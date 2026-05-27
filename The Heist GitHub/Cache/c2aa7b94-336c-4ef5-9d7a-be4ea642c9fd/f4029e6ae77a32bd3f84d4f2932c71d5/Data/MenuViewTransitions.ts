import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

/** Staggered pop animations matching MainMenuTabination. */
export class MenuViewTransitions {
  private readonly popOutBumpScale = 1
  private readonly popInOvershootScale = 0
  private readonly popOutBumpDurationMs = 100
  private readonly popOutShrinkDurationMs = 100
  /** Window shell — full-duration pop so the frame growth reads clearly. */
  private readonly shellPopInOvershootDurationMs = 100
  private readonly shellPopInSettleDurationMs = 100
  /** Out / generic root phases (unchanged). */
  private readonly popInOvershootDurationMs = 50
  private readonly popInSettleDurationMs = 50
  /** Child pieces keep full-duration pop so the scale-up stays visible. */
  private readonly childPopInOvershootDurationMs = 100
  private readonly childPopInSettleDurationMs = 100
  private readonly elementStaggerMs = 50
  /** Child elements begin halfway through the root's visible pop. */
  private readonly childPopInOverlapRootProgress = 0.5

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
   * View root snaps to full scale (children are parented under it).
   * First pop element = window/shell; remaining elements overlap at childPopInOverlapRootProgress.
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

    root.enabled = true
    root.getTransform().setLocalScale(this.getRestScale(root))

    if (children.length === 0) {
      onComplete()
      return
    }

    const {shell, content} = this.splitShellAndContent(children)
    if (!shell) {
      this.popInChildElementsWithBaseDelay(content, 0, onComplete)
      return
    }
    const shellPopMs = this.popInSettleDurationMs
    const contentDelayMs = Math.round(shellPopMs * this.childPopInOverlapRootProgress)

    let shellDone = false
    let contentDone = content.length === 0

    const tryFinish = () => {
      if (shellDone && contentDone) {
        onComplete()
      }
    }

    shell.enabled = true
    shell.getTransform().setLocalScale(vec3.zero())
    this.popInElement(
      shell,
      shell.getTransform(),
      this.getRestScale(shell),
      0,
      () => {
        shellDone = true
        tryFinish()
      },
      this.popInOvershootDurationMs,
      this.popInSettleDurationMs
    )

    if (content.length === 0) {
      return
    }

    this.prepareElementsForPopIn(content)
    this.popInChildElementsWithBaseDelay(content, contentDelayMs, () => {
      contentDone = true
      tryFinish()
    })
  }

  private popInElementsWithBaseDelay(
    elements: SceneObject[],
    baseDelayMs: number,
    onComplete: () => void
  ): void {
    this.popInChildElementsWithBaseDelay(elements, baseDelayMs, onComplete)
  }

  private popInChildElementsWithBaseDelay(
    elements: SceneObject[],
    baseDelayMs: number,
    onComplete: () => void
  ): void {
    this.animateElementsStaggered(
      elements,
      (element, transform, restScale, startDelayMs, onElementComplete) => {
        this.popInElement(
          element,
          transform,
          restScale,
          baseDelayMs + startDelayMs,
          onElementComplete,
          this.childPopInOvershootDurationMs,
          this.childPopInSettleDurationMs
        )
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

  /** First pop target = window/shell; rest overlap halfway through that pop. */
  private splitShellAndContent(elements: SceneObject[]): {
    shell: SceneObject | null
    content: SceneObject[]
  } {
    if (elements.length === 0) {
      return {shell: null, content: []}
    }
    if (elements.length === 1) {
      return {shell: elements[0], content: []}
    }

    const shellNamePattern = /background|backdrop|panel|window|frame|plate|shell|view/i
    let shellIndex = 0
    let bestArea = -1

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (shellNamePattern.test(element.name)) {
        shellIndex = i
        break
      }
      const scale = this.getRestScale(element)
      const area = scale.x * scale.y
      if (area > bestArea) {
        bestArea = area
        shellIndex = i
      }
    }

    const shell = elements[shellIndex]
    const content = elements.filter((_element, index) => index !== shellIndex)
    return {shell, content}
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
    const skipOvershoot = overshootScale.length < 0.01

    const settleTween = LSTween.scaleFromToLocal(
      transform,
      skipOvershoot ? vec3.zero() : overshootScale,
      restScale,
      settleMs
    )
      .easing(skipOvershoot ? Easing.Back.Out : Easing.Cubic.Out)
      .onComplete(() => {
        onComplete()
      })

    if (skipOvershoot) {
      if (startDelayMs > 0) {
        settleTween.delay(startDelayMs)
      }
      this.trackTween(settleTween)
      settleTween.start()
      return
    }

    const overshootTween = LSTween.scaleFromToLocal(
      transform,
      vec3.zero(),
      overshootScale,
      overshootMs
    ).easing(Easing.Back.Out)

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
