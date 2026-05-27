// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

/*
@typedef symbol
@property {string} symbolId
@property {Asset.Texture} symbolTexture
*/

// @input symbol[] symbols

script.isModuleReady = false;
let safeContext;
let correctButtonIdSequence;
let pressedButtonsIds;
let buttonContext = [{symbolId: 0}, {symbolId: 1},
                     {symbolId: 2},  {symbolId: 3}];

script.setupModule = function(safeContext, safeComponent) {}

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}