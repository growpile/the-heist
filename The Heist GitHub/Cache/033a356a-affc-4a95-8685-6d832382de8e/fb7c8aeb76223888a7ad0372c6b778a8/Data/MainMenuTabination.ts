import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {SnapOS2Styles} from "SpectaclesUIKit.lspkg/Scripts/Themes/SnapOS-2.0/SnapOS2"
import {RoundedRectangleVisual} from "SpectaclesUIKit.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisual"

const SELECTED_STYLE = SnapOS2Styles.PrimaryNeutral
const DESELECTED_STYLE = SnapOS2Styles.Secondary

/**
 * Tab controller for the main menu. Wire RectangleButton tabs in order;
 * the selected tab uses PrimaryNeutral, deselected tabs use Secondary.
 */
@component
export class MainMenuTabination extends BaseScriptComponent {
  @input
  @hint("Main menu tab buttons in left-to-right order")
  tabs: RectangleButton[] = []

  @input
  @hint("Which tab is selected when the lens starts (0-based)")
  defaultSelectedIndex: number = 0

  private selectedIndex: number = -1

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  private onStart() {
    if (!this.tabs || this.tabs.length === 0) {
      print("[MainMenuTabination] No tabs assigned.")
      return
    }

    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      if (!tab) {
        continue
      }

      const tabIndex = i
      const bindTrigger = () => {
        tab.onTriggerUp.add(() => {
          this.selectTab(tabIndex)
        })
      }

      if (tab.initialized) {
        bindTrigger()
      } else {
        tab.onInitialized.add(bindTrigger)
      }
    }

    const startIndex = Math.min(Math.max(this.defaultSelectedIndex, 0), this.tabs.length - 1)
    this.selectTab(startIndex)
  }

  /** Returns the currently selected tab index (0-based), or -1 if none. */
  public getSelectedIndex(): number {
    return this.selectedIndex
  }

  /** Selects a tab by index and updates button styles. */
  public selectTab(index: number): void {
    if (!this.tabs || index < 0 || index >= this.tabs.length) {
      return
    }

    if (index === this.selectedIndex) {
      return
    }

    this.selectedIndex = index
    this.updateTabStyles()
    print(String(index + 1))
  }

  private updateTabStyles(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      if (!tab) {
        continue
      }

      const style = i === this.selectedIndex ? SELECTED_STYLE : DESELECTED_STYLE
      this.applyTabStyle(tab, style)
    }
  }

  private applyTabStyle(button: RectangleButton, style: SnapOS2Styles): void {
    const buttonInternal = button as unknown as {_style: string}
    if (buttonInternal._style === style) {
      return
    }

    buttonInternal._style = style

    if (!button.visual) {
      return
    }

    const newVisual = new RoundedRectangleVisual({
      sceneObject: button.getSceneObject(),
      style: {
        visualElementType: button.typeString,
        style: style
      },
      transparent: style === SnapOS2Styles.Ghost
    })
    newVisual.cornerRadius = 0.5
    button.visual = newVisual
  }
}
