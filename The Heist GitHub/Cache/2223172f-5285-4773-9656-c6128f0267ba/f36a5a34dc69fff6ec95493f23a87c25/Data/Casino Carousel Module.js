// @input SceneObject[] slotSpinners
/** @type {SceneObject[]} */
var slotSpinners = script.slotSpinners;
var SPIN_DURATION = 1.5;
var DEG_TO_RAD = 0.0174533;

script.setupModule = function(safeContext, safeComponent, slotId) {
    createSpinnerMaterials();
};

script.animationFinished = function() {
};

function createSpinnerMaterials() {
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        var visuals = spinner.getComponents("Component.RenderMeshVisual");
        for (var v = 0; v < visuals.length; v++) {
            var visual = visuals[v];
            if (!visual || !visual.mainMaterial) { continue; }
            var cloned = visual.mainMaterial.clone();
            visual.clearMaterials();
            visual.mainMaterial = cloned;
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
                var delta = quat.angleAxis(angle, vec3.right());
                var current = startQ.multiply(delta);
                current.normalize();
                tfm.setLocalRotation(current);
                if (t >= 1) {
                    tfm.setLocalRotation(startQ.multiply(quat.angleAxis(totalRadians, vec3.right())));
                    anim.updateEvent.enabled = false;
                    anim.updateEvent = null;
                }
            });
        })(transform, startQuat, animData);
    }
}

// Test spin
spinSpinnersToSymbol("spade");

createSpinnerMaterials();
