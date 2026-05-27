//@input SceneObject safeRotateOrigin
/** @type {SceneObject} */
var safeRotateOrigin = script.safeRotateOrigin;
// @input Physics.ColliderComponent leftArea
/** @type {ColliderComponent} */
var leftArea = script.leftArea;
// @input Physics.ColliderComponent rightArea
/** @type {ColliderComponent} */
var rightArea = script.rightArea;

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var leftHand = SIK.HandInputData.getHand("left");
var rightHand = SIK.HandInputData.getHand("right");

var leftAreaHitLeft = false;
var leftAreaHitRight = false;
var rightAreaHitLeft = false;
var rightAreaHitRight = false;

function isInsideBounds(point, center, halfSize) {
    var offset = point.sub(center);
    return (
        Math.abs(offset.x) <= halfSize.x &&
        Math.abs(offset.y) <= halfSize.y &&
        Math.abs(offset.z) <= halfSize.z
    );
}

function getColliderBox(collider) {
    if (!collider) { return null; }
    var shape = collider.shape;
    if (!shape || !shape.size) { return null; }
    var so = collider.getSceneObject();
    if (!so) { return null; }
    var center = so.getTransform().getWorldPosition();
    var size = shape.size;
    var half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    return { center: center, half: half };
}

function getHandPoint(hand) {
    if (!hand || !hand.isTracked()) { return null; }
    if (hand.getPalmCenter) {
        return hand.getPalmCenter();
    }
    return hand.indexTip ? hand.indexTip.position : null;
}

function isHandInArea(hand, areaBox) {
    if (!areaBox) { return false; }
    var point = getHandPoint(hand);
    if (!point) { return false; }
    return isInsideBounds(point, areaBox.center, areaBox.half);
}

function leftRotation(handLabel) {
    print(handLabel + " Hand triggered Left Rotation");
}

function rightRotation(handLabel) {
    print(handLabel + " Hand triggered Right Rotation");
}

function onUpdate() {
    var leftBox = getColliderBox(leftArea);
    var rightBox = getColliderBox(rightArea);

    var leftInLeft = isHandInArea(leftHand, leftBox);
    var rightInLeft = isHandInArea(rightHand, leftBox);
    if (leftInLeft && !leftAreaHitLeft) { leftRotation("Left"); }
    if (rightInLeft && !leftAreaHitRight) { leftRotation("Right"); }
    leftAreaHitLeft = leftInLeft;
    leftAreaHitRight = rightInLeft;

    var leftInRight = isHandInArea(leftHand, rightBox);
    var rightInRight = isHandInArea(rightHand, rightBox);
    if (leftInRight && !rightAreaHitLeft) { rightRotation("Left"); }
    if (rightInRight && !rightAreaHitRight) { rightRotation("Right"); }
    rightAreaHitLeft = leftInRight;
    rightAreaHitRight = rightInRight;
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
