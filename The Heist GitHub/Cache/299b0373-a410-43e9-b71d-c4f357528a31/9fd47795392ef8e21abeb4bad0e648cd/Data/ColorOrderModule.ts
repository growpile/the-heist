import {SafeContext, SerialNumberInfo} from "../Safe/SafeTypes"

const MODULE_PENALTY_SEC = 20

type ButtonColor = "red" | "green" | "blue" | "yellow"

type GlowMaterial = Material & {
  __glowAnim?: {
    startTime: number
    updateEvent: UpdateEvent
  }
}

type PushButtonScript = ScriptComponent & {
  disable?: () => void
}

const COLOR_NAMES: Record<"RED" | "GREEN" | "BLUE" | "YELLOW", ButtonColor> = {
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  YELLOW: "yellow"
}

const SERIAL_WORDS = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"]

/**
 * Four-button color sequence puzzle. PushButton components call buttonPress(id) via external callback.
 */
@component
export class ColorOrderModule extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Buttons</span>')

  @input
  @hint("PushButton script on each colored button (index 0–3).")
  buttonComponents: ScriptComponent[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Button materials</span>')

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

  isModuleReady = false

  private safeComponent: ScriptComponent | null = null
  private slotId = 0

  private readonly buttonColors: (ButtonColor | undefined)[] = []
  private readonly buttonMaterials: (Material | null)[] = []
  private correctButtonIdSequence: number[] = []
  private currentPressIndex = 0

  setupModule(safeContext: SafeContext, safeComponent: ScriptComponent, slotId: number): void {
    this.safeComponent = safeComponent
    this.slotId = slotId

    const serialInfo = this.getSerialInfo(safeContext.serialNumber)
    const fuseColor = (safeContext.dynamiteFuseColor || "").toLowerCase()

    let orderColors: ButtonColor[]

    if (serialInfo.letterCount > serialInfo.numberCount) {
      orderColors = serialInfo.containsWord
        ? [COLOR_NAMES.RED, COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.YELLOW]
        : [COLOR_NAMES.BLUE, COLOR_NAMES.GREEN, COLOR_NAMES.RED, COLOR_NAMES.YELLOW]
    } else if (serialInfo.numberCount > serialInfo.letterCount) {
      orderColors =
        serialInfo.sumDigits > 10
          ? [COLOR_NAMES.YELLOW, COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.RED]
          : [COLOR_NAMES.YELLOW, COLOR_NAMES.RED, COLOR_NAMES.BLUE, COLOR_NAMES.GREEN]
    } else {
      if (fuseColor === COLOR_NAMES.RED) {
        orderColors = [COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.RED, COLOR_NAMES.YELLOW]
      } else if (fuseColor === COLOR_NAMES.BLUE) {
        orderColors = [COLOR_NAMES.RED, COLOR_NAMES.BLUE, COLOR_NAMES.GREEN, COLOR_NAMES.YELLOW]
      } else if (fuseColor === COLOR_NAMES.GREEN) {
        orderColors = [COLOR_NAMES.BLUE, COLOR_NAMES.YELLOW, COLOR_NAMES.GREEN, COLOR_NAMES.RED]
      } else {
        orderColors = [COLOR_NAMES.GREEN, COLOR_NAMES.YELLOW, COLOR_NAMES.RED, COLOR_NAMES.BLUE]
      }
    }

    const selectedLayout = this.getRandomColorLayout()
    this.applyButtonColors(selectedLayout)

    const pressOrder: number[] = []
    for (const color of orderColors) {
      const position = this.buttonColors.indexOf(color)
      if (position === -1) {
        continue
      }
      pressOrder.push(position)
    }

    this.correctButtonIdSequence = pressOrder

    const orderLetters = orderColors.map((c) => this.colorToLetter(c))
    print(
      "Color order: " +
        orderLetters.join("") +
        " | sequence: " +
        this.correctButtonIdSequence.join(",")
    )

    this.currentPressIndex = 0
    this.isModuleReady = true
  }

  animationFinished(): void {
    // No-op — safe landing does not drive this module.
  }

  /** Called from PushButton external callback (argument = button index). */
  buttonPress(id: number | string): void {
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
        print("Color Order Module complete")
        for (const buttonComp of this.buttonComponents) {
          const pushButton = buttonComp as PushButtonScript
          pushButton?.disable?.()
        }
        this.moduleCompleted()
      }
    } else {
      this.currentPressIndex = 0
      this.resetAllGlow()
      print("Color Order Module incorrect input, reset")
      this.modulePenalty()
    }
  }

  private applyButtonColors(layout: ButtonColor[]): void {
    const materialByColor: Partial<Record<ButtonColor, Material | undefined>> = {
      red: this.redMaterial,
      green: this.greenMaterial,
      blue: this.blueMaterial,
      yellow: this.yellowMaterial
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

      const color = layout[i]
      const sourceMaterial = materialByColor[color]
      if (!sourceMaterial) {
        continue
      }

      const cloned = sourceMaterial.clone() as GlowMaterial
      if (cloned.mainPass?.glowAmount !== undefined) {
        cloned.mainPass.glowAmount = 0
      }
      visual.mainMaterial = cloned
      this.buttonColors[i] = color
      this.buttonMaterials[i] = cloned
    }
  }

  private getRandomColorLayout(): ButtonColor[] {
    const colors: ButtonColor[] = [
      COLOR_NAMES.RED,
      COLOR_NAMES.GREEN,
      COLOR_NAMES.BLUE,
      COLOR_NAMES.YELLOW
    ]
    for (let i = colors.length - 1; i > 0; i--) {
      const swapIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, i)
          : Math.floor(Math.random() * (i + 1))
      const temp = colors[i]
      colors[i] = colors[swapIndex]
      colors[swapIndex] = temp
    }
    return colors
  }

  private colorToLetter(color: ButtonColor): string {
    switch (color) {
      case COLOR_NAMES.RED:
        return "R"
      case COLOR_NAMES.GREEN:
        return "G"
      case COLOR_NAMES.BLUE:
        return "B"
      case COLOR_NAMES.YELLOW:
        return "Y"
      default:
        return "?"
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
        if (typeof serialNumber.containsWord === "boolean") {
          containsWord = serialNumber.containsWord
        }
        if (typeof serialNumber.letterCount === "number") {
          letterCount = serialNumber.letterCount
          hasCounts = true
        }
        if (typeof serialNumber.numberCount === "number") {
          numberCount = serialNumber.numberCount
          hasCounts = true
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

      if (!containsWord) {
        const upper = serialString.toUpperCase()
        for (const word of SERIAL_WORDS) {
          if (upper.indexOf(word) !== -1) {
            containsWord = true
            break
          }
        }
      }
    }

    return {containsWord, letterCount, numberCount, sumDigits}
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
