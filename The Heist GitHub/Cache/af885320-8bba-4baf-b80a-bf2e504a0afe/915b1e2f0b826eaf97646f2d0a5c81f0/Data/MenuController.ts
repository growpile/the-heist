import {MainMenuTabination} from "./MainMenuTabination"
import {MenuView} from "./MenuView"
import {MenuViewTransitions} from "./MenuViewTransitions"
import {SafeType} from "./Safe/SafeTypes"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const MENU_SHOW_MS = 400
const MENU_HIDE_MS = 250
const MENU_BACKGROUND_LERP_SEC = 0.3
/** Main-menu tab index for Settings (MainMenuTabination tab 3 → print "3"). */
const SETTINGS_TAB_INDEX = 2

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
 * Owns menu visibility, stepped navigation (main → tips → room), and pop animations.
 * GameFlowController calls the request_* / hideForGameplay APIs; buttons stay on scene callbacks.
 */
@component
export class MenuController extends BaseScriptComponent {
  @input
  @allowUndefined
  mainMenuTabination: MainMenuTabination

  @input
  @allowUndefined
  menuRoot: SceneObject

  @input
  @allowUndefined
  @hint("Shader material for the menu backdrop. Tab 1: state 0, tab 2: state 1, tab 3: opacity 0.")
  menuBackground: Material

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Menu steps (root + pop elements)</span>')

  @input
  @allowUndefined
  @hint("Main menu shell (Main Menu object). Tab content still driven by MainMenuTabination.")
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
  @ui.label('<span style="color: #94A3B8;">Post-game overlays (enable only; no pop stack yet)</span>')

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
  private isMenuVisible = false
  private currentScreen: MenuScreenId = "main"
  private pendingSafeType: SafeType | null = null
  private isTransitioning = false
  private transitionToken = 0
  private settingsTabSelectedHandler: (() => void) | null = null

  /** Called when the user selects the settings tab (not the legacy openSettings overlay). */
  public setSettingsTabSelectedHandler(handler: () => void): void {
    this.settingsTabSelectedHandler = handler
  }

  onAwake(): void {
    this.cacheAllViewElements()
    this.hideAllScreensImmediate()
    this.hidePostGameOverlaysImmediate()
    this.prepareMenuHidden()
    this.mainMenuTabination?.setTabChangedListener((tabIndex) => {
      if (this.currentScreen === "main") {
        this.updateMenuBackgroundForTab(tabIndex)
      }
      if (tabIndex === SETTINGS_TAB_INDEX) {
        this.ensureSettingsTabVisible()
        this.settingsTabSelectedHandler?.()
      }
    })
  }

