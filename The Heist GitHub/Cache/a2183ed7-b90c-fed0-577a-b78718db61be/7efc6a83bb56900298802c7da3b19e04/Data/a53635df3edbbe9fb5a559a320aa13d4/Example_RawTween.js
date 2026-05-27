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
exports.Example_RawTween = void 0;
var __selfType = requireType("./Example_RawTween");
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
 * Example demonstrating raw tween functionality with customizable parameters. Shows how to create
 * custom tweens with configurable easing, duration, delay, and lifecycle callbacks. Use this to
 * learn tween values (0-1) and experiment with different easing functions in real-time.
 */
const Easing_1 = require("./../../TweenJS/Easing");
const LSTween_1 = require("./LSTween");
const Logger_1 = require("Utilities.lspkg/Scripts/Utils/Logger");
const decorators_1 = require("SnapDecorators.lspkg/decorators");
let Example_RawTween = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    let _instanceExtraInitializers = [];
    let _onStart_decorators;
    var Example_RawTween = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.duration = (__runInitializers(this, _instanceExtraInitializers), this.duration);
            this.delay = this.delay;
            this.autoPlay = this.autoPlay;
            this.easingType = this.easingType; // Cubic In
            this.enableYoyo = this.enableYoyo;
            this.repeatCount = this.repeatCount;
            this.targetObject = this.targetObject;
            this.logStart = this.logStart;
            this.logUpdates = this.logUpdates;
            this.logComplete = this.logComplete;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.currentTween = null;
        }
        __initialize() {
            super.__initialize();
            this.duration = (__runInitializers(this, _instanceExtraInitializers), this.duration);
            this.delay = this.delay;
            this.autoPlay = this.autoPlay;
            this.easingType = this.easingType; // Cubic In
            this.enableYoyo = this.enableYoyo;
            this.repeatCount = this.repeatCount;
            this.targetObject = this.targetObject;
            this.logStart = this.logStart;
            this.logUpdates = this.logUpdates;
            this.logComplete = this.logComplete;
            this.enableLogging = this.enableLogging;
            this.enableLoggingLifecycle = this.enableLoggingLifecycle;
            this.currentTween = null;
        }
        /**
         * Called when component is initialized
         */
        onAwake() {
            // Initialize logger
            this.logger = new Logger_1.Logger("Example_RawTween", this.enableLogging || this.enableLoggingLifecycle, true);
            if (this.enableLoggingLifecycle) {
                this.logger.debug("LIFECYCLE: onAwake() - Component initializing");
            }
        }
        onStart() {
            if (this.autoPlay) {
                this.playTween();
            }
        }
        /**
         * Get the selected easing function based on easingType
         */
        getEasingFunction() {
            switch (this.easingType) {
                case 0: return Easing_1.default.Linear.None;
                case 1: return Easing_1.default.Quadratic.In;
                case 2: return Easing_1.default.Quadratic.Out;
                case 3: return Easing_1.default.Quadratic.InOut;
                case 4: return Easing_1.default.Cubic.In;
                case 5: return Easing_1.default.Cubic.Out;
                case 6: return Easing_1.default.Cubic.InOut;
                case 7: return Easing_1.default.Quartic.In;
                case 8: return Easing_1.default.Quartic.Out;
                case 9: return Easing_1.default.Quartic.InOut;
                case 10: return Easing_1.default.Quintic.In;
                case 11: return Easing_1.default.Quintic.Out;
                case 12: return Easing_1.default.Quintic.InOut;
                case 13: return Easing_1.default.Sinusoidal.In;
                case 14: return Easing_1.default.Sinusoidal.Out;
                case 15: return Easing_1.default.Sinusoidal.InOut;
                case 16: return Easing_1.default.Exponential.In;
                case 17: return Easing_1.default.Exponential.Out;
                case 18: return Easing_1.default.Exponential.InOut;
                case 19: return Easing_1.default.Circular.In;
                case 20: return Easing_1.default.Circular.Out;
                case 21: return Easing_1.default.Circular.InOut;
                case 22: return Easing_1.default.Elastic.In;
                case 23: return Easing_1.default.Elastic.Out;
                case 24: return Easing_1.default.Elastic.InOut;
                case 25: return Easing_1.default.Back.In;
                case 26: return Easing_1.default.Back.Out;
                case 27: return Easing_1.default.Back.InOut;
                case 28: return Easing_1.default.Bounce.In;
                case 29: return Easing_1.default.Bounce.Out;
                case 30: return Easing_1.default.Bounce.InOut;
                default: return Easing_1.default.Linear.None;
            }
        }
        /**
         * Play the tween with current settings
         * Can be called from buttons or other scripts
         */
        playTween() {
            if (this.currentTween) {
                this.currentTween.stop();
            }
            const easing = this.getEasingFunction();
            this.currentTween = LSTween_1.LSTween.rawTween(this.duration)
                .easing(easing)
                .delay(this.delay)
                .onStart((o) => {
                if (this.logStart) {
                    this.logger.debug(`[RawTween] START - Value: ${o.t.toFixed(3)}`);
                    if (this.enableLogging) {
                        this.logger.info(`Tween started with duration=${this.duration}ms, delay=${this.delay}ms`);
                    }
                }
            })
                .onUpdate((o) => {
                if (this.logUpdates) {
                    this.logger.debug(`[RawTween] UPDATE - Value: ${o.t.toFixed(3)}`);
                }
                // Visual feedback: scale target object based on tween value
                if (this.targetObject) {
                    const scale = 1 + (o.t * 2); // Scale from 1 to 3
                    this.targetObject.getTransform().setLocalScale(new vec3(scale, scale, scale));
                }
            })
                .onComplete((o) => {
                if (this.logComplete) {
                    this.logger.debug(`[RawTween] COMPLETE - Final Value: ${o.t.toFixed(3)}`);
                    if (this.enableLogging) {
                        this.logger.info("Tween completed");
                    }
                }
            });
            // Apply loop settings
            if (this.enableYoyo) {
                this.currentTween.yoyo(true);
            }
            if (this.repeatCount !== 0) {
                const repeat = this.repeatCount === -1 ? Infinity : this.repeatCount;
                this.currentTween.repeat(repeat);
            }
            this.currentTween.start();
            if (this.enableLogging) {
                this.logger.info(`Tween started: duration=${this.duration}ms, easing=${this.easingType}, yoyo=${this.enableYoyo}, repeat=${this.repeatCount}`);
            }
        }
        /**
         * Stop the current tween
         * Can be called from buttons or other scripts
         */
        stopTween() {
            if (this.currentTween) {
                this.currentTween.stop();
                if (this.enableLogging) {
                    this.logger.info("Tween stopped");
                }
                this.logger.debug("[RawTween] Tween stopped by user");
            }
        }
        /**
         * Restart the tween from the beginning
         * Can be called from buttons or other scripts
         */
        restartTween() {
            this.stopTween();
            this.playTween();
        }
    };
    __setFunctionName(_classThis, "Example_RawTween");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _onStart_decorators = [decorators_1.bindStartEvent];
        __esDecorate(_classThis, null, _onStart_decorators, { kind: "method", name: "onStart", static: false, private: false, access: { has: obj => "onStart" in obj, get: obj => obj.onStart }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Example_RawTween = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Example_RawTween = _classThis;
})();
exports.Example_RawTween = Example_RawTween;
//# sourceMappingURL=Example_RawTween.js.map