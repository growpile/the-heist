/**
 * Augments Lens Studio's `global` namespace with project-specific runtime APIs
 * (AppState, Utils, audio, flow callbacks, etc.)
 */

interface LensAppState {
  currentState: string
  anchorManager: {resetPlacement: () => void} | null
  inTransition: boolean
  signedInSnapCloud: boolean
  currentClientTime: unknown
  safe: {
    object?: SceneObject
    serialNumber?: unknown
    moduleList?: string[]
    dynamiteFuseColor?: string
  }
  storage: Record<string, unknown>
  checkStorage(key: "masterVolume"): number
  checkStorage(key: "safesOpened" | "safesFailed" | "currencyCount"): number
  checkStorage(key: "tutorialPlayed" | "enabledGloves"): boolean
  checkStorage(key: string): boolean | number | string
  setStorage(key: string, value: boolean | number | string): void
}

interface LensUtils {
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

interface LensTweenManager {
  startTween(target: SceneObject, tweenName: string, callback?: () => void): void
}

declare namespace global {
  let appState: LensAppState
  let utils: LensUtils
  let tweenManager: LensTweenManager
  let playSfx: (...args: unknown[]) => void
  let stopSfx: (name: string) => void
  let setBgmVolume: (volume: number) => void
  let resetRotation: () => void
  let safeComplete: (safeType: string, seconds: number) => void
  let safeFailed: () => void
  let trySignIn: () => Promise<boolean>
  let leftRotateHint: () => void
}
