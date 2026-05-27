"use strict";
/**
 * You can find this package in the Asset Library. Make sure to import this package before you can use it.
 *
 * @example
 * ```js
 * import * as LSTween from "./LSTween.lspkg/LSTween"
 * ```
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSTween = void 0;
const RotationInterpolationType_1 = require("./RotationInterpolationType");
const Tween_1 = require("./../../TweenJS/Tween");
const mainGroup_1 = require("./../../TweenJS/mainGroup");
const Now_1 = require("./../../TweenJS/Now");
class LSTween {
    constructor() {
        const lsTweenObj = global.scene.createSceneObject("LSTweenUpdates");
        const lsTweenScriptComponent = lsTweenObj.createComponent("ScriptComponent");
        lsTweenScriptComponent.createEvent("UpdateEvent").bind(() => {
            mainGroup_1.mainGroup.update((0, Now_1.default)());
        });
    }
    /**
     *
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.rawTween(1000)
     *   .onUpdate(function (o) {
     *     print(o.t);
     *   })
     *   .start();
     * ```
     * @returns
     */
    static rawTween(time) {
        const tween = new Tween_1.default({ t: 0 }, mainGroup_1.mainGroup).to({ t: 1 }).duration(time);
        return tween;
    }
    /**
     *
     * @param material Material that you wish to change alpha
     * @param to Destination value you want your alpha to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.alphaTo(material, 0.25, 1000.0).start();
     * ```
     * @returns
     */
    static alphaTo(material, to, time) {
        const mainPass = material.mainPass;
        const initColor = mainPass.baseColor.a;
        const toClamp = MathUtils.clamp(to, 0.0, 1.0);
        const tween = new Tween_1.default({ a: initColor }, mainGroup_1.mainGroup)
            .to({ a: toClamp }, time)
            .onUpdate((object) => {
            const color = mainPass.baseColor;
            color.a = object.a;
            mainPass.baseColor = color;
        });
        return tween;
    }
    /**
     *
     * @param material Material that you wish to change alpha
     * @param from Initial value of your alpha
     * @param to Destination value you want your alpha to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.alphaFromTo(material, 0.0, 0.5, 1000.0).start();
     * ```
     * @returns
     */
    static alphaFromTo(material, from, to, time) {
        const mainPass = material.mainPass;
        const fromClamp = MathUtils.clamp(from, 0.0, 1.0);
        const toClamp = MathUtils.clamp(to, 0.0, 1.0);
        const tween = new Tween_1.default({ a: fromClamp }, mainGroup_1.mainGroup)
            .to({ a: toClamp }, time)
            .onUpdate((object) => {
            const color = mainPass.baseColor;
            color.a = object.a;
            mainPass.baseColor = color;
        });
        return tween;
    }
    /**
     *
     * @param text Text that you wish to change alpha
     * @param to Destination value you want your alpha to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.textAlphaTo(text, 0.25, 1000.0).start();
     * ```
     * @returns
     */
    static textAlphaTo(text, to, time) {
        const initColor = text.textFill.color.a;
        const toClamp = MathUtils.clamp(to, 0.0, 1.0);
        const tween = new Tween_1.default({ a: initColor }, mainGroup_1.mainGroup)
            .to({ a: toClamp }, time)
            .onUpdate((object) => {
            const color = text.textFill.color;
            color.a = object.a;
            text.textFill.color = color;
            const shadowColor = text.dropshadowSettings.fill.color;
            shadowColor.a = object.a;
            text.dropshadowSettings.fill.color = shadowColor;
            const outlineColor = text.outlineSettings.fill.color;
            outlineColor.a = object.a;
            text.outlineSettings.fill.color = outlineColor;
        });
        return tween;
    }
    /**
     *
     * @param text Text that you wish to change alpha
     * @param from Initial value of your alpha
     * @param to Destination value you want your alpha to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.textAlphaFromTo(text, 0.0, 0.5, 1000.0).start();
     * ```
     * @returns
     */
    static textAlphaFromTo(text, from, to, time) {
        const fromClamp = MathUtils.clamp(from, 0.0, 1.0);
        const toClamp = MathUtils.clamp(to, 0.0, 1.0);
        const tween = new Tween_1.default({ a: fromClamp }, mainGroup_1.mainGroup)
            .to({ a: toClamp }, time)
            .onUpdate((object) => {
            const color = text.textFill.color;
            color.a = object.a;
            text.textFill.color = color;
            const shadowColor = text.dropshadowSettings.fill.color;
            shadowColor.a = object.a;
            text.dropshadowSettings.fill.color = shadowColor;
        });
        return tween;
    }
    /**
     *
     * @param material Material that you wish to change color
     * @param to Destination value you want your color to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.colorTo(material, new vec4(0,1,0,1), 1000.0).start();
     * ```
     * @returns
     */
    static colorTo(material, to, time) {
        const mainPass = material.mainPass;
        const initColor = mainPass.baseColor;
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            mainPass.baseColor = vec4.lerp(initColor, to, object.t);
        });
        return tween;
    }
    /**
     *
     * @param material Material that you wish to change color
     * @param from Initial value of your color
     * @param to Destination value you want your color to reach
     * @param time Duration of Tween in miliseconds
     * @returns
     * @example
     * ```typescript
     * LSTween.colorFromTo(material, new vec4(0,0,0,1), new vec4(0,1,0,1), 1000.0).start();
     * ```
     */
    static colorFromTo(material, from, to, time) {
        const mainPass = material.mainPass;
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            mainPass.baseColor = vec4.lerp(from, to, object.t);
        });
        return tween;
    }
    /**
     *
     * @param text Text that you wish to change color
     * @param to Destination value you want your color to reach
     * @param time Duration of Tween in miliseconds
     * @returns
     * @example
     * ```typescript
     * LSTween.colorTextTo(text, new vec4(0,1,0,1), 1000.0).start();
     * ```
     */
    static colorTextTo(text, to, time) {
        const initColor = text.textFill.color;
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            text.textFill.color = vec4.lerp(initColor, to, object.t);
        });
        return tween;
    }
    /**
     *
     * @param text Text that you wish to change color
     * @param from Initial value of your color
     * @param to Destination value you want your color to reach
     * @param time Duration of Tween in miliseconds
     * @returns
     * @example
     * ```typescript
     * LSTween.colorTextFromTo(text, new vec4(0,0,0,1), new vec4(0,1,0,1), 1000.0).start();
     * ```
     */
    static colorTextFromTo(text, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            text.textFill.color = vec4.lerp(from, to, object.t);
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change position
     * @param offset This is an addition operation in local space. For example, passing new vec3(1,0,0) will make object move 1 unit in X from its start position
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.moveOffset(transform, new vec3(0,5,0), 1000.0).start();
     * ```
     * @returns
     */
    static moveOffset(transform, offset, time) {
        const initPos = transform.getLocalPosition();
        const toPos = initPos.add(offset);
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalPosition(vec3.lerp(initPos, toPos, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change position
     * @param to Destination position you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.moveToWorld(transform, new vec3(0,5,0), 1000.0).start();
     * ```
     * @returns
     */
    static moveToWorld(transform, to, time) {
        const initPos = transform.getWorldPosition();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setWorldPosition(vec3.lerp(initPos, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change position
     * @param from Initial position you want your object to start from
     * @param to Destination position you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.moveFromToWorld(transform, new vec3(0,0,0), new vec3(0,5,0), 1000.0).start();
     * ```
     * @returns
     */
    static moveFromToWorld(transform, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setWorldPosition(vec3.lerp(from, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change position
     * @param to Destination position you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.moveToLocal(transform, new vec3(0,5,0), 1000.0).start();
     * ```
     * @returns
     */
    static moveToLocal(transform, to, time) {
        const initPos = transform.getLocalPosition();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalPosition(vec3.lerp(initPos, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change position
     * @param from Initial position you want your object to start from
     * @param to Destination position you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.moveFromToLocal(transform, new vec3(0,0,0), new vec3(0,5,0), 1000.0).start();
     * ```
     * @returns
     */
    static moveFromToLocal(transform, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalPosition(vec3.lerp(from, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change rotation
     * @param offset Multiplies the offset value from current rotation
     * @param time Duration of Tween in miliseconds
     * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
     * @example
     * ```typescript
     * LSTween.rotateOffset(transform, quat.angleAxis(radians, axis), 1000.0).start();
     * ```
     * @returns
     */
    static rotateOffset(transform, offset, time, interpolationType = RotationInterpolationType_1.RotationInterpolationType.SLERP) {
        const initRot = transform.getLocalRotation();
        const toRot = offset.multiply(initRot);
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            switch (interpolationType) {
                case RotationInterpolationType_1.RotationInterpolationType.LERP:
                    transform.setLocalRotation(quat.lerp(initRot, toRot, object.t));
                    break;
                case RotationInterpolationType_1.RotationInterpolationType.SLERP:
                    transform.setLocalRotation(quat.slerp(initRot, toRot, object.t));
                    break;
                default:
                    transform.setLocalRotation(quat.slerp(initRot, toRot, object.t));
                    break;
            }
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change rotation
     * @param to Destination quaternion you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
     * @example
     * ```typescript
     * LSTween.rotateToWorld(transform, quat.angleAxis(radians, axis), 1000.0).start();
     * ```
     * @returns
     */
    static rotateToWorld(transform, to, time, interpolationType = RotationInterpolationType_1.RotationInterpolationType.SLERP) {
        const initRot = transform.getWorldRotation();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            switch (interpolationType) {
                case RotationInterpolationType_1.RotationInterpolationType.LERP:
                    transform.setWorldRotation(quat.lerp(initRot, to, object.t));
                    break;
                case RotationInterpolationType_1.RotationInterpolationType.SLERP:
                    transform.setWorldRotation(quat.slerp(initRot, to, object.t));
                    break;
                default:
                    transform.setWorldRotation(quat.slerp(initRot, to, object.t));
                    break;
            }
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change rotation
     * @param from Initial quaternion you want your object to start from
     * @param to Destination quaternion you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
     * @example
     * ```typescript
     * LSTween.rotateFromToWorld(transform, quat.angleAxis(startRadian, axis), quat.angleAxis(destRadian, axis), 1000.0).start();
     * ```
     * @returns
     */
    static rotateFromToWorld(transform, from, to, time, interpolationType = RotationInterpolationType_1.RotationInterpolationType.SLERP) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            switch (interpolationType) {
                case RotationInterpolationType_1.RotationInterpolationType.LERP:
                    transform.setWorldRotation(quat.lerp(from, to, object.t));
                    break;
                case RotationInterpolationType_1.RotationInterpolationType.SLERP:
                    transform.setWorldRotation(quat.slerp(from, to, object.t));
                    break;
                default:
                    transform.setWorldRotation(quat.slerp(from, to, object.t));
                    break;
            }
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change rotation
     * @param to Destination quaternion you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
     * @example
     * ```typescript
     * LSTween.rotateToLocal(transform, quat.angleAxis(radians, axis), 1000.0).start();
     * ```
     * @returns
     */
    static rotateToLocal(transform, to, time, interpolationType = RotationInterpolationType_1.RotationInterpolationType.SLERP) {
        const initRot = transform.getLocalRotation();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            switch (interpolationType) {
                case RotationInterpolationType_1.RotationInterpolationType.LERP:
                    transform.setLocalRotation(quat.lerp(initRot, to, object.t));
                    break;
                case RotationInterpolationType_1.RotationInterpolationType.SLERP:
                    transform.setLocalRotation(quat.slerp(initRot, to, object.t));
                    break;
                default:
                    transform.setLocalRotation(quat.slerp(initRot, to, object.t));
                    break;
            }
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change rotation
     * @param from Initial quaternion you want your object to start from
     * @param to Destination quaternion you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @param interpolationType The interpolation type, lerp vs slerp. If no value is passed, it defaults to slerp
     * @example
     * ```typescript
     * LSTween.rotateFromToLocal(transform, quat.angleAxis(startRadian, axis), quat.angleAxis(destRadian, axis), 1000.0).start();
     * ```
     * @returns
     */
    static rotateFromToLocal(transform, from, to, time, interpolationType = RotationInterpolationType_1.RotationInterpolationType.SLERP) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            switch (interpolationType) {
                case RotationInterpolationType_1.RotationInterpolationType.LERP:
                    transform.setLocalRotation(quat.lerp(from, to, object.t));
                    break;
                case RotationInterpolationType_1.RotationInterpolationType.SLERP:
                    transform.setLocalRotation(quat.slerp(from, to, object.t));
                    break;
                default:
                    transform.setLocalRotation(quat.slerp(from, to, object.t));
                    break;
            }
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change scale
     * @param offset Multiplies the offset value from current scale
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.scaleOffset(transform, new vec3(2,2,2), 1000.0).start();
     * ```
     * @returns
     */
    static scaleOffset(transform, offset, time) {
        const initScale = transform.getLocalScale();
        const toScale = initScale.mult(offset);
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalScale(vec3.lerp(initScale, toScale, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change scale
     * @param to Destination scale you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.scaleToWorld(transform, new vec3(2,2,2), 1000.0).start();
     * ```
     * @returns
     */
    static scaleToWorld(transform, to, time) {
        const initScale = transform.getWorldScale();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setWorldScale(vec3.lerp(initScale, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change scale
     * @param from Initial scale you want your object to start from
     * @param to Destination scale you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.scaleFromToWorld(transform, new vec3(1,1,1), new vec3(2,2,2), 1000.0).start();
     * ```
     * @returns
     */
    static scaleFromToWorld(transform, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setWorldScale(vec3.lerp(from, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change scale
     * @param to Destination scale you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.scaleToLocal(transform, new vec3(2,2,2), 1000.0).start();
     * ```
     * @returns
     */
    static scaleToLocal(transform, to, time) {
        const initScale = transform.getLocalScale();
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalScale(vec3.lerp(initScale, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param transform Transform object you want to change scale
     * @param from Initial scale you want your object to start from
     * @param to Destination scale you want your object to go to
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.scaleFromToLocal(transform, new vec3(1,1,1), new vec3(2,2,2), 1000.0).start();
     * ```
     * @returns
     */
    static scaleFromToLocal(transform, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            transform.setLocalScale(vec3.lerp(from, to, object.t));
        });
        return tween;
    }
    /**
     *
     * @param sceneObject SceneObject you want to change enabled state
     * @param endValue End value of enabled state
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.enableChange(sceneObject, false, 1000.0).start();
     * ```
     * @returns
     */
    static enableChange(sceneObject, endValue, time) {
        const tween = new Tween_1.default(undefined, mainGroup_1.mainGroup)
            .to(undefined, time)
            .onComplete(() => {
            sceneObject.enabled = endValue;
        });
        return tween;
    }
    /**
     *
     * @param pass The pass you want to change the property of
     * @param property The property name in the pass you want to change
     * @param from Initial value of your property
     * @param to Destination value you want your property to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.shaderColorPropertyFromTo(pass, "tintColor", new vec4(0,0,0,1), new vec4(1,1,1,1), 1000.0).start();
     * ```
     * @returns
     */
    static shaderColorPropertyFromTo(pass, property, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            pass[property] = vec4.lerp(from, to, object.t);
        });
        return tween;
    }
    /**
     *
     * @param pass The pass you want to change the property of
     * @param property The property name in the pass you want to change
     * @param from Initial value of your property
     * @param to Destination value you want your property to reach
     * @param time Duration of Tween in miliseconds
     * @example
     * ```typescript
     * LSTween.shaderFloatPropertyFromTo(pass, "opacity", 0.0, 1.0, 1000.0).start();
     * ```
     * @returns
     */
    static shaderFloatPropertyFromTo(pass, property, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            pass[property] = MathUtils.lerp(from, to, object.t);
        });
        return tween;
    }
    static shaderFloatPropertyTo(pass, property, to, time) {
        const initValue = pass[property];
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            pass[property] = MathUtils.lerp(initValue, to, object.t);
        });
        return tween;
    }
    static shaderVec3PropertyFromTo(pass, property, from, to, time) {
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            pass[property] = vec3.lerp(from, to, object.t);
        });
        return tween;
    }
    static valueTo(value, to, time) {
        const initVal = value;
        const tween = new Tween_1.default({ v: initVal }, mainGroup_1.mainGroup)
            .to({ v: to }, time)
            .onUpdate((object) => {
            value = object.v;
        });
        return tween;
    }
    // public static vector3To(vectorValue: vec3, to: vec3, time: number)
    // {
    //   let initVal = vectorValue
    //   let tween = new Tween({ t: 0.0}, mainGroup)
    //     .to({ t: 1.0 }, time)
    //     .onUpdate((object) =>
    //     {
    //       vectorValue = vec3.lerp(initVal, to, object.t)
    //       print("LSTween: vec3 = " + vectorValue)
    //     })
    //     return tween
    // }
    static vector3FromTo(vectorValue, from, to, time) {
        const initVal = from;
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            vectorValue = vec3.lerp(initVal, to, object.t);
        });
        return tween;
    }
    static rotateToLocalInDegrees(transform, to_in_degrees, time) {
        const initRot_in_degrees = transform
            .getLocalRotation()
            .toEulerAngles()
            .uniformScale(MathUtils.RadToDeg);
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            const lerpedRot_in_degrees = vec3.lerp(initRot_in_degrees, to_in_degrees, object.t);
            transform.setLocalRotation(quat.fromEulerVec(lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)));
        });
        return tween;
    }
    static rotateFromToLocalInDegrees(transform, from_in_degrees, to_in_degrees, time) {
        // Set initial local rotation immediately
        transform.setLocalRotation(quat.fromEulerVec(from_in_degrees.uniformScale(MathUtils.DegToRad)));
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            const lerpedRot_in_degrees = vec3.lerp(from_in_degrees, to_in_degrees, object.t);
            transform.setLocalRotation(quat.fromEulerVec(lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)));
        });
        return tween;
    }
    static rotateToWorldInDegrees(transform, to_in_degrees, time) {
        const initRot_in_degrees = transform
            .getLocalRotation()
            .toEulerAngles()
            .uniformScale(MathUtils.RadToDeg);
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            const lerpedRot_in_degrees = vec3.lerp(initRot_in_degrees, to_in_degrees, object.t);
            transform.setWorldRotation(quat.fromEulerVec(lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)));
        });
        return tween;
    }
    static rotateFromToWorldInDegrees(transform, from_in_degrees, to_in_degrees, time) {
        // Set initial world rotation immediately
        transform.setWorldRotation(quat.fromEulerVec(from_in_degrees.uniformScale(MathUtils.DegToRad)));
        const tween = new Tween_1.default({ t: 0.0 }, mainGroup_1.mainGroup)
            .to({ t: 1.0 }, time)
            .onUpdate((object) => {
            const lerpedRot_in_degrees = vec3.lerp(from_in_degrees, to_in_degrees, object.t);
            transform.setWorldRotation(quat.fromEulerVec(lerpedRot_in_degrees.uniformScale(MathUtils.DegToRad)));
        });
        return tween;
    }
    static blendShapeValueTo(renderMeshVisual, blendShapeName, to, time) {
        const initVal = renderMeshVisual.getBlendShapeWeight(blendShapeName);
        const tween = new Tween_1.default({ v: initVal }, mainGroup_1.mainGroup)
            .to({ v: to }, time)
            .onUpdate((object) => {
            renderMeshVisual.setBlendShapeWeight(blendShapeName, object.v);
        });
        return tween;
    }
    static blendShapeValueFromTo(renderMeshVisual, blendShapeName, from, to, time) {
        renderMeshVisual.setBlendShapeWeight(blendShapeName, from);
        const tween = new Tween_1.default({ v: 0.0 }, mainGroup_1.mainGroup)
            .to({ v: 1.0 }, time)
            .onUpdate((object) => {
            const lerpedVal = MathUtils.lerp(from, to, object.v);
            renderMeshVisual.setBlendShapeWeight(blendShapeName, lerpedVal);
        });
        return tween;
    }
}
exports.LSTween = LSTween;
LSTween.instance = new LSTween();
//# sourceMappingURL=LSTween.js.map