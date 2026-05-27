export type SafeType = "solo" | "coop" | "tutorial"

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
