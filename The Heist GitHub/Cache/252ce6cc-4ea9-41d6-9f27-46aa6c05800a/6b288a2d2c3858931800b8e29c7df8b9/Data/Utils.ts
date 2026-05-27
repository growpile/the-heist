/**
 * Owns `global.utils` — porting of the legacy `Util.js`.
 * Attach on Prerequisites → Util (replaces Util.js).
 *
 * Public API exposed via `global.utils` is preserved so the remaining
 * JS modules (Coin Bag, Wire Fusebox, etc.) continue to work.
 */

const DEG_TO_RAD = 0.0174533

type AnyMaterial = Material & {__materialAnims?: Record<string, MaterialAnim>}

type AnimationData = {
  id: string
  startTime: number
  updateEvent: SceneEvent | null
  cleanup?: () => void
}

type MaterialAnim = {
  startTime: number
  updateEvent: SceneEvent | null
}

type AnimatedSceneObject = SceneObject & {
  animations?: AnimationData[]
  __utilsDestroyBound?: boolean
}

@component
export class Utils extends BaseScriptComponent {
  private activeAnimations: AnimationData[] = []
  private delayedCallbacks: Record<string, DelayedCallbackEvent> = {}
  private lastAnimatedObject: SceneObject | null = null
  private shakeTarget: SceneObject | null = null

  onAwake(): void {
    this.installGlobalUtils()
  }

  private installGlobalUtils(): void {
    const utils: any = {
      lastAnimatedObject: null,
      shakeTarget: null,
      delay: (idOrDelay: any, delayOrCallback?: any, callback?: any) =>
        this.delay(idOrDelay, delayOrCallback, callback),
      invalidateDelay: (id: string) => this.invalidateDelay(id),
      rng: (min: number, max: number) => this.rng(min, max),
      rngFloat: (min: number, max: number, decimals: number) => this.rngFloat(min, max, decimals),
      lerp: (start: number, end: number, amt: number) => this.lerp(start, end, amt),
      arrayContains: (array: unknown[], item: unknown) => this.arrayContains(array, item),
      arrayAllTrue: (array: boolean[]) => this.arrayAllTrue(array),
      stateChangeArray: (array: {enabled: boolean}[], state: boolean) => this.stateChangeArray(array, state),
      stateChangeArrayWithException: (
        array: {enabled: boolean}[],
        exceptionIndex: number,
        exceptionState: boolean
      ) => this.stateChangeArrayWithException(array, exceptionIndex, exceptionState),
      stateChangeArrayClassProperty: (
        array: Record<string, {enabled: boolean}>[],
        propName: string,
        state: boolean
      ) => this.stateChangeArrayClassProperty(array, propName, state),
      removeAllChildren: (sceneObject: SceneObject) => this.removeAllChildren(sceneObject),
      animatePosition: (
        sceneObject: SceneObject,
        isLocal: boolean,
        newPosition: vec3,
        duration: number,
        callback?: () => void
      ) => this.animatePosition(sceneObject, isLocal, newPosition, duration, callback),
      animateRotation: (
        sceneObject: SceneObject,
        isLocal: boolean,
        newRotation: vec3 | quat,
        duration: number,
        callback?: () => void
      ) => this.animateRotation(sceneObject, isLocal, newRotation, duration, callback),
      animateScale: (
        sceneObject: SceneObject,
        isLocal: boolean,
        newScale: vec3,
        duration: number,
        callback?: () => void
      ) => this.animateScale(sceneObject, isLocal, newScale, duration, callback),
      animateMaterialProperty: (
        material: Material,
        propertyString: string,
        targetValue: number,
        duration: number,
        callback?: () => void
      ) => this.animateMaterialProperty(material, propertyString, targetValue, duration, callback),
      animateShake: (
        sceneObject: SceneObject | null | undefined,
        isLocal: boolean,
        duration: number,
        positionShake: boolean,
        rotationShake: boolean,
        positionAmplitude: vec3,
        positionSettings: number[],
        rotationAmplitude: vec3,
        rotationSettings: number[],
        returnSpeed: number,
        easeInOut: boolean,
        onDone?: () => void
      ) =>
        this.animateShake(
          sceneObject,
          isLocal,
          duration,
          positionShake,
          rotationShake,
          positionAmplitude,
          positionSettings,
          rotationAmplitude,
          rotationSettings,
          returnSpeed,
          easeInOut,
          onDone
        )
    }

    global.utils = utils as HeistUtils
  }

