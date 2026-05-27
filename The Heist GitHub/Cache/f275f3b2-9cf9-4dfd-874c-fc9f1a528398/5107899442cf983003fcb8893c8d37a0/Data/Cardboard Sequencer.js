// @input SceneObject target
// @input Physics.BodyComponent physicsBody
// @input bool enableShake = true
// @input float intensity = 1.0 {"min":0}

// @ui {"widget":"group_start", "label":"Position Shake"}
// @input vec3 positionAmplitude = "{0.015,0.01,0.02}"
// @input float positionFrequency = 9.0 {"min":0}
// @input float positionSmoothing = 14.0 {"min":0}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Rotation Shake (Degrees)"}
// @input vec3 rotationAmplitude = "{2.0,4.0,2.5}"
// @input float rotationFrequency = 9.0 {"min":0}
// @input float rotationSmoothing = 14.0 {"min":0}
// @ui {"widget":"group_end"}

// @input float returnSpeed = 12.0 {"min":0}

// @ui {"widget":"group_start", "label":"Throw"}
// @input bool enableThrow = true
// @input vec3 throwVelocity = "{0,0.8,-1.2}"
// @input vec3 throwAngularVelocity = "{90,180,60}"
// @input float throwGravity = -1.8
// @ui {"widget":"group_end"}

// @input Component.ScriptComponent logic
/** @type {ScriptComponent} */
var logic = script.logic;

var DEG2RAD = 0.017453292519943295;
var targetObject = script.target || script.getSceneObject();
var targetTransform = targetObject ? targetObject.getTransform() : null;

var baseLocalPos = null;
var baseLocalRot = null;
var posOffset = new vec3(0, 0, 0);
var rotOffset = new vec3(0, 0, 0);
var posTarget = new vec3(0, 0, 0);
var rotTarget = new vec3(0, 0, 0);
var posTimer = 0;
var rotTimer = 0;

var START_LOCAL_POS = new vec3(0, 34, -5);
var END_LOCAL_POS = new vec3(0, 70, -5);
var START_SCALE = new vec3(0, 0, 0);
var END_SCALE = new vec3(0.874, 0.874, 0.874);
var SCALE_DURATION = 0.25;
var WAIT_DURATION = 0.5;
var RAMP_DURATION = 1.0;
var TOP_WAIT_DURATION = 0.5;
var FLAP_WAIT_DURATION = 1.0;

var sequenceState = "none";
var sequenceTime = 0;
var shakeScale = 1.0;
var tweensTriggered = false;
var throwActive = false;
var usingPhysicsThrow = false;
var throwPos = null;
var throwRot = null;
var throwVel = null;
var throwAngVel = null;

function randSigned() {
    return Math.random() * 2 - 1;
}

function randomOffset(amplitude, intensity) {
    return new vec3(
        randSigned() * amplitude.x * intensity,
        randSigned() * amplitude.y * intensity,
        randSigned() * amplitude.z * intensity
    );
}

function smoothVec3(current, target, speed, dt) {
    if (speed <= 0) {
        return target;
    }
    var t = 1 - Math.exp(-speed * dt);
    return current.add(target.sub(current).uniformScale(t));
}

function cacheBase() {
    if (!targetTransform) {
        return;
    }
    baseLocalPos = targetTransform.getLocalPosition();
    baseLocalRot = targetTransform.getLocalRotation();
}

function getBody() {
    if (script.physicsBody) {
        return script.physicsBody;
    }
    if (targetObject && targetObject.getComponent) {
        return targetObject.getComponent("Physics.BodyComponent");
    }
    return null;
}

function setBodyDynamic(body) {
    if (!body) {
        return;
    }
    if (body.setDynamic) {
        body.setDynamic(true);
        return;
    }
    if (body.setBodyType && typeof Physics !== "undefined" && Physics.BodyComponent && Physics.BodyComponent.BodyType) {
        body.setBodyType(Physics.BodyComponent.BodyType.Dynamic);
        return;
    }
    if (body.bodyType !== undefined && typeof Physics !== "undefined" && Physics.BodyComponent && Physics.BodyComponent.BodyType) {
        body.bodyType = Physics.BodyComponent.BodyType.Dynamic;
        return;
    }
    if (body.dynamic !== undefined) {
        body.dynamic = true;
    }
}

function disableBody(body) {
    if (!body) {
        return;
    }
    if (body.enabled !== undefined) {
        body.enabled = false;
    }
    if (body.setDynamic) {
        body.setDynamic(false);
    }
    if (body.bodyType !== undefined && typeof Physics !== "undefined" && Physics.BodyComponent && Physics.BodyComponent.BodyType) {
        body.bodyType = Physics.BodyComponent.BodyType.Kinematic;
    }
}