  /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
  showMainMenu(callback?: () => void): void {
    this.pendingSafeType = null
    this.setPostGameOverlay("main")
    this.transitionToScreen("main", () => {
      if (!this.isMenuVisible) {
        this.show(callback)
        return
      }
      this.ensureMenuRootShown()
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

  /** Hide menu UI for gameplay without disabling menuRoot (Headlock keeps running). */
  hideForGameplay(callback?: () => void): void {
    this.transitions.stopAll()
    this.hideAllMenuScreensImmediate()
    this.hide(callback)
  }

  /** Pop back to main menu without menuRoot scale intro (e.g. failed create-room). */
  returnToMainMenu(callback?: () => void): void {
    this.pendingSafeType = null
    this.transitionToScreen("main", () => {
      this.ensureMenuRootShown()
      this.resetMenuHeadlock()
      callback?.()
    })
  }

  /** Legacy post-game overlays — toggled without pop stack for now. */
  showOverlay(overlay: MenuOverlay, callback?: () => void): void {
    this.logSettingsDiag("showOverlay(" + overlay + ") menuVisible=" + this.isMenuVisible)
    this.setPostGameOverlay(overlay)
    if (this.isMenuVisible) {
      this.logSettingsDiag("showOverlay → ensureMenuRootShown (skip scale-from-zero)")
      this.ensureMenuRootShown()
      this.resetMenuHeadlock()
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
        const tabIndex = this.mainMenuTabination?.getSelectedIndex() ?? 0
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
        const tabElements = this.mainMenuTabination?.getTabElements() ?? []
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
      const tabElements = this.mainMenuTabination?.getTabElements() ?? []
      elements = this.uniqueElements([...elements, ...tabElements])
    }
    if (forTransitionOut && view?.root) {
      elements = this.uniqueElements([...elements, view.root])
    }
    return elements
  }

  /** Root leads pop-in so shell/background appears before child elements. */
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
      if (view?.root) {
        all.push(view.root)
      }
    }
    this.transitions.cacheRestScales(this.uniqueElements(all))
  }

  private hideAllScreensImmediate(): void {
    for (const screen of ["main", "soloTips", "tutorialTips", "onlineRoom"] as MenuScreenId[]) {
      const view = this.getViewForScreen(screen)
      if (!view?.root) {
        continue
      }
      this.hideViewRoot(view.root)
      this.transitions.setElementsHidden(this.resolveElements(view))
    }
    this.currentScreen = "main"
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
    // settingsView is main-menu tab content; MainMenuTabination + ensureSettingsTabVisible own visibility
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
        // Tab mode: keep all main-menu children enabled; tabination hides non-selected elements.
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

  private logSettingsDiag(msg: string): void {
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

  /** Keeps menuRoot visible without the 0→1 scale intro (e.g. after a screen pop-in). */
  private ensureMenuRootShown(): void {
    if (!this.menuRoot) {
      return
    }

    this.cancelActiveTween()
    this.setMenuHeadlockDriving(true)
    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    this.resetMenuHeadlock()
    this.isMenuVisible = true

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }
  }

  private show(callback?: () => void): void {
    if (!this.menuRoot) {
      print("[MenuController] show() skipped — menuRoot not assigned")
      callback?.()
      return
    }

    this.cancelActiveTween()
    this.setMenuHeadlockDriving(true)
    this.menuRoot.enabled = true
    this.resetMenuHeadlock()
    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    this.isMenuVisible = true

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }

    if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, callback)) {
      return
    }

    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    callback?.()
  }

  private hide(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    this.cancelActiveTween()
    this.setMenuHeadlockDriving(false)

    if (this.tryAnimateScale(this.menuRoot, new vec3(0, 0, 0), MENU_HIDE_MS, () => {
      if (this.menuRoot) {
        this.menuRoot.enabled = false
      }
      this.isMenuVisible = false
      callback?.()
    })) {
      return
    }

    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    this.menuRoot.enabled = false
    this.isMenuVisible = false
    callback?.()
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
    onComplete?: () => void
  ): boolean {
    const durationSec = durationMs / 1000

    if (global.utils && typeof global.utils.animateScale === "function") {
      global.utils.animateScale(target, true, toScale, durationSec, () => {
        onComplete?.()
      })
      return true
    }

    try {
      this.activeTween = LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
        .easing(toScale.x > 0 ? Easing.Back.Out : Easing.Quadratic.In)
        .onComplete(() => {
          this.activeTween = null
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

  private getMenuHeadlock(): ScriptComponent | null {
    if (!this.menuRoot) {
      return null
    }
    const scriptComponents = this.menuRoot.getComponents(
      "Component.ScriptComponent"
    ) as ScriptComponent[]
    for (const comp of scriptComponents) {
      if (typeof (comp as any).snapToOffsetPosition === "function") {
        return comp
      }
    }
    return null
  }

  private setMenuHeadlockDriving(active: boolean): void {
    const headlock = this.getMenuHeadlock()
    if (headlock) {
      headlock.enabled = active
    }
  }

  /** Re-anchor UI to the Headlock offset (prevents drift after gameplay / post-game overlays). */
  private resetMenuHeadlock(): void {
    const headlock = this.getMenuHeadlock() as {snapToOffsetPosition?: () => void} | null
    if (headlock?.snapToOffsetPosition) {
      headlock.snapToOffsetPosition()
    }
  }
}
