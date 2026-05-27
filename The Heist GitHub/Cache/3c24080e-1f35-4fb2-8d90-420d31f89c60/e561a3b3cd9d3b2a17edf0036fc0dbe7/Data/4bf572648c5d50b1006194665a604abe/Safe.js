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
exports.Safe = void 0;
var __selfType = requireType("./Safe");
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
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
const HeistContracts_1 = require("../HeistContracts");
const SerialNumberGenerator_1 = require("./SerialNumberGenerator");
const SafeModuleManager_1 = require("./SafeModuleManager");
const SafeSolveSequence_1 = require("./SafeSolveSequence");
const SafeTimerController_1 = require("./SafeTimerController");
const SafeTypes_1 = require("./SafeTypes");
const ANTENNA_GLOW_SCALE_MIN = 1;
const ANTENNA_GLOW_SCALE_MAX = 3;
/** One leg of the 1↔3 ping-pong (full 1→3→1 cycle = 1s). */
const ANTENNA_GLOW_PULSE_MS = 500;
let Safe = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Safe = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.modules = this.modules;
            this.moduleSlots = this.moduleSlots;
            this.moduleDisplayImages = this.moduleDisplayImages;
            this.safeRoot = this.safeRoot;
            this.safeBody = this.safeBody;
            this.safeDoor = this.safeDoor;
            this.safeContents = this.safeContents;
            this.dynamiteFuseMaterials = this.dynamiteFuseMaterials;
            this.dynamiteFuseObjects = this.dynamiteFuseObjects;
            this.serialNumberText = this.serialNumberText;
            this.antennaGlow = this.antennaGlow;
            this.timerScreenRMV = this.timerScreenRMV;
            this.timerDigitTexts = this.timerDigitTexts;
            this.timerBgTexts = this.timerBgTexts;
            this.gameFlow = this.gameFlow;
            this.enableDebug = this.enableDebug;
            this.safeDebugText = this.safeDebugText;
            this.safeType = "solo";
            this.bombTimer = (0, SafeTypes_1.getSafeBombTimerSeconds)("solo");
            this.activeSerialNumber = null;
            this.activeModuleList = [];
            this.solveStarted = false;
            this.safeFailedTriggered = false;
            this.lastSolvedInSeconds = -1;
            this.penaltyCount = 0;
            this.timerController = null;
            this.moduleManager = null;
            this.solveSequence = null;
            this.updateEvent = null;
            this.solveElapsedEvent = null;
            this.solveElapsedSeconds = 0;
            this.antennaGlowScaleTween = null;
        }
        __initialize() {
            super.__initialize();
            this.modules = this.modules;
            this.moduleSlots = this.moduleSlots;
            this.moduleDisplayImages = this.moduleDisplayImages;
            this.safeRoot = this.safeRoot;
            this.safeBody = this.safeBody;
            this.safeDoor = this.safeDoor;
            this.safeContents = this.safeContents;
            this.dynamiteFuseMaterials = this.dynamiteFuseMaterials;
            this.dynamiteFuseObjects = this.dynamiteFuseObjects;
            this.serialNumberText = this.serialNumberText;
            this.antennaGlow = this.antennaGlow;
            this.timerScreenRMV = this.timerScreenRMV;
            this.timerDigitTexts = this.timerDigitTexts;
            this.timerBgTexts = this.timerBgTexts;
            this.gameFlow = this.gameFlow;
            this.enableDebug = this.enableDebug;
            this.safeDebugText = this.safeDebugText;
            this.safeType = "solo";
            this.bombTimer = (0, SafeTypes_1.getSafeBombTimerSeconds)("solo");
            this.activeSerialNumber = null;
            this.activeModuleList = [];
            this.solveStarted = false;
            this.safeFailedTriggered = false;
            this.lastSolvedInSeconds = -1;
            this.penaltyCount = 0;
            this.timerController = null;
            this.moduleManager = null;
            this.solveSequence = null;
            this.updateEvent = null;
            this.solveElapsedEvent = null;
            this.solveElapsedSeconds = 0;
            this.antennaGlowScaleTween = null;
        }
        onAwake() {
            this.ensureInitialized();
        }
        /**
         * Prefab instantiate may call init() before onAwake — build helpers lazily.
         */
        ensureInitialized() {
            if (this.solveSequence) {
                return;
            }
            this.timerController = new SafeTimerController_1.SafeTimerController(this.bombTimer, this.timerScreenRMV, this.timerDigitTexts, this.timerBgTexts, () => this.handleTimeUp());
            this.moduleManager = new SafeModuleManager_1.SafeModuleManager(this.modules, this.moduleSlots, this.moduleDisplayImages, () => this.handleAllModulesSolved());
            this.solveSequence = new SafeSolveSequence_1.SafeSolveSequence(this.safeBody, this.safeDoor, this.safeContents);
            this.updateEvent = this.createEvent("UpdateEvent");
            this.timerController.bindUpdate(this.updateEvent);
        }
        /** Prefab entry — serial, modules, timer, and visuals for this safe type. */
        init(safeType) {
            this.ensureInitialized();
            this.safeType = safeType;
            this.bombTimer = (0, SafeTypes_1.getSafeBombTimerSeconds)(safeType);
            this.timerController.setBombTimer(this.bombTimer);
            this.safeFailedTriggered = false;
            this.solveStarted = false;
            this.lastSolvedInSeconds = -1;
            this.penaltyCount = 0;
            this.solveElapsedSeconds = 0;
            this.stopSolveElapsedTimer();
            if (this.safeDebugText) {
                this.safeDebugText.text = "";
            }
            const dynamiteFuseColor = this.applyRandomDynamiteFuse();
            this.solveSequence.cloneSafeBodyMaterial();
            this.moduleManager.cloneModuleDisplayMaterials();
            this.timerController.cacheBaseColors();
            const serialNumber = (0, SerialNumberGenerator_1.generateSerialNumber)();
            this.activeSerialNumber = serialNumber;
            if (this.serialNumberText) {
                this.serialNumberText.text = serialNumber.string;
            }
            this.debugLog("Serial Number", serialNumber.string);
            const safeContext = {
                object: this.getSceneObject(),
                safeRoot: this.safeRoot ?? undefined,
                serialNumber,
                moduleList: [],
                dynamiteFuseColor
            };
            const safeScript = this.sceneObject.getComponent(Safe.getTypeName());
            const { moduleList } = this.moduleManager.configureModules(safeType, safeContext, safeScript);
            this.activeModuleList = moduleList;
            safeContext.moduleList = moduleList;
            global.appState.safe = safeContext;
            this.startAntennaGlowPulse();
        }
        beginSolve() {
            this.ensureInitialized();
            if (this.solveStarted) {
                return;
            }
            this.solveStarted = true;
            this.timerController.startNormalTicking();
            this.startSolveElapsedTimer();
            global.utils.delay(0.5, () => {
                this.timerController.startCountdown(this.bombTimer);
                if (this.safeType === "tutorial") {
                    this.playTutorialHint();
                }
            });
        }
        completeModule(slotId) {
            this.ensureInitialized();
            this.moduleManager.completeModule(slotId);
        }
        applyPenalty(seconds) {
            this.ensureInitialized();
            if (Math.max(0, Math.floor(seconds || 0)) > 0) {
                this.penaltyCount++;
            }
            this.timerController.applyPenalty(seconds);
        }
        animationFinished() {
            this.ensureInitialized();
            this.moduleManager.notifyAnimationFinished();
        }
        getRemainingSeconds() {
            this.ensureInitialized();
            return this.timerController.getRemainingSeconds();
        }
        getContext() {
            this.ensureInitialized();
            return this.moduleManager.getRuntimeContext(this.activeSerialNumber);
        }
        handleTimeUp() {
            if (this.safeFailedTriggered) {
                return;
            }
            this.safeFailedTriggered = true;
            this.stopSolveElapsedTimer();
            this.timerController.stop();
            this.solveSequence.playFailSequence(() => {
                const flow = this.resolveGameFlow();
                if (flow && typeof flow.presentPostGameFail === "function") {
                    flow.presentPostGameFail();
                    return;
                }
                this.notifyFailed();
            });
        }
        handleAllModulesSolved() {
            this.timerController.stop();
            const solvedInSeconds = this.timerController.getSolvedSeconds(this.bombTimer, this.solveStarted);
            this.lastSolvedInSeconds = solvedInSeconds;
            this.stopSolveElapsedTimer();
            this.solveSequence.playWinSequence(this.safeType, () => {
                const flow = this.resolveGameFlow();
                if (flow && typeof flow.presentPostGameWin === "function") {
                    flow.presentPostGameWin(this.safeType, this.solveElapsedSeconds, this.bombTimer, this.penaltyCount);
                    return;
                }
                this.notifyComplete(this.safeType, solvedInSeconds);
            });
        }
        getBombTimerSeconds() {
            return this.bombTimer;
        }
        /** Penalty-free solve duration (wall time since solve start). */
        getSolveDurationSeconds() {
            return Math.max(0, this.solveElapsedSeconds);
        }
        getPenaltyCount() {
            return Math.max(0, this.penaltyCount);
        }
        startSolveElapsedTimer() {
            this.stopSolveElapsedTimer();
            this.solveElapsedSeconds = 0;
            this.solveElapsedEvent = this.createEvent("UpdateEvent");
            this.solveElapsedEvent.bind(() => {
                if (!this.solveStarted || this.safeFailedTriggered) {
                    return;
                }
                const dt = getDeltaTime();
                if (dt > 0) {
                    this.solveElapsedSeconds += dt;
                }
            });
        }
        stopSolveElapsedTimer() {
            if (this.solveElapsedEvent) {
                this.solveElapsedEvent.enabled = false;
                this.solveElapsedEvent = null;
            }
        }
        applyRandomDynamiteFuse() {
            if (!this.dynamiteFuseMaterials || this.dynamiteFuseMaterials.length === 0) {
                return "";
            }
            const colorNames = ["red", "green", "blue", "yellow"];
            const maxIndex = Math.min(this.dynamiteFuseMaterials.length, colorNames.length) - 1;
            const index = global.utils && global.utils.rng
                ? global.utils.rng(0, maxIndex)
                : Math.floor(Math.random() * (maxIndex + 1));
            const selectedMaterial = this.dynamiteFuseMaterials[index];
            if (!selectedMaterial) {
                return "";
            }
            const clonedMaterial = selectedMaterial.clone();
            for (const obj of this.dynamiteFuseObjects) {
                if (!obj) {
                    continue;
                }
                const visual = obj.getComponent("Component.RenderMeshVisual");
                if (visual) {
                    visual.mainMaterial = clonedMaterial;
                }
            }
            return colorNames[index] || "";
        }
        /** Tear down timer + modules before prefab destroy. */
        endSession() {
            this.stopAntennaGlowPulse();
            this.stopSolveElapsedTimer();
            this.timerController?.dispose();
            this.moduleManager?.disableAllModules();
        }
        startAntennaGlowPulse() {
            if (!this.antennaGlow) {
                return;
            }
            this.stopAntennaGlowPulse();
            const transform = this.antennaGlow.getTransform();
            const minScale = new vec3(ANTENNA_GLOW_SCALE_MIN, ANTENNA_GLOW_SCALE_MIN, ANTENNA_GLOW_SCALE_MIN);
            const maxScale = new vec3(ANTENNA_GLOW_SCALE_MAX, ANTENNA_GLOW_SCALE_MAX, ANTENNA_GLOW_SCALE_MAX);
            transform.setLocalScale(minScale);
            this.antennaGlowScaleTween = LSTween_1.LSTween.scaleFromToLocal(transform, minScale, maxScale, ANTENNA_GLOW_PULSE_MS)
                .easing(Easing_1.default.Sinusoidal.InOut)
                .yoyo(true)
                .repeat(Infinity)
                .start();
        }
        stopAntennaGlowPulse() {
            if (this.antennaGlowScaleTween && typeof this.antennaGlowScaleTween.stop === "function") {
                this.antennaGlowScaleTween.stop();
            }
            this.antennaGlowScaleTween = null;
        }
        resolveGameFlow() {
            return (0, HeistContracts_1.asGameFlowFacade)(this.gameFlow);
        }
        notifyComplete(safeType, seconds) {
            const flow = this.resolveGameFlow();
            if (flow && typeof flow.handleSafeComplete === "function") {
                flow.handleSafeComplete(safeType, seconds);
                return;
            }
            if (typeof global.safeComplete === "function") {
                global.safeComplete(safeType, seconds);
            }
        }
        notifyFailed() {
            const flow = this.resolveGameFlow();
            if (flow && typeof flow.handleSafeFailed === "function") {
                flow.handleSafeFailed();
                return;
            }
            if (typeof global.safeFailed === "function") {
                global.safeFailed();
            }
        }
        playTutorialHint() {
            const flow = this.resolveGameFlow();
            if (flow && typeof flow.playTutorialHint === "function") {
                flow.playTutorialHint();
                return;
            }
            if (typeof global.leftRotateHint === "function") {
                global.leftRotateHint();
            }
        }
        debugLog(label, value) {
            if (!this.enableDebug || !this.safeDebugText) {
                return;
            }
            this.safeDebugText.text = this.safeDebugText.text + "\n" + label + ": " + value;
        }
    };
    __setFunctionName(_classThis, "Safe");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Safe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Safe = _classThis;
})();
exports.Safe = Safe;
//# sourceMappingURL=Safe.js.map