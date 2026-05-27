import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {CapsuleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton"
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
const POSTGAME_ROOT_SCALE_SEC = 0.35
const POSTGAME_OUTLINE_STAGGER_SEC = 0.08
const POSTGAME_OUTLINE_SCALE_SEC = 0.2
const POSTGAME_TIME_ANIM_SEC = 1.5
const POSTGAME_STARS_DELAY_SEC = 0.5
const POSTGAME_STAR_STAGGER_SEC = 0.1
const POSTGAME_STAR_POP_SEC = 0.28
const POSTGAME_STAR_SETTLE_SEC = 0.16
const POSTGAME_STAR_ROTATE_POP_SEC = 0.45
const POSTGAME_STAR_ROTATE_SETTLE_SEC = 0.24
const POSTGAME_STAR_IMAGE_FADE_SEC = 0.22
const POSTGAME_STAR_IMAGE_TARGET_ALPHA = 0.5
const POSTGAME_STAR_OVERSHOOT_SCALE = 1.12
const POSTGAME_STAR_Z_POP = 1
const POSTGAME_STAR_FLIP_Y_DEG = 180
const POSTGAME_STAR_WIGGLE_Y_DEG = 7
const POSTGAME_STAR_WIGGLE_MS = 700
const SCREEN_CHANGE_LOCK_TIMEOUT_SEC = 3
const MENU_DEBUG_LOGS = false

export type PostGameOutcome = "win" | "fail"

export type PostGameSessionOptions = {
  outcome: PostGameOutcome
  solveDurationSeconds?: number
  bombTimerSeconds?: number
  penaltyCount?: number
  onMenu: () => void
}

export type MenuScreenId = "main" | "soloTips" | "tutorialTips" | "onlineRoom"
export type MenuUIRoute = "main" | "soloTips" | "tutorialTips" | "teamTips" | "postGame"

export type MenuOverlay = "main" | "settings" | "room"

/** Menu root scale, screen steps, tabs, and post-game panel. */
@component
export class MenuController extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Menu Root</span>')

  @input
  @allowUndefined
  menuRoot: SceneObject

  @input
  @hint("World Y offset from camera (cm). Headlock handles XZ.")
  menuYOffsetFromCameraCm: number = 0

  @input
  @allowUndefined
  @hint("Backdrop material — tab 0/1 state, tab 2 fades opacity.")
  menuBackground: Material

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Branding</span>')

  @input
  @allowUndefined
  logo: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Main Menu Tabs</span>')

  @input
  tabs: MenuTab[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Menu Steps</span>')

  @input
  @allowUndefined
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
  @ui.label('<span style="color: #60A5FA;">Settings</span>')

  @input
  @allowUndefined
  settingsView: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Post-Game</span>')

  @input
  @allowUndefined
  postGameRoot: SceneObject

  @input
  @allowUndefined
  timeElapsedText: Text

  @input
  @allowUndefined
  solvedCopy: SceneObject

  @input
  @allowUndefined
  failedCopy: SceneObject

  @input
  @allowUndefined
  menuButton: CapsuleButton

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Post-Game Stars</span>')

  @input
  @allowUndefined
  bronzeMaterial: Material

  @input
  @allowUndefined
  silverMaterial: Material

  @input
  @allowUndefined
  goldMaterial: Material

  @input
  @allowUndefined
  starOutlinesParent: SceneObject

  @input
  @allowUndefined
  starsParent: SceneObject

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
  /** Non-tab screen/nav transitions are single-flight (play/outbound/buttons). */
  private isScreenChangeLocked = false
  private screenChangeLockDelayId: string | null = null
  private transitionToken = 0
  private returnInProgress = false
  private menuRevealInProgress = false
  /** True after hideForGameplay until returnFromGameplay finishes. */
  private hiddenForGameplay = false
  /** Invalidates stale gameplay-return scale/pop chains (not tab transitionToken). */
  private gameplayRestoreId = 0
  private postGameSessionId = 0
  private postGameActive = false
  private postGameMenuHandler: (() => void) | null = null
  private postGameTimeAnimEvent: UpdateEvent | null = null
  private postGameStarTweens: {stop?: () => void}[] = []
  private postGameImageFadeEvents: UpdateEvent[] = []
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
    this.prepareMenuHidden()
    this.preparePostGameHidden()
    this.createEvent("LateUpdateEvent").bind(() => this.maintainMenuHeightRelativeToCamera())
    this.createEvent("OnStartEvent").bind(() => {
      this.initializeMainMenuTabs()
      this.startLogoIdleAnimation()
      this.bindPostGameMenuButton()
    })
  }

  /** After gameplay — scale menu root up and pop tab content back in. */
  returnFromGameplay(callback?: () => void): void {
    if (this.returnInProgress) {
      this.logMenu("returnFromGameplay skipped — already in progress")
      callback?.()
      return
    }
    this.returnInProgress = true
    this.logMenuState("returnFromGameplay start")

    if (!this.tryBeginScreenChange()) {
      this.logMenu("returnFromGameplay lock busy — forcing snap recovery")
      this.snapMenuVisibleAfterGameplay()
      this.endScreenChange()
      this.returnInProgress = false
      callback?.()
      return
    }
    this.pendingSafeType = null
    this.transitions.stopAll()
    this.cancelActiveTween()
    const restoreId = ++this.gameplayRestoreId
    this.logMenu("returnFromGameplay animated restore id=" + restoreId)
    this.prepareMenuForGameplayReturn()
    this.runGameplayMenuReveal(restoreId, () => {
      this.endScreenChange()
      this.returnInProgress = false
      this.logMenuState("returnFromGameplay complete")
      callback?.()
    })
  }

  private logMenu(message: string): void {
    if (!MENU_DEBUG_LOGS) {
      return
    }
    print("[MenuController] " + message)
  }

  /** Snapshot of menu restore state — grep `[MenuState]` on device logs. */
  private logMenuState(context: string): void {
    if (!MENU_DEBUG_LOGS) {
      return
    }
    const root = this.menuRoot
    const rootScale = root ? root.getTransform().getLocalScale() : null
    const host = this.getSceneObject()
    print(
      "[MenuState] " +
        context +
        " hiddenForGameplay=" +
        this.hiddenForGameplay +
        " isMenuVisible=" +
        this.isMenuVisible +
        " menuRevealInProgress=" +
        this.menuRevealInProgress +
        " returnInProgress=" +
        this.returnInProgress +
        " postGameActive=" +
        this.postGameActive +
        " screen=" +
        this.currentScreen +
        " lock=" +
        this.isScreenChangeLocked +
        " scaleGen=" +
        this.menuScaleGeneration +
        " restoreId=" +
        this.gameplayRestoreId +
        " needsRestore=" +
        this.needsFullMenuRestore() +
        " hostEnabled=" +
        (host ? host.enabled : "n/a") +
        " menuRoot=" +
        (root
          ? "enabled=" +
            root.enabled +
            " scale=" +
            rootScale!.x.toFixed(3) +
            "," +
            rootScale!.y.toFixed(3) +
            "," +
            rootScale!.z.toFixed(3)
          : "null")
    )
  }

  /** Lens open or return to main: pop transition; scale menuRoot only when it was hidden. */
  showMainMenu(callback?: () => void): void {
    this.pendingSafeType = null

    if (this.hiddenForGameplay) {
      this.returnFromGameplay(callback)
      return
    }

    if (!this.tryBeginScreenChange()) {
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
      this.restoreMainMenuFromHidden(() => {
        this.endScreenChange()
        callback?.()
      })
      return
    }

    if (this.currentScreen === "main" && !this.isTransitioning) {
      this.ensureMenuRootShown()
      this.restoreMainMenuShell()
      this.endScreenChange()
      callback?.()
      return
    }

    this.transitionToScreen("main", () => {
      this.ensureMenuRootShown()
      this.restoreMainMenuShell()
      this.endScreenChange()
      callback?.()
    })
  }

  /** Main menu → Solo or Tutorial tips (first run uses tutorial). */
  requestSoloTips(callback?: () => void): void {
    if (!this.tryBeginScreenChange()) {
      return
    }
    const hasPlayed = global.appState?.checkStorage("tutorialPlayed") ?? false
    this.pendingSafeType = hasPlayed ? "solo" : "tutorial"
    const target: MenuScreenId = hasPlayed ? "soloTips" : "tutorialTips"
    this.transitionToScreen(target, () => {
      this.endScreenChange()
      callback?.()
    })
  }

  /** Settings → Replay Tutorial: always open tutorial tips (Start runs tutorial safe). */
  requestTutorialTips(callback?: () => void): void {
    if (!this.tryBeginScreenChange()) {
      return
    }
    this.pendingSafeType = "tutorial"
    this.logMenu("requestTutorialTips → tutorialTips")
    this.transitionToScreen("tutorialTips", () => {
      this.logMenuState("requestTutorialTips done")
      this.endScreenChange()
      callback?.()
    })
  }

  /** Main menu → online room step, then run networking in the callback. */
  requestOnlineRoom(callback?: () => void): void {
    if (!this.tryBeginScreenChange()) {
      return
    }
    this.pendingSafeType = "coop"
    this.transitionToScreen("onlineRoom", () => {
      this.endScreenChange()
      callback?.()
    })
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

  private tryBeginScreenChange(): boolean {
    if (this.isScreenChangeLocked) {
      this.logMenu("tryBeginScreenChange blocked — lock active")
      return false
    }
    this.isScreenChangeLocked = true
    if (this.screenChangeLockDelayId && global.utils?.invalidateDelay) {
      global.utils.invalidateDelay(this.screenChangeLockDelayId)
    }
    this.screenChangeLockDelayId = "menu_screen_change_lock_" + getTime().toString()
    if (global.utils?.delay) {
      const lockId = this.screenChangeLockDelayId
      global.utils.delay(lockId, SCREEN_CHANGE_LOCK_TIMEOUT_SEC, () => {
        if (!this.isScreenChangeLocked || this.screenChangeLockDelayId !== lockId) {
          return
        }
        print("[MenuController] screen-change lock watchdog released stale lock")
        if (this.hiddenForGameplay || this.menuRevealInProgress) {
          this.snapMenuVisibleAfterGameplay()
        }
        this.endScreenChange()
      })
    }
    this.setTabButtonsInteractable(false)
    this.setCapsuleButtonPressable(this.menuButton, false)
    return true
  }

  private endScreenChange(): void {
    this.isScreenChangeLocked = false
    if (this.screenChangeLockDelayId && global.utils?.invalidateDelay) {
      global.utils.invalidateDelay(this.screenChangeLockDelayId)
      this.screenChangeLockDelayId = null
    }
    this.setTabButtonsInteractable(true)
    if (this.postGameActive) {
      // Keep disabled until post-game sequence explicitly enables it.
      return
    }
    this.setCapsuleButtonPressable(this.menuButton, false)
  }

  getCurrentScreen(): MenuScreenId {
    return this.currentScreen
  }

  /** Unified external UI route API for non-tab screen changes. */
  showUI(route: MenuUIRoute, callback?: () => void): void {
    switch (route) {
      case "main":
        this.showMainMenu(callback)
        return
      case "soloTips":
        this.requestSoloTips(callback)
        return
      case "tutorialTips":
        this.requestTutorialTips(callback)
        return
      case "teamTips":
        this.requestOnlineRoom(callback)
        return
      case "postGame":
        // Post-game view is driven by outcome payload; no-op route helper.
        callback?.()
        return
    }
  }

  /** Hide menu UI for gameplay (scale + step views only; no transform position changes). */
  hideForGameplay(callback?: () => void): void {
    if (!this.tryBeginScreenChange()) {
      this.logMenu("hideForGameplay blocked — screen change locked")
      return
    }
    this.logMenuState("hideForGameplay start")
    this.hiddenForGameplay = true
    this.isMenuVisible = false
    this.beginMenuScaleOperation()
    this.transitions.stopAll()
    this.isTransitioning = false
    this.isTabTransitioning = false
    this.tabTransitionToken++
    this.hideAllMenuScreensImmediate()
    this.hide(() => {
      this.logMenuState("hideForGameplay hide() done")
      this.endScreenChange()
      callback?.()
    })
  }

  /** Coop/network failure or cancel — same restore path as showMainMenu. */
  returnToMainMenu(callback?: () => void): void {
    this.showMainMenu(callback)
  }

  /** Legacy overlay hook — settings panel or online room root. */
  showOverlay(overlay: MenuOverlay, callback?: () => void): void {
    this.setPostGameOverlay(overlay)
    if (this.isMenuVisible) {
      this.ensureMenuRootShown()
      callback?.()
      return
    }
    this.show(callback)
  }

  /** Show dedicated post-game panel after safe hide animation (win or fail). */
  showPostGameSession(options: PostGameSessionOptions): void {
    const sessionId = ++this.postGameSessionId
    this.stopPostGameTimeAnimation()
    this.postGameActive = true
    this.postGameMenuHandler = options.onMenu
    this.ensurePostGameHostVisible()
    this.setCapsuleButtonPressable(this.menuButton, false)
    this.preparePostGameHidden()

    this.logMenu("showPostGameSession — " + options.outcome)
    this.logMenuState("showPostGameSession")

    this.popInPostGameRoot(() => {
      if (sessionId !== this.postGameSessionId) {
        return
      }
      this.runPostGamePresentation(sessionId, options)
    })
  }

  hidePostGameSession(): void {
    this.logMenuState("hidePostGameSession")
    this.postGameSessionId++
    this.postGameActive = false
    this.postGameMenuHandler = null
    this.stopPostGameTimeAnimation()
    this.cancelPostGameAnimations()
    this.setCapsuleButtonPressable(this.menuButton, false)
    this.preparePostGameHidden()
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

  private setPostGameOverlay(overlay: MenuOverlay): void {
    this.setSettingsOverlayActive(false)

    if (overlay === "main") {
      return
    }

    if (overlay === "settings") {
      this.setSettingsOverlayActive(true)
      return
    }

    const map: Partial<Record<MenuOverlay, SceneObject | undefined>> = {
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
      const scale = this.menuRoot.getTransform().getLocalScale()
      this.logMenu(
        "prepareMenuForGameplayReturn menuRoot scale=" +
          scale.x.toFixed(3) +
          "," +
          scale.y.toFixed(3) +
          "," +
          scale.z.toFixed(3)
      )
    } else {
      this.logMenu("prepareMenuForGameplayReturn — menuRoot null")
    }
    this.logMenuState("prepareMenuForGameplayReturn")
  }

  private runGameplayMenuReveal(restoreId: number, callback?: () => void): void {
    this.isMenuVisible = true
    this.menuRevealInProgress = true
    this.logMenu("runGameplayMenuReveal id=" + restoreId)

    if (this.tabs && this.tabs.length > 0) {
      this.selectedTabIndex = Math.min(DEFAULT_TAB_INDEX, this.tabs.length - 1)
      this.logMenu("runGameplayMenuReveal reset tab → " + this.selectedTabIndex)
    }

    const popElements = this.getMainMenuPopElements()

    const complete = () => {
      if (restoreId !== this.gameplayRestoreId) {
        return
      }
      this.menuRevealInProgress = false
      this.hiddenForGameplay = false
      this.finalizeGameplayMenuRestore()
      this.setTabButtonsInteractable(true)
      this.tabSwitchLocked = false
      this.logMenuState("runGameplayMenuReveal complete")
      callback?.()
    }

    const runPop = () => {
      if (restoreId !== this.gameplayRestoreId) {
        this.logMenu(
          "runGameplayMenuReveal runPop stale id=" +
            restoreId +
            " current=" +
            this.gameplayRestoreId
        )
        return
      }
      this.logMenu("runGameplayMenuReveal popIn count=" + popElements.length)
      this.maintainMenuHeightRelativeToCamera()
      if (popElements.length === 0) {
        this.logMenu("runGameplayMenuReveal — no pop elements, finishing")
        complete()
        return
      }
      this.transitions.prepareElementsForPopIn(popElements)
      this.transitions.popInElements(popElements, complete)
    }

    const menuRootAlreadyVisible =
      !!this.menuRoot &&
      this.menuRoot.enabled &&
      this.menuRoot.getTransform().getLocalScale().x > 0.99

    if (menuRootAlreadyVisible) {
      this.logMenu("runGameplayMenuReveal skip show() — menuRoot already visible")
      this.isMenuVisible = true
      if (global.appState) {
        global.appState.currentState = "mainMenu"
      }
      this.maintainMenuHeightRelativeToCamera()
      runPop()
    } else {
      this.show(() => {
        if (restoreId !== this.gameplayRestoreId) {
          this.logMenu(
            "runGameplayMenuReveal show() stale id=" +
              restoreId +
              " current=" +
              this.gameplayRestoreId
          )
          return
        }
        this.logMenuState("runGameplayMenuReveal after show()")
        runPop()
      })
    }

    const fallbackSec =
      (MENU_SHOW_MS + popElements.length * 100 + 400) / 1000
    global.utils.delay(fallbackSec, () => {
      if (restoreId !== this.gameplayRestoreId) {
        return
      }
      if (!this.needsFullMenuRestore()) {
        this.logMenu("runGameplayMenuReveal fallback skipped — menu looks restored")
        return
      }
      this.logMenu("runGameplayMenuReveal — snap fallback (needsRestore still true)")
      this.logMenuState("runGameplayMenuReveal before snap fallback")
      this.snapMenuVisibleAfterGameplay()
      if (this.menuRevealInProgress) {
        complete()
      }
    })
  }

  /**
   * Immediate menu restore — fallback if animated return stalls.
   */
  private snapMenuVisibleAfterGameplay(): void {
    this.logMenu("snapMenuVisibleAfterGameplay")
    this.logMenuState("snapMenuVisibleAfterGameplay before")
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

    if (this.tabs && this.tabs.length > 0) {
      this.selectedTabIndex = Math.min(DEFAULT_TAB_INDEX, this.tabs.length - 1)
    }
    this.finalizeGameplayMenuRestore()

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }

    this.setTabButtonsInteractable(true)
    this.tabSwitchLocked = false
    this.logMenuState("snapMenuVisibleAfterGameplay after")
  }

  /**
   * After gameplay return: snap pop targets to rest scale and sync tab visibility/background.
   * Animated restore used to skip this (snap path did not), which left tabs/background wrong on device.
   */
  private finalizeGameplayMenuRestore(): void {
    this.transitions.stopAll()
    this.restoreMainMenuShell()
    this.resetMainMenuChromeVisibility()
    this.setPostGameOverlay("main")

    for (const element of this.getMainMenuPopElements()) {
      if (!element) {
        continue
      }
      element.enabled = true
      element.getTransform().setLocalScale(this.transitions.getRestScale(element))
    }

    if (!this.tabs || this.tabs.length === 0) {
      this.logMenu("finalizeGameplayMenuRestore — no tabs")
      return
    }

    const tabIndex =
      this.selectedTabIndex >= 0
        ? this.selectedTabIndex
        : Math.min(DEFAULT_TAB_INDEX, this.tabs.length - 1)
    this.selectedTabIndex = tabIndex
    this.initializeVisibleTab(tabIndex)
    this.updateTabToggles()
    this.handleTabChanged(tabIndex)
    this.logMenu("finalizeGameplayMenuRestore tab=" + tabIndex)
    this.maintainMenuHeightRelativeToCamera()
  }

  /** Re-enable main-menu chrome children (e.g. after legacy settings overlay hid them). */
  private resetMainMenuChromeVisibility(): void {
    const mainRoot = this.mainMenuView?.root
    if (!mainRoot) {
      return
    }
    mainRoot.enabled = true
    const childCount = mainRoot.getChildrenCount()
    for (let i = 0; i < childCount; i++) {
      const child = mainRoot.getChild(i)
      if (child) {
        child.enabled = true
      }
    }
  }

  /** After gameplay the whole menu was scaled away — restore main + pop tab content. */
  private restoreMainMenuFromHidden(callback?: () => void): void {
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
        this.logMenu(
          "show() finish stale gen=" + scaleGeneration + " current=" + this.menuScaleGeneration
        )
        return
      }
      this.logMenu("show() finish gen=" + scaleGeneration)
      callback?.()
    }

    this.logMenu("show() start gen=" + scaleGeneration)
    if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, scaleGeneration, finish)) {
      return
    }

    this.logMenu("show() instant scale (no tween)")
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
        this.logMenu(
          "hide() finish stale gen=" + scaleGeneration + " current=" + this.menuScaleGeneration
        )
        return
      }
      this.isMenuVisible = false
      this.logMenu("hide() finish gen=" + scaleGeneration)
      callback?.()
    }

    this.logMenu("hide() start gen=" + scaleGeneration)
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
        .easing(toScale.x > 0 ? Easing.Quadratic.Out : Easing.Quadratic.In)
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

  // ── Post-game session UI ───────────────────────────────────────────────────

  private bindPostGameMenuButton(): void {
    const button = this.resolveCapsuleButton(this.menuButton)
    if (!button) {
      return
    }

    const bind = () => {
      button.onTriggerUp.add(() => {
        this.onPostGameMenuPressed()
      })
    }

    if (button.initialized) {
      bind()
      return
    }

    button.onInitialized.add(bind)
  }

  private onPostGameMenuPressed(): void {
    this.logMenu(
      "onPostGameMenuPressed postGameActive=" +
        this.postGameActive +
        " hasHandler=" +
        !!this.postGameMenuHandler
    )
    if (!this.postGameActive || !this.postGameMenuHandler) {
      this.logMenu("onPostGameMenuPressed ignored")
      return
    }

    this.setCapsuleButtonPressable(this.menuButton, false)
    const handler = this.postGameMenuHandler
    this.postGameMenuHandler = null
    this.logMenuState("onPostGameMenuPressed invoking handler")
    handler?.()
  }

  private ensurePostGameHostVisible(): void {
    const host = this.getSceneObject()
    if (host) {
      host.enabled = true
    }

    if (this.menuRoot) {
      this.enableSceneObjectAncestors(this.menuRoot)
      this.menuRoot.enabled = true
      this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
      this.maintainMenuHeightRelativeToCamera()
    }
  }

  private cancelPostGameAnimations(): void {
    this.stopPostGameStarTweens()
    const targets = [
      this.postGameRoot,
      ...this.getDirectChildren(this.starOutlinesParent),
      ...this.getDirectChildren(this.starsParent)
    ]
    for (const target of targets) {
      if (target && global.utils?.cancelObjectAnimations) {
        global.utils.cancelObjectAnimations(target)
      }
    }
  }

  private stopPostGameStarTweens(): void {
    for (const tween of this.postGameStarTweens) {
      tween?.stop?.()
    }
    this.postGameStarTweens = []
    for (const ev of this.postGameImageFadeEvents) {
      ev.enabled = false
    }
    this.postGameImageFadeEvents = []
  }

  private preparePostGameHidden(): void {
    this.cancelPostGameAnimations()
    if (this.postGameRoot) {
      this.postGameRoot.enabled = false
      this.postGameRoot.getTransform().setLocalScale(vec3.zero())
    }
    if (this.solvedCopy) {
      this.solvedCopy.enabled = false
    }
    if (this.failedCopy) {
      this.failedCopy.enabled = false
    }
    this.resetPostGameStarVisuals()
    if (this.timeElapsedText) {
      this.timeElapsedText.text = "000.0s"
    }
  }

  private resetPostGameStarVisuals(): void {
    const outlines = this.getDirectChildren(this.starOutlinesParent)
    const stars = this.getDirectChildren(this.starsParent)
    this.transitions.cacheRestScales(outlines)
    this.transitions.cacheRestScales(stars)
    this.resetChildren(outlines)
    this.resetChildren(stars)
  }

  private resetChildren(children: SceneObject[]): void {
    for (const child of children) {
      if (!child) {
        continue
      }
      child.enabled = false
      child.getTransform().setLocalScale(vec3.zero())
    }
  }

  private popInPostGameRoot(onComplete: () => void): void {
    if (!this.postGameRoot) {
      onComplete()
      return
    }

    this.postGameRoot.enabled = true
    this.postGameRoot.getTransform().setLocalScale(vec3.zero())
    global.utils.animateScale(
      this.postGameRoot,
      true,
      vec3.one(),
      POSTGAME_ROOT_SCALE_SEC,
      onComplete
    )
  }

  private runPostGamePresentation(sessionId: number, options: PostGameSessionOptions): void {
    const isWin = options.outcome === "win"
    if (this.solvedCopy) {
      this.solvedCopy.enabled = isWin
    }
    if (this.failedCopy) {
      this.failedCopy.enabled = !isWin
    }

    const outlineChildren = this.getDirectChildren(this.starOutlinesParent)
    this.transitions.cacheRestScales(outlineChildren)

    this.scaleChildrenStaggered(
      outlineChildren,
      POSTGAME_OUTLINE_SCALE_SEC,
      POSTGAME_OUTLINE_STAGGER_SEC,
      () => {
        if (sessionId !== this.postGameSessionId) {
          return
        }
        if (!isWin) {
          this.setPostGameMissingOutlines(0)
          this.finishPostGamePresentation(sessionId)
          return
        }

        const solveDuration = Math.max(0, options.solveDurationSeconds ?? 0)
        const bombTimer = Math.max(1, options.bombTimerSeconds ?? 1)
        const penalties = Math.max(0, options.penaltyCount ?? 0)
        const starCount = this.computeStarCount(solveDuration, bombTimer, penalties)

        let timeDone = false
        let starsDone = starCount <= 0
        const tryFinishWin = () => {
          if (timeDone && starsDone) {
            this.finishPostGamePresentation(sessionId)
          }
        }

        this.playPostGameTimeAnimation(sessionId, solveDuration, () => {
          timeDone = true
          tryFinishWin()
        })

        global.utils.delay(POSTGAME_STARS_DELAY_SEC, () => {
          if (sessionId !== this.postGameSessionId) {
            return
          }
          this.popInPostGameStars(sessionId, starCount, () => {
            this.setPostGameMissingOutlines(starCount)
            starsDone = true
            tryFinishWin()
          })
        })
      }
    )
  }

  private finishPostGamePresentation(sessionId: number): void {
    if (sessionId !== this.postGameSessionId) {
      return
    }
    this.logMenu("finishPostGamePresentation — menu button enabled")
    this.setCapsuleButtonPressable(this.menuButton, true)
  }

  private computeStarCount(solveDurationSec: number, bombTimerSec: number, penaltyCount: number): number {
    const ratio = solveDurationSec / bombTimerSec
    if (ratio < 0.5 && penaltyCount <= 0) {
      return 3
    }
    if (ratio < 0.6) {
      return 2
    }
    return 1
  }

  /**
   * Outlines are only shown for missing stars after reveal.
   * - 3 stars => 0 outlines
   * - 2 stars => 1 outline
   * - 1 star  => 2 outlines
   * - 0 stars => 3 outlines
   */
  private setPostGameMissingOutlines(starCount: number): void {
    const outlines = this.getDirectChildren(this.starOutlinesParent)
    const maxStars = Math.min(3, outlines.length)
    const clampedStars = Math.max(0, Math.min(starCount, maxStars))

    for (let i = 0; i < outlines.length; i++) {
      const outline = outlines[i]
      if (!outline) {
        continue
      }
      // Show only outlines for star slots that are missing.
      const show = i >= clampedStars && i < maxStars
      outline.enabled = show
      if (!show) {
        outline.getTransform().setLocalScale(vec3.zero())
      } else {
        outline.getTransform().setLocalScale(this.transitions.getRestScale(outline))
      }
    }
  }

  private scaleChildrenStaggered(
    children: SceneObject[],
    durationSec: number,
    staggerSec: number,
    onComplete: () => void
  ): void {
    if (children.length === 0) {
      onComplete()
      return
    }

    let remaining = children.length
    const finishOne = () => {
      remaining--
      if (remaining <= 0) {
        onComplete()
      }
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const restScale = this.transitions.getRestScale(child)
      child.enabled = true
      child.getTransform().setLocalScale(vec3.zero())
      global.utils.delay(i * staggerSec, () => {
        global.utils.animateScale(child, true, restScale, durationSec, finishOne)
      })
    }
  }

  private popInPostGameStars(
    sessionId: number,
    starCount: number,
    onComplete: () => void
  ): void {
    const stars = this.getDirectChildren(this.starsParent)
    if (stars.length === 0 || starCount <= 0) {
      onComplete()
      return
    }

    this.transitions.cacheRestScales(stars)
    const visibleStars = stars.slice(0, Math.min(starCount, stars.length))

    for (let i = starCount; i < stars.length; i++) {
      stars[i].enabled = false
      stars[i].getTransform().setLocalScale(vec3.zero())
    }

    let remaining = visibleStars.length
    const finishOne = () => {
      remaining--
      if (remaining <= 0) {
        onComplete()
      }
    }

    for (let i = 0; i < visibleStars.length; i++) {
      const star = visibleStars[i]
      const transform = star.getTransform()
      const starImage = this.getStarFillImage(star)
      const restScale = this.transitions.getRestScale(star)
      const restPos = transform.getLocalPosition()
      const restRotRad = transform.getLocalRotation().toEulerAngles()
      const restRotDeg = restRotRad.uniformScale(RAD_TO_DEG)
      const popPos = new vec3(restPos.x, restPos.y, restPos.z + POSTGAME_STAR_Z_POP)
      const flipRotDeg = new vec3(restRotDeg.x, restRotDeg.y + POSTGAME_STAR_FLIP_Y_DEG, restRotDeg.z)
      star.enabled = true
      this.setImageOpacity(starImage, 0)
      transform.setLocalScale(vec3.zero())
      transform.setLocalPosition(restPos)
      transform.setLocalRotation(
        quat.fromEulerAngles(
          restRotDeg.x * (Math.PI / 180),
          restRotDeg.y * (Math.PI / 180),
          restRotDeg.z * (Math.PI / 180)
        )
      )

      const delaySec = i * POSTGAME_STAR_STAGGER_SEC
      global.utils.delay(delaySec, () => {
        if (sessionId !== this.postGameSessionId) {
          return
        }
        if (!star.enabled) {
          finishOne()
          return
        }
        const overshootScale = restScale.uniformScale(POSTGAME_STAR_OVERSHOOT_SCALE)
        global.utils.animateScale(star, true, overshootScale, POSTGAME_STAR_POP_SEC, () => {
          if (sessionId !== this.postGameSessionId || !star.enabled) {
            return
          }
          global.utils.animateScale(star, true, restScale, POSTGAME_STAR_SETTLE_SEC, () => {
            if (sessionId !== this.postGameSessionId || !star.enabled) {
              return
            }
            this.fadeInStarImage(starImage)
            this.startPostGameStarWiggle(star, sessionId)
            finishOne()
          })
        })
        global.utils.animatePosition(star, true, popPos, POSTGAME_STAR_POP_SEC, () => {
          if (sessionId !== this.postGameSessionId || !star.enabled) {
            return
          }
          global.utils.animatePosition(star, true, restPos, POSTGAME_STAR_SETTLE_SEC, () => {})
        })
        const masterVolume =
          global.appState && typeof global.appState.checkStorage === "function"
            ? (global.appState.checkStorage("masterVolume") as number)
            : 1
        global.playSfx(29, 1, masterVolume * 1)
        global.utils.animateRotation(star, true, flipRotDeg, POSTGAME_STAR_ROTATE_POP_SEC, () => {
          if (sessionId !== this.postGameSessionId || !star.enabled) {
            return
          }
          global.utils.animateRotation(star, true, restRotDeg, POSTGAME_STAR_ROTATE_SETTLE_SEC, () => {})
        })
      })
    }
  }

  private startPostGameStarWiggle(star: SceneObject, sessionId: number): void {
    if (!star || sessionId !== this.postGameSessionId) {
      return
    }

    const transform = star.getTransform()
    const eulerRad = transform.getLocalRotation().toEulerAngles()
    const restDeg = eulerRad.uniformScale(RAD_TO_DEG)
    const fromDeg = new vec3(
      restDeg.x,
      restDeg.y - POSTGAME_STAR_WIGGLE_Y_DEG,
      restDeg.z
    )
    const toDeg = new vec3(
      restDeg.x,
      restDeg.y + POSTGAME_STAR_WIGGLE_Y_DEG,
      restDeg.z
    )

    try {
      const tween = LSTween.rotateFromToLocalInDegrees(
        transform,
        fromDeg,
        toDeg,
        POSTGAME_STAR_WIGGLE_MS
      )
        .easing(Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
      this.postGameStarTweens.push(tween)
      tween.start()
    } catch (_e) {
      // Keep stars static if tween setup fails.
    }
  }

  /** Each filled star's second child holds an Image that should fade in. */
  private getStarFillImage(star: SceneObject): Image | null {
    const secondChild = star?.getChild(1)
    if (!secondChild) {
      return null
    }
    return secondChild.getComponent("Component.Image") as Image | null
  }

  private fadeInStarImage(image: Image | null): void {
    if (!image) {
      return
    }
    const material = image.mainMaterial ?? null
    if (material && material.mainPass && material.mainPass.baseColor) {
      const start = this.getBaseColorAlpha(material)
      const target = POSTGAME_STAR_IMAGE_TARGET_ALPHA
      const duration = Math.max(0.001, POSTGAME_STAR_IMAGE_FADE_SEC)
      const startTime = getTime()
      const ev = this.createEvent("UpdateEvent")
      this.postGameImageFadeEvents.push(ev)
      ev.bind(() => {
        const t = Math.min(1, (getTime() - startTime) / duration)
        const smooth = t * t * (3 - 2 * t)
        const alpha = start + (target - start) * smooth
        this.setImageOpacity(image, alpha)
        if (t >= 1) {
          this.setImageOpacity(image, target)
          ev.enabled = false
          this.postGameImageFadeEvents = this.postGameImageFadeEvents.filter((entry) => entry !== ev)
        }
      })
      return
    }
    this.setImageOpacity(image, POSTGAME_STAR_IMAGE_TARGET_ALPHA)
  }

  private setImageOpacity(image: Image | null, alpha: number): void {
    if (!image) {
      return
    }
    const a = Math.max(0, Math.min(1, alpha))
    const material = image.mainMaterial ?? null
    if (!material) {
      return
    }
    if (material.mainPass && material.mainPass.baseColor) {
      const c = material.mainPass.baseColor as vec4
      material.mainPass.baseColor = new vec4(c.x, c.y, c.z, a)
    }
  }

  private getBaseColorAlpha(material: Material): number {
    if (!material.mainPass || !material.mainPass.baseColor) {
      return 0
    }
    const c = material.mainPass.baseColor as vec4
    return c.w
  }

  private playPostGameTimeAnimation(
    sessionId: number,
    targetSeconds: number,
    onComplete: () => void
  ): void {
    this.stopPostGameTimeAnimation()

    if (!this.timeElapsedText) {
      onComplete()
      return
    }

    this.timeElapsedText.text = "000.0s"
    let elapsed = 0

    this.postGameTimeAnimEvent = this.createEvent("UpdateEvent")
    this.postGameTimeAnimEvent.bind(() => {
      if (sessionId !== this.postGameSessionId) {
        return
      }
      elapsed += getDeltaTime()
      const progress = Math.min(1, elapsed / POSTGAME_TIME_ANIM_SEC)
      const currentSeconds = targetSeconds * progress
      this.timeElapsedText!.text = this.formatPostGameElapsed(currentSeconds)

      if (progress >= 1) {
        this.timeElapsedText!.text = this.formatPostGameElapsed(targetSeconds)
        this.stopPostGameTimeAnimation()
        onComplete()
      }
    })
  }

  private stopPostGameTimeAnimation(): void {
    if (this.postGameTimeAnimEvent) {
      this.postGameTimeAnimEvent.enabled = false
      this.postGameTimeAnimEvent = null
    }
  }

  private formatPostGameElapsed(seconds: number): string {
    const clamped = Math.max(0, Math.min(999.9, seconds))
    const whole = Math.floor(clamped)
    const tenths = Math.min(9, Math.floor((clamped - whole) * 10 + 0.0001))
    return ("000" + whole.toString()).slice(-3) + "." + tenths + "s"
  }

  private getDirectChildren(parent: SceneObject | undefined): SceneObject[] {
    if (!parent) {
      return []
    }
    const children: SceneObject[] = []
    const count = parent.getChildrenCount()
    for (let i = 0; i < count; i++) {
      const child = parent.getChild(i)
      if (child) {
        children.push(child)
      }
    }
    return children
  }

  private resolveCapsuleButton(
    buttonInput: CapsuleButton | undefined | null
  ): CapsuleButton | null {
    if (!buttonInput) {
      return null
    }

    const direct = buttonInput as CapsuleButton
    if (typeof (direct as {inactive?: boolean}).inactive !== "undefined") {
      return direct
    }

    const asScript = buttonInput as unknown as ScriptComponent
    const sceneObject = asScript?.getSceneObject?.()
    if (!sceneObject) {
      return null
    }

    return sceneObject.getComponent(CapsuleButton.getTypeName()) as CapsuleButton | null
  }

  private setCapsuleButtonPressable(
    buttonInput: CapsuleButton | undefined | null,
    pressable: boolean
  ): void {
    const button = this.resolveCapsuleButton(buttonInput)
    if (!button) {
      return
    }

    const apply = () => {
      const resolved = this.resolveCapsuleButton(buttonInput)
      if (!resolved) {
        return
      }
      if (pressable) {
        resolved.inactive = true
        resolved.inactive = false
      } else {
        resolved.inactive = false
        resolved.inactive = true
      }
      const interactable = (resolved as any).interactable
      if (interactable) {
        interactable.enabled = pressable
      }
    }

    if (button.initialized) {
      apply()
      return
    }

    button.onInitialized.add(apply)
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

    if (this.isScreenChangeLocked) {
      this.updateTabToggles()
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
