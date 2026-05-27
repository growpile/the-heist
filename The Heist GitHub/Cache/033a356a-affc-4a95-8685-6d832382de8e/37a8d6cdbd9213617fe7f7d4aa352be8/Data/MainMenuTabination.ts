import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"

/**
 * Tab controller for the main menu. Wire toggleable RectangleButton tabs in order.
 * All tabs keep their PrimaryNeutral style; selection is shown via the toggle state.
 */
@component
export class MainMenuTabination extends BaseScriptComponent {
  @input
  @hint("Main menu tab buttons in left-to-right order (toggleable)")
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

      tab.setIsToggleable(true)

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

  /** Selects a tab by index and updates toggle states. */
  public selectTab(index: number): void {
    if (!this.tabs || index < 0 || index >= this.tabs.length) {
      return
    }

    const changed = index !== this.selectedIndex
    this.selectedIndex = index
    this.updateTabToggles()

    if (changed) {
      print(String(index + 1))
    }
  }

  private updateTabToggles(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      if (!tab) {
        continue
      }

      tab.isOn = i === this.selectedIndex
    }
  }
}
