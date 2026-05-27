export type SafeType = "solo" | "coop" | "tutorial"

/** Hardcoded bomb countdown durations (seconds). */
export const SAFE_TIMER_TUTORIAL_SEC = 999
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
  object: SceneObject
  serialNumber: SerialNumberInfo
  moduleList: string[]
  dynamiteFuseColor: string
}

export type SafeRuntimeContext = {
  serialNumber: string
  moduleIds: string[]
  solved: boolean[]
}
