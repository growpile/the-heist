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
const FLOW_DEBUG_LOGS = false

/** Session flow: menu steps, placement, safe spawn, win/fail, settings. */
@component
export class GameFlowController extends BaseScriptComponent {
  @ui.separator
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
  safeAnchorPlacement: SafeAnchorPlacement

  @input
  @allowUndefined
  rotationManager: SafeRotationManager

  @input
  @allowUndefined
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
  /** Settings tab opened — sync slider/toggle from storage without firing callbacks. */
  onSettingsTabSelected(): void {
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
    this.menuController?.showMainMenu()
  }

  /** Main menu Solo Play → tips step, then startGame for anchoring. */
  startSolo(): void {
    if (this.isFlowBusy()) {
      return
    }
    this.logFlow("startSolo → tips")
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
      this.logFlow("startGame skipped — no pending safe type")
      return
    }

    this.logFlow("startGame → " + safeType)
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)

    this.menuController?.hideForGameplay(() => {
      this.logFlow("startGame hideForGameplay done — surface placement")
      this.beginSurfacePlacement(safeType)
    })
  }

  private logFlow(message: string): void {
    if (!FLOW_DEBUG_LOGS) {
      return
    }
    print("[GameFlow] " + message)
  }

  private beginSurfacePlacement(safeType: SafeType): void {
    if (!this.safeAnchorPlacement) {
      this.logFlow("No safeAnchorPlacement — direct safe intro")
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

    this.logFlow("createRoom")
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

    this.logFlow("startOnlineGame")
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
      const prefabRoot = global.appState.safe?.object
      this.hideSafePrefabForMenuReturn(prefabRoot)
      this.exitGameplaySession()
      return
    }
    this.safeCompleteExitInProgress = true
    this.networkFlowGeneration++
    this.stopTutorialHint()

    this.logFlow("handleSafeComplete — " + safeType)
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

    const solveDurationSeconds =
      typeof (this.activeSafeComponent as any)?.getSolveDurationSeconds === "function"
        ? ((this.activeSafeComponent as any).getSolveDurationSeconds() as number)
        : solvedInSeconds
    const bombTimerSeconds =
      typeof (this.activeSafeComponent as any)?.getBombTimerSeconds === "function"
        ? ((this.activeSafeComponent as any).getBombTimerSeconds() as number)
        : 0
    const penaltyCount =
      typeof (this.activeSafeComponent as any)?.getPenaltyCount === "function"
        ? ((this.activeSafeComponent as any).getPenaltyCount() as number)
        : 0

    this.logFlow("handleSafeComplete — post-game UI")
    this.presentPostGameWin(safeType, solveDurationSeconds, bombTimerSeconds, penaltyCount)
  }

  handleSafeFailed(): void {
    if (this.safeFailExitInProgress) {
      const prefabRoot = global.appState.safe?.object
      this.hideSafePrefabForMenuReturn(prefabRoot)
      this.exitGameplaySession()
      return
    }
    this.safeFailExitInProgress = true
    this.networkFlowGeneration++
    this.stopTutorialHint()

    this.setRotationEnabled(false)
    this.activeSafeComponent?.endSession()

    const prefabRoot = global.appState.safe?.object

    this.getGroundPlaneCtrl().hide()
    if (this.activeSessionSafeType === "coop") {
      this.sendGameState(2)
      this.stopNetworkStreaming()
    }

    if (!this.menuController) {
      this.logFlow("handleSafeFailed — no menuController")
      this.exitGameplaySession()
      this.scheduleDestroySafePrefab(prefabRoot, () => {
        this.safeFailExitInProgress = false
      })
      return
    }

    print("[GameFlowController] handleSafeFailed — presenting post-game UI")
    this.presentPostGameFail()
  }

  /** Win: scale safe away, then show MenuController post-game panel. */
  presentPostGameWin(
    safeType: SafeType,
    solveDurationSeconds: number,
    bombTimerSeconds: number,
    penaltyCount: number
  ): void {
    this.stopTutorialHint()
    this.setRotationEnabled(false)
    this.activeSafeComponent?.endSession()
    const prefabRoot = global.appState.safe?.object
    if (!this.menuController || !prefabRoot) {
      this.safeCompleteExitInProgress = false
      this.exitGameplaySession()
      return
    }

    this.scaleSafeRootAway(() => {
      this.hideSafePrefabForMenuReturn(prefabRoot)
      this.hideSurfaceAnchorForMenu()
      this.menuController!.showPostGameSession({
        outcome: "win",
        solveDurationSeconds,
        bombTimerSeconds,
        penaltyCount,
        onMenu: () => {
          this.logFlow("post-game win menu pressed")
          this.menuController?.hidePostGameSession()
          this.exitGameplaySession()
        }
      })
      this.scheduleDestroySafePrefab(prefabRoot, () => {
        this.safeCompleteExitInProgress = false
      })
    })
  }

  /** Fail: boom + shrink plane + scale safe away, then show MenuController post-game panel. */
  presentPostGameFail(): void {
    this.stopTutorialHint()
    this.setRotationEnabled(false)
    this.activeSafeComponent?.endSession()
    const prefabRoot = global.appState.safe?.object
    if (!this.menuController || !prefabRoot) {
      this.safeFailExitInProgress = false
      this.exitGameplaySession()
      return
    }

    this.playFailExplosionAndScaleAway(() => {
      this.hideSafePrefabForMenuReturn(prefabRoot)
      this.hideSurfaceAnchorForMenu()
      this.menuController!.showPostGameSession({
        outcome: "fail",
        onMenu: () => {
          this.logFlow("post-game fail menu pressed")
          this.menuController?.hidePostGameSession()
          this.exitGameplaySession()
        }
      })
      this.scheduleDestroySafePrefab(prefabRoot, () => {
        this.safeFailExitInProgress = false
      })
    })
  }

  /** Hide the safe instance immediately so post-game UI does not cover the menu. */
  private hideSafePrefabForMenuReturn(prefabRoot: SceneObject | undefined): void {
    if (!prefabRoot) {
      return
    }
    prefabRoot.enabled = false
  }

  private exitGameplaySession(afterMenu?: () => void): void {
    this.logFlow(
      "exitGameplaySession appState=" +
        global.appState.currentState +
        " menuVisible=" +
        (this.menuController?.isVisible() ?? "n/a") +
        " sessionType=" +
        (this.activeSessionSafeType ?? "none")
    )
    global.appState.inTransition = false
    global.appState.currentState = "mainMenu"
    this.activeSessionSafeType = null
    this.surfacePlacementActive = false
    this.stopTutorialHint()
    this.hideSurfaceAnchorForMenu()

    if (!this.menuController) {
      this.logFlow("exitGameplaySession — no menuController")
      afterMenu?.()
      return
    }
    this.menuController.returnFromGameplay(() => {
      this.logFlow("exitGameplaySession — returnFromGameplay done")
      afterMenu?.()
    })
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
      if (prefabRoot && global.utils?.cancelObjectAnimations) {
        global.utils.cancelObjectAnimations(prefabRoot)
      }
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

    if (global.utils?.cancelObjectAnimations) {
      global.utils.cancelObjectAnimations(scaleTarget)
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
        const prefabRoot = global.appState.safe?.object
        this.hideSafePrefabForMenuReturn(prefabRoot)
        this.exitGameplaySession()
        return
      }
      const safeType = this.activeSessionSafeType ?? "solo"
      this.handleSafeComplete(safeType, 0)
    }
  }

  /** Legacy entry — opens settings overlay on the menu. */
  openSettings(): void {
    if (global.appState.inTransition || !this.menuController) {
      return
    }
    this.suppressSettingsControlCallbacksUntil = getTime() + 0.25
    this.menuController.showOverlay("settings", () => {
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
  private syncSettingsControlsFromStorage(_phase: string): void {
    const volume = this.readPersistedSetting("masterVolume") as number
    const glovesOn = this.readPersistedSetting("enabledGloves") as boolean

    const slider = this.getVolumeSlider()
    if (slider) {
      slider.updateCurrentValue(volume, false)
    }

    const glovesSwitch = this.getGlovesSwitch()
    if (glovesSwitch) {
      glovesSwitch.isOn = glovesOn
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
    if (ctrl.handHints) {
      ctrl.handHints.enabled = true
    }
    const root = this.interactionHintController.getSceneObject()
    if (root) {
      root.enabled = true
    }
    if (typeof ctrl.playHintAnimation === "function") {
      ctrl.playHintAnimation(HandMode.Right, HandAnimationsLibrary.Right.PalmTouchSurface, 1, 0.3)
    }
  }

  private stopTutorialHint(): void {
    if (!this.interactionHintController) {
      return
    }
    const ctrl = this.interactionHintController as any

    ctrl.numberOfLoops = 0
    ctrl.loopsPlayed = Number.MAX_SAFE_INTEGER
    ctrl.clipsToPlay = []

    if (ctrl.animationEndEvent && typeof ctrl.animationEndEvent.reset === "function") {
      ctrl.animationEndEvent.reset(0)
    }

    if (ctrl.animationPlayer) {
      const player = ctrl.animationPlayer as AnimationPlayer & {stop?: () => void}
      if (ctrl.currentAnimationName) {
        player.setClipEnabled(ctrl.currentAnimationName, false)
      }
      if (typeof player.stop === "function") {
        player.stop()
      }
    }

    if (ctrl.animationPlayerClipEndEvent && ctrl.animationPlayer?.onEvent?.remove) {
      ctrl.animationPlayer.onEvent.remove(ctrl.animationPlayerClipEndEvent)
      ctrl.animationPlayerClipEndEvent = null
    }

    const cancelTween = (tween: {stop?: () => void} | null | undefined) => {
      tween?.stop?.()
    }
    cancelTween(ctrl.left_outlineFadeTween)
    cancelTween(ctrl.right_outlineFadeTween)
    cancelTween(ctrl.current_tween)
    ctrl.left_outlineFadeTween = null
    ctrl.right_outlineFadeTween = null
    ctrl.current_tween = null

    if (ctrl.leftHandMesh) {
      ctrl.leftHandMesh.enabled = false
    }
    if (ctrl.rightHandMesh) {
      ctrl.rightHandMesh.enabled = false
    }
    if (ctrl.cursor) {
      ctrl.cursor.enabled = false
    }
    if (ctrl.handHints) {
      ctrl.handHints.enabled = false
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
