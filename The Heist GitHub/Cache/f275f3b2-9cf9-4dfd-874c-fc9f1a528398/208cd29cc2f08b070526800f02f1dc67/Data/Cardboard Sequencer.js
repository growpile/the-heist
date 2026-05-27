// @input SceneObject target
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

var START_LOCAL_POS = new vec3(0, 34, -10);
var END_LOCAL_POS = new vec3(0, 70, -10);
var START_SCALE = new vec3(0, 0, 0);
var END_SCALE = new vec3(0.874, 0.874, 0.874);
var SCALE_DURATION = 0.25;
var WAIT_DURATION = 0.5;
var RAMP_DURATION = 2.0;

var sequenceState = "none";
var sequenceTime = 0;
var shakeScale = 1.0;
var tweensTriggered = false;

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
            sequenceState = "done";
        }
        return;
    }

    if (sequenceState === "done" && !tweensTriggered) {
        tweensTriggered = true;
        if (global.tweenManager && global.tweenManager.startTween) {
            var tweenTarget = script.getSceneObject();
            global.tweenManager.startTween(tweenTarget, "right-flap-open");
            global.tweenManager.startTween(tweenTarget, "right-flap-open");
        }
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
