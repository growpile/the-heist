import {PlacementMode, PlacementSettings} from "../Addons/SurfacePlacement.lspkg/Scripts/PlacementSettings"
import {SurfacePlacementController} from "../Addons/SurfacePlacement.lspkg/Scripts/SurfacePlacementController"

/** Surface placement wrapper — GameFlowController calls startPlacement before safe spawn. */
@component
export class SafeAnchorPlacement extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Placement Configuration</span>')

  @input
  @allowUndefined
  @hint("Child to hide until surface is confirmed (e.g. VisualParent / Safe Origin). Same as Example.objectVisuals.")
  placementVisuals: SceneObject

  @input("int")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Near Surface", 0),
      new ComboBoxItem("Horizontal", 1),
      new ComboBoxItem("Vertical", 2)
    ])
  )
  placementSettingMode: number = 0

  @input
  @hint("Show the height-adjustment slider widget (NEAR_SURFACE only)")
  useAdjustmentWidget: boolean = true

  @input
  @hint("Offset in cm of the height-adjustment widget from the surface center")
  widgetOffset: vec3 = new vec3(10, 10, 0)

  private onPlacedCallback: ((pos: vec3, rot: quat) => void) | null = null
  private onSliderCallback: ((pos: vec3) => void) | null = null
  private isPlacing: boolean = false
  private placementTransform: Transform | null = null
  private resetButton: SceneObject | null = null

  onAwake(): void {
    this.placementTransform = this.getSceneObject().getTransform()
    this.resolvePlacementVisuals()
    this.setPlacementVisualsVisible(false)
    this.createEvent("OnStartEvent").bind(() => {
      this.setPlacementVisualsVisible(false)
    })
  }

  /** Finds Anchor / VisualParent child from the SurfacePlacement Example hierarchy if not wired. */
  private resolvePlacementVisuals(): void {
    if (this.placementVisuals) {
      this.cacheResetButton()
      return
    }
    const root = this.getSceneObject()
    for (let i = 0; i < root.getChildrenCount(); i++) {
      const child = root.getChild(i)
      if (!child) {
        continue
      }
      const name = child.name
      if (name.indexOf("VisualParent") !== -1 || name.indexOf("Anchor") !== -1) {
        this.placementVisuals = child
        print("[SafeAnchorPlacement] Auto-assigned placementVisuals: " + child.name)
        this.cacheResetButton()
        return
      }
    }
    if (root.getChildrenCount() > 0) {
      const firstChild = root.getChild(0)
      if (firstChild) {
        this.placementVisuals = firstChild
        print("[SafeAnchorPlacement] Auto-assigned placementVisuals to first child: " + firstChild.name)
        this.cacheResetButton()
        return
      }
    }
    print("[SafeAnchorPlacement] placementVisuals not assigned — anchor preview may stay visible at scene center")
  }

  private cacheResetButton(): void {
    if (!this.placementVisuals) {
      return
    }
    this.resetButton = this.findChildByName(this.placementVisuals, "ResetButton")
  }

  private findChildByName(parent: SceneObject, targetName: string): SceneObject | null {
    if (parent.name === targetName) {
      return parent
    }
    for (let i = 0; i < parent.getChildrenCount(); i++) {
      const child = parent.getChild(i)
      if (!child) {
        continue
      }
      const found = this.findChildByName(child, targetName)
      if (found) {
        return found
      }
    }
    return null
  }

  /**
   * Begins surface calibration. `onPlaced` fires once the user confirms a
   * surface. `onSliderUpdated` (optional) fires continuously while the user
   * drags the height widget — useful for previewing the spawn position
   * before confirmation.
   */
  startPlacement(
    onPlaced: (pos: vec3, rot: quat) => void,
    onSliderUpdated?: (pos: vec3) => void
  ): void {
    if (this.isPlacing) {
      this.stopPlacement()
    }

    this.onPlacedCallback = onPlaced
    this.onSliderCallback = onSliderUpdated || null
    this.isPlacing = true

    this.setPlacementVisualsVisible(false)

    const settings = this.buildSettings()
    SurfacePlacementController.getInstance().startSurfacePlacement(
      settings,
      (pos: vec3, rot: quat) => this.handlePlacementConfirmed(pos, rot)
    )
  }

  /** Aborts an in-progress placement session (no callback fires). */
  stopPlacement(): void {
    if (!this.isPlacing) {
      return
    }
    SurfacePlacementController.getInstance().stopSurfacePlacement()
    this.isPlacing = false
    this.onPlacedCallback = null
    this.onSliderCallback = null
    this.setPlacementVisualsVisible(false)
  }

  /**
   * Scales placement visuals away and hides them when returning to the main menu.
   * Resets local scale while disabled so the next session starts at full size.
   */
  hideForMenu(onComplete?: () => void): void {
    this.stopPlacement()

    const visuals = this.placementVisuals
    if (!visuals) {
      onComplete?.()
      return
    }

    const finish = (): void => {
      visuals.getTransform().setLocalScale(new vec3(1, 1, 1))
      this.setPlacementVisualsVisible(false)
      onComplete?.()
    }

    if (!visuals.enabled) {
      finish()
      return
    }

    global.utils.animateScale(visuals, true, new vec3(0, 0, 0), 0.25, finish)
  }

  isActive(): boolean {
    return this.isPlacing
  }

  private buildSettings(): PlacementSettings {
    switch (this.placementSettingMode) {
      case 0:
        return new PlacementSettings(
          PlacementMode.NEAR_SURFACE,
          this.useAdjustmentWidget,
          this.widgetOffset,
          (pos: vec3) => this.handleSliderUpdate(pos)
        )
      case 1:
        return new PlacementSettings(PlacementMode.HORIZONTAL)
      case 2:
        return new PlacementSettings(PlacementMode.VERTICAL)
      default:
        return new PlacementSettings(PlacementMode.NEAR_SURFACE)
    }
  }

  private handleSliderUpdate(pos: vec3): void {
    if (this.placementTransform) {
      this.placementTransform.setWorldPosition(pos)
    }
    if (this.onSliderCallback) {
      this.onSliderCallback(pos)
    }
  }

  private handlePlacementConfirmed(pos: vec3, rot: quat): void {
    const cb = this.onPlacedCallback
    this.isPlacing = false
    this.onPlacedCallback = null
    this.onSliderCallback = null

    if (this.placementTransform) {
      this.placementTransform.setWorldPosition(pos)
      this.placementTransform.setWorldRotation(rot)
    }

    this.setPlacementVisualsVisible(true)

    cb?.(pos, rot)
  }

  private setPlacementVisualsVisible(visible: boolean): void {
    if (this.placementVisuals) {
      this.placementVisuals.enabled = visible
    }
    if (this.resetButton) {
      this.resetButton.enabled = visible
    }
  }
}
