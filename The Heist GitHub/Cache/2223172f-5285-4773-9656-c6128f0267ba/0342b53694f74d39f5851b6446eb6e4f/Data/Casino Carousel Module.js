// @input SceneObject[] slotSpinners
/** @type {SceneObject[]} */
var slotSpinners = script.slotSpinners;

// @input SceneObject lever
/** @type {SceneObject} */
var lever = script.lever;

// @input SceneObject leverBall
/** @type {SceneObject} */
var leverBall = script.leverBall;

// @input SceneObject leverHandle
/** @type {SceneObject} */
var leverHandle = script.leverHandle;
// @input float leverMaxDegrees = 30
/** @type {number} */
var leverMaxDegrees = script.leverMaxDegrees;
// @input vec2 handleMinMaxDistance = "{0,1}"
/** @type {vec2} */
var handleMinMaxDistance = script.handleMinMaxDistance;

var SPIN_DURATION = 3;
var DEG_TO_RAD = 0.0174533;
var spinnerMaterials = [];
var baseLeverRotation = null;
var currentLeverAngle = 0;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

script.setupModule = function(safeContext, safeComponent, slotId) {
    createSpinnerMaterials();
};

script.animationFinished = function() {
};

function collectSpinnerVisuals(sceneObject, visuals) {
    if (!sceneObject) { return; }
    var rmv = sceneObject.getComponent("Component.RenderMeshVisual");
    if (rmv) {
        visuals.push(rmv);
    }
    var childCount = sceneObject.getChildrenCount();
    for (var i = 0; i < childCount; i++) {
        collectSpinnerVisuals(sceneObject.getChild(i), visuals);
    }
}

function createSpinnerMaterials() {
    spinnerMaterials = [];
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        var visuals = [];
        collectSpinnerVisuals(spinner, visuals);
        for (var v = 0; v < visuals.length; v++) {
            var visual = visuals[v];
            if (!visual || !visual.mainMaterial) { continue; }
            var cloned = visual.mainMaterial.clone();
            visual.clearMaterials();
            visual.mainMaterial = cloned;
            if (cloned.mainPass && cloned.mainPass.progress !== undefined) {
                cloned.mainPass.progress = 0;
            } else if (cloned.progress !== undefined) {
                cloned.progress = 0;
            }
            spinnerMaterials.push(cloned);
        }
    }
}

function getSymbolStep(symbolId) {
    if (symbolId === "diamond") { return 0; }
    if (symbolId === "spade") { return 1; }
    if (symbolId === "heart") { return 2; }
    if (symbolId === "club") { return 3; }
    return 0;
}

function spinSpinnersToSymbol(symbolId) {
    if (spinnerMaterials.length === 0) {
        createSpinnerMaterials();
    }
    var step = getSymbolStep(symbolId);
    var totalDegrees = 360 * 5 + step * 90;
    var totalRadians = totalDegrees * DEG_TO_RAD;
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        var transform = spinner.getTransform();
        var startQuat = transform.getLocalRotation();
        if (spinner.__spinAnim && spinner.__spinAnim.updateEvent) {
            spinner.__spinAnim.updateEvent.enabled = false;
            spinner.__spinAnim.updateEvent = null;
        }
        var animData = {
            startTime: getTime(),
            updateEvent: script.createEvent("UpdateEvent")
        };
        spinner.__spinAnim = animData;

        (function(tfm, startQ, anim) {
            anim.updateEvent.bind(function() {
                var elapsed = getTime() - anim.startTime;
                var t = Math.min(elapsed / SPIN_DURATION, 1);
                var smoothT = t * t * (3 - 2 * t);
                var angle = totalRadians * smoothT;
                for (var m = 0; m < spinnerMaterials.length; m++) {
                    var mat = spinnerMaterials[m];
                    if (!mat) { continue; }
                    var progress = smoothT < 0.25 ? smoothT * 4 : (smoothT > 0.75 ? (1 - smoothT) * 4 : 1);
                    if (mat.mainPass && mat.mainPass.progress !== undefined) {
                        mat.mainPass.progress = progress;
                    } else if (mat.progress !== undefined) {
                        mat.progress = progress;
                    }
                }
                var delta = quat.angleAxis(angle, vec3.right());
                var current = startQ.multiply(delta);
                current.normalize();
                tfm.setLocalRotation(current);
                if (t >= 1) {
                    tfm.setLocalRotation(startQ.multiply(quat.angleAxis(totalRadians, vec3.right())));
                    for (var m2 = 0; m2 < spinnerMaterials.length; m2++) {
                        var mat2 = spinnerMaterials[m2];
                        if (!mat2) { continue; }
                        if (mat2.mainPass && mat2.mainPass.progress !== undefined) {
                            mat2.mainPass.progress = 0;
                        } else if (mat2.progress !== undefined) {
                            mat2.progress = 0;
                        }
                    }
                    anim.updateEvent.enabled = false;
                    anim.updateEvent = null;
                }
            });
        })(transform, startQuat, animData);
    }
}

// Test spin
spinSpinnersToSymbol("club");

createSpinnerMaterials();

var following = false;
function onHandleStart() {
    print("handle start")
    following = true;

}

function onHandleEnd() {
    print("handle end")
    following = false;
    leverHandle.getTransform().setWorldPosition(leverBall.getTransform().getWorldPosition());
}


var leverInteractableManipulation = leverHandle.getComponent("Component.ScriptComponent");
script.createEvent("OnStartEvent").bind(function(eventData){
    leverInteractableManipulation.onTranslationStart.add(onHandleStart);
    leverInteractableManipulation.onTranslationEnd.add(onHandleEnd);
});


script.createEvent("UpdateEvent").bind(function(eventData){
    if (!leverHandle || !leverBall || !lever) { return; }
    if (!baseLeverRotation) {
        baseLeverRotation = lever.getTransform().getLocalRotation();
        currentLeverAngle = 0;
    }
    var handlePos = leverHandle.getTransform().getWorldPosition();
    var ballPos = leverBall.getTransform().getWorldPosition();
    var verticalDelta = handlePos.y - ballPos.y;
    var verticalDistance = Math.abs(verticalDelta);

    var minDist = handleMinMaxDistance ? handleMinMaxDistance.x : 0;
    var maxDist = handleMinMaxDistance ? handleMinMaxDistance.y : 1;
    if (maxDist <= minDist) { return; }
    var t = clamp((verticalDistance - minDist) / (maxDist - minDist), 0, 1);
    var direction = verticalDelta >= 0 ? 1 : -1;
    var targetAngle = (leverMaxDegrees || 0) * t * direction;
    currentLeverAngle = currentLeverAngle + (targetAngle - currentLeverAngle) * clamp(getDeltaTime() * 10, 0, 1);

    var delta = quat.angleAxis(currentLeverAngle * DEG_TO_RAD, vec3.right());
    var newRot = baseLeverRotation.multiply(delta);
    lever.getTransform().setLocalRotation(newRot);
});
