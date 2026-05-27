import {SafeContext, SerialNumberInfo} from "../Safe/SafeTypes"

const SPIN_DURATION_SEC = 3
const DEG_TO_RAD = 0.0174533
const STREAK_TO_SOLVE = 5
const MODULE_PENALTY_SEC = 10
const LEVER_SWING_SEC = 0.25
const LEVER_HOLD_SEC = 0.1

type SymbolId = "heart" | "spade" | "diamond" | "club"
type ComboKey = "HHH" | "DCD" | "SSS" | "CDS"
type LeverDirection = "UP" | "DOWN"
type ConditionKey = "word" | "numbers" | "default"
type FuseColor = "red" | "green" | "blue" | "yellow"
type LeverAnimState = "idle" | "swingUp" | "hold" | "swingDown"

type LampAnimData = {
  startTime: number
  updateEvent: UpdateEvent
}

type SpinAnimData = {
  startTime: number
  updateEvent: UpdateEvent
}

type ProgressMaterial = Material & {
  progress?: number
  __lampAnim?: LampAnimData
}

type SpinnerObject = SceneObject & {
  __spinAnim?: SpinAnimData
}

type InteractableManipulation = ScriptComponent & {
  onTranslationStart: {add: (callback: () => void) => void}
  onTranslationEnd: {add: (callback: () => void) => void}
  release?: () => void
  setCanTranslate?: (enabled: boolean) => void
}

const COMBO_DEFINITIONS: Record<ComboKey, SymbolId[]> = {
  HHH: ["heart", "heart", "heart"],
  DCD: ["diamond", "club", "diamond"],
  SSS: ["spade", "spade", "spade"],
  CDS: ["club", "diamond", "spade"]
}

const RULE_TABLE: Record<
  ConditionKey,
  Record<ComboKey, Record<FuseColor, LeverDirection>>
