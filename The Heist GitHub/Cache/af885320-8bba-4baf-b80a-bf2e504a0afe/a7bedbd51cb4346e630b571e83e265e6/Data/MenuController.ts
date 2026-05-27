import {MainMenuTabination} from "./MainMenuTabination"
import {MenuView} from "./MenuView"
import {MenuViewTransitions} from "./MenuViewTransitions"
import {SafeType} from "./Safe/SafeTypes"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const WorldCameraFinderProvider =
  require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")
    .default ?? require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")

const MENU_SHOW_MS = 400
const DEFAULT_MENU_HEADLOCK_DISTANCE_CM = 110
const MENU_HIDE_MS = 250
const MENU_BACKGROUND_LERP_SEC = 0.3

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

  onAwake(): void {
    this.cacheAllViewElements()
    this.hideAllScreensImmediate()
    this.hidePostGameOverlaysImmediate()
    this.prepareMenuHidden()
    this.mainMenuTabination?.setTabChangedListener((tabIndex) => {
      if (this.currentScreen === "main") {
        this.updateMenuBackgroundForTab(tabIndex)
      }
    })
  }

  /** Lens open: scale menu up on the main step. */
  showMainMenu(callback?: () => void): void {
    this.pendingSafeType = null
    this.transitionToScreen("main", () => {
      this.show(callback)
    })
  }

  /** Main menu → Solo or Tutorial tips (first run uses tutorial). */
  requestSoloTips(callback?: () => void): void {
    const hasPlayed = global.appState?.checkStorage("tutorialPlayed") ?? false
    this.pendingSafeType = hasPlayed ? "solo" : "tutorial"
    const target: MenuScreenId = hasPlayed ? "soloTips" : "tutorialTips"
    this.transitionToScreen(target, callback)
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

  /** Scale entire menu away before surface placement or gameplay. */
  hideForGameplay(callback?: () => void): void {
    this.transitions.stopAll()
    this.hide(callback)
  }

  /** Pop back to main menu (e.g. failed create-room). */
  returnToMainMenu(callback?: () => void): void {
    this.pendingSafeType = null
    this.transitionToScreen("main", callback)
  }

  /** Legacy post-game overlays — toggled without pop stack for now. */
  showOverlay(overlay: MenuOverlay, callback?: () => void): void {
    this.setPostGameOverlay(overlay)
    this.show(callback)
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
    const overlays = [
      this.settingsView,
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
    this.hidePostGameOverlaysImmediate()

    if (overlay === "main") {
      return
    }

    const map: Partial<Record<MenuOverlay, SceneObject | undefined>> = {
      settings: this.settingsView,
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

  private show(callback?: () => void): void {
    if (!this.menuRoot) {
      print("[MenuController] show() skipped — menuRoot not assigned")
      callback?.()
      return
    }

    this.cancelActiveTween()
    this.menuRoot.enabled = true
    this.snapMenuHeadlock()
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

  private snapMenuHeadlock(): void {
    if (!this.menuRoot) {
      return
    }

    const distance = this.getMenuHeadlockDistance()
    const cameraTransform = WorldCameraFinderProvider.getInstance().getTransform()
    const cameraPosition = cameraTransform.getWorldPosition()
    const lookForward = cameraTransform.back

    let flatForward = new vec3(lookForward.x, 0, lookForward.z)
    if (flatForward.length > 0.001) {
      flatForward = flatForward.normalize()
    } else {
      flatForward = new vec3(0, 0, -1)
    }

    const menuPosition = cameraPosition.add(flatForward.uniformScale(distance))
    this.menuRoot.getTransform().setWorldPosition(menuPosition)
  }

  private getMenuHeadlockDistance(): number {
    const scriptComponents = this.menuRoot!.getComponents(
      "Component.ScriptComponent"
    ) as ScriptComponent[]
    for (const comp of scriptComponents) {
      const distance = (comp as any).distance
      if (typeof distance === "number" && distance > 0) {
        return distance
      }
    }
    return DEFAULT_MENU_HEADLOCK_DISTANCE_CM
  }
}
