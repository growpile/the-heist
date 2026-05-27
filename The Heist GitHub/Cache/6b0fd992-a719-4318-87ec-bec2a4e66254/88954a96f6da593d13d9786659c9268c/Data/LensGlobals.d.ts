/**
 * Runtime globals provided by Lens Studio scripts (AppState, Utils, etc.)
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

interface LensGlobal {
  appState: LensAppState
  utils: LensUtils
  tweenManager: LensTweenManager
  playSfx: (...args: unknown[]) => void
  stopSfx: (name: string) => void
  setBgmVolume: (volume: number) => void
  resetRotation: () => void
  safeComplete: (safeType: string, seconds: number) => void
  safeFailed: () => void
  trySignIn: () => Promise<boolean>
  leftRotateHint: () => void
  userContextSystem?: {
    requestDisplayName: (callback: (name: string) => void) => void
  }
  persistentStorageSystem?: unknown
  scene: Scene
}

declare const global: LensGlobal
