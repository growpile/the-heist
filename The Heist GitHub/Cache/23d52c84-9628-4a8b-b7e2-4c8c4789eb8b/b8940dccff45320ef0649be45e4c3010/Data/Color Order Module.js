// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

// @input Asset.Material redMaterial
/** @type {Material} */
var redMaterial = script.redMaterial;
// @input Asset.Material greenMaterial
/** @type {Material} */
var greenMaterial = script.greenMaterial;
// @input Asset.Material blueMaterial
/** @type {Material} */
var blueMaterial = script.blueMaterial;
// @input Asset.Material yellowMaterial
/** @type {Material} */
var yellowMaterial = script.yellowMaterial;

script.isModuleReady = false;
let safeContext;

function setupButtonColors() {
    var materials = [redMaterial, greenMaterial, blueMaterial, yellowMaterial].filter(function(material) {
        return material != null;
    });
    if (materials.length === 0) { return; }

    // Shuffle materials so each button gets a unique random color.
    for (var m = materials.length - 1; m > 0; m--) {
        var swapIndex = global.utils && global.utils.rng ? global.utils.rng(0, m) : Math.floor(Math.random() * (m + 1));
        var temp = materials[m];
        materials[m] = materials[swapIndex];
        materials[swapIndex] = temp.clone();
    }

    for (let i = 0; i < buttonComponents.length; i++) {
        var scriptComp = buttonComponents[i];
        if (!scriptComp) { continue; }
        var buttonObject = scriptComp.getSceneObject();
        if (!buttonObject || buttonObject.getChildrenCount() < 1) { continue; }
        var firstChild = buttonObject.getChild(0);
        if (!firstChild || firstChild.getChildrenCount() < 1) { continue; }
        var visualObject = firstChild.getChild(0);
        if (!visualObject) { continue; }
        var visual = visualObject.getComponent("Component.RenderMeshVisual");
        if (!visual) { continue; }
        var materialIndex = i % materials.length;
        visual.mainMaterial = materials[materialIndex];
    }
}

script.setupModule = function(safeContext) {
    // currentTime = global.appState.currentClientTime;
    // based on rules, written here, form an array of buttons
    if(safeContext.serialNumber.containsWord && global.utils.arrayContains(safeContext.modulesList, "casinoCarousel")) {
        // 0213
        return;
    }
    if(safeContext.serialNumber.numbers > 3) {
        // 3210
        return;
    }
    if(global.utils.arrayContains(safeContext.modulesList, "casinoCarousel")) {
        // 3012
        return;
    }
    // 0123


    correctButtonIdSequence = [0,1,2,3]; // based on safe context
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;
    print("Pressed: " + id);
}
