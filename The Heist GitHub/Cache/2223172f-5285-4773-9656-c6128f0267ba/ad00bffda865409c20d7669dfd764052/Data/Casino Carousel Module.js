// @input SceneObject[] slotSpinners
/** @type {SceneObject[]} */
var slotSpinners = script.slotSpinners;

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