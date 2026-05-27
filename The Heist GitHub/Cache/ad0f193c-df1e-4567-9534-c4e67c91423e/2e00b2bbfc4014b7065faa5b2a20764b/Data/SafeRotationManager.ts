import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import {getMaterialScalar, setMaterialScalar} from "./Safe/MaterialPropertyHelpers"

const sikModule = require("SpectaclesInteractionKit.lspkg/SIK")
const SIK = sikModule.SIK || sikModule.default || sikModule
const InteractorTriggerType =
  require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType

const LEFT_AREA_NAME = "Rotate Left Area"
const RIGHT_AREA_NAME = "Rotate Right Area"
const HOLD_DURATION_SEC = 0.75
const RELEASE_DURATION_SEC = 0.25
const ROTATION_DURATION_SEC = 0.25
const YAW_STEP_RADIANS = Math.PI * 0.5

type HoldState = {
  active: boolean
  holdStart: number
  triggered: boolean
  label: string
  triggerDelayId: string | null
}

type AreaBox = {
  center: vec3
  half: vec3
}

type StoppableTween = {
  stop: () => void
}

type TweenProgress = {
  t: number
}

const LOCAL_Y_AXIS = new vec3(0, 1, 0)

/**
 * TypeScript + LSTween port of `Safe Rotation Manager.js`.
 * Drop-in replacement: wire the same inputs, then disable or remove the JS component when ready.
 */
@component
export class SafeRotationManager extends BaseScriptComponent {
  @input
  @allowUndefined
  safeRotateOrigin: SceneObject

  @input
  @allowUndefined
  leftArea: BodyComponent

  @input
  @allowUndefined
  rightArea: BodyComponent

  @input
  @allowUndefined
  rotateIcons: Image[]

  @input
  @allowUndefined
  groundMaterial: Material

  canRotate = false

  private rotateTransform: Transform | null = null
  private rotationTween: StoppableTween | null = null
  private groundTween: StoppableTween | null = null
  private accumulatedYaw = 0
  private isRotating = false

  private leftHand: any = null
  private rightHand: any = null

  private leftState: HoldState = this.createHoldState()
  private rightState: HoldState = this.createHoldState()

  private iconProgressTweens: (StoppableTween | null)[] = []
  private iconOpacityTweens: (StoppableTween | null)[] = []

  private lastEditorHitInfo: any = null
  private lastEditorStartArea = ""

  onAwake(): void {
    this.rotateTransform = this.safeRotateOrigin?.getTransform() ?? null
    this.leftHand = SIK.HandInputData.getHand("left")
    this.rightHand = SIK.HandInputData.getHand("right")

    global.resetRotation = () => this.resetRotation()

    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
  }

  setGroundMaterial(material: Material | undefined | null): void {
    this.groundMaterial = (material ?? undefined) as Material
  }

  setCanRotate(state: boolean): void {
    this.canRotate = state
    const targetOpacity = this.canRotate ? 1 : 0
    this.animateIconOpacity(0, targetOpacity, RELEASE_DURATION_SEC)
    this.animateIconOpacity(1, targetOpacity, RELEASE_DURATION_SEC)
  }

  resetRotation(): void {
    if (!this.rotateTransform) {
      return
    }
    this.setCanRotate(false)
    if (this.accumulatedYaw === 0) {
      this.stopTween(this.rotationTween)
      this.isRotating = false
      return
    }
    this.animateYawDelta(-this.accumulatedYaw, ROTATION_DURATION_SEC)
  }

  private createHoldState(): HoldState {
    return {
      active: false,
      holdStart: 0,
      triggered: false,
      label: "",
      triggerDelayId: null
    }
  }

  private tweenProgress(progress: TweenProgress | number): number {
    if (typeof progress === "number") {
      return progress
    }
    return progress.t
  }

  private smoothStep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  private stopTween(tween: StoppableTween | null): void {
    tween?.stop?.()
  }

  private wrapTween(tween: {stop: () => void}): StoppableTween {
    return {stop: () => tween.stop()}
  }

  private animateYawDelta(deltaRadians: number, durationSec: number): void {
    if (!this.rotateTransform || this.isRotating) {
      return
    }

    global.playSfx(
      global.utils.rng(22, 25),
      1,
      global.appState.checkStorage("masterVolume") * 0.9
    )

    this.stopTween(this.rotationTween)
    this.stopTween(this.groundTween)

    this.animateGroundRotation(deltaRadians, durationSec)

    const offset = quat.angleAxis(deltaRadians, LOCAL_Y_AXIS)
    const durationMs = durationSec * 1000

    this.isRotating = true
    const tween = LSTween.rotateOffset(this.rotateTransform, offset, durationMs)
      .easing(Easing.Quadratic.InOut)
      .onComplete(() => {
        this.accumulatedYaw += deltaRadians
        this.isRotating = false
        this.rotationTween = null
        this.resetGroundRotation()
      })

    this.rotationTween = this.wrapTween(tween)
    tween.start()
  }

