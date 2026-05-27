import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {MenuTab} from "./MenuTab"
import {MenuView} from "./MenuView"
import {MenuViewTransitions} from "./MenuViewTransitions"
import {SafeType} from "./Safe/SafeTypes"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const WorldCameraFinderProvider =
  require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")
    .default ?? require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")

const MENU_SHOW_MS = 400
const MENU_HIDE_MS = 250
const MENU_BACKGROUND_LERP_SEC = 0.3
const LOGO_SCALE_PEAK = 1.1
const LOGO_SCALE_DURATION_MS = 500
const LOGO_ROTATE_Z_DEG = 3
const LOGO_ROTATE_DURATION_MS = 1000
const RAD_TO_DEG = 180 / Math.PI
/** Main-menu tab index for Settings (third tab). */
const SETTINGS_TAB_INDEX = 2
const DEFAULT_TAB_INDEX = 0
const TAB_SWITCH_COOLDOWN_SEC = 0.5

export type MenuScreenId = "main" | "soloTips" | "tutorialTips" | "onlineRoom"

export type MenuOverlay =
  | "main"
  | "settings"
  | "solved"
  | "timed"
  | "tutorialSolved"
  | "loading"
  | "room"

/**
 * Central menu controller: root scale, stepped screens (main → tips → room),
 * main-menu tab switching, and post-game overlays.
 */
@component
export class MenuController extends BaseScriptComponent {
  @input
  @allowUndefined
  menuRoot: SceneObject

  @input
  @hint("World Y offset from camera in cm. Pitch and Headlock control XZ; this pins height only.")
  menuYOffsetFromCameraCm: number = 0

  @input
  @allowUndefined
  @hint("Shader material for menu backdrop. Tab 1 state 0, tab 2 state 1, tab 3 opacity 0.")
  menuBackground: Material

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Branding</span>')

  @input
  @allowUndefined
  @hint("Main menu logo — idle scale 1↔1.1 in 0.5s and Z rotation ±15° in 1s.")
  logo: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Main Menu Tabs</span>')

