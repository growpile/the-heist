script.isModuleReady = false;

let safeContext;
let correctButtonIdSequence;
let pressedButtonsIds;
let buttonContext = [{color: "blue"}, {color: "yellow"},
                     {color: "red"},  {color: "green"}];

script.setupModule = function() {

    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}