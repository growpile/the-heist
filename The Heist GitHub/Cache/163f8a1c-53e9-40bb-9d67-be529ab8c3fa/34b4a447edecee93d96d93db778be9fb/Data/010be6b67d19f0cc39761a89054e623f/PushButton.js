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
exports.PushButton = void 0;
var __selfType = requireType("./PushButton");
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
const sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
const SIK = sikModule.SIK || sikModule.default || sikModule;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
const DEPTH_LERP = 15;
const PINCH_ANIM_DURATION_SEC = 0.25;
/**
 * Physical push-button face driven by fingertip depth on the button plane.
 * Calls an external script function at the trigger threshold; exposes disable() for modules.
 */
let PushButton = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PushButton = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.buttonFace = this.buttonFace;
            this.customFaceSize = this.customFaceSize;
            this.faceSize = this.faceSize;
            this.pressThresholds = this.pressThresholds;
            this.maxTravel = this.maxTravel;
            this.pushX = this.pushX;
            this.pushY = this.pushY;
            this.pushZ = this.pushZ;
            this.externalScript = this.externalScript;
            this.externalFunctionName = this.externalFunctionName;
            this.callWithArgument = this.callWithArgument;
            this.argument = this.argument;
            this.debugLogs = this.debugLogs;
            this.rightHand = SIK.HandInputData.getHand("right");
            this.leftHand = SIK.HandInputData.getHand("left");
            this.warnedNoFace = false;
            this.baseLocalPos = null;
            this.currentDepth = 0;
            this.targetDepth = 0;
            this.hoverActive = false;
            this.triggerActive = false;
            this.pinchAnimStart = 0;
            this.pinchAnimating = false;
            this.isDisabled = false;
        }
        __initialize() {
            super.__initialize();
            this.buttonFace = this.buttonFace;
            this.customFaceSize = this.customFaceSize;
            this.faceSize = this.faceSize;
            this.pressThresholds = this.pressThresholds;
            this.maxTravel = this.maxTravel;
            this.pushX = this.pushX;
            this.pushY = this.pushY;
            this.pushZ = this.pushZ;
            this.externalScript = this.externalScript;
            this.externalFunctionName = this.externalFunctionName;
            this.callWithArgument = this.callWithArgument;
            this.argument = this.argument;
            this.debugLogs = this.debugLogs;
            this.rightHand = SIK.HandInputData.getHand("right");
            this.leftHand = SIK.HandInputData.getHand("left");
            this.warnedNoFace = false;
            this.baseLocalPos = null;
            this.currentDepth = 0;
            this.targetDepth = 0;
            this.hoverActive = false;
            this.triggerActive = false;
            this.pinchAnimStart = 0;
            this.pinchAnimating = false;
            this.isDisabled = false;
        }
        onAwake() {
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(() => this.onUpdate());
        }
        /** Disables interaction and releases the face (used by puzzle modules on solve). */
        disable() {
            this.isDisabled = true;
            this.hoverActive = false;
            this.triggerActive = false;
            this.pinchAnimating = false;
        }
        onUpdate() {
            const faceTransform = this.getFaceTransform();
            if (!faceTransform) {
                if (!this.warnedNoFace) {
                    this.log("buttonFace not set");
                    this.warnedNoFace = true;
                }
                return;
            }
            this.warnedNoFace = false;
            if (this.baseLocalPos === null) {
                this.baseLocalPos = faceTransform.getLocalPosition();
            }
            if (this.isDisabled) {
                this.targetDepth = 0;
                this.currentDepth += (this.targetDepth - this.currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1);
                const colliderSize = this.getColliderSize();
                const idleAxis = this.getPushAxisConfig(faceTransform.getWorldRotation(), colliderSize);
                const idlePos = this.baseLocalPos.add(idleAxis.axisLocal.uniformScale(-this.currentDepth));
                faceTransform.setLocalPosition(idlePos);
                return;
            }
            const center = faceTransform.getWorldPosition();
            const faceRot = faceTransform.getWorldRotation();
            const size = this.getColliderSize();
            const axisConfig = this.getPushAxisConfig(faceRot, size);
            const planeInfo = this.getPlaneInfo(faceRot, size);
            const anyHit = this.checkHand(this.leftHand, center, planeInfo, axisConfig.axisWorld) ||
                this.checkHand(this.rightHand, center, planeInfo, axisConfig.axisWorld);
            let maxDepth = 0;
            if (anyHit) {
                const hands = [this.leftHand, this.rightHand];
                for (const hand of hands) {
                    if (!hand?.isTracked()) {
                        continue;
                    }
                    const tips = [hand.indexTip.position];
                    for (const tip of tips) {
                        if (!this.isInsideFacePlane(tip, center, planeInfo, axisConfig.axisWorld)) {
                            continue;
                        }
                        const offset = tip.sub(center);
                        const depth = -offset.dot(axisConfig.axisWorld);
                        if (depth > maxDepth) {
                            maxDepth = depth;
                        }
                    }
                }
            }
            const travelLimit = this.maxTravel !== undefined ? this.maxTravel : axisConfig.axisSize;
            this.targetDepth = Math.min(Math.max(maxDepth, 0), Math.min(axisConfig.axisSize, travelLimit));
            const isEditor = !!global.deviceInfoSystem?.isEditor();
            let usePinchAnim = this.pinchAnimating && isEditor;
            if (usePinchAnim) {
                const animElapsed = getTime() - this.pinchAnimStart;
                const animNormalized = clamp(animElapsed / PINCH_ANIM_DURATION_SEC, 0, 1);
                if (animNormalized >= 1) {
                    this.pinchAnimating = false;
                    usePinchAnim = false;
                }
                else {
                    const mirrored = animNormalized <= 0.5 ? animNormalized * 2 : 1 - (animNormalized - 0.5) * 2;
                    const animDepth = travelLimit * clamp(mirrored, 0, 1);
                    this.targetDepth = animDepth;
                    this.currentDepth = animDepth;
                }
            }
            if (!usePinchAnim) {
                this.currentDepth +=
                    (this.targetDepth - this.currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1);
            }
            if (this.baseLocalPos) {
                const localPos = this.baseLocalPos.add(axisConfig.axisLocal.uniformScale(-this.currentDepth));
                faceTransform.setLocalPosition(localPos);
            }
            const progress = travelLimit > 0 ? this.currentDepth / travelLimit : 0;
            const hoverThreshold = this.pressThresholds ? this.pressThresholds.x : 0.2;
            const triggerThreshold = this.pressThresholds ? this.pressThresholds.y : 0.8;
            if (progress >= hoverThreshold && !this.hoverActive) {
                this.hoverActive = true;
                this.log("hover");
                global.playSfx(3, 1, global.appState.checkStorage("masterVolume") * 1);
            }
            else if (progress < hoverThreshold) {
                this.hoverActive = false;
            }
            if (progress >= triggerThreshold && !this.triggerActive) {
                this.triggerActive = true;
                this.log("trigger");
                this.invokeExternal();
                global.playSfx(2, 1, global.appState.checkStorage("masterVolume") * 0.9);
            }
            else if (progress < triggerThreshold) {
                this.triggerActive = false;
            }
            this.checkEditorPinch();
        }
        getFaceTransform() {
            return this.buttonFace?.getTransform() ?? null;
        }
        getColliderSize() {
            if (!this.buttonFace) {
                return vec3.one();
            }
            if (this.customFaceSize && this.faceSize) {
                return this.faceSize;
            }
            const collider = this.buttonFace.getComponent("Physics.ColliderComponent");
            const shape = collider?.shape;
            return shape?.size ?? vec3.one();
        }
        getPushAxisConfig(rot, size) {
            let axisLocal = vec3.forward();
            let axisSize = size.z;
            if (this.pushX) {
                axisLocal = vec3.right();
                axisSize = size.x;
            }
            else if (this.pushY) {
                axisLocal = vec3.up();
                axisSize = size.y;
            }
            else if (this.pushZ) {
                axisLocal = vec3.forward();
                axisSize = size.z;
            }
            const axisWorld = rot.multiplyVec3(axisLocal).normalize();
            return { axisLocal, axisWorld, axisSize };
        }
        getPlaneInfo(rot, size) {
            let axisU;
            let axisV;
            let halfU;
            let halfV;
            let halfDepth;
            if (this.pushX) {
                axisU = rot.multiplyVec3(vec3.up()).normalize();
                axisV = rot.multiplyVec3(vec3.forward()).normalize();
                halfU = size.y * 0.5;
                halfV = size.z * 0.5;
                halfDepth = size.x * 0.5;
            }
            else if (this.pushY) {
                axisU = rot.multiplyVec3(vec3.right()).normalize();
                axisV = rot.multiplyVec3(vec3.forward()).normalize();
                halfU = size.x * 0.5;
                halfV = size.z * 0.5;
                halfDepth = size.y * 0.5;
            }
            else {
                axisU = rot.multiplyVec3(vec3.right()).normalize();
                axisV = rot.multiplyVec3(vec3.up()).normalize();
                halfU = size.x * 0.5;
                halfV = size.y * 0.5;
                halfDepth = size.z * 0.5;
            }
            return { axisU, axisV, halfU, halfV, halfDepth };
        }
        invokeExternal() {
            if (!this.externalScript || !this.externalFunctionName) {
                return;
            }
            const fn = this.externalScript[this.externalFunctionName];
            if (typeof fn !== "function") {
                print("[PushButton] externalFunctionName '" +
                    this.externalFunctionName +
                    "' is not a function on " +
                    (this.externalScript.getSceneObject?.()?.name ?? "external script"));
                return;
            }
            if (this.callWithArgument) {
                this.log("External argument: " + (this.argument || ""));
                if (this.argument !== undefined && this.argument !== null && this.argument !== "") {
                    ;
                    fn.call(this.externalScript, this.argument);
                    return;
                }
            }
            ;
            fn.call(this.externalScript);
        }
        isInsideFacePlane(point, center, planeInfo, axisWorld) {
            const offset = point.sub(center);
            const planeDist = offset.dot(axisWorld);
            if (Math.abs(planeDist) > planeInfo.halfDepth) {
                return false;
            }
            const u = offset.dot(planeInfo.axisU);
            const v = offset.dot(planeInfo.axisV);
            return Math.abs(u) <= planeInfo.halfU && Math.abs(v) <= planeInfo.halfV;
        }
        checkHand(hand, center, planeInfo, axisWorld) {
            if (!hand?.isTracked()) {
                return false;
            }
            const tip = hand.indexTip.position;
            if (this.isInsideFacePlane(tip, center, planeInfo, axisWorld)) {
                this.log("In face area: " + hand.handType + " index");
                return true;
            }
            return false;
        }
        isHitButtonFace(hitInfo) {
            if (!hitInfo?.hit?.collider) {
                return false;
            }
            let sceneObject = hitInfo.hit.collider.getSceneObject();
            while (sceneObject) {
                if (sceneObject === this.buttonFace) {
                    return true;
                }
                sceneObject = sceneObject.getParent();
            }
            return false;
        }
        checkEditorPinch() {
            const deviceInfo = global.deviceInfoSystem;
            if (!deviceInfo?.isEditor()) {
                return;
            }
            const interactorList = SIK.InteractionManager.getTargetingInteractors();
            const primaryInteractor = interactorList.length > 0 ? interactorList[0] : null;
            if (!primaryInteractor) {
                return;
            }
            if (primaryInteractor.previousTrigger === InteractorTriggerType.None &&
                primaryInteractor.currentTrigger !== InteractorTriggerType.None) {
                return;
            }
            if (primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                primaryInteractor.currentTrigger === InteractorTriggerType.None) {
                if (this.isHitButtonFace(primaryInteractor.targetHitInfo)) {
                    this.pinchAnimStart = getTime();
                    this.pinchAnimating = true;
                }
            }
        }
        log(message) {
            if (this.debugLogs) {
                print("[PushButton] " + message);
            }
        }
    };
    __setFunctionName(_classThis, "PushButton");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PushButton = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PushButton = _classThis;
})();
exports.PushButton = PushButton;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=PushButton.js.map