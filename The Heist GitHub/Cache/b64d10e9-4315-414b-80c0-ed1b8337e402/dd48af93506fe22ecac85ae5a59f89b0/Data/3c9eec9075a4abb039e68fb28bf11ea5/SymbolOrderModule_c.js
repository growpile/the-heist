if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef SymbolDefinition
@property {string} symbolId {"hint":"Symbol id matching the symbol map (e.g. fork, doNotPress)."}
@property {Asset.Texture} symbolTexture {"hint":"Texture applied to the symbol image mainPass.symbolMap."}
*/
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Buttons</span>"}
// @input Component.ScriptComponent[] buttonComponents = {} {"hint":"PushButton script on each button (index 0–3)."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Symbol Images</span>"}
// @input Component.Image[] symbolImageComponents = {} {"hint":"Image on each button showing the assigned symbol texture."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Button Materials</span>"}
// @input Asset.Material redMaterial
// @input Asset.Material greenMaterial
// @input Asset.Material blueMaterial
// @input Asset.Material yellowMaterial
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Symbol Catalog</span>"}
// @input SymbolDefinition[] symbols = {} {"hint":"Id + texture pairs for every symbol used in the map grid."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Scripts/Modules/SymbolOrderModule");
Object.setPrototypeOf(script, Module.SymbolOrderModule.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("buttonComponents", []);
    checkUndefined("symbolImageComponents", []);
    checkUndefined("symbols", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
