if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef MenuTab
@property {AssignableType} button {"hint":"Tab button (toggleable RectangleButton)"}
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
// @input float defaultSelectedIndex {"hint":"Which tab is selected when the lens starts (0-based)"}
// @input float popOutBumpScale = 1.1 {"hint":"Scale multiplier during pop-out bump"}
// @input float popInOvershootScale = 1.12 {"hint":"Scale multiplier during pop-in overshoot"}
// @input float popOutBumpDurationMs = 80 {"hint":"Pop-out bump duration (ms)"}
// @input float popOutShrinkDurationMs = 120 {"hint":"Pop-out shrink-to-zero duration (ms)"}
// @input float popInOvershootDurationMs = 150 {"hint":"Pop-in overshoot duration (ms)"}
// @input float popInSettleDurationMs = 100 {"hint":"Pop-in settle-to-rest duration (ms)"}
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
    checkUndefined("defaultSelectedIndex", []);
    checkUndefined("popOutBumpScale", []);
    checkUndefined("popInOvershootScale", []);
    checkUndefined("popOutBumpDurationMs", []);
    checkUndefined("popOutShrinkDurationMs", []);
    checkUndefined("popInOvershootDurationMs", []);
    checkUndefined("popInSettleDurationMs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
