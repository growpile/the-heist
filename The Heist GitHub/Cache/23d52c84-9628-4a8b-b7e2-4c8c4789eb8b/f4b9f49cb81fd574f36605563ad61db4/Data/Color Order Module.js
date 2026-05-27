// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

//@input Asset.Material redMaterial
/** @type {Material} */
var redMaterial = script.redMaterial;

script.isModuleReady = false;
let safeContext;

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