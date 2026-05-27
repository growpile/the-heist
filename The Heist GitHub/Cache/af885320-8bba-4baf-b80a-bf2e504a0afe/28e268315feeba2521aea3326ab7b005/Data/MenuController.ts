import {MainMenuTabination} from "./MainMenuTabination"

@component
export class MenuController extends BaseScriptComponent {
  @input
  @allowUndefined
  mainMenuTabination: MainMenuTabination

  @input
  @allowUndefined
  menuRoot: SceneObject

  show(callback?: () => void): void {
    if (global.appState && global.appState.inTransition) {
      return
    }

    if (this.menuRoot) {
      this.menuRoot.enabled = true
    }

    if (global.appState) {
      global.appState.inTransition = true
      global.appState.currentState = "mainMenu"
    }

    if (global.appState) {
      global.appState.inTransition = false
    }

    callback?.()
  }

  hide(callback?: () => void): void {
    if (global.appState && global.appState.inTransition) {
      return
    }

    if (global.appState) {
      global.appState.inTransition = true
    }

    if (this.menuRoot) {
      this.menuRoot.enabled = false
    }

    if (global.appState) {
      global.appState.inTransition = false
    }

    callback?.()
  }
}
