// @input Component.ScriptComponent[] wireButtons
/** @type {ScriptComponent[]} */
var wireButtons = script.wireButtons;
// @input Component.Text ruleText
/** @type {Text} */
var ruleText = script.ruleText;

function attemptWireCut(wireId) {
    print("Attempting to cut wire " + (wireId + 1));
    wireButtons[wireId].enabled = false;
    var buttonSO = wireButtons[wireId].getSceneObject();
    var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
    textComponent.text = "Cut " + (wireId + 1);
    textComponent.textFill.color = new vec4(1, 1, 1, 1); // change color to white to indicate cut.
}

script.generatePuzzle = function() {
    print("Generating new puzzle...");
    for(var i = 0; i < wireButtons.length; i++) {
        var buttonSO = wireButtons[i].getSceneObject();
        buttonSO.enabled = true;
        wireButtons[i].enabled = true;
        wireButtons[i].initialize();
        var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
        textComponent.text = "Wire " + (i + 1);
        textComponent.textFill.color = new vec4(1, 0, 0, 1); // wire color. can be red, green or blue.
        
        print("Wire " + (i + 1) + " is active.");
    }
    ruleText.text = "Cut the wires according to the new rules! \n\nA: Rule 1\nB: Rule 2\nC: Rule 3\nD: Rule 4";
}

script.cutWire1 = function(value) {
    if(value) attemptWireCut(0);
}
script.cutWire2 = function(value) {
    if(value) attemptWireCut(1);
}
script.cutWire3 = function(value) {
    if(value) attemptWireCut(2);
} 
script.cutWire4 = function(value) {
    if(value) attemptWireCut(3);
}
script.cutWire5 = function(value) {
    if(value) attemptWireCut(4);
}