function wakeBody(body) {
    if (!body) {
        return;
    }
    if (body.sleeping !== undefined) {
        body.sleeping = false;
    }
    if (body.wakeUp) {
        body.wakeUp();
    }
}

function applyLinearLaunch(body, velocityWorld) {
    if (!body) {
        return;
    }
    var mass = body.mass !== undefined ? body.mass : 1;
    var impulse = velocityWorld.uniformScale(mass);

    if (body.addImpulse) {
        body.addImpulse(impulse);
        return;
    }
    if (body.applyImpulse) {
        body.applyImpulse(impulse);
        return;
    }
    if (body.setLinearVelocity) {
        body.setLinearVelocity(velocityWorld);
        return;
    }
    if (body.setVelocity) {
        body.setVelocity(velocityWorld);
        return;
    }
    if (body.velocity !== undefined) {
        body.velocity = velocityWorld;
        return;
    }
    if (body.addForce) {
        if (typeof Physics !== "undefined" && Physics.ForceMode && Physics.ForceMode.Impulse) {
            body.addForce(impulse, Physics.ForceMode.Impulse);
        } else {
            body.addForce(impulse);
        }
    }
}

function applyAngularLaunch(body, angularVelocityWorld) {
    if (!body) {
        return;
    }
    if (body.setAngularVelocity) {
        body.setAngularVelocity(angularVelocityWorld);
        return;
    }
    if (body.angularVelocity !== undefined) {
        body.angularVelocity = angularVelocityWorld;
        return;
    }
    if (body.addAngularVelocity) {
        body.addAngularVelocity(angularVelocityWorld);
        return;
    }
    if (body.addTorque) {
        body.addTorque(angularVelocityWorld);
    }
}

function easeInBack(t) {
    var s = 1.70158;
    return t * t * ((s + 1) * t - s);
}

function smoothstep01(t) {
    return t * t * (3 - 2 * t);
}

function clamp01(t) {
    return Math.min(Math.max(t, 0), 1);
}

function setScaleImmediate(scaleVec) {
    if (!targetTransform) {
        return;
    }
    targetTransform.setLocalScale(scaleVec);
}

script.resetBase = function() {
    cacheBase();
    posOffset = new vec3(0, 0, 0);
    rotOffset = new vec3(0, 0, 0);
    posTarget = new vec3(0, 0, 0);
    rotTarget = new vec3(0, 0, 0);
    posTimer = 0;
    rotTimer = 0;
};

cacheBase();

function beginSequence() {
    if (!targetTransform) {
        return;
    }
    disableBody(getBody());
    targetTransform.setLocalPosition(START_LOCAL_POS);
    setScaleImmediate(START_SCALE);
    baseLocalPos = START_LOCAL_POS;
    baseLocalRot = targetTransform.getLocalRotation();
    posOffset = new vec3(0, 0, 0);
    rotOffset = new vec3(0, 0, 0);
    posTarget = new vec3(0, 0, 0);
    rotTarget = new vec3(0, 0, 0);
    posTimer = 0;
    rotTimer = 0;
    sequenceState = "scaleUp";
    sequenceTime = 0;
    shakeScale = 0;
    tweensTriggered = false;
    throwActive = false;
    usingPhysicsThrow = false;
}

function startThrow() {
    if (!targetTransform) {
        return;
    }
    throwActive = false;
    usingPhysicsThrow = false;
    if (!script.enableThrow) {
        return;
    }

    var body = getBody();
    if (body) {
        if (body.enabled !== undefined) {
            body.enabled = true;
        }
        setBodyDynamic(body);
        var worldRot = targetTransform.getWorldRotation();
        var velocityWorld = worldRot.multiplyVec3(script.throwVelocity);
        var angularWorldDeg = worldRot.multiplyVec3(script.throwAngularVelocity);
        var angularWorldRad = angularWorldDeg.uniformScale(DEG2RAD);
        wakeBody(body);
        applyLinearLaunch(body, velocityWorld);
        applyAngularLaunch(body, angularWorldRad);
        usingPhysicsThrow = true;
        return;
    }

    throwActive = true;
    throwPos = targetTransform.getLocalPosition();
    throwRot = targetTransform.getLocalRotation();
    throwVel = new vec3(script.throwVelocity.x, script.throwVelocity.y, script.throwVelocity.z);
    throwAngVel = new vec3(script.throwAngularVelocity.x, script.throwAngularVelocity.y, script.throwAngularVelocity.z);
}

function updateThrow(dt) {
    if (!throwActive || !targetTransform) {
        return;
    }
    throwVel = throwVel.add(new vec3(0, script.throwGravity * dt, 0));
    throwPos = throwPos.add(throwVel.uniformScale(dt));
    targetTransform.setLocalPosition(throwPos);

    var deltaRot = quat.fromEulerAngles(
        throwAngVel.x * DEG2RAD * dt,
        throwAngVel.y * DEG2RAD * dt,
        throwAngVel.z * DEG2RAD * dt
    );
    throwRot = throwRot.multiply(deltaRot);
    targetTransform.setLocalRotation(throwRot);
}

