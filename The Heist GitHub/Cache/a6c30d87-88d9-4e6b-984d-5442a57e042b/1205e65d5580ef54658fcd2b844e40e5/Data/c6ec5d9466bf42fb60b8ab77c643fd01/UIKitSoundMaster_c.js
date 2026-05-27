if (script.onAwake) {
    script.onAwake();
    return;
}
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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">UIKit Controls</span>"}
// @input AssignableType[] menuTabs = {} {"hint":"Assign the 3 main menu RectangleButtons."}
// @input AssignableType_1[] buttons = {} {"hint":"Capsule buttons to toggle Play Audio on/off."}
// @input AssignableType_2 toggleSwitch
// @input AssignableType_3 volumeSlider
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/UIKitSoundMaster");
Object.setPrototypeOf(script, Module.UIKitSoundMaster.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("menuTabs", []);
    checkUndefined("buttons", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
