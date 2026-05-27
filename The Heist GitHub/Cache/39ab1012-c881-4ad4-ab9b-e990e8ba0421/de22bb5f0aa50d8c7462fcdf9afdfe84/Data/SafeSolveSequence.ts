import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import {animateProgress} from "./MaterialProgressAnimator"
import {SafeType} from "./SafeTypes"

const DOOR_OPEN_FROM = new vec3(90, 0, 180)
const DOOR_OPEN_TO = new vec3(90, -45, 180)
const DOOR_OPEN_MS = 250

export class SafeSolveSequence {
  private safeBody: SceneObject | null
  private safeDoor: SceneObject | null
  private safeContents: SceneObject[]
  private safeBodyMaterial: Material | null = null
  private failedTriggered = false

  constructor(
    safeBody: SceneObject | null,
    safeDoor: SceneObject | null,
    safeContents: SceneObject[]
  ) {
    this.safeBody = safeBody
    this.safeDoor = safeDoor
    this.safeContents = safeContents || []
  }

  cloneSafeBodyMaterial(): void {
    if (!this.safeBody) {
      return
    }
    const rmv = this.safeBody.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    if (!rmv || !rmv.mainMaterial) {
      return
    }
    const newBodyMaterial = rmv.mainMaterial.clone()
    rmv.clearMaterials()
    rmv.addMaterial(newBodyMaterial)
    this.safeBodyMaterial = rmv.mainMaterial
  }

  playFailSequence(onComplete: () => void): void {
    if (this.failedTriggered) {
      return
    }
    this.failedTriggered = true
    global.resetRotation()
    global.utils.delay(3, () => {
      onComplete()
    })
  }

  playWinSequence(safeType: SafeType, onPresentationReady: () => void): void {
    if (safeType === "tutorial") {
      global.appState.setStorage("tutorialPlayed", true)
    }

    global.utils.delay(0.5, () => {
      global.resetRotation()

      if (this.safeContents[0]) {
        this.safeContents[0].enabled = false
      }
      if (this.safeContents[1]) {
        this.safeContents[1].enabled = true
      }

      global.utils.delay(0.5, () => {
        if (this.safeBodyMaterial) {
          animateProgress(this.safeBodyMaterial, 1, 0.25)
        }

        const vol = global.appState.checkStorage("masterVolume")
        global.playSfx(26, 1, vol * 0.8)
        global.playSfx(27, 1, vol * 1)

        this.openDoor()

        global.utils.delay(DOOR_OPEN_MS / 1000 + 0.05, () => {
          onPresentationReady()
        })
      })
    })
  }

  private openDoor(): void {
    if (!this.safeDoor) {
      return
    }
    const transform = this.safeDoor.getTransform()
    LSTween.rotateFromToLocalInDegrees(transform, DOOR_OPEN_FROM, DOOR_OPEN_TO, DOOR_OPEN_MS)
      .easing(Easing.Back.Out)
      .start()
  }
}
