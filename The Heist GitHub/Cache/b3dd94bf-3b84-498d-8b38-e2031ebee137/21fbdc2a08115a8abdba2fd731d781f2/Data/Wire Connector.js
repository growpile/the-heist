// @input SceneObject wireHead
// @input SceneObject wireHandle
// @input float followLerpSpeed = 10.0 "Follow Lerp Speed"
// @input Component.ScriptComponent handleManipulation
/** @type {ScriptComponent} */
var handleManipulation = script.handleManipulation;

var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
// var handleInteractable = null;

var planeTransform = script.getSceneObject().getTransform();
var baseLocalPos = headTransform ? headTransform.getLocalPosition() : null;
var following = false;

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
    print("a")
}

function onHandleTriggerEnd() {
    following = false;
    if (handleTransform && headTransform) {
        handleTransform.setWorldPosition(headTransform.getWorldPosition());
    }
}

function updateFollow() {
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
}

function init() {
    if (script.wireHandle) {
        // handleInteractable = script.wireHandle.getComponent("Component.ScriptComponent");
        // if (handleInteractable) {
            // if (handleInteractable.onTranslationStart) {
            print(handleManipulation.name);
                handleManipulation.onTranslationStart.add(onHandleTriggerStart);
            // }
            // if (handleInteractable.onTranslationEnd) {
                handleManipulation.onTranslationEnd.add(onHandleTriggerEnd);
            }
        }
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(updateFollow);

script.createEvent("OnStartEvent").bind(init);
