// @input SceneObject buttonFace
// @input vec3 faceSize = {"x":3.0,"y":3.0,"z":3.0} "Face Size (cm)"
// @input float maxTravel = 1.5 "Max Travel (cm)"
// @input bool debugLogs = true "Debug Logs"

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var warnedNoFace = false;
var baseLocalPos = null;
var restWorldPos = null;
var restForward = null;
var currentDepth = 0;
var targetDepth = 0;
var DEPTH_LERP = 15.0;

function log(msg) {
    if (script.debugLogs) {
        print("[PushButton] " + msg);
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function getFaceTransform() {
    if (!script.buttonFace) {
        return null;
    }
    return script.buttonFace.getTransform();
}

function isInsideBounds(point, center, halfSize) {
    var offset = point.sub(center);
    return (
        Math.abs(offset.x) <= halfSize.x &&
        Math.abs(offset.y) <= halfSize.y &&
        Math.abs(offset.z) <= halfSize.z
    );
}

function checkHand(hand, center, half) {
    if (!hand || !hand.isTracked()) {
        return false;
    }
    var tips = [
        { name: "thumb", pos: hand.thumbTip.position },
        { name: "index", pos: hand.indexTip.position },
        { name: "middle", pos: hand.middleTip.position },
        { name: "ring", pos: hand.ringTip.position },
        { name: "pinky", pos: hand.pinkyTip.position },
    ];
    for (var i = 0; i < tips.length; i++) {
        var tip = tips[i];
        if (isInsideBounds(tip.pos, center, half)) {
            log("In face area: " + hand.handType + " " + tip.name);
            return true;
        }
    }
    return false;
}

function onUpdate() {
    var faceTransform = getFaceTransform();
    if (!faceTransform) {
        if (!warnedNoFace) {
            log("buttonFace not set");
            warnedNoFace = true;
        }
        return;
    }
    warnedNoFace = false;
    if (baseLocalPos === null) {
        baseLocalPos = faceTransform.getLocalPosition();
        restWorldPos = faceTransform.getWorldPosition();
        restForward = faceTransform.getWorldRotation().multiplyVec3(vec3.forward()).normalize();
    }

    var center = restWorldPos;
    var size = script.faceSize || new vec3(0, 0, 0);
    var half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    // Face position is the front face center; shift the detection center backward by half the depth
    var forward = restForward;
    var detectionCenter = center.sub(forward.uniformScale(half.z));

    var anyHit = checkHand(leftHand, detectionCenter, half) || checkHand(rightHand, detectionCenter, half);

    // Push behavior: move face inward along -forward based on deepest fingertip within bounds, smoothed
    var maxDepth = 0;
    if (anyHit) {
        var hands = [leftHand, rightHand];
        for (var h = 0; h < hands.length; h++) {
            var hand = hands[h];
            if (!hand || !hand.isTracked()) { continue; }
            var tips = [hand.thumbTip.position, hand.indexTip.position, hand.middleTip.position, hand.ringTip.position, hand.pinkyTip.position];
            for (var t = 0; t < tips.length; t++) {
                var offset = tips[t].sub(restWorldPos);
                var depth = -offset.dot(forward); // positive when pushing inward
                if (depth > maxDepth) { maxDepth = depth; }
            }
        }
    }

    var travelLimit = script.maxTravel !== undefined ? script.maxTravel : size.z;
    targetDepth = Math.min(Math.max(maxDepth, 0), Math.min(size.z, travelLimit));
    currentDepth = currentDepth + (targetDepth - currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1);

    if (baseLocalPos) {
        var localPos = new vec3(baseLocalPos.x, baseLocalPos.y, baseLocalPos.z - currentDepth);
        faceTransform.setLocalPosition(localPos);
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
