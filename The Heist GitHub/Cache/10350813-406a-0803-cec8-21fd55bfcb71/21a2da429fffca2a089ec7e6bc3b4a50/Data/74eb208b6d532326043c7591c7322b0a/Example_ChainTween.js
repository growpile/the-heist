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
exports.Example_ChainTween = void 0;
var __selfType = requireType("./Example_ChainTween");
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
 * Example demonstrating chained tween animations with customizable parameters. Shows how to
 * sequence multiple tweens where one animation starts automatically after the previous one
 * completes. Perfect for creating complex multi-step animations with rotation, scale, and movement.
 */
const Easing_1 = require("../../TweenJS/Easing");
const LSTween_1 = require("./LSTween");
const RotationInterpolationType_1 = require("./RotationInterpolationType");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
const decorators_1 = require("SnapDecorators.lspkg/decorators");
let Example_ChainTween = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    let _instanceExtraInitializers = [];
    let _onStart_decorators;
    var Example_ChainTween = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.targetObject = (__runInitializers(this, _instanceExtraInitializers), this.targetObject);
            this.autoPlay = this.autoPlay;
            this.rotationAngle = this.rotationAngle;
            this.rotationAxis = this.rotationAxis; // Up
            this.rotationDuration = this.rotationDuration;
            this.rotationInterpolation = this.rotationInterpolation; // LERP
            this.rotationEasing = this.rotationEasing; // Cubic InOut
            this.scaleMultiplier = this.scaleMultiplier;
            this.scaleDuration = this.scaleDuration;
            this.scaleEasing = this.scaleEasing; // Elastic Out
            this.enableMovement = this.enableMovement;
            this.movementOffset = this.movementOffset;
            this.movementDuration = this.movementDuration;
            this.movementEasing = this.movementEasing; // Cubic Out
            this.loopChain = this.loopChain;
            this.resetScaleOnLoop = this.resetScaleOnLoop;
            this.logChainEvents = this.logChainEvents;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.rotateTween = null;
            this.scaleTween = null;
            this.moveTween = null;
        }
        __initialize() {
            super.__initialize();
            this.targetObject = (__runInitializers(this, _instanceExtraInitializers), this.targetObject);
            this.autoPlay = this.autoPlay;
            this.rotationAngle = this.rotationAngle;
            this.rotationAxis = this.rotationAxis; // Up
            this.rotationDuration = this.rotationDuration;
            this.rotationInterpolation = this.rotationInterpolation; // LERP
            this.rotationEasing = this.rotationEasing; // Cubic InOut
            this.scaleMultiplier = this.scaleMultiplier;
            this.scaleDuration = this.scaleDuration;
            this.scaleEasing = this.scaleEasing; // Elastic Out
            this.enableMovement = this.enableMovement;
            this.movementOffset = this.movementOffset;
            this.movementDuration = this.movementDuration;
            this.movementEasing = this.movementEasing; // Cubic Out
            this.loopChain = this.loopChain;
            this.resetScaleOnLoop = this.resetScaleOnLoop;
            this.logChainEvents = this.logChainEvents;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.rotateTween = null;
            this.scaleTween = null;
            this.moveTween = null;
        }
        /**
         * Called when component is initialized
         */
        onAwake() {
            // Initialize logger
            this.logger = new Logger_1.Logger("Example_ChainTween", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle) {
                this.logger.debug("LIFECYCLE: onAwake() - Component initializing");
            }
            // Get target transform (use this object if no target specified)
            const target = this.targetObject || this.getSceneObject();
            this.targetTransform = target.getTransform();
            // Store initial values
            this.initialScale = this.targetTransform.getLocalScale();
            this.initialPosition = this.targetTransform.getLocalPosition();
        }
        onStart() {
            if (this.autoPlay) {
                this.playChain();
            }
        }
        /**
         * Get the selected easing function
         */
        getEasing(easingType) {
            switch (easingType) {
                case 0: return Easing_1.default.Linear.None;
                case 1: return Easing_1.default.Cubic.In;
                case 2: return Easing_1.default.Cubic.Out;
                case 3: return Easing_1.default.Cubic.InOut;
                case 4: return Easing_1.default.Elastic.Out;
                case 5: return Easing_1.default.Bounce.Out;
                case 6: return Easing_1.default.Back.InOut;
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
         * Play the tween chain with current settings
         * Can be called from buttons or other scripts
         */
        playChain() {
            // Stop any existing tweens
            this.stopChain();
            const axis = this.getRotationAxisVector();
            const rotation = quat.angleAxis(MathUtils.DegToRad * this.rotationAngle, axis);
            const interpType = this.rotationInterpolation === 0
                ? RotationInterpolationType_1.RotationInterpolationType.LERP
                : RotationInterpolationType_1.RotationInterpolationType.SLERP;
            // Create rotation tween
            this.rotateTween = LSTween_1.LSTween.rotateOffset(this.targetTransform, rotation, this.rotationDuration, interpType)
                .easing(this.getEasing(this.rotationEasing))
                .onEveryStart((o) => {
                if (this.resetScaleOnLoop) {
                    this.targetTransform.setLocalScale(this.initialScale);
                }
                if (this.logChainEvents) {
                    this.logger.debug(`[ChainTween] Rotation started - ${this.rotationAngle}° around ${['Y', 'X', 'Z'][this.rotationAxis]} axis`);
                }
            });
            // Create scale tween
            this.scaleTween = LSTween_1.LSTween.scaleOffset(this.targetTransform, vec3.one().uniformScale(this.scaleMultiplier), this.scaleDuration)
                .easing(this.getEasing(this.scaleEasing))
                .onStart((o) => {
                if (this.logChainEvents) {
                    this.logger.debug(`[ChainTween] Scale started - multiplier: ${this.scaleMultiplier}x`);
                }
            });
            // Chain rotation to scale
            this.rotateTween.chain(this.scaleTween);
            // Create and chain movement tween if enabled
            if (this.enableMovement) {
                this.moveTween = LSTween_1.LSTween.moveOffset(this.targetTransform, this.movementOffset, this.movementDuration)
                    .easing(this.getEasing(this.movementEasing))
                    .onStart((o) => {
                    if (this.logChainEvents) {
                        this.logger.debug(`[ChainTween] Movement started - offset: (${this.movementOffset.x}, ${this.movementOffset.y}, ${this.movementOffset.z})`);
                    }
                })
                    .onComplete((o) => {
                    // Reset position after movement
                    this.targetTransform.setLocalPosition(this.initialPosition);
                });
                // Chain scale to movement
                this.scaleTween.chain(this.moveTween);
                // If looping, chain movement back to rotation
                if (this.loopChain) {
                    this.moveTween.chain(this.rotateTween);
                }
            }
            else {
                // If no movement, chain scale back to rotation for loop
                if (this.loopChain) {
                    this.scaleTween.chain(this.rotateTween);
                }
            }
            // Start the chain
            this.rotateTween.start();
            if (this.enableLogging) {
                const chain = this.enableMovement ? "Rotation → Scale → Movement" : "Rotation → Scale";
                this.logger.info(`Chain started: ${chain} (loop: ${this.loopChain})`);
            }
            if (this.logChainEvents) {
                this.logger.debug(`[ChainTween] ====== CHAIN STARTED ======`);
                this.logger.debug(`[ChainTween] Sequence: Rotation (${this.rotationDuration}ms) → Scale (${this.scaleDuration}ms)${this.enableMovement ? ` → Movement (${this.movementDuration}ms)` : ''}`);
                this.logger.debug(`[ChainTween] Loop enabled: ${this.loopChain}`);
            }
        }
        /**
         * Stop all tweens in the chain
         * Can be called from buttons or other scripts
         */
        stopChain() {
            if (this.rotateTween) {
                this.rotateTween.stop();
                this.rotateTween = null;
            }
            if (this.scaleTween) {
                this.scaleTween.stop();
                this.scaleTween = null;
            }
            if (this.moveTween) {
                this.moveTween.stop();
                this.moveTween = null;
            }
            if (this.enableLogging) {
                this.logger.info("Chain stopped");
            }
            if (this.logChainEvents) {
                this.logger.debug("[ChainTween] Chain stopped by user");
            }
        }
        /**
         * Restart the chain from the beginning
         * Can be called from buttons or other scripts
         */
        restartChain() {
            // Reset to initial state
            this.targetTransform.setLocalScale(this.initialScale);
            this.targetTransform.setLocalPosition(this.initialPosition);
            this.stopChain();
            this.playChain();
        }
    };
    __setFunctionName(_classThis, "Example_ChainTween");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _onStart_decorators = [decorators_1.bindStartEvent];
        __esDecorate(_classThis, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Example_ChainTween = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Example_ChainTween = _classThis;
})();
exports.Example_ChainTween = Example_ChainTween;
//# sourceMappingURL=Example_ChainTween.js.map