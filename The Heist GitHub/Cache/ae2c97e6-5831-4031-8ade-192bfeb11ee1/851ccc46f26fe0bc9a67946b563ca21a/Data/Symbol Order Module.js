// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

/*
@typedef module
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
// let symbolMap = 
// 0: bulgarian голям юс
// 1: Toilet Paper
// 2: Key
// 3: Sun
// 4: Swirl
// 5: Horizontal Line
// 6: Vertical Line
// 7: Dot
// 8: Big Dot
// 9: Fork
// 10: Dynamite
// 11: Teabag
// 12: DO NOT PRESS text
// 13: LEFT
// 14: RIGHT

script.setupModule = function(safeContext, safeComponent) {}

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;


}