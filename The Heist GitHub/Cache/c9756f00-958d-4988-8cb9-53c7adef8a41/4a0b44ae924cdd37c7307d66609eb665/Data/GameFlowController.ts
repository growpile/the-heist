import {Safe} from "./Safe/Safe"
import {CoopNetworkController, type CoopNetworkFacade} from "./CoopNetworkController"
import {GroundPlaneController} from "./GroundPlaneController"
import {MenuController} from "./MenuController"
import {SafeAnchorPlacement} from "./SafeAnchorPlacement"
import {SafeRotationManager} from "./SafeRotationManager"
import {SafeType} from "./Safe/SafeTypes"
import {Slider} from "SpectaclesUIKit.lspkg/Scripts/Components/Slider/Slider"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"

const InteractionHintModule = require("Spectacles3DHandHints.lspkg/Scripts/InteractionHintController")
const {HandAnimationsLibrary, HandMode} = InteractionHintModule

const DESTROY_SAFE_DELAY_SEC = 0.5

@component
export class GameFlowController extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">Flow</span>')

  @input
  @allowUndefined
  menuController: MenuController

  @input
  @allowUndefined
  coopNetwork: CoopNetworkController

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Safe & Placement</span>')

  @input
  safePrefab: ObjectPrefab

  @input
  @allowUndefined
  safeOrigin: SceneObject

  @input
  @allowUndefined
  @hint("Runs surface placement before spawning the safe.")
  safeAnchorPlacement: SafeAnchorPlacement

  @input
  @allowUndefined
  rotationManager: SafeRotationManager

  @input
  @allowUndefined
  @hint("Ground plane object. Material is read from its mesh at runtime.")
  groundPlane: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Settings UI</span>')

  @input
  @allowUndefined
  volumeSlider: ScriptComponent

  @input
  @allowUndefined
  glovesToggle: ScriptComponent

  @input
  @allowUndefined
  gloves: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Feedback</span>')

  @input
  @allowUndefined
  interactionHintController: ScriptComponent

  @input
  @allowUndefined
  tableImpactVFX: VFXComponent

  @input
  @allowUndefined
  boomVfx: VFXComponent

  private activeSafeComponent: Safe | null = null
  private activeSessionSafeType: SafeType | null = null
  private safeFailExitInProgress = false
  private safeCompleteExitInProgress = false
  private networkFlowGeneration = 0
  private groundPlaneCtrl: GroundPlaneController | null = null
  private static readonly ENABLE_SETTINGS_DEBUG = false
  private currentGameState = 0
  private solvedSecondsLatest: number | null = null
  private surfacePlacementActive = false
  private suppressSettingsControlCallbacksUntil = 0

  /** Lens Studio AssignableType omits methods; use facade for network + stream API. */
  private coop(): CoopNetworkFacade | null {
    return (this.coopNetwork as unknown as CoopNetworkFacade | null) ?? null
  }

  onAwake(): void {
    global.safeComplete = (safeType: SafeType, solvedInSeconds: number) => {
      this.handleSafeComplete(safeType, solvedInSeconds)
    }
    global.safeFailed = () => {
      this.handleSafeFailed()
    }
    global.trySignIn = async () => {
      if (!this.coopNetwork) {
        return false
      }
      return await this.coopNetwork.trySignIn()
    }
    global.leftRotateHint = () => {
      this.playTutorialHint()
    }

    this.menuController?.setSettingsTabSelectedHandler(() => {
      this.onSettingsTabSelected()
    })

    this.createEvent("OnStartEvent").bind(() => this.startEvent())
    this.syncGroundPlaneMaterialToRotationManager()
  }

  private isFlowBusy(): boolean {
    return global.appState.inTransition || this.surfacePlacementActive
  }

  /** Main-menu settings tab (MenuController); not the legacy showOverlay("settings") path. */
  onSettingsTabSelected(): void {
    this.logSettingsDiag("onSettingsTabSelected()")
    this.suppressSettingsControlCallbacksUntil = getTime() + 0.25
    this.syncSettingsControlsFromStorage("tab-immediate")
    const delayed = this.createEvent("DelayedCallbackEvent")
    delayed.bind(() => {
      this.syncSettingsControlsFromStorage("tab-delayed")
      this.suppressSettingsControlCallbacksUntil = 0
    })
    delayed.reset(0.05)
  }

  playareaPositioned(): void {
    print("Play Area Positioned.")
    this.menuController?.showMainMenu(() => {
      print("Menu shown")
    })
  }

  /** Main menu Solo Play → tips step, then startGame for anchoring. */
  startSolo(): void {
    if (this.isFlowBusy()) {
      return
    }
    print("[GameFlowController] startSolo() → tips")
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)
    this.menuController?.requestSoloTips()
  }

  /** Tips Start button → hide menu and run surface placement. */
  startGame(): void {
    if (this.isFlowBusy()) {
      return
    }

    const safeType = this.menuController?.consumePendingSafeType()
    if (!safeType) {
      print("[GameFlowController] startGame() skipped — no pending safe type")
      return
    }

    print("[GameFlowController] startGame() → " + safeType)
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)

    this.menuController?.hideForGameplay(() => {
      this.beginSurfacePlacement(safeType)
    })
  }

  private beginSurfacePlacement(safeType: SafeType): void {
    if (!this.safeAnchorPlacement) {
      print("[GameFlowController] No safeAnchorPlacement input wired; falling back to direct safe intro")
      this.safeIntro(safeType)
      return
    }

    this.surfacePlacementActive = true

    const placementRoot = this.safeAnchorPlacement.getSceneObject()
    if (placementRoot) {
      placementRoot.enabled = true
    }

    if (this.safeOrigin) {
      this.safeOrigin.enabled = false
    }

    this.safeAnchorPlacement.startPlacement(
      (pos: vec3, rot: quat) => this.onSurfacePlaced(safeType, pos, rot),
      (pos: vec3) => this.onSurfaceSliderUpdated(pos)
    )
  }

  private onSurfaceSliderUpdated(pos: vec3): void {
    if (!this.safeOrigin) {
      return
    }
    this.safeOrigin.getTransform().setWorldPosition(pos)
  }

  private onSurfacePlaced(safeType: SafeType, pos: vec3, rot: quat): void {
    this.surfacePlacementActive = false

    if (this.safeOrigin) {
      const originTransform = this.safeOrigin.getTransform()
      originTransform.setWorldPosition(pos)
      originTransform.setWorldRotation(rot)
      this.safeOrigin.enabled = true
    }

    this.safeIntro(safeType)
  }

  /** Main menu Create Room → online room step, then networking. */
  createRoom(): void {
    if (this.isFlowBusy()) {
      return
    }

    print("[GameFlowController] createRoom()")
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)
    global.appState.inTransition = true

    this.menuController?.requestOnlineRoom(() => {
      global.appState.inTransition = false
      global.appState.currentState = "coopPlay"
      this.beginNetworkFlow()
    })
  }

  /** Legacy scene callback name for coop tab Create Room button. */
  teamPlay(): void {
    this.createRoom()
  }

  startTeam(): void {
    this.createRoom()
  }

  /** Online room Start button → anchoring + coop safe. */
  startOnlineGame(): void {
    if (this.isFlowBusy()) {
      return
    }

    print("[GameFlowController] startOnlineGame()")
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)

    this.coop()?.setStreamMetaProvider(() => this.buildStreamMeta())
    this.coop()?.startCameraStream()

    this.menuController?.hideForGameplay(() => {
      this.sendGameState(1)
      this.beginSurfacePlacement("coop")
    })
  }

  /** Legacy scene callback names. */
  startTeamSession(): void {
    this.startOnlineGame()
  }

  playersReady(): void {
    this.startOnlineGame()
  }

  beginSolveTutorial(): void {
    this.startGame()
  }

  beginSolveSolo(): void {
    this.startGame()
  }

  beginSolveCoop(): void {
    this.startOnlineGame()
  }

  /** Called when timer hits 0 — rotate, scale safe away, then fail post-game UI. */
  playFailExplosionAndScaleAway(callback?: () => void): void {
    global.utils.delay(0.1, () => {
      this.playBoomVfx()
      global.playSfx(28, 1, global.appState.checkStorage("masterVolume") * 0.9)
    })

    this.getGroundPlaneCtrl().shrinkForFail()
    this.scaleSafeRootAway(() => callback?.())
  }

  handleSafeComplete(safeType: SafeType, solvedInSeconds: number): void {
    if (this.safeCompleteExitInProgress) {
      return
    }
    this.safeCompleteExitInProgress = true
    this.networkFlowGeneration++

    print("[GameFlowController] handleSafeComplete — " + safeType)
    this.menuController?.setSolvedSeconds(solvedInSeconds)
    this.activeSafeComponent?.endSession()
    this.setRotationEnabled(false)

    this.getGroundPlaneCtrl().hide()
    global.playSfx(global.utils.rng(22, 25), 1, global.appState.getMasterVolume() * 0.9)

    const prefabRoot = global.appState.safe?.object
    if (!prefabRoot) {
      this.safeCompleteExitInProgress = false
      this.exitGameplaySession()
      return
    }

    if (safeType === "coop") {
      this.sendGameState(3, solvedInSeconds)
      this.stopNetworkStreaming()
    }

    print("[GameFlowController] handleSafeComplete — showing main menu")
    this.exitGameplaySession(() => {
      this.scheduleDestroySafePrefab(prefabRoot, () => {
        this.safeCompleteExitInProgress = false
      })
    })
  }

  handleSafeFailed(): void {
    if (this.safeFailExitInProgress) {
      return
    }
    this.safeFailExitInProgress = true
    this.networkFlowGeneration++

    this.setRotationEnabled(false)
    this.activeSafeComponent?.endSession()

    const prefabRoot = global.appState.safe?.object

    this.getGroundPlaneCtrl().hide()
    if (this.activeSessionSafeType === "coop") {
      this.sendGameState(2)
      this.stopNetworkStreaming()
    }

    const finishFailExit = () => {
      this.scheduleDestroySafePrefab(prefabRoot, () => {
        this.safeFailExitInProgress = false
      })
    }

    if (!this.menuController) {
      print("[GameFlowController] handleSafeFailed — menuController not wired")
      this.exitGameplaySession(finishFailExit)
      return
    }

    print("[GameFlowController] handleSafeFailed — showing main menu")
    this.exitGameplaySession(finishFailExit)
  }

  private exitGameplaySession(afterMenu?: () => void): void {
    global.appState.inTransition = false
    global.appState.currentState = "mainMenu"
    this.activeSessionSafeType = null
    this.surfacePlacementActive = false
    this.hideSurfaceAnchorForMenu()

    if (!this.menuController) {
      afterMenu?.()
      return
    }
    this.menuController.showMainMenu(afterMenu)
  }

  /** Scale down and hide the placed surface anchor when leaving gameplay. */
  private hideSurfaceAnchorForMenu(): void {
    if (this.safeOrigin) {
      this.safeOrigin.enabled = false
    }

    this.safeAnchorPlacement?.hideForMenu()
  }

  private scheduleDestroySafePrefab(prefabRoot: SceneObject | undefined, onDone?: () => void): void {
    global.utils.delay(DESTROY_SAFE_DELAY_SEC, () => {
      this.activeSafeComponent = null
      if (prefabRoot) {
        prefabRoot.destroy()
      }
      if (prefabRoot && global.appState.safe?.object === prefabRoot) {
        global.appState.safe = {}
      }
      onDone?.()
    })
  }

  /** Scales safeRoot only — used on timer fail before post-game UI. */
  private scaleSafeRootAway(onComplete: () => void): void {
    const safeState = global.appState.safe
    const scaleTarget = safeState?.safeRoot ?? safeState?.object
    if (!scaleTarget) {
      onComplete()
      return
    }

    global.utils.animateScale(scaleTarget, true, new vec3(0, 0, 0), 0.25, () => {
      onComplete()
    })
  }

  private getGroundPlaneCtrl(): GroundPlaneController {
    if (!this.groundPlaneCtrl) {
      this.groundPlaneCtrl = new GroundPlaneController(this.groundPlane)
    }
    return this.groundPlaneCtrl
  }

  private resetGroundPlaneHidden(): void {
    this.getGroundPlaneCtrl().resetHidden()
    this.syncGroundPlaneMaterialToRotationManager()
  }

  private showGroundPlane(): void {
    this.getGroundPlaneCtrl().show()
    this.syncGroundPlaneMaterialToRotationManager()
  }

  backToMenu(): void {
    const state = global.appState.currentState
    if (state === "losePostGame") {
      this.handleSafeFailed()
      return
    }
    if (state === "winPostGame" || state === "tutorialWinPostGame") {
      if (this.safeCompleteExitInProgress) {
        return
      }
      const safeType = this.activeSessionSafeType ?? "solo"
      this.handleSafeComplete(safeType, 0)
    }
  }

  openSettings(): void {
    this.logSettingsDiag("openSettings() inTransition=" + global.appState.inTransition)
    if (global.appState.inTransition) {
      this.logSettingsDiag("openSettings ABORT — app in transition")
      return
    }
    if (!this.menuController) {
      this.logSettingsDiag("openSettings ABORT — menuController not assigned on GameFlowController")
      return
    }
    this.logSettingsDiag(
      "inputs: volumeSlider=" +
        (this.volumeSlider ? this.volumeSlider.getSceneObject().name : "(null)") +
        " glovesToggle=" +
        (this.glovesToggle ? this.glovesToggle.getSceneObject().name : "(null)")
    )
    this.suppressSettingsControlCallbacksUntil = getTime() + 0.25
    this.menuController.showOverlay("settings", () => {
      this.logSettingsDiag("showOverlay(settings) callback — syncing controls")
      this.syncSettingsControlsFromStorage("immediate")
      const delayed = this.createEvent("DelayedCallbackEvent")
      delayed.bind(() => {
        this.syncSettingsControlsFromStorage("delayed+50ms")
        this.suppressSettingsControlCallbacksUntil = 0
      })
      delayed.reset(0.05)
    })
  }

  /** Reload persisted values into UIKit settings controls. */
  private syncSettingsControlsFromStorage(phase: string): void {
    const volume = this.readPersistedSetting("masterVolume") as number
    const glovesOn = this.readPersistedSetting("enabledGloves") as boolean
    this.logSettingsDiag(
      "sync(" +
        phase +
        ") persisted masterVolume=" +
        volume +
        " enabledGloves=" +
        glovesOn
    )

    if (this.volumeSlider) {
      this.logSceneChain(this.volumeSlider.getSceneObject(), "volumeSlider")
    } else {
      this.logSettingsDiag("sync volumeSlider input is NULL on GameFlowController")
    }

    const slider = this.getVolumeSlider()
    if (slider) {
      slider.updateCurrentValue(volume, false)
      this.logSettingsDiag("sync volume Slider OK → currentValue=" + volume)
    } else {
      this.logSettingsDiag(
        "sync volume Slider MISSING — getComponent(" +
          Slider.getTypeName() +
          ") failed on " +
          (this.volumeSlider ? this.volumeSlider.getSceneObject().name : "?")
      )
    }

    if (this.glovesToggle) {
      this.logSceneChain(this.glovesToggle.getSceneObject(), "glovesToggle")
    } else {
      this.logSettingsDiag("sync glovesToggle input is NULL on GameFlowController")
    }

    const glovesSwitch = this.getGlovesSwitch()
    if (glovesSwitch) {
      glovesSwitch.isOn = glovesOn
      this.logSettingsDiag("sync gloves Switch OK → isOn=" + glovesOn)
    } else {
      this.logSettingsDiag(
        "sync gloves Switch MISSING — getComponent(" +
          Switch.getTypeName() +
          ") failed on " +
          (this.glovesToggle ? this.glovesToggle.getSceneObject().name : "?")
      )
    }
  }

  private logSettingsDiag(msg: string): void {
    if (!GameFlowController.ENABLE_SETTINGS_DEBUG) {
      return
    }
    print("[SettingsDiag][GameFlowController] " + msg)
  }

  private logSceneChain(obj: SceneObject, label: string): void {
    let current: SceneObject | null = obj
    let depth = 0
    this.logSettingsDiag("── scene chain " + label + " ──")
    while (current && depth < 12) {
      const scale = current.getTransform().getLocalScale()
      this.logSettingsDiag(
        "  [" +
          depth +
          "] " +
          current.name +
          " enabled=" +
          current.enabled +
          " scale=" +
          scale.x.toFixed(2) +
          "," +
          scale.y.toFixed(2) +
          "," +
          scale.z.toFixed(2)
      )
      current = current.getParent()
      depth++
    }
  }

  /** Bypass in-memory cache so UI always reflects persistent store after lens restart. */
  private readPersistedSetting(key: string): boolean | number {
    const storage = global.appState.storage as Record<string, unknown>
    if (storage && Object.prototype.hasOwnProperty.call(storage, key)) {
      delete storage[key]
    }
    return global.appState.checkStorage(key) as boolean | number
  }

  private getVolumeSlider(): Slider | null {
    if (!this.volumeSlider) {
      return null
    }
    const comp = this.volumeSlider
      .getSceneObject()
      .getComponent(Slider.getTypeName()) as ScriptComponent | null
    return (comp as unknown as Slider) ?? null
  }

  private getGlovesSwitch(): Switch | null {
    if (!this.glovesToggle) {
      return null
    }
    const comp = this.glovesToggle
      .getSceneObject()
      .getComponent(Switch.getTypeName()) as ScriptComponent | null
    return (comp as unknown as Switch) ?? null
  }

  setMasterVolume(value: number): void {
    if (getTime() < this.suppressSettingsControlCallbacksUntil) {
      return
    }
    const volume = Math.max(0, Math.min(1, value))
    const rounded = Math.round(volume * 100) / 100
    global.appState.setStorage("masterVolume", rounded)
    global.setBgmVolume(rounded * 0.1)
  }

  setGlovesEnabled(value: boolean): void {
    if (getTime() < this.suppressSettingsControlCallbacksUntil) {
      return
    }
    global.appState.setStorage("enabledGloves", value)
    if (this.gloves) {
      this.gloves.enabled = value
    }
  }

  replayTutorial(): void {
    if (global.appState.inTransition) {
      return
    }
    print("[GameFlowController] replayTutorial() → tutorial tips")
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)
    this.menuController?.requestTutorialTips()
  }

  exitSettings(callback?: () => void): void {
    if (global.appState.inTransition) {
      return
    }
    this.menuController?.showMainMenu(callback)
  }

  rescanSurface(): void {
    if (global.appState.inTransition) {
      return
    }
    const safeType = this.menuController?.consumePendingSafeType() ?? "solo"
    this.menuController?.hideForGameplay(() => {
      this.safeAnchorPlacement?.stopPlacement()
      this.beginSurfacePlacement(safeType)
    })
  }

  playTutorialHint(): void {
    if (!this.interactionHintController) {
      return
    }
    const ctrl = this.interactionHintController as any
    if (typeof ctrl.playHintAnimation === "function") {
      ctrl.playHintAnimation(HandMode.Right, HandAnimationsLibrary.Right.PalmTouchSurface, 1, 0.3)
    }
  }

  private startEvent(): void {
    this.resetGroundPlaneHidden()
    global.setBgmVolume(0.1 * global.appState.checkStorage("masterVolume"))
    if (this.gloves) {
      this.gloves.enabled = global.appState.checkStorage("enabledGloves")
    }
    this.menuController?.showMainMenu()
  }

  /** Supports TS SafeRotationManager (AssignableType) and legacy JS script API. */
  private resolveRotationManager(): SafeRotationManager | null {
    const rm = this.rotationManager as SafeRotationManager | ScriptComponent | undefined | null
    if (!rm) {
      return null
    }
    if (typeof (rm as SafeRotationManager).setCanRotate === "function") {
      return rm as SafeRotationManager
    }
    const sceneObject = (rm as ScriptComponent).getSceneObject?.()
    if (!sceneObject) {
      return null
    }
    const comp = sceneObject.getComponent(SafeRotationManager.getTypeName()) as ScriptComponent
    return (comp as unknown as SafeRotationManager | null) ?? null
  }

  private syncGroundPlaneMaterialToRotationManager(): void {
    const mgr = this.resolveRotationManager()
    if (!mgr) {
      return
    }
    mgr.setGroundMaterial(this.getGroundPlaneCtrl().resolveMaterial())
  }

  private setRotationEnabled(enabled: boolean): void {
    const mgr = this.resolveRotationManager()
    if (mgr && typeof mgr.setCanRotate === "function") {
      mgr.setCanRotate(enabled)
      return
    }
    if (this.rotationManager) {
      print("[GameFlowController] rotationManager has no setCanRotate — check wiring to SafeRotationManager.ts")
    }
  }

  private safeIntro(safeType: SafeType): void {
    if (!this.safePrefab || !this.safeOrigin) {
      return
    }

    this.activeSessionSafeType = safeType

    const safeObject = this.safePrefab.instantiate(this.safeOrigin)
    safeObject.getTransform().setLocalScale(new vec3(0, 0, 0))

    const safeComponent = safeObject.getComponent(Safe.getTypeName()) as ScriptComponent
    const safe = safeComponent as unknown as Safe | null
    if (!safe) {
      return
    }
    this.activeSafeComponent = safe
    safe.init(safeType)

    const finalScale = new vec3(1, 1, 1)
    const overshootScale = new vec3(1.2, 1.2, 1.2)

    this.syncGroundPlaneMaterialToRotationManager()
    this.showGroundPlane()
    global.utils.delay(1, () => {
      global.utils.animateScale(safeObject, true, overshootScale, 0.2, () => {
        global.utils.animateScale(safeObject, true, finalScale, 0.05, () => {
          safe.animationFinished()
          global.playSfx(4, 1, global.appState.checkStorage("masterVolume") * 0.7)
          global.playSfx(5, 1, global.appState.checkStorage("masterVolume") * 0.7)
          global.playSfx(6, 1, global.appState.checkStorage("masterVolume") * 0.7)
          global.playSfx(7, 1, global.appState.checkStorage("masterVolume") * 0.7)
          global.playSfx(8, 1, global.appState.checkStorage("masterVolume") * 0.7)
          this.playSafeLandingVFX()

          this.setRotationEnabled(true)
          safe.beginSolve()
        })
      })
    })
  }

  private async beginNetworkFlow(): Promise<void> {
    const generation = ++this.networkFlowGeneration
    print("[GameFlowController] beginNetworkFlow()")

    const coop = this.coop()
    let ready = false
    if (coop) {
      ready = await coop.ensureReady()
    } else {
      ready = !!global.appState.signedInSnapCloud
    }

    if (generation !== this.networkFlowGeneration) {
      return
    }

    if (!ready) {
      this.networkFlowFailed()
      return
    }

    let code: string | null = null
    try {
      code = coop ? await coop.createNewRoom() : null
    } catch (e) {
      print("[GameFlowController] createNewRoom exception: " + e)
      code = null
    }

    if (generation !== this.networkFlowGeneration) {
      return
    }

    if (!code) {
      this.networkFlowFailed()
      return
    }

    coop?.setupRoomUI(code)
    this.sendGameState(0)
  }

  private networkFlowFailed(): void {
    this.networkFlowGeneration++
    print("[GameFlowController] Network flow failed; returning to menu")
    global.appState.inTransition = false
    this.surfacePlacementActive = false

    const coop = this.coop()
    coop?.stopCameraStream()
    coop?.disconnectFromRoom()

    global.appState.currentState = "mainMenu"
    this.menuController?.showMainMenu()
  }

  private sendGameState(state: number, solvedSeconds?: number): void {
    if (this.activeSessionSafeType !== "coop") {
      return
    }
    this.currentGameState = state
    if (solvedSeconds !== undefined && solvedSeconds !== null) {
      this.solvedSecondsLatest = solvedSeconds
    }
    const coop = this.coop()
    if (!coop) {
      return
    }
    const meta: Record<string, unknown> = {gameState: state}
    if (solvedSeconds !== undefined && solvedSeconds !== null) {
      meta.solvedSeconds = solvedSeconds
    }
    coop.sendCustomMessageWithMeta("", "gameState", meta)
  }

  private stopNetworkStreaming(): void {
    if (this.activeSessionSafeType !== "coop") {
      return
    }
    global.utils.delay(3, () => {
      const coop = this.coop()
      coop?.stopCameraStream()
      coop?.deleteCurrentRoom()
      coop?.disconnectFromRoom()
    })
  }

  private buildStreamMeta(): Record<string, unknown> | null {
    const meta: Record<string, unknown> = {}
    let hasMeta = false

    const timerStr = this.getCurrentTimerString()
    const timerSeconds = this.getCurrentTimerSeconds()
    if (timerStr || timerSeconds !== null) {
      meta.timer = timerStr
      meta.timerSeconds = timerSeconds
      hasMeta = true
    }

    if (this.currentGameState !== null && this.currentGameState !== undefined) {
      meta.gameState = this.currentGameState
      hasMeta = true
      if (this.currentGameState === 3 && this.solvedSecondsLatest !== null) {
        meta.solvedSeconds = this.solvedSecondsLatest
      }
    }

    return hasMeta ? meta : null
  }

  private formatTimerSeconds(totalSeconds: number): string {
    const secs = Math.max(0, Math.floor(totalSeconds || 0))
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    const mm = mins < 10 ? "0" + mins : "" + mins
    const ss = rem < 10 ? "0" + rem : "" + rem
    return mm + ":" + ss
  }

  private getCurrentTimerString(): string | null {
    if (this.activeSafeComponent) {
      return this.formatTimerSeconds(this.activeSafeComponent.getRemainingSeconds())
    }
    return null
  }

  private getCurrentTimerSeconds(): number | null {
    if (this.activeSafeComponent) {
      return this.activeSafeComponent.getRemainingSeconds()
    }
    return null
  }

  private playBoomVfx(): void {
    if (!this.boomVfx || !this.boomVfx.asset) {
      return
    }
    this.boomVfx.asset.properties["burstDuration"] = 0.05 + getTime()
  }

  private playSafeLandingVFX(): void {
    if (!this.tableImpactVFX || !this.tableImpactVFX.asset) {
      return
    }
    this.tableImpactVFX.asset.properties["burstDuration"] = 0.05 + getTime()
  }

}
