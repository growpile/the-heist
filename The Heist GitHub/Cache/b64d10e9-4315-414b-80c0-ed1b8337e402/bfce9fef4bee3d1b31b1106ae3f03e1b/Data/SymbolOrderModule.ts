import {SafeContext, SerialNumberInfo} from "../Safe/SafeTypes"
import {SymbolDefinition} from "./SymbolDefinition"
import {animateGlowAmount} from "../Safe/MaterialProgressAnimator"

const MODULE_PENALTY_SEC = 30

type SymbolId =
  | "verticalLine"
  | "doNotPress"
  | "fork"
  | "helmWheel"
  | "horizontalLine"
  | "bigYus"
  | "smallDot"
  | "bigDot"
  | "slavicF"
  | "sun"

type PushButtonScript = ScriptComponent & {
  disable?: () => void
}

type OrderedSymbolInfo = {
  symbols: SymbolId[]
  pressSymbols: SymbolId[]
  useColumn: boolean
  axisIndex: number
  reverseOrder: boolean
}

const SYMBOL_MAP_ROWS: SymbolId[][] = [
  ["verticalLine", "doNotPress", "fork", "helmWheel", "horizontalLine"],
  ["bigYus", "smallDot", "bigDot", "horizontalLine", "fork"],
  ["bigDot", "slavicF", "smallDot", "fork", "sun"],
  ["horizontalLine", "verticalLine", "doNotPress", "slavicF", "bigDot"],
  ["sun", "bigDot", "bigYus", "doNotPress", "verticalLine"],
  ["fork", "helmWheel", "sun", "bigYus", "smallDot"]
]

/**
 * Symbol-sequence puzzle on four PushButtons. Disable legacy Symbol Order Module.js on the same object.
 */
