import {CapsuleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton"
import {SafeModuleConfig} from "./SafeModuleConfig"
import {generateSerialNumber} from "./SerialNumberGenerator"
import {SafeModuleManager} from "./SafeModuleManager"
import {SafeSolveSequence} from "./SafeSolveSequence"
import {SafeTimerController} from "./SafeTimerController"
import {
  SafeContext,
  SafeRuntimeContext,
  SafeType,
  SerialNumberInfo,
  getSafeBombTimerSeconds
} from "./SafeTypes"

const POSTGAME_ROOT_SCALE_DURATION_SEC = 0.35
const POSTGAME_TIME_ANIM_DURATION_SEC = 1.5
const POSTGAME_TIME_LABEL_SCALE_FROM = 0.7
const POSTGAME_TIME_LABEL_SCALE_TO = 1

@component
export class Safe extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Modules</span>')
  @input
  modules: SafeModuleConfig[] = []

  @input
  moduleSlots: SceneObject[] = []

  @input
  @allowUndefined
  moduleDisplayImages: Image[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Visuals</span>')
  @input
  @allowUndefined
  safeBody: SceneObject

  @input
  @allowUndefined
  safeDoor: SceneObject

  @input
  safeContents: SceneObject[] = []

  @input
  dynamiteFuseMaterials: Material[] = []

  @input
  dynamiteFuseObjects: SceneObject[] = []

  @input
  @allowUndefined
  serialNumberText: Text

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Timer UI</span>')
  @input
  @allowUndefined
  timerScreenRMV: RenderMeshVisual

  @input
  timerDigitTexts: Text[] = []

  @input
  timerBgTexts: Text[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Flow</span>')
  @input
  @allowUndefined
  gameFlow: ScriptComponent

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Debug</span>')
  @input
  enableDebug: boolean = false

  @input
  @showIf("enableDebug", true)
  @allowUndefined
  safeDebugText: Text

  safeType: SafeType = "solo"

  private bombTimer = getSafeBombTimerSeconds("solo")
  private activeSerialNumber: SerialNumberInfo | null = null
  private activeModuleList: string[] = []
  private solveStarted = false
  private safeFailedTriggered = false

  private timerController: SafeTimerController | null = null
  private moduleManager: SafeModuleManager | null = null
  private solveSequence: SafeSolveSequence | null = null
  private updateEvent: UpdateEvent | null = null

  onAwake(): void {
    this.ensureInitialized()
  }

  /**
   * Prefab instantiate may call init() before onAwake — build helpers lazily.
   */
  private ensureInitialized(): void {
    if (this.solveSequence) {
      return
    }

    this.timerController = new SafeTimerController(
      this.bombTimer,
      this.timerScreenRMV,
      this.timerDigitTexts,
      this.timerBgTexts,
      () => this.handleTimeUp()
    )

    this.moduleManager = new SafeModuleManager(
      this.modules,
      this.moduleSlots,
      this.moduleDisplayImages,
      () => this.handleAllModulesSolved()
    )

    this.solveSequence = new SafeSolveSequence(this.safeBody, this.safeDoor, this.safeContents)

    this.updateEvent = this.createEvent("UpdateEvent")
    this.timerController.bindUpdate(this.updateEvent)
  }

  init(safeType: SafeType): void {
    this.ensureInitialized()

    this.safeType = safeType
    this.bombTimer = getSafeBombTimerSeconds(safeType)
    this.timerController!.setBombTimer(this.bombTimer)
    this.safeFailedTriggered = false
    this.solveStarted = false

    if (this.safeDebugText) {
      this.safeDebugText.text = ""
    }

    const dynamiteFuseColor = this.applyRandomDynamiteFuse()
    this.solveSequence!.cloneSafeBodyMaterial()
    this.moduleManager!.cloneModuleDisplayMaterials()
    this.timerController!.cacheBaseColors()

    const serialNumber = generateSerialNumber()
    this.activeSerialNumber = serialNumber

    if (this.serialNumberText) {
      this.serialNumberText.text = serialNumber.string
    }
    this.debugLog("Serial Number", serialNumber.string)

    const safeContext: SafeContext = {
      object: this.getSceneObject(),
      serialNumber,
      moduleList: [],
      dynamiteFuseColor
    }

    const safeScript = this.sceneObject.getComponent(Safe.getTypeName()) as ScriptComponent
    const {moduleList} = this.moduleManager!.configureModules(safeType, safeContext, safeScript)
    this.activeModuleList = moduleList
    safeContext.moduleList = moduleList

    global.appState.safe = safeContext
  }

  beginSolve(): void {
    this.ensureInitialized()

    if (this.solveStarted) {
      return
    }

    this.solveStarted = true
    this.timerController!.startNormalTicking()

    global.utils.delay(0.5, () => {
      this.timerController!.startCountdown(this.bombTimer)
      if (this.safeType === "tutorial") {
        this.playTutorialHint()
      }
    })
  }

  completeModule(slotId: number): void {
    this.ensureInitialized()
    this.moduleManager!.completeModule(slotId)
  }

  applyPenalty(seconds: number): void {
    this.ensureInitialized()
    this.timerController!.applyPenalty(seconds)
  }

  animationFinished(): void {
    this.ensureInitialized()
    this.moduleManager!.notifyAnimationFinished()
  }

  getRemainingSeconds(): number {
    this.ensureInitialized()
    return this.timerController!.getRemainingSeconds()
  }

  getContext(): SafeRuntimeContext {
    this.ensureInitialized()
    return this.moduleManager!.getRuntimeContext(this.activeSerialNumber)
  }

  private handleTimeUp(): void {
    this.solveSequence!.playFailSequence(() => this.notifyFailed())
  }

  private handleAllModulesSolved(): void {
    this.timerController!.stop()
    const solvedInSeconds = this.timerController!.getSolvedSeconds(this.bombTimer, this.solveStarted)
    this.solveSequence!.playWinSequence(this.safeType, solvedInSeconds, (type, seconds) => {
      this.notifyComplete(type, seconds)
    })
  }

  private applyRandomDynamiteFuse(): string {
    if (!this.dynamiteFuseMaterials || this.dynamiteFuseMaterials.length === 0) {
      return ""
    }

    const colorNames = ["red", "green", "blue", "yellow"]
    const maxIndex = Math.min(this.dynamiteFuseMaterials.length, colorNames.length) - 1
    const index =
      global.utils && global.utils.rng
        ? global.utils.rng(0, maxIndex)
        : Math.floor(Math.random() * (maxIndex + 1))

    const selectedMaterial = this.dynamiteFuseMaterials[index]
    if (!selectedMaterial) {
      return ""
    }

    const clonedMaterial = selectedMaterial.clone()
    for (const obj of this.dynamiteFuseObjects) {
      if (!obj) {
        continue
      }
      const visual = obj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
      if (visual) {
        visual.mainMaterial = clonedMaterial
      }
    }

    return colorNames[index] || ""
  }

  private notifyComplete(safeType: SafeType, seconds: number): void {
    const flow = this.gameFlow as any
    if (flow && typeof flow.handleSafeComplete === "function") {
      flow.handleSafeComplete(safeType, seconds)
    } else if (typeof global.safeComplete === "function") {
      global.safeComplete(safeType, seconds)
    }
  }

  private notifyFailed(): void {
    const flow = this.gameFlow as any
    if (flow && typeof flow.handleSafeFailed === "function") {
      flow.handleSafeFailed()
    } else if (typeof global.safeFailed === "function") {
      global.safeFailed()
    }
  }

  private playTutorialHint(): void {
    const flow = this.gameFlow as any
    if (flow && typeof flow.playTutorialHint === "function") {
      flow.playTutorialHint()
    } else if (typeof global.leftRotateHint === "function") {
      global.leftRotateHint()
    }
  }

  private debugLog(label: string, value: unknown): void {
    if (!this.enableDebug || !this.safeDebugText) {
      return
    }
    this.safeDebugText.text = this.safeDebugText.text + "\n" + label + ": " + value
  }
}
