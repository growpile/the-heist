import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

const PANEL_SHOW_MS = 500
const PANEL_HIDE_MS = 500
const PANEL_HIDE_FAST_MS = 250

@component
export class GameUIController extends BaseScriptComponent {
  @input
  @allowUndefined
  solvedWindow: SceneObject

  @input
  @allowUndefined
  timedWindow: SceneObject

  @input
  @allowUndefined
  tutorialSolvedWindow: SceneObject

  @input
  @allowUndefined
  loadingWindow: SceneObject

  @input
  @allowUndefined
  roomWindow: SceneObject

  @input
  @allowUndefined
  settingsWindow: SceneObject

  @input
  @allowUndefined
  solvedSecondsText: Text

  private activeTweens: any[] = []

  onAwake(): void {
    this.hideAllImmediate()
  }

  setSolvedSeconds(seconds: number): void {
    if (this.solvedSecondsText) {
      this.solvedSecondsText.text = seconds.toFixed(0).toString()
    }
  }

  showSolved(_mode: "solo" | "coop"): void {
    this.showPanel(this.solvedWindow)
  }

  showTutorialSolved(): void {
    this.showPanel(this.tutorialSolvedWindow)
  }

  showTimedOut(): void {
    this.showPanel(this.timedWindow)
  }

  hideSolved(callback?: () => void): void {
    this.hidePanel(this.solvedWindow, callback)
  }

  hideTutorialSolved(callback?: () => void): void {
    this.hidePanel(this.tutorialSolvedWindow, callback)
  }

  hideTimedOut(callback?: () => void): void {
    this.hidePanel(this.timedWindow, callback)
  }

  showLoading(): void {
    this.showPanel(this.loadingWindow)
  }

  hideLoading(callback?: () => void): void {
    this.hidePanel(this.loadingWindow, callback, PANEL_HIDE_FAST_MS)
  }

  showRoom(): void {
    this.showPanel(this.roomWindow)
  }

  hideRoom(callback?: () => void): void {
    this.hidePanel(this.roomWindow, callback)
  }

  showSettings(): void {
    this.showPanel(this.settingsWindow)
  }

  hideSettings(callback?: () => void): void {
    this.hidePanel(this.settingsWindow, callback)
  }

  private hideAllImmediate(): void {
    const panels = [
      this.solvedWindow,
      this.timedWindow,
      this.tutorialSolvedWindow,
      this.loadingWindow,
      this.roomWindow,
      this.settingsWindow
    ]
    for (const panel of panels) {
      if (!panel) {
        continue
      }
      panel.enabled = false
      panel.getTransform().setLocalScale(new vec3(0, 0, 0))
    }
  }

  private showPanel(panel: SceneObject | undefined): void {
    if (!panel) {
      return
    }
    panel.enabled = true
    panel.getTransform().setLocalScale(new vec3(0, 0, 0))
    const tween = LSTween.scaleToWorld(panel.getTransform(), new vec3(1, 1, 1), PANEL_SHOW_MS)
      .easing(Easing.Quadratic.Out)
      .start()
    this.activeTweens.push(tween)
  }

  private hidePanel(
    panel: SceneObject | undefined,
    callback?: () => void,
    durationMs: number = PANEL_HIDE_MS
  ): void {
    if (!panel) {
      callback?.()
      return
    }
    const tween = LSTween.scaleToWorld(panel.getTransform(), new vec3(0, 0, 0), durationMs)
      .easing(Easing.Quadratic.In)
      .onComplete(() => {
        panel.enabled = false
        callback?.()
      })
      .start()
    this.activeTweens.push(tween)
  }
}
