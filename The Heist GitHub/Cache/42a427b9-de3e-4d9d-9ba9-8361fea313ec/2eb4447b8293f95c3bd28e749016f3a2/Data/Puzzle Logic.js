//@input Component.ScriptComponent[] wireButtons
/** @type {ScriptComponent[]} */
var wireButtons = script.wireButtons;

function attemptWireCut(wireId) {
    print("Attempting to cut wire " + (wireId + 1));
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
    if(value) attemptWireCut(4);ß
}