> = {
  word: {
    HHH: {red: "DOWN", green: "DOWN", blue: "UP", yellow: "DOWN"},
    DCD: {red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN"},
    SSS: {red: "UP", green: "DOWN", blue: "UP", yellow: "UP"},
    CDS: {red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN"}
  },
  numbers: {
    SSS: {red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN"},
    DCD: {red: "UP", green: "DOWN", blue: "UP", yellow: "UP"},
    CDS: {red: "DOWN", green: "DOWN", blue: "UP", yellow: "UP"},
    HHH: {red: "UP", green: "UP", blue: "DOWN", yellow: "UP"}
  },
  default: {
    CDS: {red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN"},
    HHH: {red: "DOWN", green: "DOWN", blue: "DOWN", yellow: "UP"},
    DCD: {red: "DOWN", green: "UP", blue: "DOWN", yellow: "UP"},
    SSS: {red: "UP", green: "DOWN", blue: "UP", yellow: "DOWN"}
  }
}

/**
 * Casino carousel safe module — lever direction puzzle with slot spinners and streak lamps.
 * Wire on the Casino Carousel prefab; disable legacy Casino Carousel Module.js on the same object.
 */
@component
export class CasinoCarouselModule extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Slot reels</span>')

  @input
  @hint("Three slot spinner roots (left to right).")
  slotSpinners: SceneObject[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Streak lamps</span>')

  @input
  @hint("Five lamps — light in order on correct lever swings.")
  sequenceLamps: SceneObject[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Lever</span>')

  @input
  @allowUndefined
  @hint("Lever arm pivot object.")
  lever: SceneObject

  @input
  @allowUndefined
  @hint("Ball anchor the handle snaps back to.")
  leverBall: SceneObject

  @input
  @allowUndefined
  @hint("Draggable handle (needs Interactable Manipulation as first ScriptComponent).")
  leverHandle: SceneObject

  @input
  @widget(new SliderWidget(5, 90, 1))
  @hint("Max lever rotation in degrees during a swing.")
  leverMaxDegrees: number = 30

  @input
  @widget(new SliderWidget(0.05, 10, 0.05))
  @hint("Minimum vertical pull distance to register a swing.")
  leverMinDistance: number = 0.1

  private safeComponent: ScriptComponent | null = null
  private slotId = 0

  private readonly spinnerMaterials: Material[][] = []
  private readonly spinnerBaseRotations: quat[] = []
  private readonly spinnerCurrentSteps: number[] = []
  private spinnerBaseInitialized = false

  private readonly lampMaterials: (Material | null)[] = []

  private baseLeverRotation: quat | null = null
  private currentLeverAngle = 0
  private leverAnimState: LeverAnimState = "idle"
  private leverAnimStart = 0
  private leverAnimDirection = 1
  private isLeverAnimating = false

  private leverManipulation: InteractableManipulation | null = null

  private currentComboKey: ComboKey | null = null
  private expectedDirection: LeverDirection | null = null
  private readonly comboCounts: Partial<Record<ComboKey, number>> = {}
  private streakCount = 0
  private conditionKey: ConditionKey = "default"
  private fuseColor: FuseColor = "red"

  private isSpinning = false
  private readonly spinnerProgress: number[] = []
  private spinSfxTimer = 0
  private pendingNextCombo = false
  private pendingResolveDirection: LeverDirection | null = null

  private updateEvent!: UpdateEvent

  onAwake(): void {
    this.updateEvent = this.createEvent("UpdateEvent")
    this.updateEvent.bind(() => this.onUpdate())

    this.createEvent("OnStartEvent").bind(() => this.onStart())

    if (this.slotSpinners.length > 0) {
      this.createSpinnerMaterials()
    }
  }

  /** Called by SafeModuleManager when this module is spawned into a slot. */
  setupModule(safeContext: SafeContext, safeComponent: ScriptComponent, slotId: number): void {
    this.safeComponent = safeComponent
    this.slotId = slotId
    this.createSpinnerMaterials()
    this.initPuzzle(safeContext)
  }

  animationFinished(): void {
    // No-op — safe landing does not drive this module.
  }

  private onStart(): void {
    this.leverManipulation = this.resolveLeverManipulation()
    if (!this.leverManipulation) {
      return
    }

    this.leverManipulation.onTranslationStart.add(() => {
      this.handleFollowing = true
    })
    this.leverManipulation.onTranslationEnd.add(() => {
      this.handleFollowing = false
      this.snapHandleToBall()
    })
  }

  private onUpdate(): void {
    this.updateLever()
    this.updateSpinSfx()
  }

  private resolveLeverManipulation(): InteractableManipulation | null {
    if (!this.leverHandle) {
      return null
    }
    const components = this.leverHandle.getComponents(
      "Component.ScriptComponent"
    ) as ScriptComponent[]
    if (components.length === 0) {
      return null
    }
    return components[0] as InteractableManipulation
  }

  private snapHandleToBall(): void {
    if (!this.leverHandle || !this.leverBall) {
      return
    }
    this.leverHandle
      .getTransform()
      .setWorldPosition(this.leverBall.getTransform().getWorldPosition())
  }

  private createSpinnerMaterials(): void {
    for (let i = 0; i < this.slotSpinners.length; i++) {
      const spinner = this.slotSpinners[i] as SpinnerObject | undefined
      if (!spinner) {
        continue
      }

      if (!this.spinnerBaseInitialized) {
        this.spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation()
        this.spinnerCurrentSteps[i] = 0
      } else if (!this.spinnerBaseRotations[i]) {
        this.spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation()
        this.spinnerCurrentSteps[i] = 0
      }

      const visuals: RenderMeshVisual[] = []
      this.collectSpinnerVisuals(spinner, visuals)

      const spinnerMats: Material[] = []
      for (const visual of visuals) {
        if (!visual?.mainMaterial) {
          continue
        }
        const cloned = visual.mainMaterial.clone() as ProgressMaterial
        visual.clearMaterials()
        visual.mainMaterial = cloned
        this.setMaterialProgress(cloned, 0)
        spinnerMats.push(cloned)
      }
      this.spinnerMaterials[i] = spinnerMats
    }
    this.spinnerBaseInitialized = true
  }

  private collectSpinnerVisuals(sceneObject: SceneObject, visuals: RenderMeshVisual[]): void {
    const rmv = sceneObject.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    if (rmv) {
      visuals.push(rmv)
    }
    const childCount = sceneObject.getChildrenCount()
    for (let i = 0; i < childCount; i++) {
      const child = sceneObject.getChild(i)
      if (child) {
        this.collectSpinnerVisuals(child, visuals)
      }
    }
  }

  private initSequenceLamps(): void {
    for (let i = 0; i < this.sequenceLamps.length; i++) {
      const lampObj = this.sequenceLamps[i]
      if (!lampObj) {
        continue
      }
      const visual = lampObj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
      if (!visual?.mainMaterial) {
        continue
      }
      const cloned = visual.mainMaterial.clone() as ProgressMaterial
      visual.clearMaterials()
      visual.mainMaterial = cloned
      if (cloned.mainPass?.state !== undefined) {
        cloned.mainPass.state = 0
      }
      if (cloned.mainPass?.glowAmount !== undefined) {
        cloned.mainPass.glowAmount = 0
      }
      this.lampMaterials[i] = cloned
    }
  }

  private animateLamp(material: Material | null, targetValue: number, duration: number, callback?: () => void): void {
    const mat = material as ProgressMaterial | null
    if (!mat?.mainPass) {
      callback?.()
      return
    }

    if (mat.__lampAnim?.updateEvent) {
      mat.__lampAnim.updateEvent.enabled = false
      mat.__lampAnim.updateEvent = null
    }

    const startState = mat.mainPass.state || 0
    const startGlow = mat.mainPass.glowAmount || 0
    const animData: LampAnimData = {
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    mat.__lampAnim = animData

    animData.updateEvent.bind(() => {
      const elapsed = getTime() - animData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)

      if (mat.mainPass!.state !== undefined) {
        mat.mainPass!.state = startState + (targetValue - startState) * smoothT
      }
      if (mat.mainPass!.glowAmount !== undefined) {
        mat.mainPass!.glowAmount = startGlow + (targetValue - startGlow) * smoothT
      }

      if (t >= 1) {
        if (mat.mainPass!.state !== undefined) {
          mat.mainPass!.state = targetValue
        }
        if (mat.mainPass!.glowAmount !== undefined) {
          mat.mainPass!.glowAmount = targetValue
        }
        animData.updateEvent.enabled = false
        animData.updateEvent = null
        callback?.()
      }
    })
  }

  private spinSlotsToCombo(symbols: SymbolId[], callback?: () => void): void {
    if (this.spinnerMaterials.length === 0) {
      this.createSpinnerMaterials()
    }

    this.isSpinning = true
    this.spinSfxTimer = 0
    let remaining = 0

    for (let i = 0; i < this.slotSpinners.length; i++) {
      const spinner = this.slotSpinners[i] as SpinnerObject | undefined
      if (!spinner) {
        continue
      }

      remaining++
      const transform = spinner.getTransform()
      const startQuat = this.spinnerBaseRotations[i] || transform.getLocalRotation()

      if (spinner.__spinAnim?.updateEvent) {
        spinner.__spinAnim.updateEvent.enabled = false
        spinner.__spinAnim.updateEvent = null
      }

      const targetStep = this.getSymbolStep(symbols[i] || "diamond")
      const currentStep = this.spinnerCurrentSteps[i] ?? 0
      const deltaStep = (targetStep - currentStep + 4) % 4
      const rotations = 3 + i
      const totalDegrees = 360 * rotations + deltaStep * 90
      const totalRadians = totalDegrees * DEG_TO_RAD
      const duration = SPIN_DURATION_SEC * (rotations / 3)

      const animData: SpinAnimData = {
        startTime: getTime(),
        updateEvent: this.createEvent("UpdateEvent")
      }
      spinner.__spinAnim = animData

      const spinIndex = i
      const spinDuration = duration
      const targetStepValue = targetStep

      animData.updateEvent.bind(() => {
        const elapsed = getTime() - animData.startTime
        const t = Math.min(elapsed / spinDuration, 1)
        const smoothT = t * t * (3 - 2 * t)
        const angle = totalRadians * smoothT
        const mats = this.spinnerMaterials[spinIndex] || []

        for (let m = 0; m < mats.length; m++) {
          const mat = mats[m] as ProgressMaterial
          if (!mat) {
            continue
          }
          const progress = smoothT < 0.25 ? smoothT * 4 : smoothT > 0.75 ? (1 - smoothT) * 4 : 1
          this.spinnerProgress[spinIndex] = progress
          this.setMaterialProgress(mat, progress)
        }

        const delta = quat.angleAxis(angle, vec3.right())
        const current = startQuat.multiply(delta)
        current.normalize()
        transform.setLocalRotation(current)

        if (t >= 1) {
          const finalRot = startQuat.multiply(quat.angleAxis(totalRadians, vec3.right()))
          transform.setLocalRotation(finalRot)
          this.spinnerBaseRotations[spinIndex] = finalRot
          this.spinnerCurrentSteps[spinIndex] = targetStepValue

          global.playSfx(14, 1, global.appState.checkStorage("masterVolume") * 0.8)

          for (const mat2 of mats) {
            if (mat2) {
              this.setMaterialProgress(mat2 as ProgressMaterial, 0)
            }
          }

          animData.updateEvent.enabled = false
          animData.updateEvent = null
          remaining--

          if (remaining <= 0) {
            this.isSpinning = false
            this.spinnerProgress.length = 0
            if (this.leverManipulation?.setCanTranslate && !this.isLeverAnimating) {
              this.leverManipulation.setCanTranslate(true)
            }
            if (this.expectedDirection) {
              print("Carousel expected direction: " + this.expectedDirection)
            }
            callback?.()
          }
        }
      })
    }
  }

  private updateLever(): void {
    if (!this.leverHandle || !this.leverBall || !this.lever) {
      return
    }

    if (!this.baseLeverRotation) {
      this.baseLeverRotation = this.lever.getTransform().getLocalRotation()
      this.currentLeverAngle = 0
    }

    const handlePos = this.leverHandle.getTransform().getWorldPosition()
    const ballPos = this.leverBall.getTransform().getWorldPosition()
    const verticalDelta = handlePos.y - ballPos.y
    const verticalDistance = Math.abs(verticalDelta)
    const direction = verticalDelta >= 0 ? -1 : 1

    if (
      !this.isLeverAnimating &&
      this.leverAnimState === "idle" &&
      verticalDistance >= (this.leverMinDistance || 0)
    ) {
      this.leverAnimState = "swingUp"
      this.leverAnimStart = getTime()
      this.leverAnimDirection = direction
      this.isLeverAnimating = true
      global.playSfx(global.utils.rng(10, 12), 1, global.appState.checkStorage("masterVolume") * 1)

      const swingDir: LeverDirection = verticalDelta >= 0 ? "UP" : "DOWN"
      print("Lever Swing " + (swingDir === "UP" ? "Up" : "Down"))

      this.leverManipulation?.release?.()
      this.leverManipulation?.setCanTranslate?.(false)
      this.pendingResolveDirection = swingDir
    }

    if (this.leverAnimState !== "idle") {
      const elapsed = getTime() - this.leverAnimStart

      if (this.leverAnimState === "swingUp") {
        const tUp = clamp(elapsed / LEVER_SWING_SEC, 0, 1)
        const smoothUp = tUp * tUp * (3 - 2 * tUp)
        this.currentLeverAngle = (this.leverMaxDegrees || 0) * smoothUp * this.leverAnimDirection
        if (tUp >= 1) {
          this.leverAnimState = "hold"
          this.leverAnimStart = getTime()
        }
      } else if (this.leverAnimState === "hold") {
        this.currentLeverAngle = (this.leverMaxDegrees || 0) * this.leverAnimDirection
        if (elapsed >= LEVER_HOLD_SEC) {
          this.leverAnimState = "swingDown"
          this.leverAnimStart = getTime()
        }
      } else if (this.leverAnimState === "swingDown") {
        const tDown = clamp(elapsed / LEVER_SWING_SEC, 0, 1)
        const smoothDown = tDown * tDown * (3 - 2 * tDown)
        this.currentLeverAngle = (this.leverMaxDegrees || 0) * (1 - smoothDown) * this.leverAnimDirection
        if (tDown >= 1) {
          this.currentLeverAngle = 0
          this.leverAnimState = "idle"
          this.snapHandleToBall()
          this.isLeverAnimating = false

          if (this.pendingResolveDirection) {
            const resolveDir = this.pendingResolveDirection
            this.pendingResolveDirection = null
            this.handleLeverSwing(resolveDir)
          }
          if (this.pendingNextCombo && !this.isSpinning) {
            this.pendingNextCombo = false
            this.displayRandomCombo()
          }
        }
      }
    }

    const delta = quat.angleAxis(this.currentLeverAngle * DEG_TO_RAD, vec3.right())
    const newRot = this.baseLeverRotation.multiply(delta)
    this.lever.getTransform().setLocalRotation(newRot)
  }

  private getSerialInfo(serialNumber: SerialNumberInfo | string | undefined): {
    containsWord: boolean
    numberCount: number
  } {
    let serialString = ""
    let containsWord = false
    let numberCount = 0

    if (serialNumber) {
      if (typeof serialNumber === "string") {
        serialString = serialNumber
      } else {
        serialString = serialNumber.string || ""
        if (typeof serialNumber.containsWord === "boolean") {
          containsWord = serialNumber.containsWord
        }
        if (typeof serialNumber.numberCount === "number") {
          numberCount = serialNumber.numberCount
        }
      }
    }

    if (serialString && typeof serialNumber !== "object") {
      for (let i = 0; i < serialString.length; i++) {
        const ch = serialString.charAt(i)
        if (ch >= "0" && ch <= "9") {
          numberCount++
        }
      }
    }

    return {containsWord, numberCount}
  }

  private initPuzzle(safeContext: SafeContext): void {
    const serialInfo = this.getSerialInfo(safeContext.serialNumber)
    this.fuseColor = ((safeContext.dynamiteFuseColor || "red") as string).toLowerCase() as FuseColor

    if (serialInfo.containsWord) {
      this.conditionKey = "word"
    } else if (serialInfo.numberCount > 3) {
      this.conditionKey = "numbers"
    } else {
      this.conditionKey = "default"
    }

    for (const key of Object.keys(this.comboCounts) as ComboKey[]) {
      delete this.comboCounts[key]
    }
    this.streakCount = 0
    this.initSequenceLamps()
    this.displayRandomCombo()
  }

  private displayRandomCombo(): void {
    const keys = Object.keys(COMBO_DEFINITIONS) as ComboKey[]
    const idx =
      global.utils && global.utils.rng
        ? global.utils.rng(0, keys.length - 1)
        : Math.floor(Math.random() * keys.length)

    this.currentComboKey = keys[idx]
    const symbols = COMBO_DEFINITIONS[this.currentComboKey]

    if (!this.comboCounts[this.currentComboKey]) {
      this.comboCounts[this.currentComboKey] = 0
    }
    this.comboCounts[this.currentComboKey]! += 1

    const baseDir = RULE_TABLE[this.conditionKey][this.currentComboKey][this.fuseColor]
    const flip = this.comboCounts[this.currentComboKey]! % 2 === 0
    this.expectedDirection = flip ? (baseDir === "UP" ? "DOWN" : "UP") : baseDir

    this.spinSlotsToCombo(symbols)
  }

  private handleLeverSwing(direction: LeverDirection): void {
    if (this.isSpinning || !this.currentComboKey || !this.expectedDirection) {
      return
    }

    if (direction === this.expectedDirection) {
      this.streakCount++
      const lamp = this.lampMaterials[this.streakCount - 1]
      if (lamp) {
        global.playSfx(15, 1, global.appState.checkStorage("masterVolume") * 1)
        this.animateLamp(lamp, 1, 0.25)
      }

      if (this.streakCount >= STREAK_TO_SOLVE) {
        print("Casino Carousel Module solved")
        this.leverManipulation?.setCanTranslate?.(false)
        if (this.leverHandle) {
          this.leverHandle.enabled = false
        }
        this.moduleCompleted()
        return
      }
      this.pendingNextCombo = true
    } else {
      print("Casino Carousel Module streak reset")
      this.streakCount = 0
      for (const key of Object.keys(this.comboCounts) as ComboKey[]) {
        delete this.comboCounts[key]
      }
      for (const lampMat of this.lampMaterials) {
        if (lampMat) {
          this.animateLamp(lampMat, 0, 0.25)
        }
      }
      this.modulePenalty()
      this.pendingNextCombo = true
    }
  }

  private updateSpinSfx(): void {
    if (!this.isSpinning) {
      this.spinSfxTimer = 0
      return
    }

    let maxProgress = 0
    for (let i = 0; i < this.spinnerProgress.length; i++) {
      if (this.spinnerProgress[i] > maxProgress) {
        maxProgress = this.spinnerProgress[i]
      }
    }

    const rate = 2 + 2 * maxProgress
    const interval = rate > 0 ? 1 / rate : 0.5
    this.spinSfxTimer += getDeltaTime()

    while (this.spinSfxTimer >= interval) {
      this.spinSfxTimer -= interval
      global.playSfx(13, 1, global.appState.checkStorage("masterVolume") * 0.8)
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

  private getSymbolStep(symbolId: SymbolId): number {
    switch (symbolId) {
      case "diamond":
        return 0
      case "spade":
        return 1
      case "heart":
        return 2
      case "club":
        return 3
      default:
        return 0
    }
  }

  private setMaterialProgress(material: ProgressMaterial, value: number): void {
    if (material.mainPass?.progress !== undefined) {
      material.mainPass.progress = value
    } else if (material.progress !== undefined) {
      material.progress = value
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
