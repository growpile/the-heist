//@input SceneObject safeRotateOrigin
/** @type {SceneObject} */
var safeRotateOrigin = script.safeRotateOrigin;
// @input Physics.BodyComponent leftArea
/** @type {BodyComponent} */
var leftArea = script.leftArea;
// @input Physics.BodyComponent rightArea
/** @type {BodyComponent} */
var rightArea = script.rightArea;
// @input Component.Image[] rotateIcons
/** @type {Image[]} */
var rotateIcons = script.rotateIcons;

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
var lastEditorStartArea = "";

var LEFT_AREA_NAME = "Rotate Left Area";
var RIGHT_AREA_NAME = "Rotate Right Area";
var HOLD_DURATION = 0.75;
var RELEASE_DURATION = 0.25;

var rotateTransform = safeRotateOrigin ? safeRotateOrigin.getTransform() : null;
var rotationAnim = null;
var baseEuler = null;
var accumulatedYaw = 0;
script.canRotate = true;
script.canRotate = true;

var leftState = { active: false, holdStart: 0, triggered: false, label: "" };
var rightState = { active: false, holdStart: 0, triggered: false, label: "" };
var iconAnims = [];

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
    global.playSfx(global.utils.rng(22, 25), 1, 1);
    if (!baseEuler) {
        baseEuler = getQuatEuler(rotateTransform.getLocalRotation());
        accumulatedYaw = 0;
    }
    var startYaw = accumulatedYaw;
    var targetYaw = accumulatedYaw + deltaRadians;
    var targetEuler = new vec3(baseEuler.x, baseEuler.y + targetYaw, baseEuler.z);
    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    rotationAnim = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        var yaw = startYaw + (targetYaw - startYaw) * smoothT;
        rotateTransform.setLocalRotation(quat.fromEulerVec(new vec3(baseEuler.x, baseEuler.y + yaw, baseEuler.z)));
        if (t >= 1) {
            rotateTransform.setLocalRotation(quat.fromEulerVec(targetEuler));
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
            accumulatedYaw = targetYaw;
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

function getIconMaterial(index) {
    if (!rotateIcons || !rotateIcons[index]) { return null; }
    return rotateIcons[index].mainMaterial || null;
}

function getIconProgress(material) {
    if (!material) { return null; }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        return material.mainPass.progress;
    }
    if (material.progress !== undefined) {
        return material.progress;
    }
    return null;
}

function setIconProgress(material, value) {
    if (!material) { return; }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        material.mainPass.progress = value;
    } else if (material.progress !== undefined) {
        material.progress = value;
    }
}

function animateIconProgress(index, targetValue, duration) {
    var material = getIconMaterial(index);
    if (!material) { return; }
    var startValue = getIconProgress(material);
    if (startValue === null || startValue === undefined) { return; }

    if (iconAnims[index] && iconAnims[index].updateEvent) {
        iconAnims[index].updateEvent.enabled = false;
        iconAnims[index].updateEvent = null;
    }

    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    iconAnims[index] = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        var value = startValue + (targetValue - startValue) * smoothT;
        setIconProgress(material, value);
        if (t >= 1) {
            setIconProgress(material, targetValue);
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
        }
    });
}

function updateHoldState(index, state, isActive, handLabel, triggerFn) {
    var now = getTime();
    if (isActive) {
        if (!state.active) {
            state.active = true;
            state.holdStart = now;
            state.triggered = false;
            state.label = handLabel || "";
            animateIconProgress(index, 1, HOLD_DURATION);
        } else if (handLabel) {
            state.label = handLabel;
        }
        if (!state.triggered && (now - state.holdStart) >= HOLD_DURATION) {
            if (script.canRotate && (!rotationAnim || !rotationAnim.updateEvent)) {
                state.triggered = true;
                triggerFn(state.label || "Hand");
            }
        }
    } else {
        if (state.active || state.triggered) {
            state.active = false;
            state.triggered = false;
            state.holdStart = 0;
            state.label = "";
            animateIconProgress(index, 0, RELEASE_DURATION);
        }
    }
}