  private getGroundRotation(): number | null {
    const material = this.groundMaterial
    if (!material) {
      return null
    }
    if (material.mainPass && material.mainPass.rotation !== undefined) {
      return material.mainPass.rotation as number
    }
    if ((material as any).rotation !== undefined) {
      return (material as any).rotation as number
    }
    return null
  }

  private setGroundRotation(value: number): void {
    const material = this.groundMaterial
    if (!material) {
      return
    }
    if (material.mainPass && material.mainPass.rotation !== undefined) {
      material.mainPass.rotation = value
      return
    }
    if ((material as any).rotation !== undefined) {
      ;(material as any).rotation = value
    }
  }

  private animateGroundRotation(deltaRadians: number, durationSec: number): void {
    const groundStart = this.getGroundRotation()
    if (groundStart === null) {
      return
    }

    const groundTarget = deltaRadians >= 0 ? 1 : -1
    const durationMs = durationSec * 1000

    const tween = LSTween.rawTween(durationMs)
      .easing(Easing.Quadratic.InOut)
      .onUpdate((progress: TweenProgress) => {
        const t = this.smoothStep(this.tweenProgress(progress))
        this.setGroundRotation(groundStart + (groundTarget - groundStart) * t)
      })
      .onComplete(() => {
        this.resetGroundRotation()
        this.groundTween = null
      })

    this.groundTween = this.wrapTween(tween)
    tween.start()
  }

  private resetGroundRotation(): void {
    if (this.getGroundRotation() !== null) {
      this.setGroundRotation(0)
    }
  }

  private getIconMaterial(index: number): Material | null {
    const icon = this.rotateIcons?.[index]
    if (!icon) {
      return null
    }
    return icon.mainMaterial ?? null
  }

  private getIconProgress(material: Material | null): number | null {
    if (!material) {
      return null
    }
    if (material.mainPass && material.mainPass.progress !== undefined) {
      return material.mainPass.progress as number
    }
    if ((material as any).progress !== undefined) {
      return (material as any).progress as number
    }
    return null
  }

  private setIconProgress(material: Material | null, value: number): void {
    if (!material) {
      return
    }
    if (material.mainPass && material.mainPass.progress !== undefined) {
      material.mainPass.progress = value
    } else if ((material as any).progress !== undefined) {
      ;(material as any).progress = value
    }
  }

  private getIconOpacity(material: Material | null): number | null {
    if (!material) {
      return null
    }
    if (material.mainPass && material.mainPass.opacityMultiplier !== undefined) {
      return material.mainPass.opacityMultiplier as number
    }
    if ((material as any).opacityMultiplier !== undefined) {
      return (material as any).opacityMultiplier as number
    }
    return null
  }

  private setIconOpacity(material: Material | null, value: number): void {
    if (!material) {
      return
    }
    if (material.mainPass && material.mainPass.opacityMultiplier !== undefined) {
      material.mainPass.opacityMultiplier = value
    } else if ((material as any).opacityMultiplier !== undefined) {
      ;(material as any).opacityMultiplier = value
    }
  }

  private animateMaterialScalar(
    slot: (StoppableTween | null)[],
    index: number,
    getValue: (material: Material) => number | null,
    setValue: (material: Material, value: number) => void,
    targetValue: number,
    durationSec: number,
    onComplete?: () => void
  ): void {
    const material = this.getIconMaterial(index)
    if (!material) {
      return
    }

    const startValue = getValue(material)
    if (startValue === null || startValue === undefined) {
      onComplete?.()
      return
    }

    this.stopTween(slot[index] ?? null)

    const durationMs = durationSec * 1000
    const tween = LSTween.rawTween(durationMs)
      .easing(Easing.Quadratic.InOut)
      .onUpdate((progress: TweenProgress) => {
        const t = this.smoothStep(this.tweenProgress(progress))
        const value = startValue + (targetValue - startValue) * t
        setValue(material, value)
      })
      .onComplete(() => {
        setValue(material, targetValue)
        slot[index] = null
        onComplete?.()
      })

    slot[index] = this.wrapTween(tween)
    tween.start()
  }

