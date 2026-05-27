script.isModuleReady = false;

let safeContext;
let correctButtonIdSequence = [0,1,2,3];
let pressedButtonsIds = [0,1,2];
var buttonContext = [{color: "blue"}, {color: "yellow"},
                     {color: "red"},  {color: "green"}];

script.setupModule = function() {

    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}