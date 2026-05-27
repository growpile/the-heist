/**
 * Global type augmentations for Lens Studio's `global` namespace.
 * Runtime values are set by AppState.ts, Utils.ts, Sound Manager.js, Tween Manager.
 *
 * This file must remain a SCRIPT (no top-level imports/exports) so that
 * `declare namespace global` merges with the namespace from StudioLib.d.ts.
 * Do not attach this file to any SceneObject.
 */

interface HeistSafeState {
  object?: SceneObject
  serialNumber?: unknown
  moduleList?: string[]
  dynamiteFuseColor?: string
}

interface HeistAppState {
  currentState: string
  anchorManager: {resetPlacement: () => void} | null
  inTransition: boolean
  signedInSnapCloud: boolean
  currentClientTime: unknown
  safe: HeistSafeState
  storage: Record<string, unknown>
  checkStorage(key: "masterVolume"): number
  checkStorage(key: "safesOpened" | "safesFailed" | "currencyCount"): number
  checkStorage(key: "tutorialPlayed" | "enabledGloves"): boolean
  checkStorage(key: string): boolean | number | string
  setStorage(key: string, value: boolean | number | string): void
}

interface HeistUtils {
  delay(delaySeconds: number, callback: () => void): void
  delay(id: string, delaySeconds: number, callback: () => void): void
  invalidateDelay(id: string): void
  rng(min: number, max: number): number
  rngFloat(min: number, max: number, decimals: number): number
  lerp(start: number, end: number, amt: number): number
  arrayContains(array: unknown[], item: unknown): boolean
  arrayAllTrue(array: boolean[]): boolean
  stateChangeArray(array: {enabled: boolean}[], state: boolean): void
  stateChangeArrayWithException(
    array: {enabled: boolean}[],
    exceptionIndex: number,
    exceptionState: boolean
  ): void
  stateChangeArrayClassProperty(
    array: Record<string, {enabled: boolean}>[],
    propName: string,
    state: boolean
  ): void
  removeAllChildren(sceneObject: SceneObject): void
  animatePosition(
    sceneObject: SceneObject,
    isLocal: boolean,
    newPosition: vec3,
    duration: number,
    callback?: () => void
  ): void
  animateRotation(
    sceneObject: SceneObject,
    isLocal: boolean,
    newRotation: vec3 | quat,
    duration: number,
    callback?: () => void
  ): void
  animateScale(
    sceneObject: SceneObject,
    isLocal: boolean,
    newScale: vec3,
    duration: number,
    callback?: () => void
  ): void
  animateMaterialProperty(
    material: Material,
    propertyString: string,
    targetValue: number,
    duration: number,
    callback?: () => void
  ): void
  animateShake(
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
  ): void
  lastAnimatedObject: SceneObject | null
  shakeTarget: SceneObject | null
}

interface HeistTweenManager {
  startTween(target: SceneObject, tweenName: string, callback?: () => void): void
}

declare namespace global {
  let appState: HeistAppState
  let utils: HeistUtils
  let tweenManager: HeistTweenManager
  let playSfx: (...args: unknown[]) => void
  let stopSfx: (name: string | number) => void
  let setBgmVolume: (volume: number) => void
  let resetRotation: () => void
  let safeComplete: (safeType: string, seconds: number) => void
  let safeFailed: () => void
  let trySignIn: () => Promise<boolean>
  let leftRotateHint: () => void
}
