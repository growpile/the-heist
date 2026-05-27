/**
 * Global type augmentations for Lens Studio `global` namespace.
 * Runtime values are provided by AppState.ts, Util.js, Sound Manager.js, etc.
 * Do not add this file to any SceneObject.
 */

export interface HeistSafeState {
  object?: SceneObject
  serialNumber?: unknown
  moduleList?: string[]
  dynamiteFuseColor?: string
}

export interface HeistAppState {
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

export interface HeistUtils {
  delay(seconds: number, callback: () => void): void
  rng(min: number, max: number): number
  animateScale(
    sceneObject: SceneObject,
    useLocal: boolean,
    scale: vec3,
    duration: number,
    callback?: () => void
  ): void
  animateMaterialProperty(material: Material, property: string, value: number, duration: number): void
  arrayAllTrue(arr: boolean[]): boolean
}

export interface HeistTweenManager {
  startTween(target: SceneObject, tweenName: string, callback?: () => void): void
}

declare namespace global {
  let appState: HeistAppState
  let utils: HeistUtils
  let tweenManager: HeistTweenManager
  let playSfx: (...args: unknown[]) => void
  let stopSfx: (name: string) => void
  let setBgmVolume: (volume: number) => void
  let resetRotation: () => void
  let safeComplete: (safeType: string, seconds: number) => void
  let safeFailed: () => void
  let trySignIn: () => Promise<boolean>
  let leftRotateHint: () => void
}