  private animateIconProgress(
    index: number,
    targetValue: number,
    durationSec: number,
    onComplete?: () => void
  ): void {
    this.animateMaterialScalar(
      this.iconProgressTweens,
      index,
      (m) => this.getIconProgress(m),
      (m, v) => this.setIconProgress(m, v),
      targetValue,
      durationSec,
      onComplete
    )
  }

  private animateIconOpacity(index: number, targetValue: number, durationSec: number): void {
    this.animateMaterialScalar(
      this.iconOpacityTweens,
      index,
      (m) => this.getIconOpacity(m),
      (m, v) => this.setIconOpacity(m, v),
      targetValue,
      durationSec
    )
  }

  private isIconReady(index: number): boolean {
    const value = this.getIconProgress(this.getIconMaterial(index))
    if (value === null || value === undefined) {
      return true
    }
    return value <= 0.001
  }

  private playIconBump(index: number): void {
    const icon = this.rotateIcons?.[index]
    if (!icon) {
      return
    }
    const transform = icon.getSceneObject().getTransform()
    const rest = transform.getLocalScale()
    const bump = rest.uniformScale(1.15)

    LSTween.scaleFromToLocal(transform, rest, bump, 80)
      .easing(Easing.Quadratic.Out)
      .chain(LSTween.scaleFromToLocal(transform, bump, rest, 120).easing(Easing.Quadratic.In))
      .start()
  }

  private updateHoldState(
    index: number,
    state: HoldState,
    isActive: boolean,
    handLabel: string,
    triggerFn: (handLabel: string) => void
  ): void {
    const now = getTime()

    if (isActive) {
      if (!state.active) {
        if (!this.isIconReady(index)) {
          return
        }
        state.active = true
        state.holdStart = now
        state.triggered = false
        state.label = handLabel || ""

        const triggerTime = HOLD_DURATION_SEC * 0.7
        const delayId = "rotateHold_" + index
        if (state.triggerDelayId) {
          global.utils.invalidateDelay(state.triggerDelayId)
        }
        state.triggerDelayId = delayId
        global.utils.delay(delayId, triggerTime, () => {
          if (!state.active || state.triggered) {
            return
          }
          if (this.canRotate && !this.isRotating) {
            state.triggered = true
            triggerFn(state.label || "Hand")
          }
        })

        this.animateIconProgress(index, 1, HOLD_DURATION_SEC)
      } else if (handLabel) {
        state.label = handLabel
      }
      return
    }

    if (state.active || state.triggered) {
      state.active = false
      state.triggered = false
      state.holdStart = 0
      state.label = ""
      if (state.triggerDelayId) {
        global.utils.invalidateDelay(state.triggerDelayId)
        state.triggerDelayId = null
      }
      this.animateIconProgress(index, 0, RELEASE_DURATION_SEC)
    }
  }

  private leftRotation(handLabel: string): void {
    if (!this.canRotate || this.isRotating) {
      return
    }
    this.playIconBump(0)
    print(handLabel + " Hand triggered Left Rotation")
    this.animateYawDelta(-YAW_STEP_RADIANS, ROTATION_DURATION_SEC)
  }

  private rightRotation(handLabel: string): void {
    if (!this.canRotate || this.isRotating) {
      return
    }
    this.playIconBump(1)
    print(handLabel + " Hand triggered Right Rotation")
    this.animateYawDelta(YAW_STEP_RADIANS, ROTATION_DURATION_SEC)
  }

  private isInsideBounds(point: vec3, center: vec3, halfSize: vec3): boolean {
    const offset = point.sub(center)
    return (
      Math.abs(offset.x) <= halfSize.x &&
      Math.abs(offset.y) <= halfSize.y &&
      Math.abs(offset.z) <= halfSize.z
    )
  }

  private getBodyCollider(body: BodyComponent | undefined): ColliderComponent | null {
    if (!body?.getSceneObject) {
      return null
    }
    const so = body.getSceneObject()
    if (!so) {
      return null
    }
    const collider = so.getComponent("Physics.ColliderComponent") as ColliderComponent
    if (collider) {
      return collider
    }
    for (let i = 0; i < so.getChildrenCount(); i++) {
      const child = so.getChild(i)
      if (!child) {
        continue
      }
      const childCollider = child.getComponent("Physics.ColliderComponent") as ColliderComponent
      if (childCollider) {
        return childCollider
      }
    }
    return null
  }

  private getBoxShapeSize(shape: Shape | null | undefined): vec3 | null {
    if (!shape) {
      return null
    }
    const boxShape = shape as BoxShape
    return boxShape.size ?? null
  }

