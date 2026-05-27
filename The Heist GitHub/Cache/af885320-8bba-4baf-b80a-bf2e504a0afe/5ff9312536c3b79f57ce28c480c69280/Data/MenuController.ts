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
  private isMenuVisible: boolean = false
  private useUtilsScale: boolean = false

  onAwake(): void {
    this.hideOverlayViewsImmediate()
    this.prepareMenuHidden()
  }

  /** Pop up the main menu (default tab content). Call after intro / play area setup. */
  showMainMenu(callback?: () => void): void {
    this.setActiveOverlay("main")
    this.show(callback)
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
