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
  @ui.label('<span style="color: #34D399;">Win ending</span>')
  @input
  @hint("Root scaled 0→1 when the safe is solved.")
  @allowUndefined
  winPostgameViewRoot: SceneObject

  @input
  @hint("Solve-time label (SSS:M count-up).")
  @allowUndefined
  winTimeSolvedText: Text

  @input
  @hint("Menu button — wire Safe.backToMenu on trigger up.")
  @allowUndefined
  winMenuButton: CapsuleButton

  @ui.separator
  @ui.label('<span style="color: #F87171;">Fail ending</span>')
  @input
  @hint("Root scaled 0→1 when the timer runs out.")
  @allowUndefined
  failPostgameViewRoot: SceneObject

  @input
  @hint("Menu button — wire Safe.backToMenu on trigger up.")
  @allowUndefined
  failMenuButton: CapsuleButton

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
  private postGameShown = false
  private postGameOutcome: "none" | "win" | "fail" = "none"

  private timerController: SafeTimerController | null = null
  private postGameTimeAnimEvent: UpdateEvent | null = null
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
    this.resetPostGameView()
  }

  init(safeType: SafeType): void {
    this.ensureInitialized()

    this.safeType = safeType
    this.bombTimer = getSafeBombTimerSeconds(safeType)
    this.timerController!.setBombTimer(this.bombTimer)
    this.safeFailedTriggered = false
    this.solveStarted = false
    this.lastSolvedInSeconds = -1
    this.postGameShown = false
    this.postGameOutcome = "none"

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
    this.resetPostGameView()
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
    this.solveSequence!.playFailSequence(() => this.showFailPostGameView())
  }

  private handleAllModulesSolved(): void {
    this.timerController!.stop()
    const solvedInSeconds = this.timerController!.getSolvedSeconds(this.bombTimer, this.solveStarted)
    this.lastSolvedInSeconds = solvedInSeconds
    this.solveSequence!.playWinSequence(this.safeType, () => {
      this.showWinPostGameView(solvedInSeconds)
    })
  }

  /** Scene callback from win/fail menu CapsuleButtons. */
  backToMenu(): void {
    if (!this.postGameShown) {
      return
    }

    if (this.postGameOutcome === "win" && this.lastSolvedInSeconds >= 0) {
      this.stopPostGameTimeAnimation()
      this.notifyComplete(this.safeType, this.lastSolvedInSeconds)
      return
    }

    if (this.postGameOutcome === "fail") {
      this.notifyFailed()
    }
  }

  private showWinPostGameView(solvedInSeconds: number): void {
    this.postGameShown = true
    this.postGameOutcome = "win"
    this.setWinPostGameAppState()
    this.hideEndViewRoot(this.failPostgameViewRoot)
    this.setCapsuleButtonPressable(this.winMenuButton, false)
    this.setCapsuleButtonPressable(this.failMenuButton, false)

    if (!this.winPostgameViewRoot) {
      this.playPostGameTimeAnimation(solvedInSeconds, () => this.enableWinMenuButton())
      return
    }

    const timeLabelObject = this.winTimeSolvedText?.getSceneObject()
    if (timeLabelObject) {
      const from = POSTGAME_TIME_LABEL_SCALE_FROM
      timeLabelObject.getTransform().setLocalScale(new vec3(from, from, from))
    }
    if (this.winTimeSolvedText) {
      this.winTimeSolvedText.text = "000:0"
    }

    this.showEndViewRoot(this.winPostgameViewRoot)

    if (timeLabelObject) {
      const to = POSTGAME_TIME_LABEL_SCALE_TO
      global.utils.animateScale(
        timeLabelObject,
        true,
        new vec3(to, to, to),
        POSTGAME_TIME_ANIM_DURATION_SEC,
        () => {}
      )
    }

    this.playPostGameTimeAnimation(solvedInSeconds, () => this.enableWinMenuButton())
  }

  private showFailPostGameView(): void {
    this.postGameShown = true
    this.postGameOutcome = "fail"
    this.setFailPostGameAppState()
    this.hideEndViewRoot(this.winPostgameViewRoot)
    this.setCapsuleButtonPressable(this.winMenuButton, false)
    this.setCapsuleButtonPressable(this.failMenuButton, false)

    this.showEndViewRoot(this.failPostgameViewRoot, () => this.enableFailMenuButton())
  }

  private resetPostGameView(): void {
    this.stopPostGameTimeAnimation()
    this.resetEndViewRoot(this.winPostgameViewRoot)
    this.resetEndViewRoot(this.failPostgameViewRoot)

    const timeLabelObject = this.winTimeSolvedText?.getSceneObject()
    if (timeLabelObject) {
      const from = POSTGAME_TIME_LABEL_SCALE_FROM
      timeLabelObject.getTransform().setLocalScale(new vec3(from, from, from))
    }

    if (this.winTimeSolvedText) {
      this.winTimeSolvedText.text = "000:0"
    }

    this.setCapsuleButtonPressable(this.winMenuButton, false)
    this.setCapsuleButtonPressable(this.failMenuButton, false)
  }

  private resetEndViewRoot(root: SceneObject | undefined | null): void {
    if (!root) {
      return
    }
    root.enabled = true
    root.getTransform().setLocalScale(vec3.zero())
  }

  private hideEndViewRoot(root: SceneObject | undefined | null): void {
    if (!root) {
      return
    }
    root.getTransform().setLocalScale(vec3.zero())
  }

  private showEndViewRoot(root: SceneObject | undefined | null, onComplete?: () => void): void {
    if (!root) {
      onComplete?.()
      return
    }

    root.enabled = true
    root.getTransform().setLocalScale(vec3.zero())
    global.utils.animateScale(root, true, vec3.one(), POSTGAME_ROOT_SCALE_DURATION_SEC, () => {
      onComplete?.()
    })
  }

  private enableWinMenuButton(): void {
    global.utils.delay(0.05, () => {
      this.setCapsuleButtonPressable(this.winMenuButton, true)
    })
  }

  private enableFailMenuButton(): void {
    global.utils.delay(0.05, () => {
      this.setCapsuleButtonPressable(this.failMenuButton, true)
    })
  }

  /** Inspector may assign the CapsuleButton script component reference. */
  private resolveCapsuleButton(buttonInput: CapsuleButton | undefined | null): CapsuleButton | null {
    if (!buttonInput) {
      return null
    }

    const direct = buttonInput as CapsuleButton
    if (typeof (direct as {inactive?: boolean}).inactive !== "undefined") {
      return direct
    }

    const asScript = buttonInput as unknown as ScriptComponent
    const sceneObject = asScript?.getSceneObject?.()
    if (!sceneObject) {
      return null
    }

    return sceneObject.getComponent(CapsuleButton.getTypeName()) as CapsuleButton | null
  }

  /**
   * CapsuleButton uses `inactive` (not SceneObject.enabled).
   * UIKit expects a double-toggle to refresh collider + interactable state.
   */
  private setCapsuleButtonPressable(
    buttonInput: CapsuleButton | undefined | null,
    pressable: boolean
  ): void {
    const button = this.resolveCapsuleButton(buttonInput)
    if (!button) {
      return
    }

    const apply = () => {
      const resolved = this.resolveCapsuleButton(buttonInput)
      if (!resolved) {
        return
      }
      if (pressable) {
        resolved.inactive = true
        resolved.inactive = false
      } else {
        resolved.inactive = false
        resolved.inactive = true
      }
      const interactable = resolved.interactable
      if (interactable) {
        interactable.enabled = pressable
      }
    }

    if (button.initialized) {
      apply()
      return
    }

    const onInitialized = button.onInitialized
    if (onInitialized && typeof onInitialized.add === "function") {
      onInitialized.add(apply)
      return
    }

    global.utils.delay(0, apply)
  }

  private setWinPostGameAppState(): void {
    if (!global.appState) {
      return
    }
    global.appState.currentState =
      this.safeType === "tutorial" ? "tutorialWinPostGame" : "winPostGame"
  }

  private setFailPostGameAppState(): void {
    if (!global.appState) {
      return
    }
    global.appState.currentState = "losePostGame"
  }

  private formatSolveTime(seconds: number): string {
    const clamped = Math.max(0, Math.min(999.9, seconds))
    const wholeSeconds = Math.floor(clamped)
    const tenths = Math.min(9, Math.floor((clamped - wholeSeconds) * 10 + 0.0001))
    const secStr = ("000" + wholeSeconds.toString()).slice(-3)
    return secStr + ":" + tenths.toString()
  }

  private playPostGameTimeAnimation(solvedInSeconds: number, onComplete: () => void): void {
    this.stopPostGameTimeAnimation()

    if (!this.timeSolvedText) {
      onComplete()
      return
    }

    this.timeSolvedText.text = "000:0"
    let elapsed = 0

    this.postGameTimeAnimEvent = this.createEvent("UpdateEvent")
    this.postGameTimeAnimEvent.bind(() => {
      elapsed += getDeltaTime()
      const progress = Math.min(1, elapsed / POSTGAME_TIME_ANIM_DURATION_SEC)
      const currentSeconds = solvedInSeconds * progress
      this.timeSolvedText!.text = this.formatSolveTime(currentSeconds)

      if (progress >= 1) {
        this.timeSolvedText!.text = this.formatSolveTime(solvedInSeconds)
        this.stopPostGameTimeAnimation()
        onComplete()
      }
    })
  }

  private stopPostGameTimeAnimation(): void {
    if (this.postGameTimeAnimEvent) {
      this.postGameTimeAnimEvent.enabled = false
      this.postGameTimeAnimEvent = null
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
