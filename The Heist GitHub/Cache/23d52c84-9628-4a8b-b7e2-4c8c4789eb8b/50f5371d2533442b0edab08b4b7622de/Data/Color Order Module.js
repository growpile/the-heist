//@input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

script.isModuleReady = false;
let safeContext;

script.setupModule = function(safeContext) {
    // currentTime = global.appState.currentClientTime;
    // based on rules, written here, form an array of buttons
    if() {

    }
    if() {
        
    }


    correctButtonIdSequence = [0,1,2,3]; // based on safe context
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;
    print("Pressed: " + id);
}