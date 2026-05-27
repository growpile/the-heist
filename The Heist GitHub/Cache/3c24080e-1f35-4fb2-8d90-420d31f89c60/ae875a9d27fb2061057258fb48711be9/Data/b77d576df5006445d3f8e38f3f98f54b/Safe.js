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
const SerialNumberGenerator_1 = require("./SerialNumberGenerator");
const SafeModuleManager_1 = require("./SafeModuleManager");
const SafeSolveSequence_1 = require("./SafeSolveSequence");
const SafeTimerController_1 = require("./SafeTimerController");
let Safe = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Safe = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.bombTimer = this.bombTimer;
            this.modules = this.modules;
            this.moduleSlots = this.moduleSlots;
            this.moduleDisplayImages = this.moduleDisplayImages;
            this.safeBody = this.safeBody;
            this.safeDoor = this.safeDoor;
            this.safeContents = this.safeContents;
            this.dynamiteFuseMaterials = this.dynamiteFuseMaterials;
            this.dynamiteFuseObjects = this.dynamiteFuseObjects;
            this.serialNumberText = this.serialNumberText;
            this.timerScreenRMV = this.timerScreenRMV;
            this.timerDigitTexts = this.timerDigitTexts;
            this.timerBgTexts = this.timerBgTexts;
            this.gameFlow = this.gameFlow;
            this.enableDebug = this.enableDebug;
            this.safeDebugText = this.safeDebugText;
            this.safeType = "solo";
            this.activeSerialNumber = null;
            this.activeModuleList = [];
            this.solveStarted = false;
            this.safeFailedTriggered = false;
        }
        __initialize() {
            super.__initialize();
            this.bombTimer = this.bombTimer;
            this.modules = this.modules;
            this.moduleSlots = this.moduleSlots;
            this.moduleDisplayImages = this.moduleDisplayImages;
            this.safeBody = this.safeBody;
            this.safeDoor = this.safeDoor;
            this.safeContents = this.safeContents;
            this.dynamiteFuseMaterials = this.dynamiteFuseMaterials;
            this.dynamiteFuseObjects = this.dynamiteFuseObjects;
            this.serialNumberText = this.serialNumberText;
            this.timerScreenRMV = this.timerScreenRMV;
            this.timerDigitTexts = this.timerDigitTexts;
            this.timerBgTexts = this.timerBgTexts;
            this.gameFlow = this.gameFlow;
            this.enableDebug = this.enableDebug;
            this.safeDebugText = this.safeDebugText;
            this.safeType = "solo";
            this.activeSerialNumber = null;
            this.activeModuleList = [];
            this.solveStarted = false;
            this.safeFailedTriggered = false;
        }
        onAwake() {
            this.timerController = new SafeTimerController_1.SafeTimerController(this.bombTimer, this.timerScreenRMV, this.timerDigitTexts, this.timerBgTexts, () => this.handleTimeUp());
            this.moduleManager = new SafeModuleManager_1.SafeModuleManager(this.modules, this.moduleSlots, this.moduleDisplayImages, () => this.handleAllModulesSolved());
            this.solveSequence = new SafeSolveSequence_1.SafeSolveSequence(this.safeBody, this.safeDoor, this.safeContents);
            this.updateEvent = this.createEvent("UpdateEvent");
            this.timerController.bindUpdate(this.updateEvent);
        }
        init(safeType) {
            this.safeType = safeType;
            this.safeFailedTriggered = false;
            this.solveStarted = false;
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
                serialNumber,
                moduleList: [],
                dynamiteFuseColor
            };
            const safeScript = this.sceneObject.getComponent(Safe.getTypeName());
            const { moduleList } = this.moduleManager.configureModules(safeType, safeContext, safeScript);
            this.activeModuleList = moduleList;
            safeContext.moduleList = moduleList;
            global.appState.safe = safeContext;
        }
        beginSolve() {
            if (this.solveStarted) {
                return;
            }
            if (this.safeType === "tutorial") {
                this.bombTimer = 999;
                this.timerController.setBombTimer(999);
            }
            this.solveStarted = true;
            this.timerController.startNormalTicking();
            global.utils.delay(0.5, () => {
                this.timerController.startCountdown(this.bombTimer);
                if (this.safeType === "tutorial") {
                    this.playTutorialHint();
                }
            });
        }
        completeModule(slotId) {
            this.moduleManager.completeModule(slotId);
        }
        applyPenalty(seconds) {
            this.timerController.applyPenalty(seconds);
        }
        animationFinished() {
            this.moduleManager.notifyAnimationFinished();
        }
        getRemainingSeconds() {
            return this.timerController.getRemainingSeconds();
        }
        getContext() {
            return this.moduleManager.getRuntimeContext(this.activeSerialNumber);
        }
        handleTimeUp() {
            this.solveSequence.playFailSequence(() => this.notifyFailed());
        }
        handleAllModulesSolved() {
            this.timerController.stop();
            const solvedInSeconds = this.timerController.getSolvedSeconds(this.bombTimer, this.solveStarted);
            this.solveSequence.playWinSequence(this.safeType, solvedInSeconds, (type, seconds) => {
                this.notifyComplete(type, seconds);
            });
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
        notifyComplete(safeType, seconds) {
            const flow = this.gameFlow;
            if (flow && typeof flow.handleSafeComplete === "function") {
                flow.handleSafeComplete(safeType, seconds);
            }
            else if (typeof global.safeComplete === "function") {
                global.safeComplete(safeType, seconds);
            }
        }
        notifyFailed() {
            const flow = this.gameFlow;
            if (flow && typeof flow.handleSafeFailed === "function") {
                flow.handleSafeFailed();
            }
            else if (typeof global.safeFailed === "function") {
                global.safeFailed();
            }
        }
        playTutorialHint() {
            const flow = this.gameFlow;
            if (flow && typeof flow.playTutorialHint === "function") {
                flow.playTutorialHint();
            }
            else if (typeof global.leftRotateHint === "function") {
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