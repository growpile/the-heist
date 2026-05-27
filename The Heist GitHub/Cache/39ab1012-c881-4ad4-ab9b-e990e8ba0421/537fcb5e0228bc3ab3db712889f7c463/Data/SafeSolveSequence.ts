import {LSTween} from "LSTween.lspkg/Examples/Scripts/LSTween"
import Easing from "LSTween.lspkg/Examples/Scripts/EasingFunctions"
import {animateProgress, stopAllProgressTweens} from "./MaterialProgressAnimator"
import {SafeType} from "./SafeTypes"

const DOOR_OPEN_FROM = new vec3(90, 0, 180)
const DOOR_OPEN_TO = new vec3(90, -45, 180)
const DOOR_OPEN_MS = 250

export type SolveCallbacks = {
  onWinComplete: (safeType: SafeType, seconds: number) => void
  onFailComplete: () => void
  playSfx: (name: string) => void
  delay: (seconds: number) => Promise<void>
  resetRotation: () => void
}

export class SafeSolveSequence {
  private safeBody: SceneObject | null
  private safeDoor: SceneObject | null
  private safeContents: SceneObject[]
  private dynamiteFuseMaterials: Material[]
  private dynamiteFuseObjects: SceneObject[]
  private callbacks: SolveCallbacks

  constructor(
    safeBody: SceneObject | null,
    safeDoor: SceneObject | null,
    safeContents: SceneObject[],
    dynamiteFuseMaterials: Material[],
    dynamiteFuseObjects: SceneObject[],
    callbacks: SolveCallbacks
  ) {
    this.safeBody = safeBody
    this.safeDoor = safeDoor
    this.safeContents = safeContents || []
    this.dynamiteFuseMaterials = dynamiteFuseMaterials || []
    this.dynamiteFuseObjects = dynamiteFuseObjects || []
    this.callbacks = callbacks
  }

  async playWinSequence(safeType: SafeType, remainingSeconds: number): Promise<void> {
    stopAllProgressTweens()
    this.callbacks.playSfx("safe-solved")

    await this.callbacks.delay(0.5)

    for (const content of this.safeContents) {
      if (content) {
        content.enabled = true
      }
    }

    if (this.safeBody) {
      const bodyMat = this.getBodyMaterial()
      if (bodyMat) {
        animateProgress(bodyMat, 1, 1.5)
      }
    }

    this.openDoor()

    await this.callbacks.delay(2)
    this.callbacks.onWinComplete(safeType, remainingSeconds)
  }

  async playFailSequence(): Promise<void> {
    stopAllProgressTweens()
    this.callbacks.playSfx("safe-failed")
    this.callbacks.resetRotation()

    await this.callbacks.delay(1.5)
    this.callbacks.onFailComplete()
  }

  animateFuseProgress(progress: number, durationSec: number): void {
    for (const mat of this.dynamiteFuseMaterials) {
      animateProgress(mat, progress, durationSec)
    }
  }

  private openDoor(): void {
    if (!this.safeDoor) {
      return
    }
    const transform = this.safeDoor.getTransform()
    LSTween.rotateFromToLocalInDegrees(
      transform,
      DOOR_OPEN_FROM,
      DOOR_OPEN_TO,
      DOOR_OPEN_MS
    )
      .easing(Easing.Back.Out)
      .start()
  }

  private getBodyMaterial(): Material | null {
    if (!this.safeBody) {
      return null
    }
    const rmv = this.safeBody.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    return rmv ? rmv.mainMaterial : null
  }
}
