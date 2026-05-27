import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

/** Staggered pop animations for menu screens and tabs. */
export class MenuViewTransitions {
  /** Matches legacy MainMenuTabination defaults. */
  private readonly popOutBumpScale = 1.1
  private readonly popInOvershootScale = 1.12
  private readonly popOutBumpDurationMs = 80
  private readonly popOutShrinkDurationMs = 120
  private readonly popInOvershootDurationMs = 150
  private readonly popInSettleDurationMs = 100
  private readonly elementStaggerMs = 80

  private restScales: Map<SceneObject, vec3> = new Map()
  private activeTweens: {stop: () => void}[] = []

  cacheRestScales(elements: SceneObject[]): void {
    for (const element of elements) {
      if (!element || this.restScales.has(element)) {
        continue
      }
      this.restScales.set(element, element.getTransform().getLocalScale())
    }
  }

  stopAll(): void {
    for (const tween of this.activeTweens) {
      tween?.stop?.()
    }
    this.activeTweens = []
  }

  popOutElements(elements: SceneObject[], onComplete: () => void): void {
    this.animateElementsStaggered(
      elements,
      (element, transform, restScale, startDelayMs, onElementComplete) => {
        this.popOutElement(element, transform, restScale, startDelayMs, onElementComplete)
      },
      onComplete
    )
  }

  popInElements(elements: SceneObject[], onComplete: () => void): void {
    this.animateElementsStaggered(
      elements,
      (element, transform, restScale, startDelayMs, onElementComplete) => {
        this.popInElement(element, transform, restScale, startDelayMs, onElementComplete)
      },
      onComplete
    )
  }

  setElementsHidden(elements: SceneObject[]): void {
    for (const element of elements) {
      if (!element) {
        continue
      }
      element.enabled = false
      element.getTransform().setLocalScale(vec3.zero())
    }
  }

  prepareElementsForPopIn(elements: SceneObject[]): void {
    for (const element of elements) {
      if (!element) {
        continue
      }
      element.enabled = true
      element.getTransform().setLocalScale(vec3.zero())
    }
  }

  getRestScale(element: SceneObject): vec3 {
    return this.restScales.get(element) ?? vec3.one()
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
}