  private getColliderBox(body: BodyComponent | undefined): AreaBox | null {
    const collider = this.getBodyCollider(body)
    const size = this.getBoxShapeSize(collider?.shape ?? null)
    if (!collider || !size) {
      return null
    }
    const so = collider.getSceneObject()
    if (!so) {
      return null
    }
    const center = so.getTransform().getWorldPosition()
    const half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
    return {center, half}
  }

  private getHandPoint(hand: any): vec3 | null {
    if (!hand?.isTracked?.() || !hand.isTracked()) {
      return null
    }
    if (hand.getPalmCenter) {
      return hand.getPalmCenter()
    }
    return hand.indexTip ? hand.indexTip.position : null
  }

  private isHandInArea(hand: any, areaBox: AreaBox | null): boolean {
    if (!areaBox) {
      return false
    }
    const point = this.getHandPoint(hand)
    if (!point) {
      return false
    }
    return this.isInsideBounds(point, areaBox.center, areaBox.half)
  }

  private isHitAreaName(hitInfo: any, areaName: string): boolean {
    if (!hitInfo?.hit?.collider || !areaName) {
      return false
    }
    let so: SceneObject | null = hitInfo.hit.collider.getSceneObject()
    while (so) {
      if (so.name === areaName) {
        return true
      }
      so = so.getParent ? so.getParent() : null
    }
    return false
  }

  private checkEditorClick(): void {
    if (!global.deviceInfoSystem?.isEditor()) {
      return
    }

    const interactorList = SIK.InteractionManager.getTargetingInteractors()
    const primaryInteractor = interactorList.length > 0 ? interactorList[0] : null
    if (!primaryInteractor) {
      return
    }

    if (
      primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
      primaryInteractor.currentTrigger === InteractorTriggerType.None
    ) {
      const hitInfo = primaryInteractor.targetHitInfo || this.lastEditorHitInfo
      if (
        this.lastEditorStartArea === LEFT_AREA_NAME &&
        this.isHitAreaName(hitInfo, LEFT_AREA_NAME) &&
        this.isIconReady(0)
      ) {
        this.animateIconProgress(0, 1, 0.25)
        global.utils.delay(0.25, () => {
          this.animateIconProgress(0, 0, RELEASE_DURATION_SEC)
        })
        this.leftRotation("Editor")
      } else if (
        this.lastEditorStartArea === RIGHT_AREA_NAME &&
        this.isHitAreaName(hitInfo, RIGHT_AREA_NAME) &&
        this.isIconReady(1)
      ) {
        this.animateIconProgress(1, 1, 0.25)
        global.utils.delay(0.25, () => {
          this.animateIconProgress(1, 0, RELEASE_DURATION_SEC)
        })
        this.rightRotation("Editor")
      }
      this.lastEditorHitInfo = null
      this.lastEditorStartArea = ""
    } else if (
      primaryInteractor.previousTrigger === InteractorTriggerType.None &&
      primaryInteractor.currentTrigger !== InteractorTriggerType.None
    ) {
      const startHit = primaryInteractor.targetHitInfo
      this.lastEditorHitInfo = startHit
      if (this.isHitAreaName(startHit, LEFT_AREA_NAME)) {
        this.lastEditorStartArea = LEFT_AREA_NAME
      } else if (this.isHitAreaName(startHit, RIGHT_AREA_NAME)) {
        this.lastEditorStartArea = RIGHT_AREA_NAME
      } else {
        this.lastEditorStartArea = ""
      }
    }
  }

  private onUpdate(): void {
    const leftBox = this.getColliderBox(this.leftArea)
    const rightBox = this.getColliderBox(this.rightArea)

    const leftInLeft = this.isHandInArea(this.leftHand, leftBox)
    const rightInLeft = this.isHandInArea(this.rightHand, leftBox)
    const leftActive = leftInLeft || rightInLeft
    const leftLabel = leftInLeft ? "Left" : rightInLeft ? "Right" : "Hand"
    this.updateHoldState(0, this.leftState, leftActive, leftLabel, (label) => this.leftRotation(label))

    const leftInRight = this.isHandInArea(this.leftHand, rightBox)
    const rightInRight = this.isHandInArea(this.rightHand, rightBox)
    const rightActive = leftInRight || rightInRight
    const rightLabel = leftInRight ? "Left" : rightInRight ? "Right" : "Hand"
    this.updateHoldState(1, this.rightState, rightActive, rightLabel, (label) =>
      this.rightRotation(label)
    )

    this.checkEditorClick()
  }
}
