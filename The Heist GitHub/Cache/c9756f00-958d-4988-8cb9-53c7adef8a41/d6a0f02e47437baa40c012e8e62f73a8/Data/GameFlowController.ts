import {Safe} from "./Safe/Safe"
import {CoopNetworkController, type CoopNetworkFacade} from "./CoopNetworkController"
import {MenuController} from "./MenuController"
import {SafeAnchorPlacement} from "./SafeAnchorPlacement"
import {SafeRotationManager} from "./SafeRotationManager"
import {SafeType} from "./Safe/SafeTypes"
import {Slider} from "SpectaclesUIKit.lspkg/Scripts/Components/Slider/Slider"
import {Switch} from "SpectaclesUIKit.lspkg/Scripts/Components/Switch/Switch"

const InteractionHintModule = require("Spectacles3DHandHints.lspkg/Scripts/InteractionHintController")
const {HandAnimationsLibrary, HandMode} = InteractionHintModule

const sikModule = require("SpectaclesInteractionKit.lspkg/SIK")
const SIK = sikModule.SIK || sikModule.default || sikModule
const InteractorTriggerType =
  require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType

@component
export class GameFlowController extends BaseScriptComponent {
  @input
  @allowUndefined
  coopNetwork: CoopNetworkController

  @input
  @allowUndefined
  menuController: MenuController

  @input
  @allowUndefined
  @hint("Scene-attached SafeAnchorPlacement script that runs the surface-placement flow")
  safeAnchorPlacement: SafeAnchorPlacement

  @input
  @allowUndefined
  rotationManager: SafeRotationManager

  @input
  @allowUndefined
  volumeSlider: ScriptComponent

  @input
  @allowUndefined
  glovesToggle: ScriptComponent

  @input
  @allowUndefined
  interactionHintController: ScriptComponent

  @input
  safePrefab: ObjectPrefab

  @input
  @allowUndefined
  safeOrigin: SceneObject

  @input
  @allowUndefined
  tweens: SceneObject

  @input
  @allowUndefined
  anchorManager: SceneObject

  @input
  tableGridMaterial: Material

  @input
  @allowUndefined
  gloves: SceneObject

  @input
  @allowUndefined
  tableImpactVFX: VFXComponent

  @input
  @allowUndefined
  boomVfx: VFXComponent

  private activeSafeComponent: Safe | null = null
  private currentGameState = 0
  private solvedSecondsLatest: number | null = null
  private introSkipped = false
  private introCompleted = false
  private skipTweenPlayed = false
  private airPinchCount = 0
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

