import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

/** Staggered pop animations matching MainMenuTabination. */
export class MenuViewTransitions {
  private readonly popOutBumpScale = 1
  private readonly popInOvershootScale = 0
  private readonly popOutBumpDurationMs = 100
  private readonly popOutShrinkDurationMs = 100
  private readonly popInOvershootDurationMs = 100
  private readonly popInSettleDurationMs = 100
  private readonly elementStaggerMs = 100
  /** View roots (Main Menu shell, tips window root, etc.) pop in faster. */
  private readonly rootPopInSpeedMultiplier = 1.5
  /** Child elements begin when the root's visible scale pop is this far along (0–1). */
  private readonly childPopInOverlapRootProgress = 0.35

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
    this.popInElementsWithBaseDelay(elements, 0, onComplete)
  }

  /**
   * Pops the view root faster, then overlaps child elements at childPopInOverlapRootProgress.
   */
  popInRootThenElements(
    root: SceneObject | undefined | null,
    elements: SceneObject[],
    onComplete: () => void
  ): void {
    const children = elements.filter((element) => !!element)

    if (!root) {
      this.popInElements(children, onComplete)
      return
    }

    const rootOvershootMs = this.popInOvershootDurationMs / this.rootPopInSpeedMultiplier
    const rootSettleMs = this.popInSettleDurationMs / this.rootPopInSpeedMultiplier
    const rootTotalMs = rootOvershootMs + rootSettleMs
    const childBaseDelayMs = Math.round(rootTotalMs * this.childPopInOverlapRootProgress)

    let rootDone = false
    let childrenDone = children.length === 0

    const tryFinish = () => {
      if (rootDone && childrenDone) {
        onComplete()
      }
    }

    root.enabled = true
    this.popInElement(
      root,
      root.getTransform(),
      this.getRestScale(root),
      0,
      () => {
        rootDone = true
        tryFinish()
      },
      rootOvershootMs,
      rootSettleMs
    )

    if (children.length === 0) {
      return
    }

    this.popInElementsWithBaseDelay(children, childBaseDelayMs, () => {
      childrenDone = true
      tryFinish()
    })
  }

  private popInElementsWithBaseDelay(
    elements: SceneObject[],
    baseDelayMs: number,
    onComplete: () => void
  ): void {
    this.animateElementsStaggered(
      elements,
      (element, transform, restScale, startDelayMs, onElementComplete) => {
        this.popInElement(element, transform, restScale, baseDelayMs + startDelayMs, onElementComplete)
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

  private getRestScale(element: SceneObject): vec3 {
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
    onComplete: () => void,
    overshootDurationMs?: number,
    settleDurationMs?: number
  ): void {
    element.enabled = true
    transform.setLocalScale(vec3.zero())

    const overshootMs = overshootDurationMs ?? this.popInOvershootDurationMs
    const settleMs = settleDurationMs ?? this.popInSettleDurationMs
    const overshootScale = restScale.uniformScale(this.popInOvershootScale)

    const overshootTween = LSTween.scaleFromToLocal(
      transform,
      vec3.zero(),
      overshootScale,
      overshootMs
    ).easing(Easing.Back.Out)

    const settleTween = LSTween.scaleFromToLocal(
      transform,
      overshootScale,
      restScale,
      settleMs
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
