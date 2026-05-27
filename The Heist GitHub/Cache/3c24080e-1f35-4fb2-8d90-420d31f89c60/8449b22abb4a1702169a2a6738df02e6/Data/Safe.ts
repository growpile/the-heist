import {LSTween} from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import {asGameFlowFacade, GameFlowFacade} from "../HeistContracts"
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

const ANTENNA_GLOW_SCALE_MIN = 1
const ANTENNA_GLOW_SCALE_MAX = 3
/** One leg of the 1↔3 ping-pong (full 1→3→1 cycle = 1s). */
const ANTENNA_GLOW_PULSE_MS = 500

/** Safe prefab runtime — modules, timer, win/fail sequences. */
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
  @hint("Scaled away on win/fail — keep post-game UI outside this object.")
  @allowUndefined
  safeRoot: SceneObject

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

  @input
  @allowUndefined
  antennaGlow: SceneObject

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
  private lastSolvedInSeconds = -1
  private penaltyCount = 0

  private timerController: SafeTimerController | null = null
  private moduleManager: SafeModuleManager | null = null
  private solveSequence: SafeSolveSequence | null = null
  private updateEvent: UpdateEvent | null = null
  private solveElapsedEvent: UpdateEvent | null = null
  private solveElapsedSeconds = 0
  private antennaGlowScaleTween: any = null

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

  /** Prefab entry — serial, modules, timer, and visuals for this safe type. */
  init(safeType: SafeType): void {
    this.ensureInitialized()

    this.safeType = safeType
    this.bombTimer = getSafeBombTimerSeconds(safeType)
    this.timerController!.setBombTimer(this.bombTimer)
    this.safeFailedTriggered = false
    this.solveStarted = false
    this.lastSolvedInSeconds = -1
    this.penaltyCount = 0
    this.solveElapsedSeconds = 0
    this.stopSolveElapsedTimer()

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
      safeRoot: this.safeRoot ?? undefined,
      serialNumber,
      moduleList: [],
      dynamiteFuseColor
    }

    const safeScript = this.sceneObject.getComponent(Safe.getTypeName()) as ScriptComponent
    const {moduleList} = this.moduleManager!.configureModules(safeType, safeContext, safeScript)
    this.activeModuleList = moduleList
    safeContext.moduleList = moduleList

    global.appState.safe = safeContext
    this.startAntennaGlowPulse()
  }

  /** Starts bomb countdown after intro delay; tutorial plays rotate hint. */
  beginSolve(): void {
    this.ensureInitialized()

    if (this.solveStarted) {
      return
    }

    this.solveStarted = true
    this.timerController!.startNormalTicking()
    this.startSolveElapsedTimer()

    global.utils.delay(0.5, () => {
      this.timerController!.startCountdown(this.bombTimer)
      if (this.safeType === "tutorial") {
        this.playTutorialHint()
      }
    })
  }

  /** Called by a module when its puzzle is solved. */
  completeModule(slotId: number): void {
    this.ensureInitialized()
    this.moduleManager!.completeModule(slotId)
  }

  /** Shaves time off the bomb timer (modules call on wrong input). */
  applyPenalty(seconds: number): void {
    this.ensureInitialized()
    if (Math.max(0, Math.floor(seconds || 0)) > 0) {
      this.penaltyCount++
    }
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
    if (this.safeFailedTriggered) {
      return
    }
    this.safeFailedTriggered = true
    this.stopSolveElapsedTimer()
    this.timerController!.stop()
    this.solveSequence!.playFailSequence(() => {
      const flow = this.resolveGameFlow() as GameFlowFacade & {presentPostGameFail?: () => void} | null
      if (flow && typeof flow.presentPostGameFail === "function") {
        flow.presentPostGameFail()
        return
      }
      this.notifyFailed()
    })
  }

  private handleAllModulesSolved(): void {
    this.timerController!.stop()
    const solvedInSeconds = this.timerController!.getSolvedSeconds(this.bombTimer, this.solveStarted)
    this.lastSolvedInSeconds = solvedInSeconds
    this.stopSolveElapsedTimer()
    this.solveSequence!.playWinSequence(this.safeType, () => {
      const flow =
        this.resolveGameFlow() as GameFlowFacade & {
          presentPostGameWin?: (
            safeType: SafeType,
            solveDurationSeconds: number,
            bombTimerSeconds: number,
            penaltyCount: number
          ) => void
        } | null
      if (flow && typeof flow.presentPostGameWin === "function") {
        flow.presentPostGameWin(this.safeType, this.solveElapsedSeconds, this.bombTimer, this.penaltyCount)
        return
      }
      this.notifyComplete(this.safeType, solvedInSeconds)
    })
  }

  getBombTimerSeconds(): number {
    return this.bombTimer
  }

  /** Penalty-free solve duration (wall time since solve start). */
  getSolveDurationSeconds(): number {
    return Math.max(0, this.solveElapsedSeconds)
  }

  getPenaltyCount(): number {
    return Math.max(0, this.penaltyCount)
  }

  private startSolveElapsedTimer(): void {
    this.stopSolveElapsedTimer()
    this.solveElapsedSeconds = 0

    this.solveElapsedEvent = this.createEvent("UpdateEvent")
    this.solveElapsedEvent.bind(() => {
      if (!this.solveStarted || this.safeFailedTriggered) {
        return
      }
      const dt = getDeltaTime()
      if (dt > 0) {
        this.solveElapsedSeconds += dt
      }
    })
  }

  private stopSolveElapsedTimer(): void {
    if (this.solveElapsedEvent) {
      this.solveElapsedEvent.enabled = false
      this.solveElapsedEvent = null
    }
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

  /** Tear down timer + modules before prefab destroy. */
  /** Win/fail teardown — stops timer, modules, and idle VFX. */
  endSession(): void {
    this.stopAntennaGlowPulse()
    this.stopSolveElapsedTimer()
    this.timerController?.dispose()
    this.moduleManager?.disableAllModules()
  }

  private startAntennaGlowPulse(): void {
    if (!this.antennaGlow) {
      return
    }

    this.stopAntennaGlowPulse()

    const transform = this.antennaGlow.getTransform()
    const minScale = new vec3(
      ANTENNA_GLOW_SCALE_MIN,
      ANTENNA_GLOW_SCALE_MIN,
      ANTENNA_GLOW_SCALE_MIN
    )
    const maxScale = new vec3(
      ANTENNA_GLOW_SCALE_MAX,
      ANTENNA_GLOW_SCALE_MAX,
      ANTENNA_GLOW_SCALE_MAX
    )
    transform.setLocalScale(minScale)

    this.antennaGlowScaleTween = LSTween.scaleFromToLocal(
      transform,
      minScale,
      maxScale,
      ANTENNA_GLOW_PULSE_MS
    )
      .easing(Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .start()
  }

  private stopAntennaGlowPulse(): void {
    if (this.antennaGlowScaleTween && typeof this.antennaGlowScaleTween.stop === "function") {
      this.antennaGlowScaleTween.stop()
    }
    this.antennaGlowScaleTween = null
  }

  private resolveGameFlow(): GameFlowFacade | null {
    return asGameFlowFacade(this.gameFlow as ScriptComponent | GameFlowFacade | null | undefined)
  }

  private notifyComplete(safeType: SafeType, seconds: number): void {
    const flow = this.resolveGameFlow()
    if (flow && typeof flow.handleSafeComplete === "function") {
      flow.handleSafeComplete(safeType, seconds)
      return
    }
    if (typeof global.safeComplete === "function") {
      global.safeComplete(safeType, seconds)
    }
  }

  private notifyFailed(): void {
    const flow = this.resolveGameFlow()
    if (flow && typeof flow.handleSafeFailed === "function") {
      flow.handleSafeFailed()
      return
    }
    if (typeof global.safeFailed === "function") {
      global.safeFailed()
    }
  }

  private playTutorialHint(): void {
    const flow = this.resolveGameFlow() as GameFlowFacade & {playTutorialHint?: () => void} | null
    if (flow && typeof flow.playTutorialHint === "function") {
      flow.playTutorialHint()
      return
    }
    if (typeof global.leftRotateHint === "function") {
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
