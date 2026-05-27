//@input Component.ScriptComponent interactable
//@input Component.ScriptComponent manipulation
// @input float pinchDistance = 2.5 "Pinch Distance (cm)"
// @input float rotationLerpSpeed = 10.0 "Rotation Lerp Speed"
// @input bool debugLogs = true "Print Debug Logs"

/** @type {ScriptComponent} */
var interactable = script.interactable;
/** @type {ScriptComponent} */
var manipulation = script.manipulation;

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var transform = script.getSceneObject().getTransform();
var activeHand = null;
var pinchActive = false;
var pinchStartAngle = 0;
var smoothedDelta = 0;
var targetDelta = 0;
var baseRotation = transform.getLocalRotation();
var baseZ = getQuatEuler(baseRotation).z;

interactable.onTriggerStart.add(function () {
    print("Started Dialing the Dialer!");
});

function log(msg) {
    if (script.debugLogs) {
        print("[DialInteractable] " + msg);
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

function getHandUpVector(hand) {
    var forward = hand.wrist.position.sub(hand.middleTip.position).normalize();
    var right = hand.thumbBaseJoint.position
        .sub(hand.pinkyKnuckle.position)
        .normalize();
    if (hand.handType === "right") {
        right = right.uniformScale(-1);
    }
    return forward.cross(right).normalize();
}

function getHandRollAroundZ(hand) {
    // Build a simple basis from joint positions and extract the roll projected to world Z.
    var forward = hand.middleTip.position.sub(hand.wrist.position).normalize();
    var up = getHandUpVector(hand);
    var right = up.cross(forward).normalize();

    // Fall back to forward if right degenerates.
    if (!isFinite(right.x) || right.length < 1e-3) {
        right = forward;
    }

    var projected = new vec2(right.x, right.y);
    if (projected.length < 1e-3) {
        projected = new vec2(forward.x, forward.y);
    }
    return Math.atan2(projected.y, projected.x); // radians
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

function beginPinch(hand) {
    pinchActive = true;
    activeHand = hand;
    pinchStartAngle = getHandRollAroundZ(hand);
    baseRotation = transform.getLocalRotation();
    baseZ = getQuatEuler(baseRotation).z;
    smoothedDelta = 0;
    targetDelta = 0;
    log("Pinch started (" + hand.handType + ")");
}

function endPinch() {
    pinchActive = false;
    activeHand = null;
    log("Pinch ended");
}

function applyRotation() {
    var baseEuler = getQuatEuler(baseRotation);
    var newEuler = new vec3(baseEuler.x, baseEuler.y, baseZ + smoothedDelta);
    transform.setLocalRotation(quat.fromEulerVec(newEuler));
}

function update() {
    var hand = chooseHand();

    if (!hand || !hand.isTracked()) {
        if (pinchActive) {
            endPinch();
        }
        return;
    }

    var thumbTip = hand.thumbTip.position;
    var indexTip = hand.indexTip.position;
    var distance = thumbTip.distance(indexTip);

    log("Thumb-Index distance: " + distance.toFixed(2) + " cm");

    if (distance < script.pinchDistance) {
        if (!pinchActive) {
            beginPinch(hand);
        }

        var roll = getHandRollAroundZ(hand);
        targetDelta = normalizeAngle(roll - pinchStartAngle);
        smoothedDelta = lerp(
            smoothedDelta,
            targetDelta,
            getDeltaTime() * script.rotationLerpSpeed
        );
        applyRotation();
    } else if (pinchActive) {
        endPinch();
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
