import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {CapsuleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"
import {Slider} from "SpectaclesUIKit.lspkg/Scripts/Components/Slider/Slider"

/** Toggles UIKit playAudio from master volume — call updateState() when volume changes. */
@component
export class UIKitSoundMaster extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">UIKit Controls</span>')

  @input
  @hint("Assign the 3 main menu RectangleButtons.")
  menuTabs: RectangleButton[] = []

  @input
  @hint("Capsule buttons to toggle Play Audio on/off.")
  buttons: CapsuleButton[] = []

  @input
  @allowUndefined
  toggleSwitch: Switch

  @input
  @allowUndefined
  volumeSlider: Slider

  onAwake(): void {
    this.updateState()
    this.createEvent("OnStartEvent").bind(() => {
      this.updateState()
      const delayed = this.createEvent("DelayedCallbackEvent")
      delayed.bind(() => this.updateState())
      delayed.reset(0.05)
    })
  }

  /** Public API: call after master volume changes. */
  public updateState(): void {
    const shouldPlayAudio = this.getMasterVolume() > 0

    for (const tab of this.menuTabs ?? []) {
      this.setElementPlayAudio(tab as unknown as ScriptComponent | RectangleButton | null, shouldPlayAudio)
    }
    for (const button of this.buttons ?? []) {
      this.setElementPlayAudio(button as unknown as ScriptComponent | CapsuleButton | null, shouldPlayAudio)
    }
    this.setElementPlayAudio(this.toggleSwitch as unknown as ScriptComponent | Switch | null, shouldPlayAudio)
    this.setElementPlayAudio(this.volumeSlider as unknown as ScriptComponent | Slider | null, shouldPlayAudio)
  }

  private getMasterVolume(): number {
    if (global.appState && typeof global.appState.checkStorage === "function") {
      return Number(global.appState.checkStorage("masterVolume") || 0)
    }
    return 0
  }

  private setElementPlayAudio(
    input: ScriptComponent | RectangleButton | CapsuleButton | Switch | Slider | null | undefined,
    enabled: boolean
  ): void {
    if (!input) {
      return
    }

    const direct = input as {playAudio?: boolean}
    if (typeof direct.playAudio !== "undefined") {
      direct.playAudio = enabled
      return
    }

    const scriptInput = input as ScriptComponent
    const sceneObject = scriptInput.getSceneObject?.()
    if (!sceneObject) {
      return
    }

    const candidates = [
      RectangleButton.getTypeName(),
      CapsuleButton.getTypeName(),
      Switch.getTypeName(),
      Slider.getTypeName()
    ]

    for (const typeName of candidates) {
      const comp = sceneObject.getComponent(typeName) as {playAudio?: boolean} | null
      if (comp && typeof comp.playAudio !== "undefined") {
        comp.playAudio = enabled
        return
      }
    }
  }
}