function leftRotation(handLabel) {
    if (!script.canRotate) { return; }
    if (rotationAnim && rotationAnim.updateEvent) { return; }
    global.tweenManager.startTween(rotateIcons[1], "rotate-icon-animation");
    print(handLabel + " Hand triggered Left Rotation");
    animateYawDelta(-Math.PI * 0.5, 0.25);
}

function rightRotation(handLabel) {
    if (!script.canRotate) { return; }
    if (rotationAnim && rotationAnim.updateEvent) { return; }
    global.tweenManager.startTween(rotateIcons[1], "rotate-icon-animation");
    print(handLabel + " Hand triggered Right Rotation");
    animateYawDelta(Math.PI * 0.5, 0.25);
}

script.resetRotation = function() {
    if (!rotateTransform) { return; }
    if (!baseEuler) {
        baseEuler = getQuatEuler(rotateTransform.getLocalRotation());
    }
    if (accumulatedYaw === 0) {
        rotateTransform.setLocalRotation(quat.fromEulerVec(baseEuler));
        return;
    }
    animateYawDelta(-accumulatedYaw, 0.25);
};

global.resetRotation = script.resetRotation;

script.setCanRotate = function(state) {
    script.canRotate = !!state;
};

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
    if (primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
        primaryInteractor.currentTrigger === InteractorTriggerType.None) {
        var hitInfo = primaryInteractor.targetHitInfo || lastEditorHitInfo;
        if (lastEditorStartArea === LEFT_AREA_NAME && isHitAreaName(hitInfo, LEFT_AREA_NAME)) {
            animateIconProgress(0, 1, 0.25);
            global.utils.delay(0.25, function() {
                animateIconProgress(0, 0, RELEASE_DURATION);
            });
            leftRotation("Editor");
        } else if (lastEditorStartArea === RIGHT_AREA_NAME && isHitAreaName(hitInfo, RIGHT_AREA_NAME)) {
            animateIconProgress(1, 1, 0.25);
            global.utils.delay(0.25, function() {
                animateIconProgress(1, 0, RELEASE_DURATION);
            });
            rightRotation("Editor");
        }
        lastEditorHitInfo = null;
        lastEditorStartArea = "";
    } else if (primaryInteractor.previousTrigger === InteractorTriggerType.None &&
        primaryInteractor.currentTrigger !== InteractorTriggerType.None) {
        var startHit = primaryInteractor.targetHitInfo;
        lastEditorHitInfo = startHit;
        if (isHitAreaName(startHit, LEFT_AREA_NAME)) {
            lastEditorStartArea = LEFT_AREA_NAME;
        } else if (isHitAreaName(startHit, RIGHT_AREA_NAME)) {
            lastEditorStartArea = RIGHT_AREA_NAME;
        } else {
            lastEditorStartArea = "";
        }
    }
}

function onUpdate() {
    var leftBox = getColliderBox(leftArea);
    var rightBox = getColliderBox(rightArea);

    var leftInLeft = isHandInArea(leftHand, leftBox);
    var rightInLeft = isHandInArea(rightHand, leftBox);
    var leftActive = leftInLeft || rightInLeft;
    var leftLabel = leftInLeft ? "Left" : (rightInLeft ? "Right" : "Hand");
    updateHoldState(0, leftState, leftActive, leftLabel, leftRotation);

    var leftInRight = isHandInArea(leftHand, rightBox);
    var rightInRight = isHandInArea(rightHand, rightBox);
    var rightActive = leftInRight || rightInRight;
    var rightLabel = leftInRight ? "Left" : (rightInRight ? "Right" : "Hand");
    updateHoldState(1, rightState, rightActive, rightLabel, rightRotation);

    checkEditorClick();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
