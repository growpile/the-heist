"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Example_YoyoTween = void 0;
var __selfType = requireType("./Example_YoyoTween");
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
/**
 * Specs Inc. 2026
 * Example demonstrating yoyo tween animation with customizable parameters. Shows how to create
 * back-and-forth animations that automatically reverse direction with configurable movement,
 * rotation, and scale. Perfect for creating oscillating, bouncing, or breathing effects.
 */
const Easing_1 = require("../../TweenJS/Easing");
const LSTween_1 = require("./LSTween");
const RotationInterpolationType_1 = require("./RotationInterpolationType");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
const decorators_1 = require("SnapDecorators.lspkg/decorators");
let Example_YoyoTween = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    let _instanceExtraInitializers = [];
    let _onStart_decorators;
    var Example_YoyoTween = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.targetObject = (__runInitializers(this, _instanceExtraInitializers), this.targetObject);
            this.autoPlay = this.autoPlay;
            this.animationType = this.animationType; // Position
            this.movementOffset = this.movementOffset;
            this.movementDuration = this.movementDuration;
            this.movementEasing = this.movementEasing; // Cubic InOut
            this.rotationAngle = this.rotationAngle;
            this.rotationAxis = this.rotationAxis; // Up
            this.rotationDuration = this.rotationDuration;
            this.rotationEasing = this.rotationEasing; // Cubic InOut
            this.scaleMultiplier = this.scaleMultiplier;
            this.scaleDuration = this.scaleDuration;
            this.scaleEasing = this.scaleEasing; // Sinusoidal InOut
            this.repeatCount = this.repeatCount; // Infinite
            this.initialDelay = this.initialDelay;
            this.repeatDelay = this.repeatDelay;
            this.logYoyoEvents = this.logYoyoEvents;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.currentTweens = [];
        }
        __initialize() {
            super.__initialize();
            this.targetObject = (__runInitializers(this, _instanceExtraInitializers), this.targetObject);
            this.autoPlay = this.autoPlay;
            this.animationType = this.animationType; // Position
            this.movementOffset = this.movementOffset;
            this.movementDuration = this.movementDuration;
            this.movementEasing = this.movementEasing; // Cubic InOut
            this.rotationAngle = this.rotationAngle;
            this.rotationAxis = this.rotationAxis; // Up
            this.rotationDuration = this.rotationDuration;
            this.rotationEasing = this.rotationEasing; // Cubic InOut
            this.scaleMultiplier = this.scaleMultiplier;
            this.scaleDuration = this.scaleDuration;
            this.scaleEasing = this.scaleEasing; // Sinusoidal InOut
            this.repeatCount = this.repeatCount; // Infinite
            this.initialDelay = this.initialDelay;
            this.repeatDelay = this.repeatDelay;
            this.logYoyoEvents = this.logYoyoEvents;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.currentTweens = [];
        }
        /**
         * Called when component is initialized
         */
        onAwake() {
            // Initialize logger
            this.logger = new Logger_1.Logger("Example_YoyoTween", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle) {
                this.logger.debug("LIFECYCLE: onAwake() - Component initializing");
            }
            // Get target transform (use this object if no target specified)
            const target = this.targetObject || this.getSceneObject();
            this.targetTransform = target.getTransform();
            // Store initial values
            this.initialPosition = this.targetTransform.getLocalPosition();
            this.initialRotation = this.targetTransform.getLocalRotation();
            this.initialScale = this.targetTransform.getLocalScale();
        }
        onStart() {
            if (this.autoPlay) {
                this.playYoyo();
            }
        }
        /**
         * Get the selected easing function
         */
        getEasing(easingType) {
            switch (easingType) {
                case 0: return Easing_1.default.Linear.None;
                case 1: return Easing_1.default.Cubic.InOut;
                case 2: return Easing_1.default.Sinusoidal.InOut;
                case 3: return Easing_1.default.Elastic.InOut;
                case 4: return Easing_1.default.Bounce.InOut;
                case 5: return Easing_1.default.Back.InOut;
                default: return Easing_1.default.Linear.None;
            }
        }
        /**
         * Get rotation axis vector
         */
        getRotationAxisVector() {
            switch (this.rotationAxis) {
                case 0: return vec3.up();
                case 1: return vec3.right();
                case 2: return vec3.forward();
                default: return vec3.up();
            }
        }
        /**
         * Play the yoyo animation with current settings
         * Can be called from buttons or other scripts
         */
        playYoyo() {
            // Stop any existing tweens
            this.stopYoyo();
            const repeat = this.repeatCount === -1 ? Infinity : this.repeatCount;
            // Create tweens based on animation type
            switch (this.animationType) {
                case 0: // Position only
                    this.createPositionYoyo(repeat);
                    break;
                case 1: // Rotation only
                    this.createRotationYoyo(repeat);
                    break;
                case 2: // Scale only
                    this.createScaleYoyo(repeat);
                    break;
                case 3: // Position + Rotation
                    this.createPositionYoyo(repeat);
                    this.createRotationYoyo(repeat);
                    break;
                case 4: // Position + Scale
                    this.createPositionYoyo(repeat);
                    this.createScaleYoyo(repeat);
                    break;
                case 5: // All three
                    this.createPositionYoyo(repeat);
                    this.createRotationYoyo(repeat);
                    this.createScaleYoyo(repeat);
                    break;
            }
            if (this.logYoyoEvents) {
                const types = ['Position', 'Rotation', 'Scale', 'Position+Rotation', 'Position+Scale', 'All'];
                this.logger.debug(`[YoyoTween] ====== YOYO STARTED ======`);
                this.logger.debug(`[YoyoTween] Type: ${types[this.animationType]}`);
                this.logger.debug(`[YoyoTween] Repeat: ${this.repeatCount === -1 ? 'Infinite' : this.repeatCount}`);
            }
            if (this.enableLogging) {
                this.logger.info(`Yoyo animation started: type=${this.animationType}, repeat=${this.repeatCount}`);
            }
        }
        /**
         * Create position yoyo tween
         */
        createPositionYoyo(repeat) {
            const startPos = this.initialPosition;
            const endPos = startPos.add(this.movementOffset);
            const tween = LSTween_1.LSTween.moveFromToLocal(this.targetTransform, startPos, endPos, this.movementDuration)
                .easing(this.getEasing(this.movementEasing))
                .delay(this.initialDelay)
                .yoyo(true)
                .repeat(repeat);
            if (this.repeatDelay > 0) {
                tween.repeatDelay(this.repeatDelay);
            }
            if (this.logYoyoEvents) {
                tween.onRepeat(() => {
                    this.logger.debug(`[YoyoTween] Position yoyo direction changed`);
                });
            }
            tween.start();
            this.currentTweens.push(tween);
        }
        /**
         * Create rotation yoyo tween
         */
        createRotationYoyo(repeat) {
            const axis = this.getRotationAxisVector();
            const rotation = quat.angleAxis(MathUtils.DegToRad * this.rotationAngle, axis);
            const tween = LSTween_1.LSTween.rotateOffset(this.targetTransform, rotation, this.rotationDuration, RotationInterpolationType_1.RotationInterpolationType.LERP)
                .easing(this.getEasing(this.rotationEasing))
                .delay(this.initialDelay)
                .yoyo(true)
                .repeat(repeat);
            if (this.repeatDelay > 0) {
                tween.repeatDelay(this.repeatDelay);
            }
            if (this.logYoyoEvents) {
                tween.onRepeat(() => {
                    this.logger.debug(`[YoyoTween] Rotation yoyo direction changed`);
                });
            }
            tween.start();
            this.currentTweens.push(tween);
        }
        /**
         * Create scale yoyo tween
         */
        createScaleYoyo(repeat) {
            const scaleOffset = this.initialScale.uniformScale(this.scaleMultiplier - 1);
            const tween = LSTween_1.LSTween.scaleOffset(this.targetTransform, scaleOffset, this.scaleDuration)
                .easing(this.getEasing(this.scaleEasing))
                .delay(this.initialDelay)
                .yoyo(true)
                .repeat(repeat);
            if (this.repeatDelay > 0) {
                tween.repeatDelay(this.repeatDelay);
            }
            if (this.logYoyoEvents) {
                tween.onRepeat(() => {
                    this.logger.debug(`[YoyoTween] Scale yoyo direction changed`);
                });
            }
            tween.start();
            this.currentTweens.push(tween);
        }
        /**
         * Stop all yoyo animations
         * Can be called from buttons or other scripts
         */
        stopYoyo() {
            for (const tween of this.currentTweens) {
                if (tween) {
                    tween.stop();
                }
            }
            this.currentTweens = [];
            if (this.enableLogging) {
                this.logger.info("Yoyo animation stopped");
            }
            if (this.logYoyoEvents) {
                this.logger.debug("[YoyoTween] Yoyo stopped by user");
            }
        }
        /**
         * Restart the yoyo from the beginning
         * Can be called from buttons or other scripts
         */
        restartYoyo() {
            // Reset to initial state
            this.targetTransform.setLocalPosition(this.initialPosition);
            this.targetTransform.setLocalRotation(this.initialRotation);
            this.targetTransform.setLocalScale(this.initialScale);
            this.stopYoyo();
            this.playYoyo();
        }
    };
    __setFunctionName(_classThis, "Example_YoyoTween");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _onStart_decorators = [decorators_1.bindStartEvent];
        __esDecorate(_classThis, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Example_YoyoTween = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Example_YoyoTween = _classThis;
})();
exports.Example_YoyoTween = Example_YoyoTween;
//# sourceMappingURL=Example_YoyoTween.js.map