  // ---------- Array / object helpers ----------

  private stateChangeArrayWithException(
    array: {enabled: boolean}[],
    exceptionIndex: number,
    exceptionState: boolean
  ): void {
    for (let i = 0; i < array.length; i++) {
      array[i].enabled = !exceptionState
    }
    if (array[exceptionIndex]) {
      array[exceptionIndex].enabled = exceptionState
    }
  }

  private stateChangeArray(array: {enabled: boolean}[], state: boolean): void {
    for (let i = 0; i < array.length; i++) {
      array[i].enabled = state
    }
  }

  private stateChangeArrayClassProperty(
    array: Record<string, {enabled: boolean}>[],
    propName: string,
    state: boolean
  ): void {
    for (let i = 0; i < array.length; i++) {
      const target = array[i] && array[i][propName]
      if (target) {
        target.enabled = state
      }
    }
  }

  private removeAllChildren(sceneObject: SceneObject): void {
    if (!sceneObject) {
      return
    }
    for (let i = sceneObject.getChildrenCount() - 1; i >= 0; i--) {
      const child = sceneObject.getChild(i)
      if (child) {
        child.destroy()
      }
    }
  }

  private arrayContains(array: unknown[], item: unknown): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return true
      }
    }
    return false
  }

  private arrayAllTrue(array: boolean[]): boolean {
    if (!array || array.length === 0) {
      return false
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== true) {
        return false
      }
    }
    return true
  }

  // ---------- Math helpers ----------

  private rng(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private rngFloat(min: number, max: number, decimals: number): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals)
    return parseFloat(str)
  }

  private lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end
  }

  // ---------- Delay ----------

  private delay(idOrDelay: any, delayOrCallback?: any, callback?: any): void {
    let id: string | null = null
    let delaySec: number
    let cb: () => void

    if (
      typeof idOrDelay === "string" &&
      typeof delayOrCallback === "number" &&
      typeof callback === "function"
    ) {
      id = idOrDelay
      delaySec = delayOrCallback
      cb = callback
    } else if (typeof idOrDelay === "number" && typeof delayOrCallback === "function") {
      delaySec = idOrDelay
      cb = delayOrCallback
    } else {
      return
    }

    if (id && this.delayedCallbacks[id]) {
      this.delayedCallbacks[id].cancel()
      delete this.delayedCallbacks[id]
    }

    const delayedEvent = this.createEvent("DelayedCallbackEvent")
    delayedEvent.bind(() => {
      if (id) {
        delete this.delayedCallbacks[id]
      }
      cb()
    })
    delayedEvent.reset(delaySec)

    if (id) {
      this.delayedCallbacks[id] = delayedEvent
    }
  }

  private invalidateDelay(id: string): void {
    if (this.delayedCallbacks[id]) {
      this.delayedCallbacks[id].cancel()
      delete this.delayedCallbacks[id]
    }
  }

  // ---------- Animation registry ----------

  private registerAnimation(sceneObject: SceneObject, animationData: AnimationData): void {
    if (!sceneObject) {
      return
    }
    const animated = sceneObject as AnimatedSceneObject
    if (!animated.animations) {
      animated.animations = []
    }
    this.bindAnimationDestroyCleanup(sceneObject, animated)

    const parts = animationData.id.split("_")
    const prefix = parts.length > 1 ? parts[1] : animationData.id

    for (let i = animated.animations.length - 1; i >= 0; i--) {
      const existing = animated.animations[i]
      if (existing.id.indexOf(prefix) !== -1) {
        if (existing.updateEvent) {
          existing.updateEvent.enabled = false
        }
        animated.animations.splice(i, 1)
      }
    }

    animated.animations.push(animationData)
    this.activeAnimations.push(animationData)

    animationData.cleanup = () => {
      if (animated.animations) {
        animated.animations = animated.animations.filter((a) => a !== animationData)
      }
      this.activeAnimations = this.activeAnimations.filter((a) => a !== animationData)
    }
  }

  private bindAnimationDestroyCleanup(sceneObject: SceneObject, animated: AnimatedSceneObject): void {
    if (animated.__utilsDestroyBound) {
      return
    }
    animated.__utilsDestroyBound = true
    const destroyEvent = sceneObject.createEvent("OnDestroyEvent")
    destroyEvent.bind(() => {
      const anims = animated.animations ? [...animated.animations] : []
      for (const anim of anims) {
        if (anim.updateEvent) {
          anim.updateEvent.enabled = false
          anim.updateEvent = null
        }
        anim.cleanup?.()
      }
      animated.animations = []
      this.activeAnimations = this.activeAnimations.filter((a) => anims.indexOf(a) < 0)
    })
  }

  // ---------- Animations ----------

  private animatePosition(
    sceneObject: SceneObject,
    isLocal: boolean,
    newPosition: vec3,
    duration: number,
    callback?: () => void
  ): void {
    if (!sceneObject) {
      return
    }
    this.lastAnimatedObject = sceneObject
    ;(global.utils as any).lastAnimatedObject = sceneObject

    const transform = sceneObject.getTransform()
    const animationData: AnimationData = {
      id: sceneObject.name + "_position",
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    this.registerAnimation(sceneObject, animationData)

    const startPosition = isLocal ? transform.getLocalPosition() : transform.getWorldPosition()

    animationData.updateEvent!.bind(() => {
      const elapsed = getTime() - animationData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)
      const currentPosition = vec3.lerp(startPosition, newPosition, smoothT)

      if (isLocal) {
        transform.setLocalPosition(currentPosition)
      } else {
        transform.setWorldPosition(currentPosition)
      }

      if (t >= 1) {
        if (isLocal) {
          transform.setLocalPosition(newPosition)
        } else {
          transform.setWorldPosition(newPosition)
        }
        animationData.cleanup?.()
        if (animationData.updateEvent) {
          animationData.updateEvent.enabled = false
          animationData.updateEvent = null
        }
        if (callback) {
          callback()
        }
      }
    })
  }

  private animateRotation(
    sceneObject: SceneObject,
    isLocal: boolean,
    newRotation: vec3 | quat,
    duration: number,
    callback?: () => void
  ): void {
    if (!sceneObject) {
      return
    }
    this.lastAnimatedObject = sceneObject
    ;(global.utils as any).lastAnimatedObject = sceneObject

    const transform = sceneObject.getTransform()
    const animationData: AnimationData = {
      id: sceneObject.name + "_rotation",
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    this.registerAnimation(sceneObject, animationData)

    const targetQuat =
      newRotation instanceof quat
        ? newRotation
        : quat.fromEulerAngles(
            (newRotation as vec3).x * DEG_TO_RAD,
            (newRotation as vec3).y * DEG_TO_RAD,
            (newRotation as vec3).z * DEG_TO_RAD
          )

    const startQuat = isLocal ? transform.getLocalRotation() : transform.getWorldRotation()

    animationData.updateEvent!.bind(() => {
      const elapsed = getTime() - animationData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)

      const currentQuat = quat.slerp(startQuat, targetQuat, smoothT)
      currentQuat.normalize()

      if (isLocal) {
        transform.setLocalRotation(currentQuat)
      } else {
        transform.setWorldRotation(currentQuat)
      }

      if (t >= 1) {
        if (isLocal) {
          transform.setLocalRotation(targetQuat)
        } else {
          transform.setWorldRotation(targetQuat)
        }
        animationData.cleanup?.()
        if (animationData.updateEvent) {
          animationData.updateEvent.enabled = false
          animationData.updateEvent = null
        }
        if (callback) {
          callback()
        }
      }
    })
  }

  private animateScale(
    sceneObject: SceneObject,
    isLocal: boolean,
    newScale: vec3,
    duration: number,
    callback?: () => void
  ): void {
    if (!sceneObject) {
      return
    }
    this.lastAnimatedObject = sceneObject
    ;(global.utils as any).lastAnimatedObject = sceneObject

    const transform = sceneObject.getTransform()
    const animationData: AnimationData = {
      id: sceneObject.name + "_scale",
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    this.registerAnimation(sceneObject, animationData)

    const startScale = isLocal ? transform.getLocalScale() : transform.getWorldScale()

    animationData.updateEvent!.bind(() => {
      const elapsed = getTime() - animationData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)

      const currentScale = vec3.lerp(startScale, newScale, smoothT)
      if (isLocal) {
        transform.setLocalScale(currentScale)
      } else {
        transform.setWorldScale(currentScale)
      }

      if (t >= 1) {
        if (isLocal) {
          transform.setLocalScale(newScale)
        } else {
          transform.setWorldScale(newScale)
        }
        animationData.cleanup?.()
        if (animationData.updateEvent) {
          animationData.updateEvent.enabled = false
          animationData.updateEvent = null
        }
        if (callback) {
          callback()
        }
      }
    })
  }

  private animateMaterialProperty(
    material: Material,
    propertyString: string,
    targetValue: number,
    duration: number,
    callback?: () => void
  ): void {
    if (!material || !propertyString) {
      if (callback) {
        callback()
      }
      return
    }
    let root: any = material
    const parts = String(propertyString).split(".")
    for (let i = 0; i < parts.length - 1; i++) {
      if (!root) {
        if (callback) {
          callback()
        }
        return
      }
      root = root[parts[i]]
    }
    if (!root) {
      if (callback) {
        callback()
      }
      return
    }
    const key = parts[parts.length - 1]
    if (root[key] === undefined) {
      if (callback) {
        callback()
      }
      return
    }
    const startValue = root[key]
    if (typeof startValue !== "number" || typeof targetValue !== "number") {
      root[key] = targetValue
      if (callback) {
        callback()
      }
      return
    }

    const matAny = material as AnyMaterial
    if (!matAny.__materialAnims) {
      matAny.__materialAnims = {}
    }
    const animKey = String(propertyString)
    const existing = matAny.__materialAnims[animKey]
    if (existing && existing.updateEvent) {
      existing.updateEvent.enabled = false
      existing.updateEvent = null
    }

    const animData: MaterialAnim = {
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    matAny.__materialAnims[animKey] = animData

    animData.updateEvent!.bind(() => {
      const elapsed = getTime() - animData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)
      root[key] = startValue + (targetValue - startValue) * smoothT
      if (t >= 1) {
        root[key] = targetValue
        if (animData.updateEvent) {
          animData.updateEvent.enabled = false
          animData.updateEvent = null
        }
        if (matAny.__materialAnims) {
          delete matAny.__materialAnims[animKey]
        }
        if (callback) {
          callback()
        }
      }
    })
  }

  private animateShake(
    sceneObject: SceneObject | null | undefined,
    isLocal: boolean,
    duration: number,
    positionShake: boolean,
    rotationShake: boolean,
    positionAmplitude: vec3,
    positionSettings: number[],
    rotationAmplitude: vec3,
    rotationSettings: number[],
    returnSpeed: number,
    easeInOut: boolean,
    onDone?: () => void
  ): void {
    const targetObject = sceneObject || this.shakeTarget || this.lastAnimatedObject
    if (!targetObject) {
      onDone?.()
      return
    }
    const transform = targetObject.getTransform()
    if (!transform) {
      onDone?.()
      return
    }

    const posFreq = positionSettings && positionSettings.length > 0 ? positionSettings[0] : 9
    const posSmooth = positionSettings && positionSettings.length > 1 ? positionSettings[1] : 14
    const rotFreq = rotationSettings && rotationSettings.length > 0 ? rotationSettings[0] : 9
    const rotSmooth = rotationSettings && rotationSettings.length > 1 ? rotationSettings[1] : 14
    const returnSpeedVal = returnSpeed !== undefined ? returnSpeed : 12

    const basePos = isLocal ? transform.getLocalPosition() : transform.getWorldPosition()
    const baseRot = isLocal ? transform.getLocalRotation() : transform.getWorldRotation()
    let posOffset = new vec3(0, 0, 0)
    let rotOffset = new vec3(0, 0, 0)
    let posTarget = new vec3(0, 0, 0)
    let rotTarget = new vec3(0, 0, 0)
    let posTimer = 0
    let rotTimer = 0
    const startTime = getTime()
    let ending = false

    const animationData: AnimationData = {
      id: targetObject.name + "_shake",
      startTime: startTime,
      updateEvent: this.createEvent("UpdateEvent")
    }
    this.registerAnimation(targetObject, animationData)

    const randSigned = () => Math.random() * 2 - 1
    const randomOffset = (amplitude: vec3, intensity: number): vec3 =>
      new vec3(
        randSigned() * amplitude.x * intensity,
        randSigned() * amplitude.y * intensity,
        randSigned() * amplitude.z * intensity
      )
    const smoothVec3 = (current: vec3, target: vec3, speed: number, dt: number): vec3 => {
      if (speed <= 0) {
        return target
      }
      const t = 1 - Math.exp(-speed * dt)
      return current.add(target.sub(current).uniformScale(t))
    }

    animationData.updateEvent!.bind(() => {
      const dt = getDeltaTime()
      const elapsed = getTime() - startTime
      const t = duration > 0 ? Math.min(elapsed / duration, 1) : 1
      const scaleAmt = easeInOut ? Math.sin(Math.PI * t) : 1

      if (!ending && elapsed >= duration) {
        ending = true
      }

      if (!ending) {
        if (positionShake) {
          const pFreq = Math.max(posFreq * scaleAmt, 0)
          posTimer += dt
          if (pFreq > 0 && posTimer >= 1 / pFreq) {
            posTimer = 0
            posTarget = randomOffset(positionAmplitude, scaleAmt)
          }
          posOffset = smoothVec3(posOffset, posTarget, posSmooth, dt)
        }
        if (rotationShake) {
          const rFreq = Math.max(rotFreq * scaleAmt, 0)
          rotTimer += dt
          if (rFreq > 0 && rotTimer >= 1 / rFreq) {
            rotTimer = 0
            rotTarget = randomOffset(rotationAmplitude, scaleAmt)
          }
          rotOffset = smoothVec3(rotOffset, rotTarget, rotSmooth, dt)
        }
      } else {
        posOffset = smoothVec3(posOffset, new vec3(0, 0, 0), returnSpeedVal, dt)
        rotOffset = smoothVec3(rotOffset, new vec3(0, 0, 0), returnSpeedVal, dt)
        const donePos = posOffset.length <= 0.001
        const doneRot = rotOffset.length <= 0.001
        if (donePos && doneRot) {
          if (isLocal) {
            transform.setLocalPosition(basePos)
            transform.setLocalRotation(baseRot)
          } else {
            transform.setWorldPosition(basePos)
            transform.setWorldRotation(baseRot)
          }
          animationData.cleanup?.()
          if (animationData.updateEvent) {
            animationData.updateEvent.enabled = false
            animationData.updateEvent = null
          }
          onDone?.()
          return
        }
      }

      let finalPos = basePos
      if (positionShake) {
        finalPos = basePos.add(posOffset)
      }
      if (isLocal) {
        transform.setLocalPosition(finalPos)
      } else {
        transform.setWorldPosition(finalPos)
      }

      if (rotationShake) {
        const rotQuat = quat.fromEulerAngles(
          rotOffset.x * DEG_TO_RAD,
          rotOffset.y * DEG_TO_RAD,
          rotOffset.z * DEG_TO_RAD
        )
        const finalRot = baseRot.multiply(rotQuat)
        if (isLocal) {
          transform.setLocalRotation(finalRot)
        } else {
          transform.setWorldRotation(finalRot)
        }
      } else if (isLocal) {
        transform.setLocalRotation(baseRot)
      } else {
        transform.setWorldRotation(baseRot)
      }
    })
  }
}
