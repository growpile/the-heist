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
    var buttonVisuals = [];
    for (let i = 0; i < buttonComponents.length; i++) {
        var scriptComp = buttonComponents[i];
        if (!scriptComp) { continue; }
        var buttonObject = scriptComp.getSceneObject();
        if (!buttonObject || buttonObject.getChildrenCount() < 1) { continue; }
        var firstChild = buttonObject.getChild(0);
        if (!firstChild || firstChild.getChildrenCount() < 1) { continue; }
        var visualObject = firstChild.getChild(0);
        if (!visualObject) { continue; }
        buttonVisuals.push(visualObject);
    }
    return buttonVisuals;
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
