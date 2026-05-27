export type SafeType = "solo" | "coop" | "tutorial"

/** Words that can appear embedded in generated serial numbers. */
export const SERIAL_WORDS = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"]

/** Hardcoded bomb countdown durations (seconds). Timer UI shows M:SS (e.g. 959 = 9:59). */
export const SAFE_TIMER_TUTORIAL_SEC = 9 * 60 + 59
export const SAFE_TIMER_SOLO_SEC = 7 * 60
export const SAFE_TIMER_COOP_SEC = 5 * 60

export function getSafeBombTimerSeconds(safeType: SafeType): number {
  switch (safeType) {
    case "tutorial":
      return SAFE_TIMER_TUTORIAL_SEC
    case "solo":
      return SAFE_TIMER_SOLO_SEC
    case "coop":
      return SAFE_TIMER_COOP_SEC
  }
}

export type SerialNumberInfo = {
  string: string
  containsWord: boolean
  containsOddNumber: boolean
  containsEvenNumber: boolean
  numberCount: number
  letterCount: number
}

export type SafeContext = {
  /** Prefab instance root (Safe script lives here). Destroyed when the session ends. */
  object: SceneObject
  /** Safe mesh + modules only — scaled away on win/fail exit; post-game UI stays outside. */
  safeRoot?: SceneObject
  serialNumber: SerialNumberInfo
  moduleList: string[]
  dynamiteFuseColor: string
}

export type SafeRuntimeContext = {
  serialNumber: string
  moduleIds: string[]
  solved: boolean[]
}
