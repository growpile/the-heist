import {PlacementMode, PlacementSettings} from "../Addons/SurfacePlacement.lspkg/Scripts/PlacementSettings"
import {SurfacePlacementController} from "../Addons/SurfacePlacement.lspkg/Scripts/SurfacePlacementController"

/**
 * Scene-attached entry script for the SurfacePlacement.lspkg flow.
 * Duplicated from `SurfacePlacement.lspkg/Example.ts` and adapted so
 * `GameFlowController` can reference it via an `@input` and call
 * `startPlacement(onPlaced, onSliderUpdated?)` after the player taps a
 * play-mode button. The surface confirmation result (world position +
 * rotation) is returned via the `onPlaced` callback.
 */
@component
export class SafeAnchorPlacement extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Placement Configuration</span>')

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
    if (this.onSliderCallback) {
      this.onSliderCallback(pos)
    }
  }

  private handlePlacementConfirmed(pos: vec3, rot: quat): void {
    const cb = this.onPlacedCallback
    this.isPlacing = false
    this.onPlacedCallback = null
    this.onSliderCallback = null
    cb?.(pos, rot)
  }
}