  @input
  @hint("Tabs left to right. Each entry is a button plus that tab's content elements.")
  tabs: MenuTab[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Menu Steps</span>')

  @input
  @allowUndefined
  @hint("Main Menu shell. Tab bar in elements; tab panels in tabs.")
  mainMenuView: MenuView

  @input
  @allowUndefined
  soloTipsView: MenuView

  @input
  @allowUndefined
  tutorialTipsView: MenuView

  @input
  @allowUndefined
  onlineRoomView: MenuView

  @ui.separator
  @ui.label('<span style="color: #94A3B8;">Post-Game Overlays</span>')

  @input
  @allowUndefined
  settingsView: SceneObject

  @input
  @allowUndefined
  solvedView: SceneObject

  @input
  @allowUndefined
  timedView: SceneObject

  @input
  @allowUndefined
  tutorialSolvedView: SceneObject

  @input
  @allowUndefined
  loadingView: SceneObject

  @input
  @allowUndefined
  solvedSecondsText: Text

  private readonly transitions = new MenuViewTransitions()
  private activeTween: any = null
  private logoScaleTween: any = null
  private logoRotateTween: any = null
  /** Invalidates stale hide/show scale callbacks when returning from gameplay. */
  private menuScaleGeneration = 0
  private isMenuVisible = false
  private currentScreen: MenuScreenId = "main"
  private pendingSafeType: SafeType | null = null
  private isTransitioning = false
  private transitionToken = 0
  private menuRevealInProgress = false
  /** True after hideForGameplay until returnFromGameplay finishes. */
  private hiddenForGameplay = false
  /** Invalidates stale gameplay-return scale/pop chains (not tab transitionToken). */
  private gameplayRestoreId = 0
  private settingsTabSelectedHandler: (() => void) | null = null

  private selectedTabIndex = -1
  private isTabTransitioning = false
  private tabSwitchLocked = false
  private tabTransitionToken = 0
  private unlockTabSwitchEvent: DelayedCallbackEvent

  /** Called when the user selects the settings tab (not the legacy openSettings overlay). */
  public setSettingsTabSelectedHandler(handler: () => void): void {
    this.settingsTabSelectedHandler = handler
  }

  onAwake(): void {
    this.unlockTabSwitchEvent = this.createEvent("DelayedCallbackEvent")
    this.unlockTabSwitchEvent.bind(() => {
      this.tabSwitchLocked = false
      this.setTabButtonsInteractable(true)
    })

    this.cacheAllViewElements()
    this.hideAllScreensImmediate()
    this.hidePostGameOverlaysImmediate()
    this.prepareMenuHidden()
    this.createEvent("LateUpdateEvent").bind(() => this.maintainMenuHeightRelativeToCamera())
    this.createEvent("OnStartEvent").bind(() => {
      this.initializeMainMenuTabs()
      this.startLogoIdleAnimation()
    })
  }

  /** After gameplay — scale menu root up and pop tab content back in. */
  returnFromGameplay(callback?: () => void): void {
    this.pendingSafeType = null
    this.hidePostGameOverlaysImmediate()
    this.transitions.stopAll()
    this.cancelActiveTween()
    const restoreId = ++this.gameplayRestoreId
    print("[MenuController] returnFromGameplay — animated restore")
    this.prepareMenuForGameplayReturn()
    this.runGameplayMenuReveal(restoreId, callback)
  }

  /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
  showMainMenu(callback?: () => void): void {
    this.pendingSafeType = null
    this.hidePostGameOverlaysImmediate()

    if (this.hiddenForGameplay) {
      this.returnFromGameplay(callback)
      return
    }

    const menuHiddenByScale =
      !!this.menuRoot && this.menuRoot.getTransform().getLocalScale().x < 0.01
    const needsRestore =
      !this.isMenuVisible ||
      menuHiddenByScale ||
      this.menuRevealInProgress ||
      this.needsFullMenuRestore()

    if (needsRestore) {
      this.menuRevealInProgress = false
      this.isTransitioning = false
      this.transitions.stopAll()
      this.cancelActiveTween()
      print("[MenuController] showMainMenu — restore (visible=" + this.isMenuVisible + ")")
      this.restoreMainMenuFromHidden(callback)
      return
    }

    if (this.currentScreen === "main" && !this.isTransitioning) {
      this.ensureMenuRootShown()
      this.restoreMainMenuShell()
      callback?.()
      return
    }

    this.transitionToScreen("main", () => {
      this.ensureMenuRootShown()
      this.restoreMainMenuShell()
      callback?.()
    })
  }

  /** Main menu → Solo or Tutorial tips (first run uses tutorial). */
  requestSoloTips(callback?: () => void): void {
    const hasPlayed = global.appState?.checkStorage("tutorialPlayed") ?? false
    this.pendingSafeType = hasPlayed ? "solo" : "tutorial"
    const target: MenuScreenId = hasPlayed ? "soloTips" : "tutorialTips"
    this.transitionToScreen(target, callback)
  }

  /** Settings → Replay Tutorial: always open tutorial tips (Start runs tutorial safe). */
  requestTutorialTips(callback?: () => void): void {
    this.hidePostGameOverlaysImmediate()
    this.pendingSafeType = "tutorial"
    this.transitionToScreen("tutorialTips", callback)
  }

  /** Main menu → online room step, then run networking in the callback. */
  requestOnlineRoom(callback?: () => void): void {
    this.pendingSafeType = "coop"
    this.transitionToScreen("onlineRoom", callback)
  }

  /** Tips / room Start button: returns safe type chosen when entering tips. */
  consumePendingSafeType(): SafeType | null {
    const type = this.pendingSafeType
    this.pendingSafeType = null
    return type
  }

  hasPendingSafeType(): boolean {
    return this.pendingSafeType !== null
  }

  getCurrentScreen(): MenuScreenId {
    return this.currentScreen
  }

  /** Hide menu UI for gameplay (scale + step views only; no transform position changes). */
  hideForGameplay(callback?: () => void): void {
    this.hiddenForGameplay = true
    this.isMenuVisible = false
    this.beginMenuScaleOperation()
    this.transitions.stopAll()
    this.isTransitioning = false
    this.isTabTransitioning = false
    this.tabTransitionToken++
    this.hideAllMenuScreensImmediate()
    this.hide(callback)
  }

  /** Coop/network failure or cancel — same restore path as showMainMenu. */
  returnToMainMenu(callback?: () => void): void {
    this.showMainMenu(callback)
  }

  /** Legacy post-game overlays — toggled without pop stack for now. */
  showOverlay(overlay: MenuOverlay, callback?: () => void): void {
    this.logSettingsDiag("showOverlay(" + overlay + ") menuVisible=" + this.isMenuVisible)
    this.setPostGameOverlay(overlay)
    if (this.isMenuVisible) {
      this.logSettingsDiag("showOverlay → ensureMenuRootShown (skip scale-from-zero)")
      this.ensureMenuRootShown()
      this.logSettingsHierarchy("after ensureMenuRootShown")
      callback?.()
      return
    }
    this.logSettingsDiag("showOverlay → show() full menu intro")
    this.show(() => {
      this.logSettingsHierarchy("after show()")
      callback?.()
    })
  }

  setSolvedSeconds(seconds: number): void {
    if (this.solvedSecondsText) {
      this.solvedSecondsText.text = seconds.toFixed(0).toString()
    }
  }

  isVisible(): boolean {
    return this.isMenuVisible
  }

  updateMenuBackgroundForTab(tabIndex: number): void {
    if (!this.menuBackground || !global.utils?.animateMaterialProperty) {
      return
    }

    const duration = MENU_BACKGROUND_LERP_SEC

    if (tabIndex === 0) {
      global.utils.animateMaterialProperty(this.menuBackground, "mainPass.state", 0, duration)
      global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 1, duration)
      return
    }

    if (tabIndex === 1) {
      global.utils.animateMaterialProperty(this.menuBackground, "mainPass.state", 1, duration)
      global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 1, duration)
      return
    }

