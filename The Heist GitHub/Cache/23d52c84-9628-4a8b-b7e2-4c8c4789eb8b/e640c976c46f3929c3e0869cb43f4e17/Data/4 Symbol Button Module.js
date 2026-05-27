script.isModuleReady = false;

var correctButtonIdSequence = [0,1,2,3];
var pressedButtonsIds = [0,1,2];
var buttonContext = [{color: "blue"}, {color: "yellow"},
                     {color: "red"},  {color: "green"}];

script.setupModule = function() {

    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}