    this.createEvent("OnStartEvent").bind(() => this.startEvent())
    this.createEvent("UpdateEvent").bind(() => this.checkAirPinchSkip())
  }

  playareaPositioned(): void {
    print("Play Area Positioned.")
    this.menuController?.showMainMenu(() => {
      print("Menu shown")
    })
  }

  /** Main menu Solo Play → tips step, then startGame for anchoring. */
  startSolo(): void {
    if (global.appState.inTransition || this.surfacePlacementActive) {
      return
    }
    print("[GameFlowController] startSolo() → tips")
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1)
    this.menuController?.requestSoloTips()
  }

  /** Tips Start button → hide menu and run surface placement. */
  startGame(): void {
    if (global.appState.inTransition || this.surfacePlacementActive) {
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
    if (global.appState.inTransition || this.surfacePlacementActive) {
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
    if (global.appState.inTransition || this.surfacePlacementActive) {
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

  handleSafeComplete(safeType: SafeType, solvedInSeconds: number): void {
    print(safeType)
    this.menuController?.setSolvedSeconds(solvedInSeconds)

    global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25)
    global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 0, 0.25)
    global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9)

    const safeObject = global.appState.safe?.object
    if (!safeObject) {
      return
    }

    global.utils.animateScale(safeObject, true, new vec3(0, 0, 0), 0.25, () => {
      safeObject.destroy()

      switch (safeType) {
        case "tutorial":
          global.appState.currentState = "tutorialWinPostGame"
          this.menuController?.showOverlay("tutorialSolved")
          break
        case "solo":
          global.appState.currentState = "winPostGame"
          this.menuController?.showOverlay("solved")
          break
        case "coop":
          global.appState.currentState = "winPostGame"
          this.menuController?.showOverlay("solved")
          this.sendGameState(3, solvedInSeconds)
          this.stopNetworkStreaming()
          break
      }
    })
  }

  handleSafeFailed(): void {
    global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25)
    global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 0, 0.25)

    global.utils.delay(0.1, () => {
      this.playBoomVfx()
      global.playSfx(28, 1, global.appState.checkStorage("masterVolume") * 0.9)
    })

    const safeObject = global.appState.safe?.object
    if (!safeObject) {
      return
    }

    global.utils.animateScale(safeObject, true, new vec3(0, 0, 0), 0.25, () => {
      safeObject.destroy()
      global.appState.currentState = "losePostGame"
      this.menuController?.showOverlay("timed")
      this.sendGameState(2)
      this.stopNetworkStreaming()
    })
  }

  backToMenu(): void {
    const state = global.appState.currentState
    if (
      state === "winPostGame" ||
      state === "losePostGame" ||
      state === "tutorialWinPostGame"
    ) {
      this.menuController?.showMainMenu()
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

  /**
   * Reload persisted values into UIKit controls.
   * Inputs on GameFlowController (Inspector): volumeSlider → Slider under Settings Panel;
   * glovesToggle → Switch on "3D Gloves Toggle".
   */
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
    this.menuController?.hideForGameplay(() => {
      if (global.appState.anchorManager) {
        global.appState.anchorManager.resetPlacement()
      }
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
    this.introLogoSequence()
    global.setBgmVolume(0.1 * global.appState.checkStorage("masterVolume"))
    if (this.gloves) {
      this.gloves.enabled = global.appState.checkStorage("enabledGloves")
    }
  }

  /** Supports TS SafeRotationManager (AssignableType) and legacy JS script API. */
  private setRotationEnabled(enabled: boolean): void {
    const rm = this.rotationManager as any
    if (!rm) {
      return
    }
    if (typeof rm.setCanRotate === "function") {
      rm.setCanRotate(enabled)
      return
    }
    const sceneObject = rm.getSceneObject?.() as SceneObject | undefined
    if (!sceneObject) {
      print("[GameFlowController] rotationManager has no setCanRotate — check wiring to SafeRotationManager.ts")
      return
    }
    const comp = sceneObject.getComponent(SafeRotationManager.getTypeName()) as ScriptComponent
    const mgr = comp as unknown as SafeRotationManager | null
    if (mgr && typeof mgr.setCanRotate === "function") {
      mgr.setCanRotate(enabled)
      return
    }
    print("[GameFlowController] rotationManager has no setCanRotate — check wiring to SafeRotationManager.ts")
  }

  private safeIntro(safeType: SafeType): void {
    if (!this.safePrefab || !this.safeOrigin) {
      return
    }

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

    global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 1, 0.25)
    global.utils.delay(1, () => {
      global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 1, 0.25)

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
    print("[GameFlowController] beginNetworkFlow()")

    const coop = this.coop()
    let ready = false
    if (coop) {
      ready = await coop.ensureReady()
    } else {
      ready = !!global.appState.signedInSnapCloud
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

    if (!code) {
      this.networkFlowFailed()
      return
    }

    coop?.setupRoomUI(code)
    this.sendGameState(0)
  }

  private networkFlowFailed(): void {
    print("[GameFlowController] Network flow failed; returning to menu")
    this.coop()?.stopCameraStream()
    global.appState.currentState = "mainMenu"
    this.menuController?.returnToMainMenu()
  }

  private sendGameState(state: number, solvedSeconds?: number): void {
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

  private introLogoSequence(): void {
    if (this.introSkipped) {
      return
    }
    if (!this.tweens) {
      print("[GameFlowController] No tweens input wired — skipping intro, showing menu")
      this.introCompleted = true
      this.playareaSetup()
      return
    }
    global.tweenManager.startTween(this.tweens, "intro-label-fade-in")
    global.utils.delay(1, () => {
      if (this.introSkipped) {
        return
      }
      global.tweenManager.startTween(this.tweens, "intro-logo-fade-in")
      global.utils.delay(3, () => {
        if (this.introSkipped) {
          return
        }
        global.tweenManager.startTween(this.tweens, "intro-label-fade-out")
        global.tweenManager.startTween(this.tweens, "intro-logo-fade-out", () => {
          if (this.introSkipped) {
            return
          }
          global.utils.delay(0.25, () => {
            if (this.introSkipped) {
              return
            }
            global.tweenManager.startTween(this.tweens, "intro-table-hint-fade-in", () => {
              if (this.introSkipped) {
                return
              }
              global.utils.delay(1, () => {
                if (this.introSkipped) {
                  return
                }
                global.tweenManager.startTween(this.tweens, "intro-scale-down", () => {
                  if (this.introSkipped) {
                    return
                  }
                  this.introCompleted = true
                  this.playareaSetup()
                })
              })
            })
          })
        })
      })
    })
  }

  private skipIntro(): void {
    if (this.introSkipped || this.introCompleted || !this.tweens) {
      return
    }
    this.introSkipped = true
    global.tweenManager.startTween(this.tweens, "intro-scale-down", () => {
      this.introCompleted = true
      this.playareaSetup()
    })
  }

  private checkAirPinchSkip(): void {
    if (this.introSkipped || this.introCompleted || !SIK) {
      return
    }
    const interactorList = SIK.InteractionManager.getTargetingInteractors()
    if (!interactorList || interactorList.length === 0) {
      return
    }
    for (const interactor of interactorList) {
      if (!interactor) {
        continue
      }
      if (
        interactor.previousTrigger === InteractorTriggerType.None &&
        interactor.currentTrigger !== InteractorTriggerType.None
      ) {
        const hitInfo = interactor.targetHitInfo
        const hasTarget = hitInfo && hitInfo.hit && hitInfo.hit.collider
        if (!hasTarget) {
          this.airPinchCount++
          if (this.airPinchCount === 1 && !this.skipTweenPlayed && this.tweens) {
            this.skipTweenPlayed = true
            global.tweenManager.startTween(this.tweens, "skip-intro-hint-in")
          } else if (this.airPinchCount >= 2) {
            this.skipIntro()
          }
          return
        }
      }
    }
  }

  private playareaSetup(): void {
    this.menuController?.showMainMenu()
  }
}
