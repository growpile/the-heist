if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef MenuTab
@property {Component.ScriptComponent} button {"hint":"Tab button (assign the RectangleButton Script Component)"}
@property {SceneObject[]} elements = {} {"hint":"UI SceneObjects that belong to this tab's view"}
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
// @input MenuTab[] tabs = {} {"hint":"Main menu tabs in left-to-right order"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MainMenuTabination");
Object.setPrototypeOf(script, Module.MainMenuTabination.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("tabs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
