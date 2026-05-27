// @input SceneObject rotaryGripObject
// @input float fingerProximity = 5.0 "Finger Proximity (cm)"
// @input float rotationLerpSpeed = 10.0 "Rotation Lerp Speed"
// @input float minAngularStep = 0.005 "Min Angle Step (rad)"
// @input bool debugLogs = true "Print Debug Logs"

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var transform = script.getSceneObject().getTransform();
var activeHand = null;
var rotating = false;
var targetDelta = 0;
var smoothedDelta = 0;
var baseRotation = transform.getLocalRotation();
var baseZ = getQuatEuler(baseRotation).z;
var prevThumbAngle = null;
var prevIndexAngle = null;

function log(msg) {
    if (script.debugLogs) {
        print("[NaturalDial] " + msg);
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

function normalizeAngle(angle) {
    while (angle > Math.PI) {
        angle -= Math.PI * 2;
    }
    while (angle < -Math.PI) {
        angle += Math.PI * 2;
    }
    return angle;
}

function getQuatEuler(quaternion) {
    if (!quaternion) {
        return new vec3(0, 0, 0);
    }
    if (quaternion.toEulerAngles) {
        return quaternion.toEulerAngles();
    }
    if (quaternion.toEulerVec) {
        return quaternion.toEulerVec();
    }
    return new vec3(0, 0, 0);
}

function chooseHand() {
    var targetPos = transform.getWorldPosition();
    var rightTracked = rightHand.isTracked();
    var leftTracked = leftHand.isTracked();

    if (rightTracked && leftTracked) {
        var rightDist = rightHand.getPalmCenter().distance(targetPos);
        var leftDist = leftHand.getPalmCenter().distance(targetPos);
        return rightDist <= leftDist ? rightHand : leftHand;
    }
    if (rightTracked) { return rightHand; }
    if (leftTracked) { return leftHand; }
    return null;
}

function getAngleAroundObject(fingerPos, objectPos) {
    var offset = fingerPos.sub(objectPos);
    return Math.atan2(offset.y, offset.x);
}

function resetInteraction() {
    rotating = false;
    activeHand = null;
    prevThumbAngle = null;
    prevIndexAngle = null;
    baseRotation = transform.getLocalRotation();
    baseZ = getQuatEuler(baseRotation).z;
}

function applyRotation() {
    var baseEuler = getQuatEuler(baseRotation);
    var newEuler = new vec3(baseEuler.x, baseEuler.y, baseZ + smoothedDelta);
    transform.setLocalRotation(quat.fromEulerVec(newEuler));
}

function update() {
    var hand = chooseHand();
    if (!hand || !hand.isTracked()) {
        if (rotating) {
            resetInteraction();
        }
        return;
    }
    activeHand = hand;

    var objPos = transform.getWorldPosition();
    var thumb = hand.thumbTip.position;
    var index = hand.indexTip.position;

    var thumbClose = thumb.distance(objPos) < script.fingerProximity;
    var indexClose = index.distance(objPos) < script.fingerProximity;

    if (!thumbClose || !indexClose) {
        if (rotating) {
            resetInteraction();
        }
        return;
    }

    var thumbAngle = getAngleAroundObject(thumb, objPos);
    var indexAngle = getAngleAroundObject(index, objPos);

    if (prevThumbAngle === null || prevIndexAngle === null) {
        var gripPos = null;
        if (script.rotaryGripObject && script.rotaryGripObject.getTransform) {
            gripPos = script.rotaryGripObject.getTransform().getWorldPosition();
        }
        var gripOk = gripPos === null
            ? true
            : (thumb.distance(gripPos) < 2 || index.distance(gripPos) < 2);
        if (!gripOk) {
            return;
        }

        prevThumbAngle = thumbAngle;
        prevIndexAngle = indexAngle;
        rotating = true;
        log("Dial interaction started (" + hand.handType + ")");
        return;
    }

    var thumbDelta = normalizeAngle(thumbAngle - prevThumbAngle);
    var indexDelta = normalizeAngle(indexAngle - prevIndexAngle);

    var opposing = thumbDelta * indexDelta < 0;
    var thumbStepOk = Math.abs(thumbDelta) > script.minAngularStep;
    var indexStepOk = Math.abs(indexDelta) > script.minAngularStep;

    if (opposing && thumbStepOk && indexStepOk) {
        var combined = (thumbDelta - indexDelta) * 0.5;
        targetDelta += combined;
    }

    smoothedDelta = lerp(
        smoothedDelta,
        targetDelta,
        getDeltaTime() * script.rotationLerpSpeed
    );
    applyRotation();

    prevThumbAngle = thumbAngle;
    prevIndexAngle = indexAngle;
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
