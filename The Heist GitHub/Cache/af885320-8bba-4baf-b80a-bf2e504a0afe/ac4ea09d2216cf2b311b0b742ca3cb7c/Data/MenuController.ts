import {MainMenuTabination} from "./MainMenuTabination"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const MENU_SHOW_MS = 400
const MENU_HIDE_MS = 250

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

  @ui.separator
  @ui.label('<span style="color: #94A3B8;">Child views under menuRoot (enable one at a time)</span>')

  @input
  @allowUndefined
  @hint("Default play tab / tabination content (shown for main menu)")
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

  onAwake(): void {
    this.hideAllOverlaysImmediate()
    if (this.menuRoot) {
      this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
      this.menuRoot.enabled = false
    }
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
      callback?.()
      return
    }

    this.cancelActiveTween()

    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
    this.isMenuVisible = true

    if (global.appState) {
      global.appState.currentState = "mainMenu"
    }

    this.activeTween = LSTween.scaleToLocal(this.menuRoot.getTransform(), new vec3(1, 1, 1), MENU_SHOW_MS)
      .easing(Easing.Back.Out)
      .onComplete(() => {
        this.activeTween = null
        callback?.()
      })
      .start()
  }

  /** Scale menu down (solo start, coop start, entering gameplay). */
  hide(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    this.cancelActiveTween()

    this.activeTween = LSTween.scaleToLocal(this.menuRoot.getTransform(), new vec3(0, 0, 0), MENU_HIDE_MS)
      .easing(Easing.Quadratic.In)
      .onComplete(() => {
        if (this.menuRoot) {
          this.menuRoot.enabled = false
        }
        this.isMenuVisible = false
        this.activeTween = null
        callback?.()
      })
      .start()
  }

  setSolvedSeconds(seconds: number): void {
    if (this.solvedSecondsText) {
      this.solvedSecondsText.text = seconds.toFixed(0).toString()
    }
  }

  isVisible(): boolean {
    return this.isMenuVisible
  }

  private setActiveOverlay(overlay: MenuOverlay): void {
    const map: Record<MenuOverlay, SceneObject | undefined> = {
      main: this.mainMenuContent,
      settings: this.settingsView,
      solved: this.solvedView,
      timed: this.timedView,
      tutorialSolved: this.tutorialSolvedView,
      loading: this.loadingView,
      room: this.roomView
    }

    const all = [
      this.mainMenuContent,
      this.settingsView,
      this.solvedView,
      this.timedView,
      this.tutorialSolvedView,
      this.loadingView,
      this.roomView
    ]

    for (const view of all) {
      if (view) {
        view.enabled = false
      }
    }

    const active = map[overlay]
    if (active) {
      active.enabled = true
    }
  }

  private hideAllOverlaysImmediate(): void {
    const views = [
      this.mainMenuContent,
      this.settingsView,
      this.solvedView,
      this.timedView,
      this.tutorialSolvedView,
      this.loadingView,
      this.roomView
    ]
    for (const view of views) {
      if (view) {
        view.enabled = false
      }
    }
    if (this.mainMenuContent) {
      this.mainMenuContent.enabled = true
    }
  }

  private cancelActiveTween(): void {
    if (this.activeTween && typeof this.activeTween.stop === "function") {
      this.activeTween.stop()
    }
    this.activeTween = null
  }
}