@component
export class SymbolOrderModule extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Buttons</span>')

  @input
  @hint("PushButton script on each button (index 0–3).")
  buttonComponents: ScriptComponent[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Symbol Images</span>')

  @input
  @hint("Image on each button showing the assigned symbol texture.")
  symbolImageComponents: Image[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Button Materials</span>')

  @input
  @allowUndefined
  redMaterial: Material

  @input
  @allowUndefined
  greenMaterial: Material

  @input
  @allowUndefined
  blueMaterial: Material

  @input
  @allowUndefined
  yellowMaterial: Material

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Symbol Catalog</span>')

  @input
  @hint("Id + texture pairs for every symbol used in the map grid.")
  symbols: SymbolDefinition[] = []

  isModuleReady = false

  private safeComponent: ScriptComponent | null = null
  private slotId = 0

  private correctButtonIdSequence: number[] = []
  private currentPressIndex = 0
  private readonly buttonMaterials: (Material | null)[] = []
  private readonly buttonSymbols: (SymbolId | undefined)[] = []

  setupModule(safeContext: SafeContext, safeComponent: ScriptComponent, slotId: number): void {
    this.safeComponent = safeComponent
    this.slotId = slotId

    const serialInfo = this.getSerialInfo(safeContext.serialNumber)
    const fuseColor = (safeContext.dynamiteFuseColor || "").toLowerCase()

    const orderedInfo = this.buildOrderedSymbols(fuseColor, serialInfo)
    const orderedSymbols = orderedInfo.symbols
    const pressSymbols = orderedInfo.pressSymbols.length > 0 ? orderedInfo.pressSymbols : orderedSymbols
    const layout = this.shuffleArray([...orderedSymbols])
    const textureMap = this.getSymbolTextureMap()

    this.applyButtonColors()
    this.applySymbols(layout, textureMap)

    const pressOrder: number[] = []
    for (const symbolId of pressSymbols) {
      const position = this.buttonSymbols.indexOf(symbolId)
      if (position === -1) {
        continue
      }
      pressOrder.push(position)
    }

    this.correctButtonIdSequence = pressOrder

    const axisLabel = orderedInfo.useColumn ? "column" : "row"
    const axisIndexReadable = orderedInfo.axisIndex + 1
    print(
      "Symbols order: " +
        orderedSymbols.join(",") +
        " | press: " +
        pressSymbols.join(",") +
        " | sequence: " +
        this.correctButtonIdSequence.join(",") +
        " | " +
        axisLabel +
        ": " +
        axisIndexReadable
    )

    this.currentPressIndex = 0
    this.isModuleReady = true
  }

  animationFinished(): void {
    // No-op — safe landing does not drive this module.
  }

  /** External callback from PushButton (primary). */
  buttonPress(id: number | string): void {
    this.handleButtonPress(id)
  }

  /** Alias used by some scene button wiring. */
  pressButton(id: number | string): void {
    this.handleButtonPress(id)
  }

  /** Tutorial flow — instant solve without player input. */
  tutorialInstaComplete(): void {
    this.isModuleReady = false
    print("Symbol Order Module complete")
    this.disableAllButtons()
    this.moduleCompleted()
  }

  private handleButtonPress(id: number | string): void {
    if (!this.isModuleReady || this.correctButtonIdSequence.length === 0) {
      return
    }

    const expectedId = this.correctButtonIdSequence[this.currentPressIndex]
    let pressedId: number | string = id

    if (typeof pressedId === "string") {
      const parsed = parseInt(pressedId, 10)
      if (!isNaN(parsed)) {
        pressedId = parsed
      }
    }

    if (pressedId === expectedId) {
      this.currentPressIndex++
      const mat = this.buttonMaterials[pressedId as number]
      if (mat) {
        this.animateGlow(mat, 1, 0.25)
      }

      if (this.currentPressIndex >= this.correctButtonIdSequence.length) {
        this.isModuleReady = false
        print("Symbol Order Module complete")
        this.disableAllButtons()
        this.moduleCompleted()
      }
    } else {
      this.currentPressIndex = 0
      this.resetAllGlow()
      print("Symbol Order Module incorrect input, reset")
      this.modulePenalty()
    }
  }

  private getSerialInfo(serialNumber: SerialNumberInfo | string | undefined): {
    containsWord: boolean
    letterCount: number
    numberCount: number
    sumDigits: number
  } {
    let serialString = ""
    let containsWord = false
    let letterCount = 0
    let numberCount = 0
    let sumDigits = 0
    let hasCounts = false

    if (serialNumber) {
      if (typeof serialNumber === "string") {
        serialString = serialNumber
      } else {
        serialString = serialNumber.string || ""
        if (typeof serialNumber.letterCount === "number") {
          letterCount = serialNumber.letterCount
          hasCounts = true
        }
        if (typeof serialNumber.numberCount === "number") {
          numberCount = serialNumber.numberCount
          hasCounts = true
        }
        if (typeof serialNumber.containsWord === "boolean") {
          containsWord = serialNumber.containsWord
        }
      }
    }

    if (serialString) {
      for (let i = 0; i < serialString.length; i++) {
        const ch = serialString.charAt(i)
        if (ch >= "0" && ch <= "9") {
          if (!hasCounts) {
            numberCount++
          }
          sumDigits += parseInt(ch, 10)
        } else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
          if (!hasCounts) {
            letterCount++
          }
        }
      }
    }

    return {containsWord, letterCount, numberCount, sumDigits}
  }

  private shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const swapIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, i)
          : Math.floor(Math.random() * (i + 1))
      const temp = arr[i]
      arr[i] = arr[swapIndex]
      arr[swapIndex] = temp
    }
    return arr
  }

  private getSymbolTextureMap(): Record<string, Texture> {
    const map: Record<string, Texture> = {}
    for (const entry of this.symbols) {
      if (entry?.symbolId && entry.symbolTexture) {
        map[entry.symbolId] = entry.symbolTexture
      }
    }
    return map
  }

  private applyButtonColors(): void {
    const materials = [this.redMaterial, this.greenMaterial, this.blueMaterial, this.yellowMaterial].filter(
      (m): m is Material => !!m
    )
    if (materials.length === 0) {
      return
    }

    for (let m = materials.length - 1; m > 0; m--) {
      const swapIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, m)
          : Math.floor(Math.random() * (m + 1))
      const temp = materials[m]
      materials[m] = materials[swapIndex]
      materials[swapIndex] = temp
    }

    for (let i = 0; i < this.buttonComponents.length; i++) {
      const scriptComp = this.buttonComponents[i]
      if (!scriptComp) {
        continue
      }

      const buttonObject = scriptComp.getSceneObject()
      if (!buttonObject || buttonObject.getChildrenCount() < 1) {
        continue
      }

      const firstChild = buttonObject.getChild(0)
      if (!firstChild || firstChild.getChildrenCount() < 1) {
        continue
      }

      const visualObject = firstChild.getChild(0)
      if (!visualObject) {
        continue
      }

      const visual = visualObject.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
      if (!visual) {
        continue
      }

      const materialIndex = i % materials.length
      const cloned = materials[materialIndex].clone() as GlowMaterial
      if (cloned.mainPass?.glowAmount !== undefined) {
        cloned.mainPass.glowAmount = 0
      }
      visual.mainMaterial = cloned
      this.buttonMaterials[i] = cloned
    }
  }

  private applySymbols(layout: SymbolId[], textureMap: Record<string, Texture>): void {
    for (let i = 0; i < this.symbolImageComponents.length; i++) {
      const symbolId = layout[i]
      const texture = symbolId ? textureMap[symbolId] : undefined
      const image = this.symbolImageComponents[i]
      if (!image?.mainMaterial || !texture) {
        continue
      }

      const newMaterial = image.mainMaterial.clone()
      image.clearMaterials()
      image.addMaterial(newMaterial)
      if (
        image.mainMaterial?.mainPass &&
        image.mainMaterial.mainPass.symbolMap !== undefined
      ) {
        image.mainMaterial.mainPass.symbolMap = texture
      }
      this.buttonSymbols[i] = symbolId
    }
  }

  private buildOrderedSymbols(fuseColor: string, serialInfo: ReturnType<typeof this.getSerialInfo>): OrderedSymbolInfo {
    const useColumn = fuseColor === "red" || fuseColor === "green"
    let reverseOrder = false
    if (fuseColor === "green" || fuseColor === "yellow") {
      reverseOrder = true
    }

    let list: SymbolId[] = []
    let axisIndex = 0

    if (useColumn) {
      const colIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, SYMBOL_MAP_ROWS[0].length - 1)
          : Math.floor(Math.random() * SYMBOL_MAP_ROWS[0].length)
      axisIndex = colIndex
      for (let r = 0; r < SYMBOL_MAP_ROWS.length; r++) {
        list.push(SYMBOL_MAP_ROWS[r][colIndex])
      }
    } else {
      const rowIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, SYMBOL_MAP_ROWS.length - 1)
          : Math.floor(Math.random() * SYMBOL_MAP_ROWS.length)
      axisIndex = rowIndex
      list = [...SYMBOL_MAP_ROWS[rowIndex]]
    }

    if (reverseOrder) {
      list.reverse()
    }

    const chosen = [...list]
    this.shuffleArray(chosen)
    const selected = chosen.slice(0, 4)

    const selectedSet: Record<string, boolean> = {}
    for (const id of selected) {
      selectedSet[id] = true
    }

    const orderedSelected: SymbolId[] = []
    for (const id of list) {
      if (selectedSet[id]) {
        orderedSelected.push(id)
      }
    }

    const skipDontPress = serialInfo.numberCount > serialInfo.letterCount
    const pressList = skipDontPress
      ? orderedSelected.filter((id) => id !== "doNotPress")
      : orderedSelected

    return {
      symbols: selected,
      pressSymbols: pressList,
      useColumn,
      axisIndex,
      reverseOrder
    }
  }

  private animateGlow(
    material: Material | null,
    targetValue: number,
    duration: number,
    callback?: () => void
  ): void {
    const mat = material as GlowMaterial | null
    if (!mat?.mainPass || mat.mainPass.glowAmount === undefined) {
      callback?.()
      return
    }

    if (mat.__glowAnim?.updateEvent) {
      mat.__glowAnim.updateEvent.enabled = false
      mat.__glowAnim.updateEvent = null
    }

    const startValue = mat.mainPass.glowAmount
    const animData = {
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    mat.__glowAnim = animData

    animData.updateEvent.bind(() => {
      const elapsed = getTime() - animData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)
      mat.mainPass!.glowAmount = startValue + (targetValue - startValue) * smoothT

      if (t >= 1) {
        mat.mainPass!.glowAmount = targetValue
        animData.updateEvent.enabled = false
        animData.updateEvent = null
        callback?.()
      }
    })
  }

  private resetAllGlow(): void {
    for (const mat of this.buttonMaterials) {
      if (mat) {
        this.animateGlow(mat, 0, 0.25)
      }
    }
  }

  private disableAllButtons(): void {
    for (const buttonComp of this.buttonComponents) {
      const pushButton = buttonComp as PushButtonScript
      pushButton?.disable?.()
    }
  }

  private moduleCompleted(): void {
    const safe = this.safeComponent as {completeModule?: (slotId: number) => void}
    safe?.completeModule?.(this.slotId)
  }

  private modulePenalty(): void {
    const safe = this.safeComponent as {applyPenalty?: (seconds: number) => void}
    safe?.applyPenalty?.(MODULE_PENALTY_SEC)
  }
}
