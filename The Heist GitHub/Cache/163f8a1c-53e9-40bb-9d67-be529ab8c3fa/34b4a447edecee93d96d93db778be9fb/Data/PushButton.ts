const sikModule = require("SpectaclesInteractionKit.lspkg/SIK")
const SIK = sikModule.SIK || sikModule.default || sikModule
const InteractorTriggerType =
  require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType

const DEPTH_LERP = 15
const PINCH_ANIM_DURATION_SEC = 0.25

type AxisConfig = {
  axisLocal: vec3
  axisWorld: vec3
  axisSize: number
}

type PlaneInfo = {
  axisU: vec3
  axisV: vec3
  halfU: number
  halfV: number
  halfDepth: number
}

type HandInput = {
  isTracked: () => boolean
  handType: string
  indexTip: {position: vec3}
}

/**
 * Physical push-button face driven by fingertip depth on the button plane.
 * Calls an external script function at the trigger threshold; exposes disable() for modules.
 */
@component
export class PushButton extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Button face</span>')

  @input
  @allowUndefined
  @hint("Moving face object with a Physics collider (size used for hit zone).")
  buttonFace: SceneObject

  @input
  @hint("Override collider size for hit detection.")
  customFaceSize: boolean = false

  @input
  @showIf("customFaceSize", true)
  faceSize: vec3 = vec3.zero()

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Press feel</span>')

  @input
  @hint("x = hover threshold (0–1), y = trigger threshold (0–1) of max travel.")
  pressThresholds: vec2 = new vec2(0.2, 0.8)

  @input
  @widget(new SliderWidget(0.1, 5, 0.05))
  @hint("Maximum inward travel along the push axis.")
  maxTravel: number = 1.5

  @input
  @hint("Push along local X instead of default Z.")
  pushX: boolean = false

  @input
  @hint("Push along local Y instead of default Z.")
  pushY: boolean = false

  @input
  @hint("Push along local Z (default when X/Y are off).")
  pushZ: boolean = false

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Callback</span>')

  @input
  @allowUndefined
  @hint("Script to invoke on trigger (e.g. Color Order Module).")
  externalScript: ScriptComponent

  @input
  @hint("Method name on external script (e.g. buttonPress).")
  externalFunctionName: string = ""

  @input
  @hint("Pass the Argument string to the external method.")
  callWithArgument: boolean = false

  @input
  @showIf("callWithArgument", true)
  argument: string = ""

  @ui.separator
  @ui.label('<span style="color: #94A3B8;">Debug</span>')

  @input
  debugLogs: boolean = true

  private readonly rightHand: HandInput = SIK.HandInputData.getHand("right")
  private readonly leftHand: HandInput = SIK.HandInputData.getHand("left")

  private warnedNoFace = false
  private baseLocalPos: vec3 | null = null
  private currentDepth = 0
  private targetDepth = 0
  private hoverActive = false
  private triggerActive = false
  private pinchAnimStart = 0
  private pinchAnimating = false
  private isDisabled = false

  private updateEvent!: UpdateEvent

  onAwake(): void {
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(() => this.onUpdate())
  }

  /** Disables interaction and releases the face (used by puzzle modules on solve). */
  disable(): void {
    this.isDisabled = true
    this.hoverActive = false
    this.triggerActive = false
    this.pinchAnimating = false
  }

  private onUpdate(): void {
    const faceTransform = this.getFaceTransform()
    if (!faceTransform) {
      if (!this.warnedNoFace) {
        this.log("buttonFace not set")
        this.warnedNoFace = true
      }
      return
    }
    this.warnedNoFace = false

    if (this.baseLocalPos === null) {
      this.baseLocalPos = faceTransform.getLocalPosition()
    }

    if (this.isDisabled) {
      this.targetDepth = 0
      this.currentDepth += (this.targetDepth - this.currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1)
      const colliderSize = this.getColliderSize()
      const idleAxis = this.getPushAxisConfig(faceTransform.getWorldRotation(), colliderSize)
      const idlePos = this.baseLocalPos.add(idleAxis.axisLocal.uniformScale(-this.currentDepth))
      faceTransform.setLocalPosition(idlePos)
      return
    }

    const center = faceTransform.getWorldPosition()
    const faceRot = faceTransform.getWorldRotation()
    const size = this.getColliderSize()
    const axisConfig = this.getPushAxisConfig(faceRot, size)
    const planeInfo = this.getPlaneInfo(faceRot, size)

    const anyHit =
      this.checkHand(this.leftHand, center, planeInfo, axisConfig.axisWorld) ||
      this.checkHand(this.rightHand, center, planeInfo, axisConfig.axisWorld)

    let maxDepth = 0
    if (anyHit) {
      const hands = [this.leftHand, this.rightHand]
      for (const hand of hands) {
        if (!hand?.isTracked()) {
          continue
        }
        const tips = [hand.indexTip.position]
        for (const tip of tips) {
          if (!this.isInsideFacePlane(tip, center, planeInfo, axisConfig.axisWorld)) {
            continue
          }
          const offset = tip.sub(center)
          const depth = -offset.dot(axisConfig.axisWorld)
          if (depth > maxDepth) {
            maxDepth = depth
          }
        }
      }
    }

    const travelLimit =
      this.maxTravel !== undefined ? this.maxTravel : axisConfig.axisSize
    this.targetDepth = Math.min(
      Math.max(maxDepth, 0),
      Math.min(axisConfig.axisSize, travelLimit)
    )

    const isEditor =
      !!(global as {deviceInfoSystem?: {isEditor: () => boolean}}).deviceInfoSystem?.isEditor()
    let usePinchAnim = this.pinchAnimating && isEditor

    if (usePinchAnim) {
      const animElapsed = getTime() - this.pinchAnimStart
      const animNormalized = clamp(animElapsed / PINCH_ANIM_DURATION_SEC, 0, 1)
      if (animNormalized >= 1) {
        this.pinchAnimating = false
        usePinchAnim = false
      } else {
        const mirrored =
          animNormalized <= 0.5 ? animNormalized * 2 : 1 - (animNormalized - 0.5) * 2
        const animDepth = travelLimit * clamp(mirrored, 0, 1)
        this.targetDepth = animDepth
        this.currentDepth = animDepth
      }
    }

    if (!usePinchAnim) {
      this.currentDepth +=
        (this.targetDepth - this.currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1)
    }

    if (this.baseLocalPos) {
      const localPos = this.baseLocalPos.add(axisConfig.axisLocal.uniformScale(-this.currentDepth))
      faceTransform.setLocalPosition(localPos)
    }

    const progress = travelLimit > 0 ? this.currentDepth / travelLimit : 0
    const hoverThreshold = this.pressThresholds ? this.pressThresholds.x : 0.2
    const triggerThreshold = this.pressThresholds ? this.pressThresholds.y : 0.8

    if (progress >= hoverThreshold && !this.hoverActive) {
      this.hoverActive = true
      this.log("hover")
      global.playSfx(3, 1, global.appState.checkStorage("masterVolume") * 1)
    } else if (progress < hoverThreshold) {
      this.hoverActive = false
    }

    if (progress >= triggerThreshold && !this.triggerActive) {
      this.triggerActive = true
      this.log("trigger")
      this.invokeExternal()
      global.playSfx(2, 1, global.appState.checkStorage("masterVolume") * 0.9)
    } else if (progress < triggerThreshold) {
      this.triggerActive = false
    }

    this.checkEditorPinch()
  }

  private getFaceTransform(): Transform | null {
    return this.buttonFace?.getTransform() ?? null
  }

  private getColliderSize(): vec3 {
    if (!this.buttonFace) {
      return vec3.one()
    }
    if (this.customFaceSize && this.faceSize) {
      return this.faceSize
    }
    const collider = this.buttonFace.getComponent(
      "Physics.ColliderComponent"
    ) as ColliderComponent | null
    const shape = collider?.shape as BoxShape | null | undefined
    return shape?.size ?? vec3.one()
  }

  private getPushAxisConfig(rot: quat, size: vec3): AxisConfig {
    let axisLocal = vec3.forward()
    let axisSize = size.z
    if (this.pushX) {
      axisLocal = vec3.right()
      axisSize = size.x
    } else if (this.pushY) {
      axisLocal = vec3.up()
      axisSize = size.y
    } else if (this.pushZ) {
      axisLocal = vec3.forward()
      axisSize = size.z
    }
    const axisWorld = rot.multiplyVec3(axisLocal).normalize()
    return {axisLocal, axisWorld, axisSize}
  }

  private getPlaneInfo(rot: quat, size: vec3): PlaneInfo {
    let axisU: vec3
    let axisV: vec3
    let halfU: number
    let halfV: number
    let halfDepth: number

    if (this.pushX) {
      axisU = rot.multiplyVec3(vec3.up()).normalize()
      axisV = rot.multiplyVec3(vec3.forward()).normalize()
      halfU = size.y * 0.5
      halfV = size.z * 0.5
      halfDepth = size.x * 0.5
    } else if (this.pushY) {
      axisU = rot.multiplyVec3(vec3.right()).normalize()
      axisV = rot.multiplyVec3(vec3.forward()).normalize()
      halfU = size.x * 0.5
      halfV = size.z * 0.5
      halfDepth = size.y * 0.5
    } else {
      axisU = rot.multiplyVec3(vec3.right()).normalize()
      axisV = rot.multiplyVec3(vec3.up()).normalize()
      halfU = size.x * 0.5
      halfV = size.y * 0.5
      halfDepth = size.z * 0.5
    }

    return {axisU, axisV, halfU, halfV, halfDepth}
  }

  private invokeExternal(): void {
    if (!this.externalScript || !this.externalFunctionName) {
      return
    }
    const fn = (this.externalScript as unknown as Record<string, unknown>)[
      this.externalFunctionName
    ]
    if (typeof fn !== "function") {
      print(
        "[PushButton] externalFunctionName '" +
          this.externalFunctionName +
          "' is not a function on " +
          (this.externalScript.getSceneObject?.()?.name ?? "external script")
      )
      return
    }

    if (this.callWithArgument) {
      this.log("External argument: " + (this.argument || ""))
      if (this.argument !== undefined && this.argument !== null && this.argument !== "") {
        ;(fn as (arg: string) => void).call(this.externalScript, this.argument)
        return
      }
    }
    ;(fn as () => void).call(this.externalScript)
  }

  private isInsideFacePlane(
    point: vec3,
    center: vec3,
    planeInfo: PlaneInfo,
    axisWorld: vec3
  ): boolean {
    const offset = point.sub(center)
    const planeDist = offset.dot(axisWorld)
    if (Math.abs(planeDist) > planeInfo.halfDepth) {
      return false
    }
    const u = offset.dot(planeInfo.axisU)
    const v = offset.dot(planeInfo.axisV)
    return Math.abs(u) <= planeInfo.halfU && Math.abs(v) <= planeInfo.halfV
  }

  private checkHand(
    hand: HandInput,
    center: vec3,
    planeInfo: PlaneInfo,
    axisWorld: vec3
  ): boolean {
    if (!hand?.isTracked()) {
      return false
    }
    const tip = hand.indexTip.position
    if (this.isInsideFacePlane(tip, center, planeInfo, axisWorld)) {
      this.log("In face area: " + hand.handType + " index")
      return true
    }
    return false
  }

  private isHitButtonFace(hitInfo: {hit?: {collider?: {getSceneObject: () => SceneObject}}}): boolean {
    if (!hitInfo?.hit?.collider) {
      return false
    }
    let sceneObject: SceneObject | null = hitInfo.hit.collider.getSceneObject()
    while (sceneObject) {
      if (sceneObject === this.buttonFace) {
        return true
      }
      sceneObject = sceneObject.getParent()
    }
    return false
  }

  private checkEditorPinch(): void {
    const deviceInfo = (global as {deviceInfoSystem?: {isEditor: () => boolean}}).deviceInfoSystem
    if (!deviceInfo?.isEditor()) {
      return
    }

    const interactorList = SIK.InteractionManager.getTargetingInteractors()
    const primaryInteractor = interactorList.length > 0 ? interactorList[0] : null
    if (!primaryInteractor) {
      return
    }

    if (
      primaryInteractor.previousTrigger === InteractorTriggerType.None &&
      primaryInteractor.currentTrigger !== InteractorTriggerType.None
    ) {
      return
    }

    if (
      primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
      primaryInteractor.currentTrigger === InteractorTriggerType.None
    ) {
      if (this.isHitButtonFace(primaryInteractor.targetHitInfo)) {
        this.pinchAnimStart = getTime()
        this.pinchAnimating = true
      }
    }
  }

  private log(message: string): void {
    if (this.debugLogs) {
      print("[PushButton] " + message)
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
