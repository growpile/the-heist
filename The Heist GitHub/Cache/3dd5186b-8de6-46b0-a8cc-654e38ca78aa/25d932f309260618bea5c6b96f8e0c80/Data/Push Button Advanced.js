// @input SceneObject buttonFace
// @input vec3 faceSize = {"x":3.0,"y":3.0,"z":3.0} "Face Size (cm)"
// @input bool debugLogs = true "Debug Logs"

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var warnedNoFace = false;

function log(msg) {
    if (script.debugLogs) {
        print("[PushButton] " + msg);
    }
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

    var center = faceTransform.getWorldPosition();
    var size = script.faceSize || new vec3(0, 0, 0);
    var half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);

    checkHand(leftHand, center, half);
    checkHand(rightHand, center, half);
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
