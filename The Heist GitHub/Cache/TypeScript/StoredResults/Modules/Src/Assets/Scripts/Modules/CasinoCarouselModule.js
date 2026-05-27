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
exports.CasinoCarouselModule = void 0;
var __selfType = requireType("./CasinoCarouselModule");
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
const MaterialPropertyHelpers_1 = require("../Safe/MaterialPropertyHelpers");
const SPIN_DURATION_SEC = 3;
const DEG_TO_RAD = 0.0174533;
const STREAK_TO_SOLVE = 5;
const MODULE_PENALTY_SEC = 10;
const LEVER_SWING_SEC = 0.25;
const LEVER_HOLD_SEC = 0.1;
const COMBO_DEFINITIONS = {
    HHH: ["heart", "heart", "heart"],
    DCD: ["diamond", "club", "diamond"],
    SSS: ["spade", "spade", "spade"],
    CDS: ["club", "diamond", "spade"]
};
const RULE_TABLE = {
    word: {
        HHH: { red: "DOWN", green: "DOWN", blue: "UP", yellow: "DOWN" },
        DCD: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN" },
        SSS: { red: "UP", green: "DOWN", blue: "UP", yellow: "UP" },
        CDS: { red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN" }
    },
    numbers: {
        SSS: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN" },
        DCD: { red: "UP", green: "DOWN", blue: "UP", yellow: "UP" },
        CDS: { red: "DOWN", green: "DOWN", blue: "UP", yellow: "UP" },
        HHH: { red: "UP", green: "UP", blue: "DOWN", yellow: "UP" }
    },
    default: {
        CDS: { red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN" },
        HHH: { red: "DOWN", green: "DOWN", blue: "DOWN", yellow: "UP" },
        DCD: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "UP" },
        SSS: { red: "UP", green: "DOWN", blue: "UP", yellow: "DOWN" }
    }
};
/**
 * Casino carousel safe module — lever direction puzzle with slot spinners and streak lamps.
 * Wire on the Casino Carousel prefab; disable legacy Casino Carousel Module.js on the same object.
 */
let CasinoCarouselModule = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CasinoCarouselModule = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.slotSpinners = this.slotSpinners;
            this.sequenceLamps = this.sequenceLamps;
            this.lever = this.lever;
            this.leverBall = this.leverBall;
            this.leverHandle = this.leverHandle;
            this.leverMaxDegrees = this.leverMaxDegrees;
            this.leverMinDistance = this.leverMinDistance;
            this.safeComponent = null;
            this.slotId = 0;
            this.spinnerMaterials = [];
            this.spinnerBaseRotations = [];
            this.spinnerCurrentSteps = [];
            this.spinnerBaseInitialized = false;
            this.lampMaterials = [];
            this.baseLeverRotation = null;
            this.currentLeverAngle = 0;
            this.leverAnimState = "idle";
            this.leverAnimStart = 0;
            this.leverAnimDirection = 1;
            this.isLeverAnimating = false;
            this.leverManipulation = null;
            this.currentComboKey = null;
            this.expectedDirection = null;
            this.comboCounts = {};
            this.streakCount = 0;
            this.conditionKey = "default";
            this.fuseColor = "red";
            this.isSpinning = false;
            this.spinnerProgress = [];
            this.spinSfxTimer = 0;
            this.pendingNextCombo = false;
            this.pendingResolveDirection = null;
        }
        __initialize() {
            super.__initialize();
            this.slotSpinners = this.slotSpinners;
            this.sequenceLamps = this.sequenceLamps;
            this.lever = this.lever;
            this.leverBall = this.leverBall;
            this.leverHandle = this.leverHandle;
            this.leverMaxDegrees = this.leverMaxDegrees;
            this.leverMinDistance = this.leverMinDistance;
            this.safeComponent = null;
            this.slotId = 0;
            this.spinnerMaterials = [];
            this.spinnerBaseRotations = [];
            this.spinnerCurrentSteps = [];
            this.spinnerBaseInitialized = false;
            this.lampMaterials = [];
            this.baseLeverRotation = null;
            this.currentLeverAngle = 0;
            this.leverAnimState = "idle";
            this.leverAnimStart = 0;
            this.leverAnimDirection = 1;
            this.isLeverAnimating = false;
            this.leverManipulation = null;
            this.currentComboKey = null;
            this.expectedDirection = null;
            this.comboCounts = {};
            this.streakCount = 0;
            this.conditionKey = "default";
            this.fuseColor = "red";
            this.isSpinning = false;
            this.spinnerProgress = [];
            this.spinSfxTimer = 0;
            this.pendingNextCombo = false;
            this.pendingResolveDirection = null;
        }
        onAwake() {
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(() => this.onUpdate());
            this.createEvent("OnStartEvent").bind(() => this.onStart());
            if (this.slotSpinners.length > 0) {
                this.createSpinnerMaterials();
            }
        }
        /** Called by SafeModuleManager when this module is spawned into a slot. */
        setupModule(safeContext, safeComponent, slotId) {
            this.safeComponent = safeComponent;
            this.slotId = slotId;
            this.createSpinnerMaterials();
            this.initPuzzle(safeContext);
        }
        animationFinished() {
            // No-op — safe landing does not drive this module.
        }
        onStart() {
            this.leverManipulation = this.resolveLeverManipulation();
            if (!this.leverManipulation) {
                return;
            }
            this.leverManipulation.onTranslationStart.add(() => { });
            this.leverManipulation.onTranslationEnd.add(() => {
                this.snapHandleToBall();
            });
        }
        onUpdate() {
            this.updateLever();
            this.updateSpinSfx();
        }
        resolveLeverManipulation() {
            if (!this.leverHandle) {
                return null;
            }
            const components = this.leverHandle.getComponents("Component.ScriptComponent");
            if (components.length === 0) {
                return null;
            }
            return components[0];
        }
        snapHandleToBall() {
            if (!this.leverHandle || !this.leverBall) {
                return;
            }
            this.leverHandle
                .getTransform()
                .setWorldPosition(this.leverBall.getTransform().getWorldPosition());
        }
        createSpinnerMaterials() {
            for (let i = 0; i < this.slotSpinners.length; i++) {
                const spinner = this.slotSpinners[i];
                if (!spinner) {
                    continue;
                }
                if (!this.spinnerBaseInitialized) {
                    this.spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation();
                    this.spinnerCurrentSteps[i] = 0;
                }
                else if (!this.spinnerBaseRotations[i]) {
                    this.spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation();
                    this.spinnerCurrentSteps[i] = 0;
                }
                const visuals = [];
                this.collectSpinnerVisuals(spinner, visuals);
                const spinnerMats = [];
                for (const visual of visuals) {
                    if (!visual?.mainMaterial) {
                        continue;
                    }
                    const cloned = visual.mainMaterial.clone();
                    visual.clearMaterials();
                    visual.mainMaterial = cloned;
                    this.setMaterialProgress(cloned, 0);
                    spinnerMats.push(cloned);
                }
                this.spinnerMaterials[i] = spinnerMats;
            }
            this.spinnerBaseInitialized = true;
        }
        collectSpinnerVisuals(sceneObject, visuals) {
            const rmv = sceneObject.getComponent("Component.RenderMeshVisual");
            if (rmv) {
                visuals.push(rmv);
            }
            const childCount = sceneObject.getChildrenCount();
            for (let i = 0; i < childCount; i++) {
                const child = sceneObject.getChild(i);
                if (child) {
                    this.collectSpinnerVisuals(child, visuals);
                }
            }
        }
        initSequenceLamps() {
            for (let i = 0; i < this.sequenceLamps.length; i++) {
                const lampObj = this.sequenceLamps[i];
                if (!lampObj) {
                    continue;
                }
                const visual = lampObj.getComponent("Component.RenderMeshVisual");
                if (!visual?.mainMaterial) {
                    continue;
                }
                const cloned = visual.mainMaterial.clone();
                visual.clearMaterials();
                visual.mainMaterial = cloned;
                if (cloned.mainPass?.state !== undefined) {
                    cloned.mainPass.state = 0;
                }
                if (cloned.mainPass?.glowAmount !== undefined) {
                    cloned.mainPass.glowAmount = 0;
                }
                this.lampMaterials[i] = cloned;
            }
        }
        animateLamp(material, targetValue, duration, callback) {
            const mat = material;
            if (!mat?.mainPass) {
                callback?.();
                return;
            }
            if (mat.__lampAnim?.updateEvent) {
                mat.__lampAnim.updateEvent.enabled = false;
                mat.__lampAnim.updateEvent = null;
            }
            const startState = mat.mainPass.state || 0;
            const startGlow = mat.mainPass.glowAmount || 0;
            const animData = {
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            mat.__lampAnim = animData;
            animData.updateEvent.bind(() => {
                const elapsed = getTime() - animData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                if (mat.mainPass.state !== undefined) {
                    mat.mainPass.state = startState + (targetValue - startState) * smoothT;
                }
                if (mat.mainPass.glowAmount !== undefined) {
                    mat.mainPass.glowAmount = startGlow + (targetValue - startGlow) * smoothT;
                }
                if (t >= 1) {
                    if (mat.mainPass.state !== undefined) {
                        mat.mainPass.state = targetValue;
                    }
                    if (mat.mainPass.glowAmount !== undefined) {
                        mat.mainPass.glowAmount = targetValue;
                    }
                    animData.updateEvent.enabled = false;
                    animData.updateEvent = null;
                    callback?.();
                }
            });
        }
        spinSlotsToCombo(symbols, callback) {
            if (this.spinnerMaterials.length === 0) {
                this.createSpinnerMaterials();
            }
            this.isSpinning = true;
            this.spinSfxTimer = 0;
            let remaining = 0;
            for (let i = 0; i < this.slotSpinners.length; i++) {
                const spinner = this.slotSpinners[i];
                if (!spinner) {
                    continue;
                }
                remaining++;
                const transform = spinner.getTransform();
                const startQuat = this.spinnerBaseRotations[i] || transform.getLocalRotation();
                if (spinner.__spinAnim?.updateEvent) {
                    spinner.__spinAnim.updateEvent.enabled = false;
                    spinner.__spinAnim.updateEvent = null;
                }
                const targetStep = this.getSymbolStep(symbols[i] || "diamond");
                const currentStep = this.spinnerCurrentSteps[i] ?? 0;
                const deltaStep = (targetStep - currentStep + 4) % 4;
                const rotations = 3 + i;
                const totalDegrees = 360 * rotations + deltaStep * 90;
                const totalRadians = totalDegrees * DEG_TO_RAD;
                const duration = SPIN_DURATION_SEC * (rotations / 3);
                const animData = {
                    startTime: getTime(),
                    updateEvent: this.createEvent("UpdateEvent")
                };
                spinner.__spinAnim = animData;
                const spinIndex = i;
                const spinDuration = duration;
                const targetStepValue = targetStep;
                animData.updateEvent.bind(() => {
                    const elapsed = getTime() - animData.startTime;
                    const t = Math.min(elapsed / spinDuration, 1);
                    const smoothT = t * t * (3 - 2 * t);
                    const angle = totalRadians * smoothT;
                    const mats = this.spinnerMaterials[spinIndex] || [];
                    for (let m = 0; m < mats.length; m++) {
                        const mat = mats[m];
                        if (!mat) {
                            continue;
                        }
                        const progress = smoothT < 0.25 ? smoothT * 4 : smoothT > 0.75 ? (1 - smoothT) * 4 : 1;
                        this.spinnerProgress[spinIndex] = progress;
                        this.setMaterialProgress(mat, progress);
                    }
                    const delta = quat.angleAxis(angle, vec3.right());
                    const current = startQuat.multiply(delta);
                    current.normalize();
                    transform.setLocalRotation(current);
                    if (t >= 1) {
                        const finalRot = startQuat.multiply(quat.angleAxis(totalRadians, vec3.right()));
                        transform.setLocalRotation(finalRot);
                        this.spinnerBaseRotations[spinIndex] = finalRot;
                        this.spinnerCurrentSteps[spinIndex] = targetStepValue;
                        global.playSfx(14, 1, global.appState.checkStorage("masterVolume") * 0.8);
                        for (const mat2 of mats) {
                            if (mat2) {
                                this.setMaterialProgress(mat2, 0);
                            }
                        }
                        animData.updateEvent.enabled = false;
                        animData.updateEvent = null;
                        remaining--;
                        if (remaining <= 0) {
                            this.isSpinning = false;
                            this.spinnerProgress.length = 0;
                            if (this.leverManipulation?.setCanTranslate && !this.isLeverAnimating) {
                                this.leverManipulation.setCanTranslate(true);
                            }
                            if (this.expectedDirection) {
                                print("Carousel expected direction: " + this.expectedDirection);
                            }
                            callback?.();
                        }
                    }
                });
            }
        }
        updateLever() {
            if (!this.leverHandle || !this.leverBall || !this.lever) {
                return;
            }
            if (!this.baseLeverRotation) {
                this.baseLeverRotation = this.lever.getTransform().getLocalRotation();
                this.currentLeverAngle = 0;
            }
            const handlePos = this.leverHandle.getTransform().getWorldPosition();
            const ballPos = this.leverBall.getTransform().getWorldPosition();
            const verticalDelta = handlePos.y - ballPos.y;
            const verticalDistance = Math.abs(verticalDelta);
            const direction = verticalDelta >= 0 ? -1 : 1;
            if (!this.isLeverAnimating &&
                this.leverAnimState === "idle" &&
                verticalDistance >= (this.leverMinDistance || 0)) {
                this.leverAnimState = "swingUp";
                this.leverAnimStart = getTime();
                this.leverAnimDirection = direction;
                this.isLeverAnimating = true;
                global.playSfx(global.utils.rng(10, 12), 1, global.appState.checkStorage("masterVolume") * 1);
                const swingDir = verticalDelta >= 0 ? "UP" : "DOWN";
                print("Lever Swing " + (swingDir === "UP" ? "Up" : "Down"));
                this.leverManipulation?.release?.();
                this.leverManipulation?.setCanTranslate?.(false);
                this.pendingResolveDirection = swingDir;
            }
            if (this.leverAnimState !== "idle") {
                const elapsed = getTime() - this.leverAnimStart;
                if (this.leverAnimState === "swingUp") {
                    const tUp = clamp(elapsed / LEVER_SWING_SEC, 0, 1);
                    const smoothUp = tUp * tUp * (3 - 2 * tUp);
                    this.currentLeverAngle = (this.leverMaxDegrees || 0) * smoothUp * this.leverAnimDirection;
                    if (tUp >= 1) {
                        this.leverAnimState = "hold";
                        this.leverAnimStart = getTime();
                    }
                }
                else if (this.leverAnimState === "hold") {
                    this.currentLeverAngle = (this.leverMaxDegrees || 0) * this.leverAnimDirection;
                    if (elapsed >= LEVER_HOLD_SEC) {
                        this.leverAnimState = "swingDown";
                        this.leverAnimStart = getTime();
                    }
                }
                else if (this.leverAnimState === "swingDown") {
                    const tDown = clamp(elapsed / LEVER_SWING_SEC, 0, 1);
                    const smoothDown = tDown * tDown * (3 - 2 * tDown);
                    this.currentLeverAngle = (this.leverMaxDegrees || 0) * (1 - smoothDown) * this.leverAnimDirection;
                    if (tDown >= 1) {
                        this.currentLeverAngle = 0;
                        this.leverAnimState = "idle";
                        this.snapHandleToBall();
                        this.isLeverAnimating = false;
                        if (this.pendingResolveDirection) {
                            const resolveDir = this.pendingResolveDirection;
                            this.pendingResolveDirection = null;
                            this.handleLeverSwing(resolveDir);
                        }
                        if (this.pendingNextCombo && !this.isSpinning) {
                            this.pendingNextCombo = false;
                            this.displayRandomCombo();
                        }
                    }
                }
            }
            const delta = quat.angleAxis(this.currentLeverAngle * DEG_TO_RAD, vec3.right());
            const newRot = this.baseLeverRotation.multiply(delta);
            this.lever.getTransform().setLocalRotation(newRot);
        }
        getSerialInfo(serialNumber) {
            let serialString = "";
            let containsWord = false;
            let numberCount = 0;
            if (serialNumber) {
                if (typeof serialNumber === "string") {
                    serialString = serialNumber;
                }
                else {
                    serialString = serialNumber.string || "";
                    if (typeof serialNumber.containsWord === "boolean") {
                        containsWord = serialNumber.containsWord;
                    }
                    if (typeof serialNumber.numberCount === "number") {
                        numberCount = serialNumber.numberCount;
                    }
                }
            }
            if (serialString && typeof serialNumber !== "object") {
                for (let i = 0; i < serialString.length; i++) {
                    const ch = serialString.charAt(i);
                    if (ch >= "0" && ch <= "9") {
                        numberCount++;
                    }
                }
            }
            return { containsWord, numberCount };
        }
        initPuzzle(safeContext) {
            const serialInfo = this.getSerialInfo(safeContext.serialNumber);
            this.fuseColor = (safeContext.dynamiteFuseColor || "red").toLowerCase();
            if (serialInfo.containsWord) {
                this.conditionKey = "word";
            }
            else if (serialInfo.numberCount > 3) {
                this.conditionKey = "numbers";
            }
            else {
                this.conditionKey = "default";
            }
            for (const key of Object.keys(this.comboCounts)) {
                delete this.comboCounts[key];
            }
            this.streakCount = 0;
            this.initSequenceLamps();
            this.displayRandomCombo();
        }
        displayRandomCombo() {
            const keys = Object.keys(COMBO_DEFINITIONS);
            const idx = global.utils && global.utils.rng
                ? global.utils.rng(0, keys.length - 1)
                : Math.floor(Math.random() * keys.length);
            this.currentComboKey = keys[idx];
            const symbols = COMBO_DEFINITIONS[this.currentComboKey];
            if (!this.comboCounts[this.currentComboKey]) {
                this.comboCounts[this.currentComboKey] = 0;
            }
            this.comboCounts[this.currentComboKey] += 1;
            const baseDir = RULE_TABLE[this.conditionKey][this.currentComboKey][this.fuseColor];
            const flip = this.comboCounts[this.currentComboKey] % 2 === 0;
            this.expectedDirection = flip ? (baseDir === "UP" ? "DOWN" : "UP") : baseDir;
            this.spinSlotsToCombo(symbols);
        }
        handleLeverSwing(direction) {
            if (this.isSpinning || !this.currentComboKey || !this.expectedDirection) {
                return;
            }
            if (direction === this.expectedDirection) {
                this.streakCount++;
                const lamp = this.lampMaterials[this.streakCount - 1];
                if (lamp) {
                    global.playSfx(15, 1, global.appState.checkStorage("masterVolume") * 1);
                    this.animateLamp(lamp, 1, 0.25);
                }
                if (this.streakCount >= STREAK_TO_SOLVE) {
                    print("Casino Carousel Module solved");
                    this.leverManipulation?.setCanTranslate?.(false);
                    if (this.leverHandle) {
                        this.leverHandle.enabled = false;
                    }
                    this.moduleCompleted();
                    return;
                }
                this.pendingNextCombo = true;
            }
            else {
                print("Casino Carousel Module streak reset");
                this.streakCount = 0;
                for (const key of Object.keys(this.comboCounts)) {
                    delete this.comboCounts[key];
                }
                for (const lampMat of this.lampMaterials) {
                    if (lampMat) {
                        this.animateLamp(lampMat, 0, 0.25);
                    }
                }
                this.modulePenalty();
                this.pendingNextCombo = true;
            }
        }
        updateSpinSfx() {
            if (!this.isSpinning) {
                this.spinSfxTimer = 0;
                return;
            }
            let maxProgress = 0;
            for (let i = 0; i < this.spinnerProgress.length; i++) {
                if (this.spinnerProgress[i] > maxProgress) {
                    maxProgress = this.spinnerProgress[i];
                }
            }
            const rate = 2 + 2 * maxProgress;
            const interval = rate > 0 ? 1 / rate : 0.5;
            this.spinSfxTimer += getDeltaTime();
            while (this.spinSfxTimer >= interval) {
                this.spinSfxTimer -= interval;
                global.playSfx(13, 1, global.appState.checkStorage("masterVolume") * 0.8);
            }
        }
        moduleCompleted() {
            const safe = this.safeComponent;
            safe?.completeModule?.(this.slotId);
        }
        modulePenalty() {
            const safe = this.safeComponent;
            safe?.applyPenalty?.(MODULE_PENALTY_SEC);
        }
        getSymbolStep(symbolId) {
            switch (symbolId) {
                case "diamond":
                    return 0;
                case "spade":
                    return 1;
                case "heart":
                    return 2;
                case "club":
                    return 3;
                default:
                    return 0;
            }
        }
        setMaterialProgress(material, value) {
            (0, MaterialPropertyHelpers_1.setMaterialScalar)(material, "progress", value);
        }
    };
    __setFunctionName(_classThis, "CasinoCarouselModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CasinoCarouselModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CasinoCarouselModule = _classThis;
})();
exports.CasinoCarouselModule = CasinoCarouselModule;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=CasinoCarouselModule.js.map