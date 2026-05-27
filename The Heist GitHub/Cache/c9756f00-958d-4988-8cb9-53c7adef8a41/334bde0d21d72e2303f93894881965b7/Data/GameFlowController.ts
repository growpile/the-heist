import {Safe} from "./Safe/Safe"
import {CoopNetworkController} from "./CoopNetworkController"
import {MenuController} from "./MenuController"
import {SafeAnchorPlacement} from "./SafeAnchorPlacement"
import {SafeRotationManager} from "./SafeRotationManager"
import {SafeType} from "./Safe/SafeTypes"

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
  cameraAccessHandler: ScriptComponent

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
  private sendToRealtime = false
  private currentGameState = 0
  private solvedSecondsLatest: number | null = null
  private introSkipped = false
  private introCompleted = false
  private skipTweenPlayed = false
  private airPinchCount = 0
  private surfacePlacementActive = false

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
    if (global.appState.inTransition) {
      return
    }
    if (this.volumeSlider) {
      ;(this.volumeSlider as any).currentValue = global.appState.checkStorage("masterVolume")
    }
    if (this.glovesToggle) {
      ;(this.glovesToggle as any).isOn = global.appState.checkStorage("enabledGloves")
    }
    this.menuController?.showOverlay("settings")
  }

  setMasterVolume(value: number): void {
    const volumeMultiplier = value.toFixed(2)
    global.appState.setStorage("masterVolume", volumeMultiplier)
    global.setBgmVolume(parseFloat(volumeMultiplier) * 0.1)
  }

  setGlovesEnabled(value: boolean): void {
    global.appState.setStorage("enabledGloves", value)
    if (this.gloves) {
      this.gloves.enabled = value
    }
  }

  replayTutorial(): void {
    if (global.appState.inTransition) {
      return
    }
    this.menuController?.hide(() => {
      this.safeIntro("tutorial")
    })
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
    this.menuController?.hide(() => {
      if (global.appState.anchorManager) {
        global.appState.anchorManager.resetPlacement()
      }
    })
  }

  textureEncoded(encodedString: string): void {
    if (!this.sendToRealtime || !this.coopNetwork) {
      return
    }

    const timerStr = this.getCurrentTimerString()
    const timerSeconds = this.getCurrentTimerSeconds()
    const meta: Record<string, unknown> = {}
    let hasMeta = false

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

    if (hasMeta) {
      this.coopNetwork.sendCustomMessageWithMeta(encodedString, "defuserTexture", meta)
    } else {
      this.coopNetwork.sendCustomMessage(encodedString, "defuserTexture")
    }
  }

  toggleTextureBroadcast(isOn: boolean): void {
    this.sendToRealtime = isOn
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

    let ready = false
    if (this.coopNetwork) {
      ready = await this.coopNetwork.ensureReady()
    } else {
      ready = !!global.appState.signedInSnapCloud
    }

    if (!ready) {
      this.networkFlowFailed()
      return
    }

    let code: string | null = null
    try {
      code = this.coopNetwork ? await this.coopNetwork.createNewRoom() : null
    } catch (e) {
      print("[GameFlowController] createNewRoom exception: " + e)
      code = null
    }

    if (!code) {
      this.networkFlowFailed()
      return
    }

    this.coopNetwork?.setupRoomUI(code)

    if (this.cameraAccessHandler && typeof (this.cameraAccessHandler as any).startStreaming === "function") {
      ;(this.cameraAccessHandler as any).startStreaming({
        externalScript: this as unknown as ScriptComponent,
        functionName: "textureEncoded",
        output: 1,
        targetFps: 10,
        encodingType: 1,
        compressionQuality: 0,
        includeRenderedContent: true
      })
    }

    this.toggleTextureBroadcast(true)
    this.sendGameState(0)
  }

  private networkFlowFailed(): void {
    print("[GameFlowController] Network flow failed; returning to menu")
    this.toggleTextureBroadcast(false)
    this.menuController?.restoreMainMenuFromRoom(() => {
      this.menuController?.showMainMenu()
    })
  }

  private sendGameState(state: number, solvedSeconds?: number): void {
    this.currentGameState = state
    if (solvedSeconds !== undefined && solvedSeconds !== null) {
      this.solvedSecondsLatest = solvedSeconds
    }
    if (!this.coopNetwork) {
      return
    }
    const meta: Record<string, unknown> = {gameState: state}
    if (solvedSeconds !== undefined && solvedSeconds !== null) {
      meta.solvedSeconds = solvedSeconds
    }
    this.coopNetwork.sendCustomMessageWithMeta("", "gameState", meta)
  }

  private stopNetworkStreaming(): void {
    global.utils.delay(3, () => {
      this.sendToRealtime = false
      if (this.cameraAccessHandler && typeof (this.cameraAccessHandler as any).stopStreaming === "function") {
        ;(this.cameraAccessHandler as any).stopStreaming()
      }
      this.coopNetwork?.deleteCurrentRoom()
      this.coopNetwork?.disconnectFromRoom()
    })
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
