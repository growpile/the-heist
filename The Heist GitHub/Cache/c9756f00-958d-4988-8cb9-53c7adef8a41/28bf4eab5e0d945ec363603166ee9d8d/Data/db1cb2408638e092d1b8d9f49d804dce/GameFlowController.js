"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameFlowController = void 0;
var __selfType = requireType("./GameFlowController");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const Safe_1 = require("./Safe/Safe");
const SafeRotationManager_1 = require("./SafeRotationManager");
const InteractionHintModule = require("Spectacles3DHandHints.lspkg/Scripts/InteractionHintController");
const { HandAnimationsLibrary, HandMode } = InteractionHintModule;
const sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
const SIK = sikModule.SIK || sikModule.default || sikModule;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
let GameFlowController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var GameFlowController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.coopNetwork = this.coopNetwork;
            this.menuController = this.menuController;
            this.safeAnchorPlacement = this.safeAnchorPlacement;
            this.rotationManager = this.rotationManager;
            this.volumeSlider = this.volumeSlider;
            this.glovesToggle = this.glovesToggle;
            this.interactionHintController = this.interactionHintController;
            this.safePrefab = this.safePrefab;
            this.safeOrigin = this.safeOrigin;
            this.tweens = this.tweens;
            this.anchorManager = this.anchorManager;
            this.tableGridMaterial = this.tableGridMaterial;
            this.gloves = this.gloves;
            this.tableImpactVFX = this.tableImpactVFX;
            this.boomVfx = this.boomVfx;
            this.activeSafeComponent = null;
            this.currentGameState = 0;
            this.solvedSecondsLatest = null;
            this.introSkipped = false;
            this.introCompleted = false;
            this.skipTweenPlayed = false;
            this.airPinchCount = 0;
            this.surfacePlacementActive = false;
        }
        __initialize() {
            super.__initialize();
            this.coopNetwork = this.coopNetwork;
            this.menuController = this.menuController;
            this.safeAnchorPlacement = this.safeAnchorPlacement;
            this.rotationManager = this.rotationManager;
            this.volumeSlider = this.volumeSlider;
            this.glovesToggle = this.glovesToggle;
            this.interactionHintController = this.interactionHintController;
            this.safePrefab = this.safePrefab;
            this.safeOrigin = this.safeOrigin;
            this.tweens = this.tweens;
            this.anchorManager = this.anchorManager;
            this.tableGridMaterial = this.tableGridMaterial;
            this.gloves = this.gloves;
            this.tableImpactVFX = this.tableImpactVFX;
            this.boomVfx = this.boomVfx;
            this.activeSafeComponent = null;
            this.currentGameState = 0;
            this.solvedSecondsLatest = null;
            this.introSkipped = false;
            this.introCompleted = false;
            this.skipTweenPlayed = false;
            this.airPinchCount = 0;
            this.surfacePlacementActive = false;
        }
        /** Lens Studio AssignableType omits methods; use facade for network + stream API. */
        coop() {
            return this.coopNetwork ?? null;
        }
        onAwake() {
            global.safeComplete = (safeType, solvedInSeconds) => {
                this.handleSafeComplete(safeType, solvedInSeconds);
            };
            global.safeFailed = () => {
                this.handleSafeFailed();
            };
            global.trySignIn = async () => {
                if (!this.coopNetwork) {
                    return false;
                }
                return await this.coopNetwork.trySignIn();
            };
            global.leftRotateHint = () => {
                this.playTutorialHint();
            };
            this.createEvent("OnStartEvent").bind(() => this.startEvent());
            this.createEvent("UpdateEvent").bind(() => this.checkAirPinchSkip());
        }
        playareaPositioned() {
            print("Play Area Positioned.");
            this.menuController?.showMainMenu(() => {
                print("Menu shown");
            });
        }
        /** Main menu Solo Play → tips step, then startGame for anchoring. */
        startSolo() {
            if (global.appState.inTransition || this.surfacePlacementActive) {
                return;
            }
            print("[GameFlowController] startSolo() → tips");
            global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
            this.menuController?.requestSoloTips();
        }
        /** Tips Start button → hide menu and run surface placement. */
        startGame() {
            if (global.appState.inTransition || this.surfacePlacementActive) {
                return;
            }
            const safeType = this.menuController?.consumePendingSafeType();
            if (!safeType) {
                print("[GameFlowController] startGame() skipped — no pending safe type");
                return;
            }
            print("[GameFlowController] startGame() → " + safeType);
            global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
            this.menuController?.hideForGameplay(() => {
                this.beginSurfacePlacement(safeType);
            });
        }
        beginSurfacePlacement(safeType) {
            if (!this.safeAnchorPlacement) {
                print("[GameFlowController] No safeAnchorPlacement input wired; falling back to direct safe intro");
                this.safeIntro(safeType);
                return;
            }
            this.surfacePlacementActive = true;
            const placementRoot = this.safeAnchorPlacement.getSceneObject();
            if (placementRoot) {
                placementRoot.enabled = true;
            }
            if (this.safeOrigin) {
                this.safeOrigin.enabled = false;
            }
            this.safeAnchorPlacement.startPlacement((pos, rot) => this.onSurfacePlaced(safeType, pos, rot), (pos) => this.onSurfaceSliderUpdated(pos));
        }
        onSurfaceSliderUpdated(pos) {
            if (!this.safeOrigin) {
                return;
            }
            this.safeOrigin.getTransform().setWorldPosition(pos);
        }
        onSurfacePlaced(safeType, pos, rot) {
            this.surfacePlacementActive = false;
            if (this.safeOrigin) {
                const originTransform = this.safeOrigin.getTransform();
                originTransform.setWorldPosition(pos);
                originTransform.setWorldRotation(rot);
                this.safeOrigin.enabled = true;
            }
            this.safeIntro(safeType);
        }
        /** Main menu Create Room → online room step, then networking. */
        createRoom() {
            if (global.appState.inTransition || this.surfacePlacementActive) {
                return;
            }
            print("[GameFlowController] createRoom()");
            global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
            global.appState.inTransition = true;
            this.menuController?.requestOnlineRoom(() => {
                global.appState.inTransition = false;
                global.appState.currentState = "coopPlay";
                this.beginNetworkFlow();
            });
        }
        /** Legacy scene callback name for coop tab Create Room button. */
        teamPlay() {
            this.createRoom();
        }
        startTeam() {
            this.createRoom();
        }
        /** Online room Start button → anchoring + coop safe. */
        startOnlineGame() {
            if (global.appState.inTransition || this.surfacePlacementActive) {
                return;
            }
            print("[GameFlowController] startOnlineGame()");
            global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
            this.coop()?.setStreamMetaProvider(() => this.buildStreamMeta());
            this.coop()?.startCameraStream();
            this.menuController?.hideForGameplay(() => {
                this.sendGameState(1);
                this.beginSurfacePlacement("coop");
            });
        }
        /** Legacy scene callback names. */
        startTeamSession() {
            this.startOnlineGame();
        }
        playersReady() {
            this.startOnlineGame();
        }
        beginSolveTutorial() {
            this.startGame();
        }
        beginSolveSolo() {
            this.startGame();
        }
        beginSolveCoop() {
            this.startOnlineGame();
        }
        handleSafeComplete(safeType, solvedInSeconds) {
            print(safeType);
            this.menuController?.setSolvedSeconds(solvedInSeconds);
            global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
            global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 0, 0.25);
            global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9);
            const safeObject = global.appState.safe?.object;
            if (!safeObject) {
                return;
            }
            global.utils.animateScale(safeObject, true, new vec3(0, 0, 0), 0.25, () => {
                safeObject.destroy();
                switch (safeType) {
                    case "tutorial":
                        global.appState.currentState = "tutorialWinPostGame";
                        this.menuController?.showOverlay("tutorialSolved");
                        break;
                    case "solo":
                        global.appState.currentState = "winPostGame";
                        this.menuController?.showOverlay("solved");
                        break;
                    case "coop":
                        global.appState.currentState = "winPostGame";
                        this.menuController?.showOverlay("solved");
                        this.sendGameState(3, solvedInSeconds);
                        this.stopNetworkStreaming();
                        break;
                }
            });
        }
        handleSafeFailed() {
            global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
            global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 0, 0.25);
            global.utils.delay(0.1, () => {
                this.playBoomVfx();
                global.playSfx(28, 1, global.appState.checkStorage("masterVolume") * 0.9);
            });
            const safeObject = global.appState.safe?.object;
            if (!safeObject) {
                return;
            }
            global.utils.animateScale(safeObject, true, new vec3(0, 0, 0), 0.25, () => {
                safeObject.destroy();
                global.appState.currentState = "losePostGame";
                this.menuController?.showOverlay("timed");
                this.sendGameState(2);
                this.stopNetworkStreaming();
            });
        }
        backToMenu() {
            const state = global.appState.currentState;
            if (state === "winPostGame" ||
                state === "losePostGame" ||
                state === "tutorialWinPostGame") {
                this.menuController?.showMainMenu();
            }
        }
        openSettings() {
            if (global.appState.inTransition) {
                return;
            }
            if (this.volumeSlider) {
                ;
                this.volumeSlider.currentValue = global.appState.checkStorage("masterVolume");
            }
            if (this.glovesToggle) {
                ;
                this.glovesToggle.isOn = global.appState.checkStorage("enabledGloves");
            }
            this.menuController?.showOverlay("settings");
        }
        setMasterVolume(value) {
            const volumeMultiplier = value.toFixed(2);
            global.appState.setStorage("masterVolume", volumeMultiplier);
            global.setBgmVolume(parseFloat(volumeMultiplier) * 0.1);
        }
        setGlovesEnabled(value) {
            global.appState.setStorage("enabledGloves", value);
            if (this.gloves) {
                this.gloves.enabled = value;
            }
        }
        replayTutorial() {
            if (global.appState.inTransition) {
                return;
            }
            print("[GameFlowController] replayTutorial() → tutorial tips");
            global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
            this.menuController?.requestTutorialTips();
        }
        exitSettings(callback) {
            if (global.appState.inTransition) {
                return;
            }
            this.menuController?.showMainMenu(callback);
        }
        rescanSurface() {
            if (global.appState.inTransition) {
                return;
            }
            this.menuController?.hideForGameplay(() => {
                if (global.appState.anchorManager) {
                    global.appState.anchorManager.resetPlacement();
                }
            });
        }
        playTutorialHint() {
            if (!this.interactionHintController) {
                return;
            }
            const ctrl = this.interactionHintController;
            if (typeof ctrl.playHintAnimation === "function") {
                ctrl.playHintAnimation(HandMode.Right, HandAnimationsLibrary.Right.PalmTouchSurface, 1, 0.3);
            }
        }
        startEvent() {
            this.introLogoSequence();
            global.setBgmVolume(0.1 * global.appState.checkStorage("masterVolume"));
            if (this.gloves) {
                this.gloves.enabled = global.appState.checkStorage("enabledGloves");
            }
        }
        /** Supports TS SafeRotationManager (AssignableType) and legacy JS script API. */
        setRotationEnabled(enabled) {
            const rm = this.rotationManager;
            if (!rm) {
                return;
            }
            if (typeof rm.setCanRotate === "function") {
                rm.setCanRotate(enabled);
                return;
            }
            const sceneObject = rm.getSceneObject?.();
            if (!sceneObject) {
                print("[GameFlowController] rotationManager has no setCanRotate — check wiring to SafeRotationManager.ts");
                return;
            }
            const comp = sceneObject.getComponent(SafeRotationManager_1.SafeRotationManager.getTypeName());
            const mgr = comp;
            if (mgr && typeof mgr.setCanRotate === "function") {
                mgr.setCanRotate(enabled);
                return;
            }
            print("[GameFlowController] rotationManager has no setCanRotate — check wiring to SafeRotationManager.ts");
        }
        safeIntro(safeType) {
            if (!this.safePrefab || !this.safeOrigin) {
                return;
            }
            const safeObject = this.safePrefab.instantiate(this.safeOrigin);
            safeObject.getTransform().setLocalScale(new vec3(0, 0, 0));
            const safeComponent = safeObject.getComponent(Safe_1.Safe.getTypeName());
            const safe = safeComponent;
            if (!safe) {
                return;
            }
            this.activeSafeComponent = safe;
            safe.init(safeType);
            const finalScale = new vec3(1, 1, 1);
            const overshootScale = new vec3(1.2, 1.2, 1.2);
            global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.opacityMultiplier", 1, 0.25);
            global.utils.delay(1, () => {
                global.utils.animateMaterialProperty(this.tableGridMaterial, "mainPass.size", 1, 0.25);
                global.utils.animateScale(safeObject, true, overshootScale, 0.2, () => {
                    global.utils.animateScale(safeObject, true, finalScale, 0.05, () => {
                        safe.animationFinished();
                        global.playSfx(4, 1, global.appState.checkStorage("masterVolume") * 0.7);
                        global.playSfx(5, 1, global.appState.checkStorage("masterVolume") * 0.7);
                        global.playSfx(6, 1, global.appState.checkStorage("masterVolume") * 0.7);
                        global.playSfx(7, 1, global.appState.checkStorage("masterVolume") * 0.7);
                        global.playSfx(8, 1, global.appState.checkStorage("masterVolume") * 0.7);
                        this.playSafeLandingVFX();
                        this.setRotationEnabled(true);
                        safe.beginSolve();
                    });
                });
            });
        }
        async beginNetworkFlow() {
            print("[GameFlowController] beginNetworkFlow()");
            const coop = this.coop();
            let ready = false;
            if (coop) {
                ready = await coop.ensureReady();
            }
            else {
                ready = !!global.appState.signedInSnapCloud;
            }
            if (!ready) {
                this.networkFlowFailed();
                return;
            }
            let code = null;
            try {
                code = coop ? await coop.createNewRoom() : null;
            }
            catch (e) {
                print("[GameFlowController] createNewRoom exception: " + e);
                code = null;
            }
            if (!code) {
                this.networkFlowFailed();
                return;
            }
            this.coopNetwork?.setupRoomUI(code);
            this.sendGameState(0);
        }
        networkFlowFailed() {
            print("[GameFlowController] Network flow failed; returning to menu");
            this.coopNetwork?.stopCameraStream();
            global.appState.currentState = "mainMenu";
            this.menuController?.returnToMainMenu();
        }
        sendGameState(state, solvedSeconds) {
            this.currentGameState = state;
            if (solvedSeconds !== undefined && solvedSeconds !== null) {
                this.solvedSecondsLatest = solvedSeconds;
            }
            if (!this.coopNetwork) {
                return;
            }
            const meta = { gameState: state };
            if (solvedSeconds !== undefined && solvedSeconds !== null) {
                meta.solvedSeconds = solvedSeconds;
            }
            this.coopNetwork.sendCustomMessageWithMeta("", "gameState", meta);
        }
        stopNetworkStreaming() {
            global.utils.delay(3, () => {
                this.coopNetwork?.stopCameraStream();
                this.coopNetwork?.deleteCurrentRoom();
                this.coopNetwork?.disconnectFromRoom();
            });
        }
        buildStreamMeta() {
            const meta = {};
            let hasMeta = false;
            const timerStr = this.getCurrentTimerString();
            const timerSeconds = this.getCurrentTimerSeconds();
            if (timerStr || timerSeconds !== null) {
                meta.timer = timerStr;
                meta.timerSeconds = timerSeconds;
                hasMeta = true;
            }
            if (this.currentGameState !== null && this.currentGameState !== undefined) {
                meta.gameState = this.currentGameState;
                hasMeta = true;
                if (this.currentGameState === 3 && this.solvedSecondsLatest !== null) {
                    meta.solvedSeconds = this.solvedSecondsLatest;
                }
            }
            return hasMeta ? meta : null;
        }
        formatTimerSeconds(totalSeconds) {
            const secs = Math.max(0, Math.floor(totalSeconds || 0));
            const mins = Math.floor(secs / 60);
            const rem = secs % 60;
            const mm = mins < 10 ? "0" + mins : "" + mins;
            const ss = rem < 10 ? "0" + rem : "" + rem;
            return mm + ":" + ss;
        }
        getCurrentTimerString() {
            if (this.activeSafeComponent) {
                return this.formatTimerSeconds(this.activeSafeComponent.getRemainingSeconds());
            }
            return null;
        }
        getCurrentTimerSeconds() {
            if (this.activeSafeComponent) {
                return this.activeSafeComponent.getRemainingSeconds();
            }
            return null;
        }
        playBoomVfx() {
            if (!this.boomVfx || !this.boomVfx.asset) {
                return;
            }
            this.boomVfx.asset.properties["burstDuration"] = 0.05 + getTime();
        }
        playSafeLandingVFX() {
            if (!this.tableImpactVFX || !this.tableImpactVFX.asset) {
                return;
            }
            this.tableImpactVFX.asset.properties["burstDuration"] = 0.05 + getTime();
        }
        introLogoSequence() {
            if (this.introSkipped) {
                return;
            }
            if (!this.tweens) {
                print("[GameFlowController] No tweens input wired — skipping intro, showing menu");
                this.introCompleted = true;
                this.playareaSetup();
                return;
            }
            global.tweenManager.startTween(this.tweens, "intro-label-fade-in");
            global.utils.delay(1, () => {
                if (this.introSkipped) {
                    return;
                }
                global.tweenManager.startTween(this.tweens, "intro-logo-fade-in");
                global.utils.delay(3, () => {
                    if (this.introSkipped) {
                        return;
                    }
                    global.tweenManager.startTween(this.tweens, "intro-label-fade-out");
                    global.tweenManager.startTween(this.tweens, "intro-logo-fade-out", () => {
                        if (this.introSkipped) {
                            return;
                        }
                        global.utils.delay(0.25, () => {
                            if (this.introSkipped) {
                                return;
                            }
                            global.tweenManager.startTween(this.tweens, "intro-table-hint-fade-in", () => {
                                if (this.introSkipped) {
                                    return;
                                }
                                global.utils.delay(1, () => {
                                    if (this.introSkipped) {
                                        return;
                                    }
                                    global.tweenManager.startTween(this.tweens, "intro-scale-down", () => {
                                        if (this.introSkipped) {
                                            return;
                                        }
                                        this.introCompleted = true;
                                        this.playareaSetup();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
        skipIntro() {
            if (this.introSkipped || this.introCompleted || !this.tweens) {
                return;
            }
            this.introSkipped = true;
            global.tweenManager.startTween(this.tweens, "intro-scale-down", () => {
                this.introCompleted = true;
                this.playareaSetup();
            });
        }
        checkAirPinchSkip() {
            if (this.introSkipped || this.introCompleted || !SIK) {
                return;
            }
            const interactorList = SIK.InteractionManager.getTargetingInteractors();
            if (!interactorList || interactorList.length === 0) {
                return;
            }
            for (const interactor of interactorList) {
                if (!interactor) {
                    continue;
                }
                if (interactor.previousTrigger === InteractorTriggerType.None &&
                    interactor.currentTrigger !== InteractorTriggerType.None) {
                    const hitInfo = interactor.targetHitInfo;
                    const hasTarget = hitInfo && hitInfo.hit && hitInfo.hit.collider;
                    if (!hasTarget) {
                        this.airPinchCount++;
                        if (this.airPinchCount === 1 && !this.skipTweenPlayed && this.tweens) {
                            this.skipTweenPlayed = true;
                            global.tweenManager.startTween(this.tweens, "skip-intro-hint-in");
                        }
                        else if (this.airPinchCount >= 2) {
                            this.skipIntro();
                        }
                        return;
                    }
                }
            }
        }
        playareaSetup() {
            this.menuController?.showMainMenu();
        }
    };
    __setFunctionName(_classThis, "GameFlowController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameFlowController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameFlowController = _classThis;
})();
exports.GameFlowController = GameFlowController;
//# sourceMappingURL=GameFlowController.js.map