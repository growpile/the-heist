import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import {MenuTab} from "./MenuTab"

/**
 * Tab controller for the main menu. Each MenuTab pairs a button with its view elements.
 * Switching tabs pops out the old elements, then pops in the new ones using LSTween.
 */
@component
export class MainMenuTabination extends BaseScriptComponent {
  @input
  @hint("Main menu tabs in left-to-right order")
  tabs: MenuTab[] = []

  private readonly defaultSelectedIndex: number = 0
  private readonly popOutBumpScale: number = 1
  private readonly popInOvershootScale: number = 0
  private readonly popOutBumpDurationMs: number = 100
  private readonly popOutShrinkDurationMs: number = 100
  private readonly popInOvershootDurationMs: number = 100
  private readonly popInSettleDurationMs: number = 100
  private readonly elementStaggerMs: number = 100
  private readonly tabSwitchCooldownSec: number = 0.5

  private selectedIndex: number = -1
  private isTransitioning: boolean = false
  private tabSwitchLocked: boolean = false
  private transitionToken: number = 0
  private restScales: Map<SceneObject, vec3> = new Map()
  private activeTweens: any[] = []
  private unlockTabSwitchEvent: DelayedCallbackEvent
  private tabChangedListener: ((tabIndex: number) => void) | null = null

  onAwake() {
    this.unlockTabSwitchEvent = this.createEvent("DelayedCallbackEvent")
    this.unlockTabSwitchEvent.bind(() => {
      this.tabSwitchLocked = false
      this.setTabButtonsInteractable(true)
    })

    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  private onStart() {
    if (!this.tabs || this.tabs.length === 0) {
      print("[MainMenuTabination] No tabs assigned.")
      return
    }

    this.cacheRestScales()

    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      const button = this.getTabButton(tab)
      if (!button) {
        continue
      }

      button.setIsToggleable(true)

      const tabIndex = i
      const bindTrigger = () => {
        button.onTriggerUp.add(() => {
          this.selectTab(tabIndex)
        })
      }

      if (button.initialized) {
        bindTrigger()
      } else {
        button.onInitialized.add(bindTrigger)
      }
    }

    const startIndex = Math.min(Math.max(this.defaultSelectedIndex, 0), this.tabs.length - 1)
    this.initializeVisibleTab(startIndex)
    this.selectedIndex = startIndex
    this.updateTabToggles()
    print(String(startIndex + 1))
  }

  /** Returns the currently selected tab index (0-based), or -1 if none. */
  public getSelectedIndex(): number {
    return this.selectedIndex
  }

  /** Selects a tab by index, animates view elements, and updates toggle states. */
  public selectTab(index: number): void {
    if (!this.tabs || index < 0 || index >= this.tabs.length) {
      return
    }

    if (this.tabSwitchLocked) {
      this.updateTabToggles()
      return
    }

    const changed = index !== this.selectedIndex
    const previousIndex = this.selectedIndex
    this.selectedIndex = index
    this.updateTabToggles()

    if (!changed) {
      return
    }

    this.lockTabSwitch()
    print(String(index + 1))

    if (this.isTransitioning) {
      this.interruptAndShowTab(index)
      return
    }

    if (previousIndex < 0) {
      const token = this.beginTransition()
      this.popInTab(index, () => {
        this.finishTransition(token)
      })
      return
    }

    const token = this.beginTransition()
    this.popOutTab(previousIndex, () => {
      if (!this.isTransitionTokenCurrent(token)) {
        return
      }

      this.popInTab(index, () => {
        this.finishTransition(token)
      })
    })
  }

  private lockTabSwitch(): void {
    this.tabSwitchLocked = true
    this.setTabButtonsInteractable(false)
    this.unlockTabSwitchEvent.reset(this.tabSwitchCooldownSec)
  }

  private setTabButtonsInteractable(enabled: boolean): void {
    for (const tab of this.tabs) {
      const button = this.getTabButton(tab)
      if (!button?.interactable) {
        continue
      }

      button.interactable.enabled = enabled
    }
  }

  private beginTransition(): number {
    this.stopActiveTweens()
    this.transitionToken++
    this.isTransitioning = true
    return this.transitionToken
  }

  private finishTransition(token: number): void {
    if (!this.isTransitionTokenCurrent(token)) {
      return
    }

    this.isTransitioning = false
  }

  private isTransitionTokenCurrent(token: number): boolean {
    return token === this.transitionToken
  }

  /** Interrupt an in-flight transition and show the newly selected tab immediately. */
  private interruptAndShowTab(index: number): void {
    const token = this.beginTransition()
    this.hideAllTabElementsExcept(index)
    this.popInTab(index, () => {
      this.finishTransition(token)
    })
  }

  private hideAllTabElementsExcept(activeIndex: number): void {
    for (let i = 0; i < this.tabs.length; i++) {
      if (i === activeIndex) {
        this.prepareTabElementsForPopIn(i)
      } else {
        this.setTabElementsHidden(i)
      }
    }
  }

  private setTabElementsHidden(tabIndex: number): void {
    const elements = this.tabs[tabIndex]?.elements ?? []

    for (const element of elements) {
      if (!element) {
        continue
      }

      element.enabled = false
      element.getTransform().setLocalScale(vec3.zero())
    }
  }

