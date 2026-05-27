// @input float fingerProximity = 5.0 "Finger Proximity (cm)"
// @input float rotationLerpSpeed = 10.0 "Rotation Lerp Speed"
// @input float minAngularStep = 0.01 "Min Angle Step (rad)"
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
var prevIndexAngle = null;

function log(msg) {
    if (script.debugLogs) {
        print("[RotaryDial] " + msg);
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
    var index = hand.indexTip.position;
    var indexClose = index.distance(objPos) < script.fingerProximity;

    if (!indexClose) {
        if (rotating) {
            resetInteraction();
        }
        return;
    }

    var angle = getAngleAroundObject(index, objPos);

    if (prevIndexAngle === null) {
        prevIndexAngle = angle;
        baseRotation = transform.getLocalRotation();
        baseZ = getQuatEuler(baseRotation).z;
        targetDelta = 0;
        smoothedDelta = 0;
        rotating = true;
        log("Rotary dial started (" + hand.handType + ")");
        return;
    }

    var delta = normalizeAngle(angle - prevIndexAngle);
    if (Math.abs(delta) > script.minAngularStep) {
        targetDelta += delta;
    }

    smoothedDelta = lerp(
        smoothedDelta,
        targetDelta,
        getDeltaTime() * script.rotationLerpSpeed
    );
    applyRotation();

    prevIndexAngle = angle;
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
