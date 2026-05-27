// @input SceneObject buttonFace
// @input vec3 faceSize = { "x": 3.0, "y": 3.0, "z": 3.0 } "Face Size (cm)"
// @input float triggerPressure = 1.5 "Trigger Pressure (cm)"
// @input bool debugLogs = true "Debug Logs"

// A push button that follows the index fingertip into a bounded zone,
// triggers hover when the tip enters, and follows up to a trigger depth.
// Rotation is locked; position is smoothed toward the fingertip along face forward.

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var faceTransform = script.buttonFace ? script.buttonFace.getTransform() : null;
var restPosition = faceTransform ? faceTransform.getWorldPosition() : null;
var restRotation = faceTransform ? faceTransform.getWorldRotation() : null;
var warnedNoFace = false;
var warnedInactive = false;

// Allow other scripts to disable interaction
if (script.active === undefined) {
    script.active = true;
}

var hoverActive = false;
var pressedActive = false;
var FOLLOW_LERP = 10.0;
var RELEASE_RATIO = 0.7; // how far to release before allowing another press event

function log(msg) {
    if (script.debugLogs) {
        print("[PushButton] " + msg);
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
}

function lerpVec3(a, b, t) {
    return new vec3(
        lerp(a.x, b.x, t),
        lerp(a.y, b.y, t),
        lerp(a.z, b.z, t)
    );
}

function chooseHands() {
    var hands = [];
    if (leftHand && leftHand.isTracked()) {
        hands.push(leftHand);
    }
    if (rightHand && rightHand.isTracked()) {
        hands.push(rightHand);
    }
    return hands;
}

function getForward() {
    if (!faceTransform) {
        return vec3.forward();
    }
    var rot = faceTransform.getWorldRotation();
    if (rot.multiplyVec3) {
        return rot.multiplyVec3(vec3.forward()).normalize();
    }
    // Fallback: use transform.forward if available
    if (faceTransform.forward) {
        return faceTransform.forward.normalize();
    }
    return vec3.forward();
}

function isInsideFaceBounds(pos) {
    if (!restPosition || !script.faceSize) {
        return false;
    }
    var half = script.faceSize.uniformScale
        ? script.faceSize.uniformScale(0.5)
        : new vec3(script.faceSize.x * 0.5, script.faceSize.y * 0.5, script.faceSize.z * 0.5);
    var offset = pos.sub(restPosition);
    return (
        Math.abs(offset.x) <= half.x &&
        Math.abs(offset.y) <= half.y &&
        Math.abs(offset.z) <= half.z
    );
}

function updateFace(targetPos) {
    if (!faceTransform) {
        return;
    }
    var current = faceTransform.getWorldPosition();
    var next = lerpVec3(current, targetPos, getDeltaTime() * FOLLOW_LERP);
    faceTransform.setWorldPosition(next);
    // Keep original rotation
    if (restRotation) {
        faceTransform.setWorldRotation(restRotation);
    }
}

function processHand(hand) {
    var indexTip = hand.indexTip.position;
    if (!isInsideFaceBounds(indexTip)) {
        return false;
    }

    log("In area!");

    if (!hoverActive) {
        hoverActive = true;
        log("hover");
    }

    if (!faceTransform || !restPosition) {
        return true;
    }

    var forward = getForward();
    var displacement = indexTip.sub(restPosition);
    var depth = displacement.dot(forward);
    var clampedDepth = clamp(depth, 0, script.triggerPressure);
    if (!pressedActive && clampedDepth >= script.triggerPressure) {
        pressedActive = true;
        log("pressed");
    } else if (pressedActive && clampedDepth < script.triggerPressure * RELEASE_RATIO) {
        pressedActive = false;
    }
    var target = restPosition.add(forward.uniformScale(clampedDepth));
    updateFace(target);
    return true;
}

function resetIfNeeded() {
    if (!faceTransform || !restPosition) {
        return;
    }
    updateFace(restPosition);
    hoverActive = false;
    pressedActive = false;
}

function onUpdate() {
    if (!script.active) {
        if (!warnedInactive) {
            log("inactive");
            warnedInactive = true;
        }
        return;
    }

    if (!script.buttonFace) {
        if (!warnedNoFace) {
            log("buttonFace not set");
            warnedNoFace = true;
        }
        return;
    }

    if (!faceTransform) {
        faceTransform = script.buttonFace.getTransform();
        restPosition = faceTransform ? faceTransform.getWorldPosition() : null;
        restRotation = faceTransform ? faceTransform.getWorldRotation() : null;
        warnedNoFace = false;
    }

    if (!faceTransform || !restPosition) {
        if (!warnedNoFace) {
            log("buttonFace transform missing");
            warnedNoFace = true;
        }
        return;
    }

    var hands = chooseHands();
    if (hands.length === 0) {
        if (hoverActive) {
            resetIfNeeded();
        }
        return;
    }

    var handled = false;
    for (var i = 0; i < hands.length; i++) {
        if (processHand(hands[i])) {
            handled = true;
            break;
        }
    }

    if (!handled && hoverActive) {
        resetIfNeeded();
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