  private prepareTabElementsForPopIn(tabIndex: number): void {
    const elements = this.tabs[tabIndex]?.elements ?? []

    for (const element of elements) {
      if (!element) {
        continue
      }

      element.enabled = true
      element.getTransform().setLocalScale(vec3.zero())
    }
  }

  private initializeVisibleTab(activeIndex: number): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i]
      if (!tab || !tab.elements) {
        continue
      }

      const isActive = i === activeIndex
      for (const element of tab.elements) {
        if (!element) {
          continue
        }

        const restScale = this.getRestScale(element)
        element.enabled = isActive
        element.getTransform().setLocalScale(isActive ? restScale : vec3.zero())
      }
    }
  }

  private cacheRestScales(): void {
    this.restScales.clear()

    for (const tab of this.tabs) {
      if (!tab || !tab.elements) {
        continue
      }

      for (const element of tab.elements) {
        if (!element || this.restScales.has(element)) {
          continue
        }
        this.restScales.set(element, element.getTransform().getLocalScale())
      }
    }
  }

  private getRestScale(element: SceneObject): vec3 {
    return this.restScales.get(element) ?? vec3.one()
  }

  private getTabButton(tab: MenuTab | undefined): RectangleButton | null {
    if (!tab?.button) {
      return null
    }

    return tab.button as RectangleButton
  }

  private updateTabToggles(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      const button = this.getTabButton(this.tabs[i])
      if (!button) {
        continue
      }

      button.toggle(i === this.selectedIndex)
    }
  }

  private popOutTab(tabIndex: number, onComplete: () => void): void {
    const elements = this.tabs[tabIndex]?.elements ?? []
    this.animateElementsStaggered(elements, (element, transform, restScale, startDelayMs, onElementComplete) => {
      this.popOutElement(element, transform, restScale, startDelayMs, onElementComplete)
    }, onComplete)
  }

  private popInTab(tabIndex: number, onComplete: () => void): void {
    const elements = this.tabs[tabIndex]?.elements ?? []
    this.animateElementsStaggered(elements, (element, transform, restScale, startDelayMs, onElementComplete) => {
      this.popInElement(element, transform, restScale, startDelayMs, onElementComplete)
    }, onComplete)
  }

  private animateElementsStaggered(
    elements: SceneObject[],
    step: (
      element: SceneObject,
      transform: Transform,
      restScale: vec3,
      startDelayMs: number,
      onElementComplete: () => void
    ) => void,
    onComplete: () => void
  ): void {
    const validElements = elements.filter((element) => !!element)

    if (validElements.length === 0) {
      onComplete()
      return
    }

    let remaining = validElements.length
    const onElementComplete = () => {
      remaining--
      if (remaining <= 0) {
        onComplete()
      }
    }

    for (let i = 0; i < validElements.length; i++) {
      const element = validElements[i]
      const startDelayMs = i * this.elementStaggerMs
      step(element, element.getTransform(), this.getRestScale(element), startDelayMs, onElementComplete)
    }
  }

  private popOutElement(
    element: SceneObject,
    transform: Transform,
    restScale: vec3,
    startDelayMs: number,
    onComplete: () => void
  ): void {
    const currentScale = transform.getLocalScale()
    const bumpScale = restScale.uniformScale(this.popOutBumpScale)

    const bumpTween = LSTween.scaleFromToLocal(
      transform,
      currentScale,
      bumpScale,
      this.popOutBumpDurationMs
    ).easing(Easing.Cubic.Out)

    const shrinkTween = LSTween.scaleFromToLocal(
      transform,
      bumpScale,
      vec3.zero(),
      this.popOutShrinkDurationMs
    )
      .easing(Easing.Cubic.In)
      .onComplete(() => {
        element.enabled = false
        onComplete()
      })

    if (startDelayMs > 0) {
      bumpTween.delay(startDelayMs)
    }

    bumpTween.chain(shrinkTween)
    this.trackTween(bumpTween)
    this.trackTween(shrinkTween)
    bumpTween.start()
  }

  private popInElement(
    element: SceneObject,
    transform: Transform,
    restScale: vec3,
    startDelayMs: number,
    onComplete: () => void
  ): void {
    element.enabled = true
    transform.setLocalScale(vec3.zero())

    const overshootScale = restScale.uniformScale(this.popInOvershootScale)

    const overshootTween = LSTween.scaleFromToLocal(
      transform,
      vec3.zero(),
      overshootScale,
      this.popInOvershootDurationMs
    ).easing(Easing.Back.Out)

    const settleTween = LSTween.scaleFromToLocal(
      transform,
      overshootScale,
      restScale,
      this.popInSettleDurationMs
    )
      .easing(Easing.Cubic.Out)
      .onComplete(() => {
        onComplete()
      })

    if (startDelayMs > 0) {
      overshootTween.delay(startDelayMs)
    }

    overshootTween.chain(settleTween)
    this.trackTween(overshootTween)
    this.trackTween(settleTween)
    overshootTween.start()
  }

  private trackTween(tween: {stop: () => void}): void {
    this.activeTweens.push(tween)
  }

  private stopActiveTweens(): void {
    for (const tween of this.activeTweens) {
      tween?.stop?.()
    }
    this.activeTweens = []
  }
}
