import {animateMaterialScalar, setMaterialScalar} from "./Safe/MaterialPropertyHelpers"

const FAIL_GROUND_DURATION_SEC = 0.25

/**
 * Ground plane grid material — resolves live material from a scene object at runtime.
 * No inspector inputs; wired via GameFlowController.groundPlane SceneObject.
 */
export class GroundPlaneController {
  constructor(private groundPlane: SceneObject | null | undefined) {}

  resolveMaterial(): Material | null {
    if (!this.groundPlane) {
      return null
    }
    const rmv = this.groundPlane.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    return rmv?.mainMaterial ?? null
  }

  resetHidden(): void {
    this.setScalar("opacityMultiplier", 0)
    this.setScalar("size", 0)
    this.setScalar("rotation", 0)
  }

  show(): void {
    this.resetHidden()
    this.animateScalar("opacityMultiplier", 1, 0.25)
    global.utils.delay(1, () => {
      this.animateScalar("size", 1, 0.25)
    })
  }

  hide(): void {
    this.animateScalar("opacityMultiplier", 0, 0.25)
    this.animateScalar("size", 0, 0.25)
    this.setScalar("rotation", 0)
  }

  shrinkForFail(): void {
    const duration = FAIL_GROUND_DURATION_SEC
    this.animateScalar("size", 0, duration)
    global.utils.delay(duration * 0.5, () => {
      this.animateScalar("opacityMultiplier", 0, duration)
    })
  }

  private setScalar(key: string, value: number): void {
    setMaterialScalar(this.resolveMaterial(), key, value)
  }

  private animateScalar(key: string, value: number, duration: number, callback?: () => void): void {
    animateMaterialScalar(this.resolveMaterial(), key, value, duration, callback)
  }
}
