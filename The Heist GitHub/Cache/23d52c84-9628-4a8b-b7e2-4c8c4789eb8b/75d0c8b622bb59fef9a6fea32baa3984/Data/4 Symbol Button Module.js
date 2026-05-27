script.isModuleReady = false;

let safeContext;
let correctButtonIdSequence;
let pressedButtonsIds;
let buttonContext = [{color: "blue"}, {color: "yellow"},
                     {color: "red"},  {color: "green"}];

script.setupModule = function(safeScriptComponent) {
    safeContext = safeScriptComponent.context();
    /*
    */
    correctButtonIdSequence = [0,1,2,3]; // based on safe context
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}