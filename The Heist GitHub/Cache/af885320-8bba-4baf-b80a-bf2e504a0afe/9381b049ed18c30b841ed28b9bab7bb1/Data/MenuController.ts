import {MainMenuTabination} from "./MainMenuTabination"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const MENU_SHOW_MS = 400
const MENU_HIDE_MS = 250

@component
export class MenuController extends BaseScriptComponent {
  @input
  @allowUndefined
  mainMenuTabination: MainMenuTabination

  @input
  @allowUndefined
  menuRoot: SceneObject

  private activeTween: any = null

  onAwake(): void {
    if (this.menuRoot) {
      this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))
      this.menuRoot.enabled = false
    }
  }

  show(callback?: () => void): void {
    if (!this.menuRoot) {
      callback?.()
      return
    }

    this.cancelActiveTween()

    this.menuRoot.enabled = true
    this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0))

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
        this.activeTween = null
        callback?.()
      })
      .start()
  }

  private cancelActiveTween(): void {
    if (this.activeTween && typeof this.activeTween.stop === "function") {
      this.activeTween.stop()
    }
    this.activeTween = null
  }
}