function updateSequence(dt) {
    if (sequenceState === "none") {
        return;
    }

    sequenceTime += dt;

    if (sequenceState === "scaleUp") {
        var tScale = clamp01(sequenceTime / SCALE_DURATION);
        var eased = easeInBack(tScale);
        if (eased < 0) {
            eased = 0;
        }
        var scaleNow = START_SCALE.add(END_SCALE.sub(START_SCALE).uniformScale(eased));
        setScaleImmediate(scaleNow);
        if (tScale >= 1) {
            setScaleImmediate(END_SCALE);
            sequenceState = "wait";
            sequenceTime = 0;
        }
        return;
    }

    if (sequenceState === "wait") {
        if (sequenceTime >= WAIT_DURATION) {
            sequenceState = "ramp";
            sequenceTime = 0;
            shakeScale = 0.1;
        }
        return;
    }

    if (sequenceState === "ramp") {
        var tRamp = clamp01(sequenceTime / RAMP_DURATION);
        var smoothT = smoothstep01(tRamp);
        baseLocalPos = START_LOCAL_POS.add(END_LOCAL_POS.sub(START_LOCAL_POS).uniformScale(smoothT));
        shakeScale = 0.1 + (1.0 - 0.1) * smoothT;
        if (tRamp >= 1) {
            baseLocalPos = END_LOCAL_POS;
            shakeScale = 1.0;
            sequenceState = "topWait";
            sequenceTime = 0;
            logic.cardboardReady();
        }
        return;
    }

    if (sequenceState === "topWait") {
        if (sequenceTime >= TOP_WAIT_DURATION) {
            if (!tweensTriggered) {
                tweensTriggered = true;
                if (global.tweenManager && global.tweenManager.startTween) {
                    var tweenTarget = script.getSceneObject();
                    global.tweenManager.startTween(tweenTarget, "right-flap-open");
                    global.tweenManager.startTween(tweenTarget, "left-flap-open");
                }
            }
            shakeScale = 0;
            posTarget = new vec3(0, 0, 0);
            rotTarget = new vec3(0, 0, 0);
            posOffset = new vec3(0, 0, 0);
            rotOffset = new vec3(0, 0, 0);
            sequenceState = "flapWait";
            sequenceTime = 0;
        }
        return;
    }

    if (sequenceState === "flapWait") {
        if (sequenceTime >= FLAP_WAIT_DURATION) {
            startThrow();
            sequenceState = "throw";
        }
        return;
    }
}

function update() {
    if (!targetTransform) {
        return;
    }
    if (baseLocalPos === null || baseLocalRot === null) {
        cacheBase();
    }

    var dt = getDeltaTime();
    updateSequence(dt);

    if (usingPhysicsThrow) {
        return;
    }

    if (throwActive) {
        updateThrow(dt);
        return;
    }

    var activeScale = shakeScale;
    var isActive = script.enableShake && script.intensity > 0 && activeScale > 0;

    if (isActive) {
        var posFreq = Math.max(script.positionFrequency * activeScale, 0);
        var rotFreq = Math.max(script.rotationFrequency * activeScale, 0);
        posTimer += dt;
        rotTimer += dt;

        if (posFreq > 0 && posTimer >= 1 / posFreq) {
            posTimer = 0;
            posTarget = randomOffset(script.positionAmplitude, script.intensity * activeScale);
        }
        if (rotFreq > 0 && rotTimer >= 1 / rotFreq) {
            rotTimer = 0;
            rotTarget = randomOffset(script.rotationAmplitude, script.intensity * activeScale);
        }

        posOffset = smoothVec3(posOffset, posTarget, script.positionSmoothing, dt);
        rotOffset = smoothVec3(rotOffset, rotTarget, script.rotationSmoothing, dt);
    } else {
        posOffset = smoothVec3(posOffset, new vec3(0, 0, 0), script.returnSpeed, dt);
        rotOffset = smoothVec3(rotOffset, new vec3(0, 0, 0), script.returnSpeed, dt);
    }

    targetTransform.setLocalPosition(baseLocalPos.add(posOffset));

    var rotQuat = quat.fromEulerAngles(
        rotOffset.x * DEG2RAD,
        rotOffset.y * DEG2RAD,
        rotOffset.z * DEG2RAD
    );
    var finalRot = baseLocalRot.multiply(rotQuat);
    targetTransform.setLocalRotation(finalRot);
}

script.createEvent("UpdateEvent").bind(update);
script.createEvent("OnStartEvent").bind(beginSequence);
