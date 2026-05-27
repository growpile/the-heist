// @input float proximity = 5.0 "Proximity (cm)"
// @input bool debugLogs = true "Debug Logs"

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var originPos = script.getSceneObject().getTransform().getWorldPosition();

function log(msg) {
    if (script.debugLogs) {
        print("[PushButton] " + msg);
    }
}

function checkHand(hand) {
    if (!hand || !hand.isTracked()) {
        return false;
    }
    var indexTip = hand.indexTip.position;
    var dist = indexTip.distance(originPos);
    if (dist <= script.proximity) {
        log("In Distance");
        return true;
    }
    return false;
}

function update() {
    // refresh origin in case the object moves
    originPos = script.getSceneObject().getTransform().getWorldPosition();
    checkHand(leftHand);
    checkHand(rightHand);
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
