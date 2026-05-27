import {MainMenuTabination} from "./MainMenuTabination"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const WorldCameraFinderProvider =
  require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")
    .default ?? require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider")

const MENU_SHOW_MS = 400
const DEFAULT_MENU_HEADLOCK_DISTANCE_CM = 110
const MENU_HIDE_MS = 250
const MENU_BACKGROUND_LERP_SEC = 0.3

export type MenuOverlay =
  | "main"
  | "settings"
  | "solved"
  | "timed"
  | "tutorialSolved"
  | "loading"
  | "room"

/**
 * Owns the main menu root and all in-menu overlays (settings, solved, coop room, etc.).
 * Game flow scales `menuRoot` up/down; overlays are toggled via enable/disable only.
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
  @ui.label('<span style="color: #94A3B8;">Child views under menuRoot (enable one at a time)</span>')

  @input
  @allowUndefined
  @hint("Default play tab / tabination content. If empty, menuRoot itself is used.")
  mainMenuContent: SceneObject

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
  roomView: SceneObject

  @input
  @allowUndefined
  solvedSecondsText: Text

  private activeTween: any = null
  private viewTween: any = null
  private isMenuVisible: boolean = false
  private useUtilsScale: boolean = false

  onAwake(): void {
    this.hideOverlayViewsImmediate()
    this.prepareMenuHidden()
    this.mainMenuTabination?.setTabChangedListener((tabIndex) => {
      this.updateMenuBackgroundForTab(tabIndex)
    })
  }

  /** Lerp menu background shader props for the active main-menu tab. */
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

  /** Pop up the main menu (default tab content). Call after intro / play area setup. */
  showMainMenu(callback?: () => void): void {
    this.restoreMainMenuFromRoom(() => {
      this.setActiveOverlay("main")
      this.show(callback)
    })
  }

  /**
   * Scale main menu content down, then scale the coop room view up.
   * Keeps menuRoot visible for Headlock; used when creating a room.
   */
  popMainMenuAndShowRoom(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    this.cancelViewTween()
    this.ensureMenuRootVisible()

    const mainMenu = this.getMainMenuShell()
    this.hideOverlayViewsImmediate()

    const showRoom = () => {
      if (!this.roomView) {
        callback?.()
        return
      }

      this.roomView.enabled = true
      this.roomView.getTransform().setLocalScale(new vec3(0, 0, 0))
      this.animateViewScale(this.roomView, new vec3(1, 1, 1), MENU_SHOW_MS, callback)
    }

    if (!mainMenu) {
      showRoom()
      return
    }

    this.animateViewScale(mainMenu, new vec3(0, 0, 0), MENU_HIDE_MS, () => {
      mainMenu.enabled = false
      showRoom()
    })
  }

  /** Scale room view down and restore main menu content (e.g. failed create-room). */
  restoreMainMenuFromRoom(callback?: () => void): void {
    const mainMenu = this.getMainMenuShell()

    const showMain = () => {
      if (!mainMenu) {
        callback?.()
        return
      }

      mainMenu.enabled = true
      mainMenu.getTransform().setLocalScale(new vec3(0, 0, 0))
      this.animateViewScale(mainMenu, new vec3(1, 1, 1), MENU_SHOW_MS, callback)
    }

    if (!this.roomView || !this.roomView.enabled) {
      showMain()
      return
    }

    this.animateViewScale(this.roomView, new vec3(0, 0, 0), MENU_HIDE_MS, () => {
      this.roomView!.enabled = false
      showMain()
    })
  }

  /** Pop up the menu showing a specific overlay (settings, solved, loading, room, …). */
  showOverlay(overlay: MenuOverlay, callback?: () => void): void {
    this.setActiveOverlay(overlay)
    this.show(callback)
  }

  /** Scale menu up (keeps current overlay selection). */
  show(callback?: () => void): void {
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

    print("[MenuController] Showing menu")

    const tabIndex = this.mainMenuTabination?.getSelectedIndex() ?? 0
    if (tabIndex >= 0) {
      this.updateMenuBackgroundForTab(tabIndex)
    }

    if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, callback)) {
      return
    }

    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    callback?.()
  }

  /** Scale menu down (solo start, coop start, entering gameplay). */
  hide(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    this.cancelActiveTween()

    print("[MenuController] Hiding menu")

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

  setSolvedSeconds(seconds: number): void {
    if (this.solvedSecondsText) {
      this.solvedSecondsText.text = seconds.toFixed(0).toString()
    }
  }

  isVisible(): boolean {
    return this.isMenuVisible
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
      this.useUtilsScale = true
      global.utils.animateScale(target, true, toScale, durationSec, () => {
        onComplete?.()
      })
      return true
    }

    try {
      this.useUtilsScale = false
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

  private setActiveOverlay(overlay: MenuOverlay): void {
    const overlayOnly = [
      this.settingsView,
      this.solvedView,
      this.timedView,
      this.tutorialSolvedView,
      this.loadingView,
      this.roomView
    ]

    for (const view of overlayOnly) {
      if (view) {
        view.enabled = false
      }
    }

    if (overlay === "main") {
      const main = this.mainMenuContent || this.menuRoot
      if (main) {
        main.enabled = true
      }
      return
    }

    const map: Record<MenuOverlay, SceneObject | undefined> = {
      main: this.mainMenuContent || this.menuRoot,
      settings: this.settingsView,
      solved: this.solvedView,
      timed: this.timedView,
      tutorialSolved: this.tutorialSolvedView,
      loading: this.loadingView,
      room: this.roomView
    }

    const active = map[overlay]
    if (active) {
      active.enabled = true
    }
  }

  private hideOverlayViewsImmediate(): void {
    const overlayOnly = [
      this.settingsView,
      this.solvedView,
      this.timedView,
      this.tutorialSolvedView,
      this.loadingView,
      this.roomView
    ]
    for (const view of overlayOnly) {
      if (view) {
        view.enabled = false
      }
    }
  }

  private cancelActiveTween(): void {
    if (this.activeTween && typeof this.activeTween.stop === "function") {
      this.activeTween.stop()
    }
    this.activeTween = null
  }

  private cancelViewTween(): void {
    if (this.viewTween && typeof this.viewTween.stop === "function") {
      this.viewTween.stop()
    }
    this.viewTween = null
  }

  private ensureMenuRootVisible(): void {
    if (!this.menuRoot) {
      return
    }

    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1))
    this.isMenuVisible = true
    this.snapMenuHeadlock()
  }

  private getMainMenuShell(): SceneObject | null {
    if (this.mainMenuContent) {
      return this.mainMenuContent
    }

    if (!this.menuRoot) {
      return null
    }

    const childCount = this.menuRoot.getChildrenCount()
    for (let i = 0; i < childCount; i++) {
      const child = this.menuRoot.getChild(i)
      if (child && child.name === "Main Menu") {
        return child
      }
    }

    return null
  }

  private animateViewScale(
    target: SceneObject,
    toScale: vec3,
    durationMs: number,
    onComplete?: () => void
  ): void {
    const durationSec = durationMs / 1000

    if (global.utils && typeof global.utils.animateScale === "function") {
      global.utils.animateScale(target, true, toScale, durationSec, () => {
        onComplete?.()
      })
      return
    }

    try {
      this.viewTween = LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
        .easing(toScale.x > 0 ? Easing.Back.Out : Easing.Quadratic.In)
        .onComplete(() => {
          this.viewTween = null
          onComplete?.()
        })
        .start()
    } catch (e) {
      print("[MenuController] View scale failed: " + e)
      target.getTransform().setLocalScale(toScale)
      onComplete?.()
    }
  }

  /**
   * Place the menu at camera height in front of the user (horizontal forward only).
   * Headlock stays unlocked on pitch so look up/down still moves the UI afterward.
   */
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
