// @input SceneObject wireHead
// @input SceneObject wireHandle
// @input float followLerpSpeed = 10.0 "Follow Lerp Speed"
// @input Component.Text debugText
// @input SceneObject wireStartOrigin
// @input float wireLength = 15.0 "Max Wire Length (cm)"
// @input float connectThreshold = 1.0 "Connect Threshold (cm)"
// @input SceneObject wireEndSocket

var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
var handleManipulation = null;
var originTransform = script.wireStartOrigin ? script.wireStartOrigin.getTransform() : null;

var planeTransform = script.getSceneObject().getTransform();
var baseLocalPos = headTransform ? headTransform.getLocalPosition() : null;
var following = false;
var returning = false;
var startHeadPos = headTransform ? headTransform.getWorldPosition() : null;
var startHandlePos = handleTransform ? handleTransform.getWorldPosition() : null;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function lerpVec3(a, b, t) {
    return new vec3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
    );
}

function getPlaneNormal(rot) {
    return rot.multiplyVec3(vec3.forward()).normalize();
}

function getBaseOffset(rot) {
    if (!baseLocalPos) {
        return vec3.zero();
    }
    return rot.multiplyVec3(new vec3(0, 0, baseLocalPos.z));
}

function onHandleTriggerStart() {
    following = true;
    returning = false;
    print("a")
}

function onHandleTriggerEnd() {
    following = false;
    if (!handleTransform || !headTransform) {
        return;
    }

    var snapped = false;
    if (script.wireEndSocket) {
        var socketPos = script.wireEndSocket.getTransform().getWorldPosition();
        var headPos = headTransform.getWorldPosition();
        if (headPos.distance(socketPos) <= script.connectThreshold) {
            headTransform.setWorldPosition(socketPos);
            handleTransform.setWorldPosition(socketPos);
            snapped = true;
        }
    }

    if (!snapped) {
        returning = true;
    }
}

function onHandleManipulationUpdate() {
    if (!headTransform || !handleTransform || !planeTransform) {
        return;
    }
    var planePos = planeTransform.getWorldPosition();
    var planeRot = planeTransform.getWorldRotation();
    var normal = getPlaneNormal(planeRot);
    var headPos = headTransform.getWorldPosition();

    // Snap handle to head's local XY plane (align along plane normal)
    var toHead = headPos.sub(planePos);
    var distance = toHead.dot(normal);
    var projectedHead = headPos.sub(normal.uniformScale(distance));
    handleTransform.setWorldPosition(projectedHead.add(getBaseOffset(planeRot)));
}

function updateFollow() {
    if (returning) {
        updateReturn();
        return;
    }
    if (!following || !headTransform || !handleTransform || !planeTransform) {
        return;
    }
    var planePos = planeTransform.getWorldPosition();
    var planeRot = planeTransform.getWorldRotation();
    var normal = getPlaneNormal(planeRot);
    var handlePos = handleTransform.getWorldPosition();

    // Project handle onto plane XY (plane normal), then add base local Z offset.
    var toHandle = handlePos.sub(planePos);
    var distance = toHandle.dot(normal);
    var projected = handlePos.sub(normal.uniformScale(distance));
    var targetWorld = projected.add(getBaseOffset(planeRot));

    var current = headTransform.getWorldPosition();
    var lerpT = clamp(getDeltaTime() * script.followLerpSpeed, 0, 1);
    var next = lerpVec3(current, targetWorld, lerpT);
    headTransform.setWorldPosition(next);

    // Clamp wire length
    if (originTransform) {
        var headPos = headTransform.getWorldPosition();
        var originPos = originTransform.getWorldPosition();
        var dist = headPos.distance(originPos);
        if (dist > script.wireLength) {
            var dir = headPos.sub(originPos).normalize();
            var clampedPos = originPos.add(dir.uniformScale(script.wireLength));
            headTransform.setWorldPosition(clampedPos);
        }
    }

    // Snap to end socket if close enough
    if (script.wireEndSocket) {
        var socketPos = script.wireEndSocket.getTransform().getWorldPosition();
        var headPos2 = headTransform.getWorldPosition();
        var d2 = headPos2.distance(socketPos);
        if (d2 <= script.connectThreshold) {
            headTransform.setWorldPosition(socketPos);
        }
    }

    if (originTransform && script.debugText) {
        var distDisplay = headTransform.getWorldPosition().distance(originTransform.getWorldPosition());
        script.debugText.text = distDisplay.toFixed(2);
        print("Wire distance: " + distDisplay.toFixed(2));
    }
}

function updateReturn() {
    if (!headTransform || !handleTransform || !startHeadPos || !startHandlePos) {
        returning = false;
        return;
    }
    var lerpT = clamp(getDeltaTime() * script.followLerpSpeed, 0, 1);

    var headNext = lerpVec3(headTransform.getWorldPosition(), startHeadPos, lerpT);
    var handleNext = lerpVec3(handleTransform.getWorldPosition(), startHandlePos, lerpT);
    headTransform.setWorldPosition(headNext);
    handleTransform.setWorldPosition(handleNext);

    var headClose = headNext.distance(startHeadPos) < 0.01;
    var handleClose = handleNext.distance(startHandlePos) < 0.01;
    if (headClose && handleClose) {
        headTransform.setWorldPosition(startHeadPos);
        handleTransform.setWorldPosition(startHandlePos);
        returning = false;
    }
}

function init() {
    if (script.wireHandle) {
        handleManipulation = script.wireHandle.getComponent("Component.ScriptComponent");
        if (handleManipulation) {
            if (handleManipulation.onTranslationStart) {
                handleManipulation.onTranslationStart.add(onHandleTriggerStart);
            }
            if (handleManipulation.onTranslationEnd) {
                handleManipulation.onTranslationEnd.add(onHandleTriggerEnd);
            }
            // if (handleManipulation.onManipulationUpdate) {
            //     handleManipulation.onManipulationUpdate.add(onHandleManipulationUpdate);
            // }
        }
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(updateFollow);

script.createEvent("OnStartEvent").bind(init);