    if (tabIndex === 2) {
      global.utils.animateMaterialProperty(this.menuBackground, "mainPass.opacity", 0, duration)
    }
  }

  private transitionToScreen(target: MenuScreenId, callback?: () => void): void {
    if (target === this.currentScreen && !this.isTransitioning && this.isScreenShowing(target)) {
      callback?.()
      return
    }

    const token = ++this.transitionToken
    this.isTransitioning = true
    this.isTabTransitioning = false
    this.tabTransitionToken++
    this.transitions.stopAll()

    const from = this.currentScreen
    const fromElements = this.getScreenElements(from, true)
    const toView = this.getViewForScreen(target)
    const toElements = this.resolveElements(toView)

    const finish = () => {
      if (token !== this.transitionToken) {
        return
      }
      this.isTransitioning = false
      this.currentScreen = target
      this.applyScreenRoots(target)
      if (target === "main") {
        const tabIndex = this.getSelectedTabIndex()
        if (tabIndex >= 0) {
          this.updateMenuBackgroundForTab(tabIndex)
        }
      }
      callback?.()
    }

    const popInTarget = () => {
      if (!toView?.root) {
        finish()
        return
      }
      toView.root.enabled = true
      const popInList = this.buildPopInElements(toView, toElements)
      this.transitions.prepareElementsForPopIn(popInList)
      this.transitions.popInElements(popInList, () => {
        if (target !== "main") {
          finish()
          return
        }
        const tabElements = this.getTabElements()
        if (tabElements.length === 0) {
          finish()
          return
        }
        this.transitions.prepareElementsForPopIn(tabElements)
        this.transitions.popInElements(tabElements, finish)
      })
    }

    if (fromElements.length === 0) {
      popInTarget()
      return
    }

    this.transitions.popOutElements(fromElements, () => {
      if (token !== this.transitionToken) {
        return
      }
      this.disableScreenRootsExcept(target)
      popInTarget()
    })
  }

  private getViewForScreen(screen: MenuScreenId): MenuView | undefined {
    switch (screen) {
      case "main":
        return this.mainMenuView
      case "soloTips":
        return this.soloTipsView
      case "tutorialTips":
        return this.tutorialTipsView
      case "onlineRoom":
        return this.onlineRoomView
    }
  }

  private getScreenElements(screen: MenuScreenId, forTransitionOut = false): SceneObject[] {
    const view = this.getViewForScreen(screen)
    let elements = this.resolveElements(view)
    if (forTransitionOut && screen === "main") {
      const tabElements = this.getTabElements()
      elements = this.uniqueElements([...elements, ...tabElements])
    }
    if (forTransitionOut && view?.root) {
      elements = this.uniqueElements([...elements, view.root])
    }
    return elements
  }

  private buildPopInElements(view: MenuView, elements: SceneObject[]): SceneObject[] {
    if (!view.root) {
      return elements
    }
    return this.uniqueElements([view.root, ...elements])
  }

  private hideViewRoot(root: SceneObject): void {
    root.getTransform().setLocalScale(vec3.zero())
    root.enabled = false
  }

  private enableSceneObjectAncestors(target: SceneObject): void {
    let current: SceneObject | null = target
    let depth = 0
    while (current && depth < 24) {
      current.enabled = true
      current = current.getParent()
      depth++
    }
  }

  private uniqueElements(elements: SceneObject[]): SceneObject[] {
    const seen: SceneObject[] = []
    for (const element of elements) {
      if (element && seen.indexOf(element) < 0) {
        seen.push(element)
      }
    }
    return seen
  }

  private resolveElements(view: MenuView | undefined): SceneObject[] {
    if (!view?.root) {
      return []
    }
    const assigned = (view.elements ?? []).filter((e) => !!e)
    if (assigned.length > 0) {
      return assigned
    }
    return this.collectPopElements(view.root)
  }

  /** Prefer assigned elements; otherwise children of root, or children of a lone Content child. */
  private collectPopElements(root: SceneObject): SceneObject[] {
    const count = root.getChildrenCount()
    if (count === 1) {
      const only = root.getChild(0)
      if (only && only.getChildrenCount() > 0) {
        const name = only.name
        if (name === "Content" || name.indexOf("Content") !== -1) {
          return this.collectDirectChildren(only)
        }
      }
    }
    return this.collectDirectChildren(root)
  }

  private collectDirectChildren(root: SceneObject): SceneObject[] {
    const result: SceneObject[] = []
    const childCount = root.getChildrenCount()
    for (let i = 0; i < childCount; i++) {
      const child = root.getChild(i)
      if (child) {
        result.push(child)
      }
    }
    return result
  }

  private isScreenShowing(screen: MenuScreenId): boolean {
    const view = this.getViewForScreen(screen)
    if (!view?.root?.enabled) {
      return false
    }
    for (const element of this.resolveElements(view)) {
      const scale = element.getTransform().getLocalScale()
      if (element.enabled && scale.x > 0.01) {
        return true
      }
    }
    return false
  }

  private cacheAllViewElements(): void {
    const all: SceneObject[] = []
    for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"] as MenuScreenId[]) {
      const view = this.getViewForScreen(screen)
      all.push(...this.getScreenElements(screen))
      if (screen === "main") {
        all.push(...this.getAllTabElements())
      }
      if (view?.root) {
        all.push(view.root)
      }
    }
    this.transitions.cacheRestScales(this.uniqueElements(all))
  }

  private hideAllScreensImmediate(): void {
    this.hideAllMenuScreensImmediate()
    this.currentScreen = "main"
  }

  /** Disable step views only — menuRoot transform position is not modified. */
  private hideAllMenuScreensImmediate(): void {
    for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"] as MenuScreenId[]) {
      const view = this.getViewForScreen(screen)
      if (!view?.root) {
        continue
      }
      this.hideViewRoot(view.root)
      this.transitions.setElementsHidden(this.resolveElements(view))
    }
  }

  private disableScreenRootsExcept(active: MenuScreenId): void {
    for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"] as MenuScreenId[]) {
      const view = this.getViewForScreen(screen)
      if (!view?.root) {
        continue
      }
      if (screen !== active) {
        this.hideViewRoot(view.root)
      }
    }
  }

  private applyScreenRoots(active: MenuScreenId): void {
    for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"] as MenuScreenId[]) {
      const view = this.getViewForScreen(screen)
      if (!view?.root) {
        continue
      }
      view.root.enabled = screen === active
    }
  }

  private hidePostGameOverlaysImmediate(): void {
    // settingsView is main-menu tab content; tab switch + ensureSettingsTabVisible own visibility
    const overlays = [
      this.solvedView,
      this.timedView,
      this.tutorialSolvedView,
      this.loadingView
    ]
    for (const view of overlays) {
      if (view) {
        view.enabled = false
      }
    }
  }

  private setPostGameOverlay(overlay: MenuOverlay): void {
    this.logSettingsDiag("setPostGameOverlay(" + overlay + ")")
    this.setSettingsOverlayActive(false)
    this.hidePostGameOverlaysImmediate()

    if (overlay === "main") {
      this.logSettingsDiag("setPostGameOverlay → main (tabs restored)")
      return
    }

    if (overlay === "settings") {
      this.setSettingsOverlayActive(true)
      this.logSettingsHierarchy("after setSettingsOverlayActive(true)")
      return
    }

    const map: Partial<Record<MenuOverlay, SceneObject | undefined>> = {
      solved: this.solvedView,
      timed: this.timedView,
      tutorialSolved: this.tutorialSolvedView,
      loading: this.loadingView,
      room: this.onlineRoomView?.root
    }

    const active = map[overlay]
    if (active) {
      active.enabled = true
    }
  }

  /**
   * Settings View lives under Main Menu. Toggle tab chrome vs settings panel visibility.
   */
  private setSettingsOverlayActive(active: boolean): void {
    const mainRoot = this.mainMenuView?.root
    if (!mainRoot) {
      this.logSettingsDiag(
        "setSettingsOverlayActive(" +
          active +
          ") ABORT — mainMenuView.root missing (assign Main Menu on MenuController)"
      )
      return
    }
    if (!this.settingsView) {
      this.logSettingsDiag(
        "setSettingsOverlayActive(" +
          active +
          ") ABORT — settingsView missing (assign Settings View on MenuController)"
      )
      return
    }

    this.logSettingsDiag(
      "setSettingsOverlayActive(" +
        active +
        ") mainRoot=" +
        mainRoot.name +
        " enabled=" +
        mainRoot.enabled
    )

    const childCount = mainRoot.getChildrenCount()
    for (let i = 0; i < childCount; i++) {
      const child = mainRoot.getChild(i)
      if (!child) {
        continue
      }
      if (!active) {
        mainRoot.enabled = true
        child.enabled = true
        continue
      }
      const isSettings = child === this.settingsView
      child.enabled = isSettings ? active : !active
      if (isSettings && active) {
        child.getTransform().setLocalScale(new vec3(1, 1, 1))
      }
      const scale = child.getTransform().getLocalScale()
      this.logSettingsDiag(
        "  child[" +
          i +
          "] " +
          child.name +
          " isSettings=" +
          isSettings +
          " enabled=" +
          child.enabled +
          " scale=" +
          scale.x.toFixed(2) +
          "," +
          scale.y.toFixed(2) +
          "," +
          scale.z.toFixed(2)
      )
    }
  }

  /** Settings panel lives under Settings View; parent must be enabled for tab pop-in. */
  private ensureSettingsTabVisible(): void {
    if (!this.settingsView) {
      this.logSettingsDiag("ensureSettingsTabVisible ABORT — settingsView not assigned")
      return
    }
    this.settingsView.enabled = true
    this.settingsView.getTransform().setLocalScale(new vec3(1, 1, 1))
    this.logSettingsDiag("ensureSettingsTabVisible OK — " + this.settingsView.name)
  }

  private static readonly ENABLE_SETTINGS_DEBUG = false

  private logSettingsDiag(msg: string): void {
    if (!MenuController.ENABLE_SETTINGS_DEBUG) {
      return
    }
    print("[SettingsDiag][MenuController] " + msg)
  }

  private logSettingsHierarchy(context: string): void {
    this.logSettingsDiag("── hierarchy " + context + " ──")
    this.logSettingsDiag(
      "menuRoot: " +
        this.describeSceneObject(this.menuRoot) +
        " | settingsView input: " +
        this.describeSceneObject(this.settingsView) +
        " | mainMenuView.root: " +
        this.describeSceneObject(this.mainMenuView?.root)
    )
    if (this.settingsView) {
      this.logSceneSubtree(this.settingsView, "  ", 0, 4)
    }
  }

  private describeSceneObject(obj: SceneObject | undefined | null): string {
    if (!obj) {
      return "(null)"
    }
    const scale = obj.getTransform().getLocalScale()
    return (
      obj.name +
      " enabled=" +
      obj.enabled +
      " scale=" +
      scale.x.toFixed(2) +
      "," +
      scale.y.toFixed(2) +
      "," +
      scale.z.toFixed(2)
    )
  }

  private logSceneSubtree(obj: SceneObject, indent: string, depth: number, maxDepth: number): void {
    if (depth > maxDepth) {
      return
    }
    this.logSettingsDiag(indent + this.describeSceneObject(obj))
    const n = obj.getChildrenCount()
    for (let i = 0; i < n; i++) {
      const child = obj.getChild(i)
      if (child) {
        this.logSceneSubtree(child, indent + "  ", depth + 1, maxDepth)
      }
    }
  }

  private prepareMenuForGameplayReturn(): void {
    this.isTransitioning = false
    this.isTabTransitioning = false
    this.currentScreen = "main"

    const host = this.getSceneObject()
    if (host) {
      host.enabled = true
    }

    this.applyScreenRoots("main")
    this.restoreMainMenuShell()

    if (this.menuRoot) {
      this.enableSceneObjectAncestors(this.menuRoot)
      this.menuRoot.enabled = true
    }
  }

  private runGameplayMenuReveal(restoreId: number, callback?: () => void): void {
    this.isMenuVisible = true
    this.menuRevealInProgress = true

    const popElements = this.getMainMenuPopElements()
    const tabIndex = this.getSelectedTabIndex()

    const complete = () => {
      if (restoreId !== this.gameplayRestoreId) {
        return
      }
      this.menuRevealInProgress = false
      this.hiddenForGameplay = false
      if (tabIndex >= 0) {
        this.updateMenuBackgroundForTab(tabIndex)
      }
      this.setTabButtonsInteractable(true)
      this.tabSwitchLocked = false
      callback?.()
    }

    const runPop = () => {
      if (restoreId !== this.gameplayRestoreId) {
        return
      }
      this.maintainMenuHeightRelativeToCamera()
      if (popElements.length === 0) {
        complete()
        return
      }
      this.transitions.prepareElementsForPopIn(popElements)
      this.transitions.popInElements(popElements, complete)
    }

    this.show(runPop)

    const fallbackSec =
      (MENU_SHOW_MS + popElements.length * 100 + 400) / 1000
    global.utils.delay(fallbackSec, () => {
      if (restoreId !== this.gameplayRestoreId) {
        return
      }
      if (!this.needsFullMenuRestore()) {
        return
      }
      print("[MenuController] returnFromGameplay — snap fallback")
      this.snapMenuVisibleAfterGameplay()
      if (this.menuRevealInProgress) {
        complete()
      }
    })
  }

  private isGameplayRestoreCurrent(restoreId: number): boolean {
    return restoreId === this.gameplayRestoreId
  }

  /**
   * Immediate menu restore — fallback if animated return stalls.
   */
  private snapMenuVisibleAfterGameplay(): void {
    this.beginMenuScaleOperation()
    this.isMenuVisible = true
    this.menuRevealInProgress = false
    this.hiddenForGameplay = false
    this.isTransitioning = false
    this.isTabTransitioning = false
    this.currentScreen = "main"

    const host = this.getSceneObject()
    if (host) {
      host.enabled = true
    }

    this.applyScreenRoots("main")
    this.restoreMainMenuShell()

    if (this.menuRoot) {
      this.enableSceneObjectAncestors(this.menuRoot)
      this.menuRoot.enabled = true
      this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    }

    for (const element of this.getMainMenuPopElements()) {
      if (!element) {
        continue
      }
      element.enabled = true
      element.getTransform().setLocalScale(this.transitions.getRestScale(element))
    }

    const tabIndex =
      this.selectedTabIndex >= 0
        ? this.selectedTabIndex
        : Math.min(DEFAULT_TAB_INDEX, Math.max(0, (this.tabs?.length ?? 1) - 1))
    if (this.tabs && this.tabs.length > 0) {
      this.selectedTabIndex = tabIndex
      this.initializeVisibleTab(tabIndex)
      this.updateTabToggles()
      this.handleTabChanged(tabIndex)
    }

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }

    this.maintainMenuHeightRelativeToCamera()
    this.setTabButtonsInteractable(true)
    this.tabSwitchLocked = false
  }

  /** After gameplay the whole menu was scaled away — restore main + pop tab content. */
  private restoreMainMenuFromHidden(callback?: () => void): void {
    this.beginMenuScaleOperation()
    this.isMenuVisible = true

    const token = ++this.transitionToken
    this.menuRevealInProgress = true
    this.isTransitioning = false
    this.transitions.stopAll()
    this.currentScreen = "main"
    this.applyScreenRoots("main")
    this.restoreMainMenuShell()

    const popElements = this.getMainMenuPopElements()
    const afterPop = () => {
      if (token !== this.transitionToken) {
        return
      }
      this.menuRevealInProgress = false
      const tabIndex = this.getSelectedTabIndex()
      if (tabIndex >= 0) {
        this.updateMenuBackgroundForTab(tabIndex)
      }
      callback?.()
    }

    this.show(() => {
      if (token !== this.transitionToken) {
        return
      }
      this.maintainMenuHeightRelativeToCamera()
      if (popElements.length === 0) {
        afterPop()
        return
      }
      this.transitions.prepareElementsForPopIn(popElements)
      this.transitions.popInElements(popElements, afterPop)
    })
  }

  /** Tab/button pieces only — not Main Menu root (show() already scales the UI shell). */
  private getMainMenuPopElements(): SceneObject[] {
    const view = this.mainMenuView
    if (!view) {
      return []
    }
    const tabElements = this.getTabElements()
    return this.uniqueElements([...this.resolveElements(view), ...tabElements])
  }

  private restoreMainMenuShell(): void {
    const mainRoot = this.mainMenuView?.root
    if (mainRoot) {
      mainRoot.enabled = true
      mainRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    }
    if (this.settingsView) {
      this.settingsView.enabled = true
      this.settingsView.getTransform().setLocalScale(new vec3(1, 1, 1))
    }
  }

  /**
   * Pins menu world Y to camera Y + offset. Does not call Headlock APIs.
   * Headlock still drives XZ / pitch; this only prevents pitch from shifting height.
   */
  private maintainMenuHeightRelativeToCamera(): void {
    if (!this.menuRoot || !this.isMenuVisible || !this.menuRoot.enabled) {
      return
    }

    const scale = this.menuRoot.getTransform().getLocalScale()
    if (scale.x < 0.01) {
      return
    }

    const cameraY = WorldCameraFinderProvider.getInstance()
      .getTransform()
      .getWorldPosition().y
    const targetY = cameraY + this.menuYOffsetFromCameraCm
    const menuTransform = this.menuRoot.getTransform()
    const menuPos = menuTransform.getWorldPosition()

    if (Math.abs(menuPos.y - targetY) < 0.05) {
      return
    }

    menuTransform.setWorldPosition(new vec3(menuPos.x, targetY, menuPos.z))
  }

  /** Keeps menuRoot visible without the 0→1 scale intro (e.g. after a screen pop-in). */
  private ensureMenuRootShown(): void {
    if (!this.menuRoot) {
      return
    }

    this.cancelActiveTween()
    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    this.isMenuVisible = true
    this.maintainMenuHeightRelativeToCamera()

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }
  }

  private needsFullMenuRestore(): boolean {
    if (this.menuRoot) {
      const rootScale = this.menuRoot.getTransform().getLocalScale().x
      if (!this.menuRoot.enabled || rootScale < 0.01) {
        return true
      }
    }
    for (const element of this.getMainMenuPopElements()) {
      if (!element) {
        continue
      }
      if (!element.enabled) {
        return true
      }
      if (element.getTransform().getLocalScale().x < 0.01) {
        return true
      }
    }
    return false
  }

  private beginMenuScaleOperation(): number {
    this.menuScaleGeneration++
    this.cancelActiveTween()
    if (this.menuRoot && global.utils?.cancelObjectAnimations) {
      global.utils.cancelObjectAnimations(this.menuRoot)
    }
    return this.menuScaleGeneration
  }

  private isMenuScaleOperationCurrent(generation: number): boolean {
    return generation === this.menuScaleGeneration
  }

  private show(callback?: () => void): void {
    if (!this.menuRoot) {
      print("[MenuController] show() skipped — menuRoot not assigned")
      callback?.()
      return
    }

    const scaleGeneration = this.beginMenuScaleOperation()
    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    this.isMenuVisible = true
    this.maintainMenuHeightRelativeToCamera()

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }

    const finish = () => {
      if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
        return
      }
      callback?.()
    }

    if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, scaleGeneration, finish)) {
      return
    }

    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    finish()
  }

  private hide(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    const scaleGeneration = this.beginMenuScaleOperation()

    const finish = () => {
      if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
        return
      }
      this.isMenuVisible = false
      callback?.()
    }

    if (this.tryAnimateScale(this.menuRoot, new vec3(0, 0, 0), MENU_HIDE_MS, scaleGeneration, finish)) {
      return
    }

    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    finish()
  }

  private prepareMenuHidden(): void {
    if (!this.menuRoot) {
      return
    }
    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    this.menuRoot.enabled = false
  }

  private tryAnimateScale(
    target: SceneObject,
    toScale: vec3,
    durationMs: number,
    scaleGeneration: number,
    onComplete?: () => void
  ): boolean {
    const durationSec = durationMs / 1000

    if (global.utils && typeof global.utils.animateScale === "function") {
      global.utils.animateScale(target, true, toScale, durationSec, () => {
        if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
          return
        }
        onComplete?.()
      })
      return true
    }

    try {
      this.activeTween = LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
        .easing(toScale.x > 0 ? Easing.Back.Out : Easing.Quadratic.In)
        .onComplete(() => {
          this.activeTween = null
          if (!this.isMenuScaleOperationCurrent(scaleGeneration)) {
            return
          }
          onComplete?.()
        })
        .start()
      return true
    } catch (e) {
      print("[MenuController] LSTween scale failed: " + e)
      return false
    }
  }

  private cancelActiveTween(): void {
    if (this.activeTween && typeof this.activeTween.stop === "function") {
      this.activeTween.stop()
    }
    this.activeTween = null
  }

  /** Playful idle logo — scale and Z wobble loop while the lens runs. */
  private startLogoIdleAnimation(): void {
    if (!this.logo) {
      return
    }

    this.stopLogoIdleAnimation()

    const transform = this.logo.getTransform()
    const restScale = transform.getLocalScale()
    const peakScale = restScale.uniformScale(LOGO_SCALE_PEAK)

    this.logoScaleTween = LSTween.scaleFromToLocal(
      transform,
      restScale,
      peakScale,
      LOGO_SCALE_DURATION_MS
    )
      .easing(Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start()

    const eulerRad = transform.getLocalRotation().toEulerAngles()
    const restDeg = eulerRad.uniformScale(RAD_TO_DEG)
    const fromDeg = new vec3(
      restDeg.x,
      restDeg.y,
      restDeg.z - LOGO_ROTATE_Z_DEG
    )
    const toDeg = new vec3(
      restDeg.x,
      restDeg.y,
      restDeg.z + LOGO_ROTATE_Z_DEG
    )

    this.logoRotateTween = LSTween.rotateFromToLocalInDegrees(
      transform,
      fromDeg,
      toDeg,
      LOGO_ROTATE_DURATION_MS
    )
      .easing(Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }

  private stopLogoIdleAnimation(): void {
    if (this.logoScaleTween && typeof this.logoScaleTween.stop === "function") {
      this.logoScaleTween.stop()
    }
    if (this.logoRotateTween && typeof this.logoRotateTween.stop === "function") {
      this.logoRotateTween.stop()
    }
    this.logoScaleTween = null
    this.logoRotateTween = null
  }

  // ── Main menu tabs (formerly MainMenuTabination) ─────────────────────────

  /** Currently selected main-menu tab (0-based), or -1 if none. */
  getSelectedTabIndex(): number {
    return this.selectedTabIndex
  }

  /** All tab panel elements across every tab. */
  private getAllTabElements(): SceneObject[] {
    const elements: SceneObject[] = []
    for (const tab of this.tabs ?? []) {
      for (const element of tab?.elements ?? []) {
        if (element) {
          elements.push(element)
        }
      }
    }
    return elements
  }

  /** SceneObjects for a tab panel (defaults to the selected tab). */
  getTabElements(tabIndex?: number): SceneObject[] {
    if (!this.tabs || this.tabs.length === 0) {
      return []
    }
    const index =
      tabIndex !== undefined && tabIndex >= 0
        ? Math.min(tabIndex, this.tabs.length - 1)
        : this.selectedTabIndex
    if (index < 0) {
      return []
    }
    return (this.tabs[index]?.elements ?? []).filter((element) => !!element)
  }

  private initializeMainMenuTabs(): void {
    if (!this.tabs || this.tabs.length === 0) {
      print("[MenuController] No main menu tabs assigned.")
      return
    }

    for (let i = 0; i < this.tabs.length; i++) {
      const button = this.getTabButton(this.tabs[i])
      if (!button) {
        continue
      }

      button.setIsToggleable(true)

      const tabIndex = i
      const bindTrigger = () => {
        button.onTriggerUp.add(() => {
          this.selectTab(tabIndex)
        })
      }

      if (button.initialized) {
        bindTrigger()
      } else {
        button.onInitialized.add(bindTrigger)
      }
    }

    const startIndex = Math.min(Math.max(DEFAULT_TAB_INDEX, 0), this.tabs.length - 1)
    this.initializeVisibleTab(startIndex)
    this.selectedTabIndex = startIndex
    this.updateTabToggles()
    this.handleTabChanged(startIndex)
  }

  private selectTab(index: number): void {
    if (!this.tabs || index < 0 || index >= this.tabs.length) {
      return
    }

    if (this.tabSwitchLocked) {
      this.updateTabToggles()
      return
    }

    const changed = index !== this.selectedTabIndex
    const previousIndex = this.selectedTabIndex
    this.selectedTabIndex = index
    this.updateTabToggles()

    if (!changed) {
      return
    }

    this.handleTabChanged(index)
    this.lockTabSwitch()

    if (this.isTabTransitioning) {
      this.interruptAndShowTab(index)
      return
    }

    if (previousIndex < 0) {
      const token = this.beginTabTransition()
      this.popInTab(index, () => {
        this.finishTabTransition(token)
      })
      return
    }

    const token = this.beginTabTransition()
    this.popOutTab(previousIndex, () => {
      if (!this.isTabTransitionTokenCurrent(token)) {
        return
      }
      this.popInTab(index, () => {
        this.finishTabTransition(token)
      })
    })
  }

  private handleTabChanged(tabIndex: number): void {
    if (this.currentScreen === "main") {
      this.updateMenuBackgroundForTab(tabIndex)
    }
    if (tabIndex === SETTINGS_TAB_INDEX) {
      this.ensureSettingsTabVisible()
      this.settingsTabSelectedHandler?.()
    }
  }

  private lockTabSwitch(): void {
    this.tabSwitchLocked = true
    this.setTabButtonsInteractable(false)
    this.unlockTabSwitchEvent.reset(TAB_SWITCH_COOLDOWN_SEC)
  }

  private setTabButtonsInteractable(enabled: boolean): void {
    for (const tab of this.tabs) {
      const button = this.getTabButton(tab)
      if (!button?.interactable) {
        continue
      }
      button.interactable.enabled = enabled
    }
  }

  private beginTabTransition(): number {
    this.tabTransitionToken++
    this.isTabTransitioning = true
    return this.tabTransitionToken
  }

  private finishTabTransition(token: number): void {
    if (!this.isTabTransitionTokenCurrent(token)) {
      return
    }
    this.isTabTransitioning = false
  }

  private isTabTransitionTokenCurrent(token: number): boolean {
    return token === this.tabTransitionToken
  }

  private interruptAndShowTab(index: number): void {
    const token = this.beginTabTransition()
    this.hideAllTabElementsExcept(index)
    this.popInTab(index, () => {
      this.finishTabTransition(token)
    })
  }

  private hideAllTabElementsExcept(activeIndex: number): void {
    for (let i = 0; i < this.tabs.length; i++) {
      if (i === activeIndex) {
        this.prepareTabElementsForPopIn(i)
      } else {
        this.setTabElementsHidden(i)
      }
    }
  }

  private setTabElementsHidden(tabIndex: number): void {
    const elements = this.tabs[tabIndex]?.elements ?? []
    this.transitions.setElementsHidden(elements.filter((element) => !!element))
  }

  private prepareTabElementsForPopIn(tabIndex: number): void {
    const elements = this.tabs[tabIndex]?.elements ?? []
    this.transitions.prepareElementsForPopIn(elements.filter((element) => !!element))
  }

  private initializeVisibleTab(activeIndex: number): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      if (!tab?.elements) {
        continue
      }

      const isActive = i === activeIndex
      for (const element of tab.elements) {
        if (!element) {
          continue
        }
        const restScale = this.transitions.getRestScale(element)
        element.enabled = isActive
        element.getTransform().setLocalScale(isActive ? restScale : vec3.zero())
      }
    }
  }

  private getTabButton(tab: MenuTab | undefined): RectangleButton | null {
    if (!tab?.button) {
      return null
    }
    return tab.button as RectangleButton
  }

  private updateTabToggles(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const button = this.getTabButton(this.tabs[i])
      if (!button) {
        continue
      }
      button.toggle(i === this.selectedTabIndex)
    }
  }

  private popOutTab(tabIndex: number, onComplete: () => void): void {
    const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element)
    this.transitions.popOutElements(elements, onComplete)
  }

  private popInTab(tabIndex: number, onComplete: () => void): void {
    const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element)
    this.transitions.popInElements(elements, onComplete)
  }
}
