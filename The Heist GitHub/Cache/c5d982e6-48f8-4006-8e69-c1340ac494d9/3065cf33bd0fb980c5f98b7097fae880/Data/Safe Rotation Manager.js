//@input SceneObject safeRotateOrigin
/** @type {SceneObject} */
var safeRotateOrigin = script.safeRotateOrigin;
// @input Physics.BodyComponent leftArea
/** @type {BodyComponent} */
var leftArea = script.leftArea;
// @input Physics.BodyComponent rightArea
/** @type {BodyComponent} */
var rightArea = script.rightArea;

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var leftHand = SIK.HandInputData.getHand("left");
var rightHand = SIK.HandInputData.getHand("right");
var InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;

var leftAreaHitLeft = false;
var leftAreaHitRight = false;
var rightAreaHitLeft = false;
var rightAreaHitRight = false;
var lastEditorHitInfo = null;

var LEFT_AREA_NAME = "Rotate Left Area";
var RIGHT_AREA_NAME = "Rotate Right Area";

var rotateTransform = safeRotateOrigin ? safeRotateOrigin.getTransform() : null;
var rotationAnim = null;

function getQuatEuler(q) {
    if (!q) {
        return new vec3(0, 0, 0);
    }
    if (q.toEulerAngles) {
        return q.toEulerAngles();
    }
    if (q.toEulerVec) {
        return q.toEulerVec();
    }
    return new vec3(0, 0, 0);
}

function animateYawDelta(deltaRadians, duration) {
    if (!rotateTransform) { return; }
    if (rotationAnim && rotationAnim.updateEvent) {
        return;
    }

    var startQuat = rotateTransform.getLocalRotation();
    var startEuler = getQuatEuler(startQuat);
    var targetEuler = new vec3(startEuler.x, startEuler.y + deltaRadians, startEuler.z);
    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    rotationAnim = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        var yaw = startEuler.y + (targetEuler.y - startEuler.y) * smoothT;
        rotateTransform.setLocalRotation(quat.fromEulerVec(new vec3(startEuler.x, yaw, startEuler.z)));
        if (t >= 1) {
            rotateTransform.setLocalRotation(quat.fromEulerVec(targetEuler));
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
        }
    });
}

function isInsideBounds(point, center, halfSize) {
    var offset = point.sub(center);
    return (
        Math.abs(offset.x) <= halfSize.x &&
        Math.abs(offset.y) <= halfSize.y &&
        Math.abs(offset.z) <= halfSize.z
    );
}

function getBodyCollider(body) {
    if (!body || !body.getSceneObject) { return null; }
    var so = body.getSceneObject();
    if (!so) { return null; }
    var collider = so.getComponent("Physics.ColliderComponent");
    if (collider) { return collider; }
    for (var i = 0; i < so.getChildrenCount(); i++) {
        var child = so.getChild(i);
        if (!child) { continue; }
        var childCollider = child.getComponent("Physics.ColliderComponent");
        if (childCollider) { return childCollider; }
    }
    return null;
}

function getColliderBox(body) {
    var collider = getBodyCollider(body);
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
    animateYawDelta(-Math.PI * 0.5, 0.25);
}

function rightRotation(handLabel) {
    print(handLabel + " Hand triggered Right Rotation");
    animateYawDelta(Math.PI * 0.5, 0.25);
}

function isHitArea(hitInfo, areaBody) {
    if (!hitInfo || !hitInfo.hit || !hitInfo.hit.collider || !areaBody) {
        return false;
    }
    var areaObj = areaBody.getSceneObject ? areaBody.getSceneObject() : null;
    if (!areaObj) { return false; }
    var areaName = areaObj.name || "";
    if (!areaName) { return false; }
    var so = hitInfo.hit.collider.getSceneObject();
    while (so) {
        if (so.name === areaName) {
            return true;
        }
        so = so.getParent ? so.getParent() : null;
    }
    return false;
}

function isHitAreaName(hitInfo, areaName) {
    if (!hitInfo || !hitInfo.hit || !hitInfo.hit.collider || !areaName) {
        return false;
    }
    var so = hitInfo.hit.collider.getSceneObject();
    while (so) {
        if (so.name === areaName) {
            return true;
        }
        so = so.getParent ? so.getParent() : null;
    }
    return false;
}

function checkEditorClick() {
    if (!global.deviceInfoSystem || !global.deviceInfoSystem.isEditor()) {
        return;
    }
    var interactorList = SIK.InteractionManager.getTargetingInteractors();
    var primaryInteractor = interactorList.length > 0 ? interactorList[0] : null;
    if (!primaryInteractor) {
        return;
    }
    var currentHit = primaryInteractor.targetHitInfo;
    if (currentHit && currentHit.hit && currentHit.hit.collider) {
        lastEditorHitInfo = currentHit;
    }

    if (primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
        primaryInteractor.currentTrigger === InteractorTriggerType.None) {
        var hitInfo = currentHit || lastEditorHitInfo;
        if (isHitAreaName(hitInfo, LEFT_AREA_NAME)) {
            leftRotation("Editor");
        } else if (isHitAreaName(hitInfo, RIGHT_AREA_NAME)) {
            rightRotation("Editor");
        }
    }
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

    checkEditorClick();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
