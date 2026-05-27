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

function update() {
    if (!targetTransform) {
        return;
    }
    if (baseLocalPos === null || baseLocalRot === null) {
        cacheBase();
    }

    var dt = getDeltaTime();
    var isActive = script.enableShake && script.intensity > 0;

    if (isActive) {
        var posFreq = Math.max(script.positionFrequency, 0);
        var rotFreq = Math.max(script.rotationFrequency, 0);
        posTimer += dt;
        rotTimer += dt;

        if (posFreq > 0 && posTimer >= 1 / posFreq) {
            posTimer = 0;
            posTarget = randomOffset(script.positionAmplitude, script.intensity);
        }
        if (rotFreq > 0 && rotTimer >= 1 / rotFreq) {
            rotTimer = 0;
            rotTarget = randomOffset(script.rotationAmplitude, script.intensity);
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
