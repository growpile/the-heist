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
exports.Utils = void 0;
var __selfType = requireType("./Utils");
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
 * Owns `global.utils` — porting of the legacy `Util.js`.
 * Attach on Prerequisites → Util (replaces Util.js).
 *
 * Public API exposed via `global.utils` is preserved so the remaining
 * JS modules (Coin Bag, Wire Fusebox, etc.) continue to work.
 */
const DEG_TO_RAD = 0.0174533;
let Utils = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Utils = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.activeAnimations = [];
            this.delayedCallbacks = {};
            this.lastAnimatedObject = null;
            this.shakeTarget = null;
        }
        __initialize() {
            super.__initialize();
            this.activeAnimations = [];
            this.delayedCallbacks = {};
            this.lastAnimatedObject = null;
            this.shakeTarget = null;
        }
        onAwake() {
            this.installGlobalUtils();
        }
        installGlobalUtils() {
            const utils = {
                lastAnimatedObject: null,
                shakeTarget: null,
                delay: (idOrDelay, delayOrCallback, callback) => this.delay(idOrDelay, delayOrCallback, callback),
                invalidateDelay: (id) => this.invalidateDelay(id),
                rng: (min, max) => this.rng(min, max),
                rngFloat: (min, max, decimals) => this.rngFloat(min, max, decimals),
                lerp: (start, end, amt) => this.lerp(start, end, amt),
                arrayContains: (array, item) => this.arrayContains(array, item),
                arrayAllTrue: (array) => this.arrayAllTrue(array),
                stateChangeArray: (array, state) => this.stateChangeArray(array, state),
                stateChangeArrayWithException: (array, exceptionIndex, exceptionState) => this.stateChangeArrayWithException(array, exceptionIndex, exceptionState),
                stateChangeArrayClassProperty: (array, propName, state) => this.stateChangeArrayClassProperty(array, propName, state),
                removeAllChildren: (sceneObject) => this.removeAllChildren(sceneObject),
                animatePosition: (sceneObject, isLocal, newPosition, duration, callback) => this.animatePosition(sceneObject, isLocal, newPosition, duration, callback),
                animateRotation: (sceneObject, isLocal, newRotation, duration, callback) => this.animateRotation(sceneObject, isLocal, newRotation, duration, callback),
                animateScale: (sceneObject, isLocal, newScale, duration, callback) => this.animateScale(sceneObject, isLocal, newScale, duration, callback),
                cancelObjectAnimations: (sceneObject) => this.cancelObjectAnimations(sceneObject),
                animateMaterialProperty: (material, propertyString, targetValue, duration, callback) => this.animateMaterialProperty(material, propertyString, targetValue, duration, callback),
                animateShake: (sceneObject, isLocal, duration, positionShake, rotationShake, positionAmplitude, positionSettings, rotationAmplitude, rotationSettings, returnSpeed, easeInOut, onDone) => this.animateShake(sceneObject, isLocal, duration, positionShake, rotationShake, positionAmplitude, positionSettings, rotationAmplitude, rotationSettings, returnSpeed, easeInOut, onDone)
            };
            global.utils = utils;
        }
        // ---------- Array / object helpers ----------
        stateChangeArrayWithException(array, exceptionIndex, exceptionState) {
            for (let i = 0; i < array.length; i++) {
                array[i].enabled = !exceptionState;
            }
            if (array[exceptionIndex]) {
                array[exceptionIndex].enabled = exceptionState;
            }
        }
        stateChangeArray(array, state) {
            for (let i = 0; i < array.length; i++) {
                array[i].enabled = state;
            }
        }
        stateChangeArrayClassProperty(array, propName, state) {
            for (let i = 0; i < array.length; i++) {
                const target = array[i] && array[i][propName];
                if (target) {
                    target.enabled = state;
                }
            }
        }
        removeAllChildren(sceneObject) {
            if (!sceneObject) {
                return;
            }
            for (let i = sceneObject.getChildrenCount() - 1; i >= 0; i--) {
                const child = sceneObject.getChild(i);
                if (child) {
                    child.destroy();
                }
            }
        }
        arrayContains(array, item) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] === item) {
                    return true;
                }
            }
            return false;
        }
        arrayAllTrue(array) {
            if (!array || array.length === 0) {
                return false;
            }
            for (let i = 0; i < array.length; i++) {
                if (array[i] !== true) {
                    return false;
                }
            }
            return true;
        }
        // ---------- Math helpers ----------
        rng(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        rngFloat(min, max, decimals) {
            const str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
        }
        lerp(start, end, amt) {
            return (1 - amt) * start + amt * end;
        }
        // ---------- Delay ----------
        delay(idOrDelay, delayOrCallback, callback) {
            let id = null;
            let delaySec;
            let cb;
            if (typeof idOrDelay === "string" &&
                typeof delayOrCallback === "number" &&
                typeof callback === "function") {
                id = idOrDelay;
                delaySec = delayOrCallback;
                cb = callback;
            }
            else if (typeof idOrDelay === "number" && typeof delayOrCallback === "function") {
                delaySec = idOrDelay;
                cb = delayOrCallback;
            }
            else {
                return;
            }
            if (id && this.delayedCallbacks[id]) {
                this.delayedCallbacks[id].cancel();
                delete this.delayedCallbacks[id];
            }
            const delayedEvent = this.createEvent("DelayedCallbackEvent");
            delayedEvent.bind(() => {
                if (id) {
                    delete this.delayedCallbacks[id];
                }
                cb();
            });
            delayedEvent.reset(delaySec);
            if (id) {
                this.delayedCallbacks[id] = delayedEvent;
            }
        }
        invalidateDelay(id) {
            if (this.delayedCallbacks[id]) {
                this.delayedCallbacks[id].cancel();
                delete this.delayedCallbacks[id];
            }
        }
        // ---------- Animation registry ----------
        /** Stops utils-driven tweens on a scene object (e.g. stale menu hide scale). */
        cancelObjectAnimations(sceneObject) {
            if (!sceneObject) {
                return;
            }
            const animated = sceneObject;
            const anims = animated.animations ? [...animated.animations] : [];
            for (const anim of anims) {
                if (anim.updateEvent) {
                    anim.updateEvent.enabled = false;
                    anim.updateEvent = null;
                }
                anim.cleanup?.();
            }
            animated.animations = [];
            this.activeAnimations = this.activeAnimations.filter((a) => anims.indexOf(a) < 0);
        }
        registerAnimation(sceneObject, animationData) {
            if (!sceneObject) {
                return;
            }
            const animated = sceneObject;
            if (!animated.animations) {
                animated.animations = [];
            }
            this.bindAnimationDestroyCleanup(sceneObject, animated);
            const parts = animationData.id.split("_");
            const prefix = parts.length > 1 ? parts[1] : animationData.id;
            for (let i = animated.animations.length - 1; i >= 0; i--) {
                const existing = animated.animations[i];
                if (existing.id.indexOf(prefix) !== -1) {
                    if (existing.updateEvent) {
                        existing.updateEvent.enabled = false;
                    }
                    animated.animations.splice(i, 1);
                }
            }
            animated.animations.push(animationData);
            this.activeAnimations.push(animationData);
            animationData.cleanup = () => {
                if (animated.animations) {
                    animated.animations = animated.animations.filter((a) => a !== animationData);
                }
                this.activeAnimations = this.activeAnimations.filter((a) => a !== animationData);
            };
        }
        bindAnimationDestroyCleanup(sceneObject, animated) {
            if (animated.__utilsDestroyBound) {
                return;
            }
            animated.__utilsDestroyBound = true;
            const cancelAll = () => {
                const anims = animated.animations ? [...animated.animations] : [];
                for (const anim of anims) {
                    if (anim.updateEvent) {
                        anim.updateEvent.enabled = false;
                        anim.updateEvent = null;
                    }
                    anim.cleanup?.();
                }
                animated.animations = [];
                this.activeAnimations = this.activeAnimations.filter((a) => anims.indexOf(a) < 0);
            };
            const scriptComponents = sceneObject.getComponents("Component.ScriptComponent");
            if (scriptComponents.length > 0) {
                scriptComponents[0].createEvent("OnDestroyEvent").bind(cancelAll);
                return;
            }
            const watcher = this.createEvent("UpdateEvent");
            watcher.bind(() => {
                try {
                    sceneObject.getTransform();
                }
                catch (_e) {
                    watcher.enabled = false;
                    cancelAll();
                }
            });
        }
        // ---------- Animations ----------
        animatePosition(sceneObject, isLocal, newPosition, duration, callback) {
            if (!sceneObject) {
                return;
            }
            this.lastAnimatedObject = sceneObject;
            global.utils.lastAnimatedObject = sceneObject;
            const transform = sceneObject.getTransform();
            const animationData = {
                id: sceneObject.name + "_position",
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            this.registerAnimation(sceneObject, animationData);
            const startPosition = isLocal ? transform.getLocalPosition() : transform.getWorldPosition();
            animationData.updateEvent.bind(() => {
                const elapsed = getTime() - animationData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                const currentPosition = vec3.lerp(startPosition, newPosition, smoothT);
                if (isLocal) {
                    transform.setLocalPosition(currentPosition);
                }
                else {
                    transform.setWorldPosition(currentPosition);
                }
                if (t >= 1) {
                    if (isLocal) {
                        transform.setLocalPosition(newPosition);
                    }
                    else {
                        transform.setWorldPosition(newPosition);
                    }
                    animationData.cleanup?.();
                    if (animationData.updateEvent) {
                        animationData.updateEvent.enabled = false;
                        animationData.updateEvent = null;
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        }
        animateRotation(sceneObject, isLocal, newRotation, duration, callback) {
            if (!sceneObject) {
                return;
            }
            this.lastAnimatedObject = sceneObject;
            global.utils.lastAnimatedObject = sceneObject;
            const transform = sceneObject.getTransform();
            const animationData = {
                id: sceneObject.name + "_rotation",
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            this.registerAnimation(sceneObject, animationData);
            const targetQuat = newRotation instanceof quat
                ? newRotation
                : quat.fromEulerAngles(newRotation.x * DEG_TO_RAD, newRotation.y * DEG_TO_RAD, newRotation.z * DEG_TO_RAD);
            const startQuat = isLocal ? transform.getLocalRotation() : transform.getWorldRotation();
            animationData.updateEvent.bind(() => {
                const elapsed = getTime() - animationData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                const currentQuat = quat.slerp(startQuat, targetQuat, smoothT);
                currentQuat.normalize();
                if (isLocal) {
                    transform.setLocalRotation(currentQuat);
                }
                else {
                    transform.setWorldRotation(currentQuat);
                }
                if (t >= 1) {
                    if (isLocal) {
                        transform.setLocalRotation(targetQuat);
                    }
                    else {
                        transform.setWorldRotation(targetQuat);
                    }
                    animationData.cleanup?.();
                    if (animationData.updateEvent) {
                        animationData.updateEvent.enabled = false;
                        animationData.updateEvent = null;
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        }
        animateScale(sceneObject, isLocal, newScale, duration, callback) {
            if (!sceneObject) {
                return;
            }
            this.lastAnimatedObject = sceneObject;
            global.utils.lastAnimatedObject = sceneObject;
            const transform = sceneObject.getTransform();
            const animationData = {
                id: sceneObject.name + "_scale",
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            this.registerAnimation(sceneObject, animationData);
            const startScale = isLocal ? transform.getLocalScale() : transform.getWorldScale();
            animationData.updateEvent.bind(() => {
                const elapsed = getTime() - animationData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                const currentScale = vec3.lerp(startScale, newScale, smoothT);
                if (isLocal) {
                    transform.setLocalScale(currentScale);
                }
                else {
                    transform.setWorldScale(currentScale);
                }
                if (t >= 1) {
                    if (isLocal) {
                        transform.setLocalScale(newScale);
                    }
                    else {
                        transform.setWorldScale(newScale);
                    }
                    animationData.cleanup?.();
                    if (animationData.updateEvent) {
                        animationData.updateEvent.enabled = false;
                        animationData.updateEvent = null;
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        }
        animateMaterialProperty(material, propertyString, targetValue, duration, callback) {
            if (!material || !propertyString) {
                if (callback) {
                    callback();
                }
                return;
            }
            let root = material;
            const parts = String(propertyString).split(".");
            for (let i = 0; i < parts.length - 1; i++) {
                if (!root) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                root = root[parts[i]];
            }
            if (!root) {
                if (callback) {
                    callback();
                }
                return;
            }
            const key = parts[parts.length - 1];
            if (root[key] === undefined) {
                if (callback) {
                    callback();
                }
                return;
            }
            const startValue = root[key];
            if (typeof startValue !== "number" || typeof targetValue !== "number") {
                root[key] = targetValue;
                if (callback) {
                    callback();
                }
                return;
            }
            const matAny = material;
            if (!matAny.__materialAnims) {
                matAny.__materialAnims = {};
            }
            const animKey = String(propertyString);
            const existing = matAny.__materialAnims[animKey];
            if (existing && existing.updateEvent) {
                existing.updateEvent.enabled = false;
                existing.updateEvent = null;
            }
            const animData = {
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            matAny.__materialAnims[animKey] = animData;
            animData.updateEvent.bind(() => {
                const elapsed = getTime() - animData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                root[key] = startValue + (targetValue - startValue) * smoothT;
                if (t >= 1) {
                    root[key] = targetValue;
                    if (animData.updateEvent) {
                        animData.updateEvent.enabled = false;
                        animData.updateEvent = null;
                    }
                    if (matAny.__materialAnims) {
                        delete matAny.__materialAnims[animKey];
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        }
        animateShake(sceneObject, isLocal, duration, positionShake, rotationShake, positionAmplitude, positionSettings, rotationAmplitude, rotationSettings, returnSpeed, easeInOut, onDone) {
            const targetObject = sceneObject || this.shakeTarget || this.lastAnimatedObject;
            if (!targetObject) {
                onDone?.();
                return;
            }
            const transform = targetObject.getTransform();
            if (!transform) {
                onDone?.();
                return;
            }
            const posFreq = positionSettings && positionSettings.length > 0 ? positionSettings[0] : 9;
            const posSmooth = positionSettings && positionSettings.length > 1 ? positionSettings[1] : 14;
            const rotFreq = rotationSettings && rotationSettings.length > 0 ? rotationSettings[0] : 9;
            const rotSmooth = rotationSettings && rotationSettings.length > 1 ? rotationSettings[1] : 14;
            const returnSpeedVal = returnSpeed !== undefined ? returnSpeed : 12;
            const basePos = isLocal ? transform.getLocalPosition() : transform.getWorldPosition();
            const baseRot = isLocal ? transform.getLocalRotation() : transform.getWorldRotation();
            let posOffset = new vec3(0, 0, 0);
            let rotOffset = new vec3(0, 0, 0);
            let posTarget = new vec3(0, 0, 0);
            let rotTarget = new vec3(0, 0, 0);
            let posTimer = 0;
            let rotTimer = 0;
            const startTime = getTime();
            let ending = false;
            const animationData = {
                id: targetObject.name + "_shake",
                startTime: startTime,
                updateEvent: this.createEvent("UpdateEvent")
            };
            this.registerAnimation(targetObject, animationData);
            const randSigned = () => Math.random() * 2 - 1;
            const randomOffset = (amplitude, intensity) => new vec3(randSigned() * amplitude.x * intensity, randSigned() * amplitude.y * intensity, randSigned() * amplitude.z * intensity);
            const smoothVec3 = (current, target, speed, dt) => {
                if (speed <= 0) {
                    return target;
                }
                const t = 1 - Math.exp(-speed * dt);
                return current.add(target.sub(current).uniformScale(t));
            };
            animationData.updateEvent.bind(() => {
                const dt = getDeltaTime();
                const elapsed = getTime() - startTime;
                const t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;
                const scaleAmt = easeInOut ? Math.sin(Math.PI * t) : 1;
                if (!ending && elapsed >= duration) {
                    ending = true;
                }
                if (!ending) {
                    if (positionShake) {
                        const pFreq = Math.max(posFreq * scaleAmt, 0);
                        posTimer += dt;
                        if (pFreq > 0 && posTimer >= 1 / pFreq) {
                            posTimer = 0;
                            posTarget = randomOffset(positionAmplitude, scaleAmt);
                        }
                        posOffset = smoothVec3(posOffset, posTarget, posSmooth, dt);
                    }
                    if (rotationShake) {
                        const rFreq = Math.max(rotFreq * scaleAmt, 0);
                        rotTimer += dt;
                        if (rFreq > 0 && rotTimer >= 1 / rFreq) {
                            rotTimer = 0;
                            rotTarget = randomOffset(rotationAmplitude, scaleAmt);
                        }
                        rotOffset = smoothVec3(rotOffset, rotTarget, rotSmooth, dt);
                    }
                }
                else {
                    posOffset = smoothVec3(posOffset, new vec3(0, 0, 0), returnSpeedVal, dt);
                    rotOffset = smoothVec3(rotOffset, new vec3(0, 0, 0), returnSpeedVal, dt);
                    const donePos = posOffset.length <= 0.001;
                    const doneRot = rotOffset.length <= 0.001;
                    if (donePos && doneRot) {
                        if (isLocal) {
                            transform.setLocalPosition(basePos);
                            transform.setLocalRotation(baseRot);
                        }
                        else {
                            transform.setWorldPosition(basePos);
                            transform.setWorldRotation(baseRot);
                        }
                        animationData.cleanup?.();
                        if (animationData.updateEvent) {
                            animationData.updateEvent.enabled = false;
                            animationData.updateEvent = null;
                        }
                        onDone?.();
                        return;
                    }
                }
                let finalPos = basePos;
                if (positionShake) {
                    finalPos = basePos.add(posOffset);
                }
                if (isLocal) {
                    transform.setLocalPosition(finalPos);
                }
                else {
                    transform.setWorldPosition(finalPos);
                }
                if (rotationShake) {
                    const rotQuat = quat.fromEulerAngles(rotOffset.x * DEG_TO_RAD, rotOffset.y * DEG_TO_RAD, rotOffset.z * DEG_TO_RAD);
                    const finalRot = baseRot.multiply(rotQuat);
                    if (isLocal) {
                        transform.setLocalRotation(finalRot);
                    }
                    else {
                        transform.setWorldRotation(finalRot);
                    }
                }
                else if (isLocal) {
                    transform.setLocalRotation(baseRot);
                }
                else {
                    transform.setWorldRotation(baseRot);
                }
            });
        }
    };
    __setFunctionName(_classThis, "Utils");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Utils = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Utils = _classThis;
})();
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map