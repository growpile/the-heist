//@input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

script.isModuleReady = false;
let safeContext;
let correctButtonIdSequence;
let pressedButtonsIds;
let buttonContext = [{symbolId: 0}, {symbolId: 1},
                     {symbolId: 2},  {symbolId: 3}];
let symbolMap = 
//

script.setupModule = function(safeScriptComponent) {


    safeContext = safeScriptComponent.getContext();
    /*
    {
        serialNumber: string
        moduleIds: [string] (in orders: left, center, right)

    }
    */
   currentTime = global.appState.currentClientTime;

   // based on rules, written here, form an array of buttons


   correctButtonIdSequence = [0,1,2,3]; // based on safe context
   script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}