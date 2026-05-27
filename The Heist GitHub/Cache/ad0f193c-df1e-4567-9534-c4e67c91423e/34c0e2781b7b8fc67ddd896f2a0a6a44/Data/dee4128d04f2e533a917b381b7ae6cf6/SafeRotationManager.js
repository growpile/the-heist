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
exports.SafeRotationManager = void 0;
var __selfType = requireType("./SafeRotationManager");
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
const MaterialPropertyHelpers_1 = require("./Safe/MaterialPropertyHelpers");
const sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
const SIK = sikModule.SIK || sikModule.default || sikModule;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
const LEFT_AREA_NAME = "Rotate Left Area";
const RIGHT_AREA_NAME = "Rotate Right Area";
const HOLD_DURATION_SEC = 0.75;
const RELEASE_DURATION_SEC = 0.25;
const ROTATION_DURATION_SEC = 0.25;
const YAW_STEP_RADIANS = Math.PI * 0.5;
const LOCAL_Y_AXIS = new vec3(0, 1, 0);
/** Hold-to-rotate safe on left/right hand zones; drives ground material rotation. */
let SafeRotationManager = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SafeRotationManager = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.safeRotateOrigin = this.safeRotateOrigin;
            this.leftArea = this.leftArea;
            this.rightArea = this.rightArea;
            this.rotateIcons = this.rotateIcons;
            this.groundMaterial = this.groundMaterial;
            this.canRotate = false;
            this.rotateTransform = null;
            this.rotationTween = null;
            this.groundTween = null;
            this.accumulatedYaw = 0;
            this.isRotating = false;
            this.leftHand = null;
            this.rightHand = null;
            this.leftState = this.createHoldState();
            this.rightState = this.createHoldState();
            this.iconProgressTweens = [];
            this.iconOpacityTweens = [];
            this.iconBumpTweens = [];
            this.lastEditorHitInfo = null;
            this.lastEditorStartArea = "";
        }
        __initialize() {
            super.__initialize();
            this.safeRotateOrigin = this.safeRotateOrigin;
            this.leftArea = this.leftArea;
            this.rightArea = this.rightArea;
            this.rotateIcons = this.rotateIcons;
            this.groundMaterial = this.groundMaterial;
            this.canRotate = false;
            this.rotateTransform = null;
            this.rotationTween = null;
            this.groundTween = null;
            this.accumulatedYaw = 0;
            this.isRotating = false;
            this.leftHand = null;
            this.rightHand = null;
            this.leftState = this.createHoldState();
            this.rightState = this.createHoldState();
            this.iconProgressTweens = [];
            this.iconOpacityTweens = [];
            this.iconBumpTweens = [];
            this.lastEditorHitInfo = null;
            this.lastEditorStartArea = "";
        }
        onAwake() {
            this.rotateTransform = this.safeRotateOrigin?.getTransform() ?? null;
            this.leftHand = SIK.HandInputData.getHand("left");
            this.rightHand = SIK.HandInputData.getHand("right");
            global.resetRotation = () => this.resetRotation();
            this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        }
        onDisable() {
            this.stopAllTweens();
        }
        onDestroy() {
            this.stopAllTweens();
        }
        setGroundMaterial(material) {
            this.groundMaterial = (material ?? undefined);
        }
        setCanRotate(state) {
            this.canRotate = state;
            if (!state) {
                this.stopAllTweens();
            }
            const targetOpacity = this.canRotate ? 1 : 0;
            this.animateIconOpacity(0, targetOpacity, RELEASE_DURATION_SEC);
            this.animateIconOpacity(1, targetOpacity, RELEASE_DURATION_SEC);
        }
        resetRotation() {
            if (!this.rotateTransform) {
                return;
            }
            this.setCanRotate(false);
            if (this.accumulatedYaw === 0) {
                this.stopTween(this.rotationTween);
                this.isRotating = false;
                return;
            }
            this.animateYawDelta(-this.accumulatedYaw, ROTATION_DURATION_SEC);
        }
        createHoldState() {
            return {
                active: false,
                holdStart: 0,
                triggered: false,
                label: "",
                triggerDelayId: null
            };
        }
        tweenProgress(progress) {
            if (typeof progress === "number") {
                return progress;
            }
            return progress.t;
        }
        smoothStep(t) {
            return t * t * (3 - 2 * t);
        }
        stopTween(tween) {
            tween?.stop?.();
        }
        stopAllTweens() {
            this.stopTween(this.rotationTween);
            this.stopTween(this.groundTween);
            this.rotationTween = null;
            this.groundTween = null;
            this.isRotating = false;
            for (let i = 0; i < this.iconProgressTweens.length; i++) {
                this.stopTween(this.iconProgressTweens[i] ?? null);
                this.iconProgressTweens[i] = null;
            }
            for (let i = 0; i < this.iconOpacityTweens.length; i++) {
                this.stopTween(this.iconOpacityTweens[i] ?? null);
                this.iconOpacityTweens[i] = null;
            }
            for (let i = 0; i < this.iconBumpTweens.length; i++) {
                this.stopTween(this.iconBumpTweens[i] ?? null);
                this.iconBumpTweens[i] = null;
            }
            if (this.leftState.triggerDelayId) {
                global.utils.invalidateDelay(this.leftState.triggerDelayId);
                this.leftState.triggerDelayId = null;
            }
            if (this.rightState.triggerDelayId) {
                global.utils.invalidateDelay(this.rightState.triggerDelayId);
                this.rightState.triggerDelayId = null;
            }
            this.leftState.active = false;
            this.leftState.triggered = false;
            this.leftState.label = "";
            this.rightState.active = false;
            this.rightState.triggered = false;
            this.rightState.label = "";
        }
        wrapTween(tween) {
            return { stop: () => tween.stop() };
        }
        animateYawDelta(deltaRadians, durationSec) {
            if (!this.rotateTransform || this.isRotating) {
                return;
            }
            global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9);
            this.stopTween(this.rotationTween);
            this.stopTween(this.groundTween);
            this.animateGroundRotation(deltaRadians, durationSec);
            const offset = quat.angleAxis(deltaRadians, LOCAL_Y_AXIS);
            const durationMs = durationSec * 1000;
            this.isRotating = true;
            const tween = LSTween_1.LSTween.rotateOffset(this.rotateTransform, offset, durationMs)
                .easing(Easing_1.default.Quadratic.InOut)
                .onComplete(() => {
                this.accumulatedYaw += deltaRadians;
                this.isRotating = false;
                this.rotationTween = null;
                this.resetGroundRotation();
            });
            this.rotationTween = this.wrapTween(tween);
            tween.start();
        }
        getGroundRotation() {
            return (0, MaterialPropertyHelpers_1.getMaterialScalar)(this.groundMaterial, "rotation");
        }
        setGroundRotation(value) {
            (0, MaterialPropertyHelpers_1.setMaterialScalar)(this.groundMaterial, "rotation", value);
        }
        animateGroundRotation(deltaRadians, durationSec) {
            const groundStart = this.getGroundRotation();
            if (groundStart === null) {
                return;
            }
            const groundTarget = deltaRadians >= 0 ? 1 : -1;
            const durationMs = durationSec * 1000;
            const tween = LSTween_1.LSTween.rawTween(durationMs)
                .easing(Easing_1.default.Quadratic.InOut)
                .onUpdate((progress) => {
                const t = this.smoothStep(this.tweenProgress(progress));
                this.setGroundRotation(groundStart + (groundTarget - groundStart) * t);
            })
                .onComplete(() => {
                this.resetGroundRotation();
                this.groundTween = null;
            });
            this.groundTween = this.wrapTween(tween);
            tween.start();
        }
        resetGroundRotation() {
            if (this.getGroundRotation() !== null) {
                this.setGroundRotation(0);
            }
        }
        getIconMaterial(index) {
            const icon = this.rotateIcons?.[index];
            if (!icon) {
                return null;
            }
            return icon.mainMaterial ?? null;
        }
        getIconProgress(material) {
            if (!material) {
                return null;
            }
            if (material.mainPass && material.mainPass.progress !== undefined) {
                return material.mainPass.progress;
            }
            if (material.progress !== undefined) {
                return material.progress;
            }
            return null;
        }
        setIconProgress(material, value) {
            if (!material) {
                return;
            }
            if (material.mainPass && material.mainPass.progress !== undefined) {
                material.mainPass.progress = value;
            }
            else if (material.progress !== undefined) {
                ;
                material.progress = value;
            }
        }
        getIconOpacity(material) {
            if (!material) {
                return null;
            }
            if (material.mainPass && material.mainPass.opacityMultiplier !== undefined) {
                return material.mainPass.opacityMultiplier;
            }
            if (material.opacityMultiplier !== undefined) {
                return material.opacityMultiplier;
            }
            return null;
        }
        setIconOpacity(material, value) {
            if (!material) {
                return;
            }
            if (material.mainPass && material.mainPass.opacityMultiplier !== undefined) {
                material.mainPass.opacityMultiplier = value;
            }
            else if (material.opacityMultiplier !== undefined) {
                ;
                material.opacityMultiplier = value;
            }
        }
        animateMaterialScalar(slot, index, getValue, setValue, targetValue, durationSec, onComplete) {
            const material = this.getIconMaterial(index);
            if (!material) {
                return;
            }
            const startValue = getValue(material);
            if (startValue === null || startValue === undefined) {
                onComplete?.();
                return;
            }
            this.stopTween(slot[index] ?? null);
            const durationMs = durationSec * 1000;
            const tween = LSTween_1.LSTween.rawTween(durationMs)
                .easing(Easing_1.default.Quadratic.InOut)
                .onUpdate((progress) => {
                const t = this.smoothStep(this.tweenProgress(progress));
                const value = startValue + (targetValue - startValue) * t;
                setValue(material, value);
            })
                .onComplete(() => {
                setValue(material, targetValue);
                slot[index] = null;
                onComplete?.();
            });
            slot[index] = this.wrapTween(tween);
            tween.start();
        }
        animateIconProgress(index, targetValue, durationSec, onComplete) {
            this.animateMaterialScalar(this.iconProgressTweens, index, (m) => this.getIconProgress(m), (m, v) => this.setIconProgress(m, v), targetValue, durationSec, onComplete);
        }
        animateIconOpacity(index, targetValue, durationSec) {
            this.animateMaterialScalar(this.iconOpacityTweens, index, (m) => this.getIconOpacity(m), (m, v) => this.setIconOpacity(m, v), targetValue, durationSec);
        }
        isIconReady(index) {
            const value = this.getIconProgress(this.getIconMaterial(index));
            if (value === null || value === undefined) {
                return true;
            }
            return value <= 0.001;
        }
        playIconBump(index) {
            const icon = this.rotateIcons?.[index];
            if (!icon) {
                return;
            }
            const sceneObject = icon.getSceneObject();
            if (!sceneObject) {
                return;
            }
            const transform = sceneObject.getTransform();
            const rest = transform.getLocalScale();
            const bump = rest.uniformScale(1.15);
            this.stopTween(this.iconBumpTweens[index] ?? null);
            const downTween = LSTween_1.LSTween.scaleFromToLocal(transform, bump, rest, 120).easing(Easing_1.default.Quadratic.In);
            const upTween = LSTween_1.LSTween.scaleFromToLocal(transform, rest, bump, 80)
                .easing(Easing_1.default.Quadratic.Out)
                .chain(downTween)
                .onComplete(() => {
                this.iconBumpTweens[index] = null;
            });
            this.iconBumpTweens[index] = this.wrapTween(upTween);
            upTween.start();
        }
        updateHoldState(index, state, isActive, handLabel, triggerFn) {
            const now = getTime();
            if (isActive) {
                if (!state.active) {
                    if (!this.isIconReady(index)) {
                        return;
                    }
                    state.active = true;
                    state.holdStart = now;
                    state.triggered = false;
                    state.label = handLabel || "";
                    const triggerTime = HOLD_DURATION_SEC * 0.7;
                    const delayId = "rotateHold_" + index;
                    if (state.triggerDelayId) {
                        global.utils.invalidateDelay(state.triggerDelayId);
                    }
                    state.triggerDelayId = delayId;
                    global.utils.delay(delayId, triggerTime, () => {
                        if (!state.active || state.triggered) {
                            return;
                        }
                        if (this.canRotate && !this.isRotating) {
                            state.triggered = true;
                            triggerFn(state.label || "Hand");
                        }
                    });
                    this.animateIconProgress(index, 1, HOLD_DURATION_SEC);
                }
                else if (handLabel) {
                    state.label = handLabel;
                }
                return;
            }
            if (state.active || state.triggered) {
                state.active = false;
                state.triggered = false;
                state.holdStart = 0;
                state.label = "";
                if (state.triggerDelayId) {
                    global.utils.invalidateDelay(state.triggerDelayId);
                    state.triggerDelayId = null;
                }
                this.animateIconProgress(index, 0, RELEASE_DURATION_SEC);
            }
        }
        leftRotation(handLabel) {
            if (!this.canRotate || this.isRotating) {
                return;
            }
            this.playIconBump(0);
            print(handLabel + " Hand triggered Left Rotation");
            this.animateYawDelta(-YAW_STEP_RADIANS, ROTATION_DURATION_SEC);
        }
        rightRotation(handLabel) {
            if (!this.canRotate || this.isRotating) {
                return;
            }
            this.playIconBump(1);
            print(handLabel + " Hand triggered Right Rotation");
            this.animateYawDelta(YAW_STEP_RADIANS, ROTATION_DURATION_SEC);
        }
        isInsideBounds(point, center, halfSize) {
            const offset = point.sub(center);
            return (Math.abs(offset.x) <= halfSize.x &&
                Math.abs(offset.y) <= halfSize.y &&
                Math.abs(offset.z) <= halfSize.z);
        }
        getBodyCollider(body) {
            if (!body?.getSceneObject) {
                return null;
            }
            const so = body.getSceneObject();
            if (!so) {
                return null;
            }
            const collider = so.getComponent("Physics.ColliderComponent");
            if (collider) {
                return collider;
            }
            for (let i = 0; i < so.getChildrenCount(); i++) {
                const child = so.getChild(i);
                if (!child) {
                    continue;
                }
                const childCollider = child.getComponent("Physics.ColliderComponent");
                if (childCollider) {
                    return childCollider;
                }
            }
            return null;
        }
        getBoxShapeSize(shape) {
            if (!shape) {
                return null;
            }
            const boxShape = shape;
            return boxShape.size ?? null;
        }
        getColliderBox(body) {
            const collider = this.getBodyCollider(body);
            const size = this.getBoxShapeSize(collider?.shape ?? null);
            if (!collider || !size) {
                return null;
            }
            const so = collider.getSceneObject();
            if (!so) {
                return null;
            }
            const center = so.getTransform().getWorldPosition();
            const half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
            return { center, half };
        }
        getHandPoint(hand) {
            if (!hand?.isTracked?.() || !hand.isTracked()) {
                return null;
            }
            if (hand.getPalmCenter) {
                return hand.getPalmCenter();
            }
            return hand.indexTip ? hand.indexTip.position : null;
        }
        isHandInArea(hand, areaBox) {
            if (!areaBox) {
                return false;
            }
            const point = this.getHandPoint(hand);
            if (!point) {
                return false;
            }
            return this.isInsideBounds(point, areaBox.center, areaBox.half);
        }
        isHitAreaName(hitInfo, areaName) {
            if (!hitInfo?.hit?.collider || !areaName) {
                return false;
            }
            let so = hitInfo.hit.collider.getSceneObject();
            while (so) {
                if (so.name === areaName) {
                    return true;
                }
                so = so.getParent ? so.getParent() : null;
            }
            return false;
        }
        checkEditorClick() {
            if (!global.deviceInfoSystem?.isEditor()) {
                return;
            }
            const interactorList = SIK.InteractionManager.getTargetingInteractors();
            const primaryInteractor = interactorList.length > 0 ? interactorList[0] : null;
            if (!primaryInteractor) {
                return;
            }
            if (primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                primaryInteractor.currentTrigger === InteractorTriggerType.None) {
                const hitInfo = primaryInteractor.targetHitInfo || this.lastEditorHitInfo;
                if (this.lastEditorStartArea === LEFT_AREA_NAME &&
                    this.isHitAreaName(hitInfo, LEFT_AREA_NAME) &&
                    this.isIconReady(0)) {
                    this.animateIconProgress(0, 1, 0.25);
                    global.utils.delay(0.25, () => {
                        this.animateIconProgress(0, 0, RELEASE_DURATION_SEC);
                    });
                    this.leftRotation("Editor");
                }
                else if (this.lastEditorStartArea === RIGHT_AREA_NAME &&
                    this.isHitAreaName(hitInfo, RIGHT_AREA_NAME) &&
                    this.isIconReady(1)) {
                    this.animateIconProgress(1, 1, 0.25);
                    global.utils.delay(0.25, () => {
                        this.animateIconProgress(1, 0, RELEASE_DURATION_SEC);
                    });
                    this.rightRotation("Editor");
                }
                this.lastEditorHitInfo = null;
                this.lastEditorStartArea = "";
            }
            else if (primaryInteractor.previousTrigger === InteractorTriggerType.None &&
                primaryInteractor.currentTrigger !== InteractorTriggerType.None) {
                const startHit = primaryInteractor.targetHitInfo;
                this.lastEditorHitInfo = startHit;
                if (this.isHitAreaName(startHit, LEFT_AREA_NAME)) {
                    this.lastEditorStartArea = LEFT_AREA_NAME;
                }
                else if (this.isHitAreaName(startHit, RIGHT_AREA_NAME)) {
                    this.lastEditorStartArea = RIGHT_AREA_NAME;
                }
                else {
                    this.lastEditorStartArea = "";
                }
            }
        }
        onUpdate() {
            const leftBox = this.getColliderBox(this.leftArea);
            const rightBox = this.getColliderBox(this.rightArea);
            const leftInLeft = this.isHandInArea(this.leftHand, leftBox);
            const rightInLeft = this.isHandInArea(this.rightHand, leftBox);
            const leftActive = leftInLeft || rightInLeft;
            const leftLabel = leftInLeft ? "Left" : rightInLeft ? "Right" : "Hand";
            this.updateHoldState(0, this.leftState, leftActive, leftLabel, (label) => this.leftRotation(label));
            const leftInRight = this.isHandInArea(this.leftHand, rightBox);
            const rightInRight = this.isHandInArea(this.rightHand, rightBox);
            const rightActive = leftInRight || rightInRight;
            const rightLabel = leftInRight ? "Left" : rightInRight ? "Right" : "Hand";
            this.updateHoldState(1, this.rightState, rightActive, rightLabel, (label) => this.rightRotation(label));
            this.checkEditorClick();
        }
    };
    __setFunctionName(_classThis, "SafeRotationManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafeRotationManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafeRotationManager = _classThis;
})();
exports.SafeRotationManager = SafeRotationManager;
//# sourceMappingURL=SafeRotationManager.js.map