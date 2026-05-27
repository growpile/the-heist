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
// @input AssignableType mainMenuTabination
// @input SceneObject menuRoot
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8;\">Child views under menuRoot (enable one at a time)</span>"}
// @input SceneObject mainMenuContent {"hint":"Default play tab / tabination content. If empty, menuRoot itself is used."}
// @input SceneObject settingsView
// @input SceneObject solvedView
// @input SceneObject timedView
// @input SceneObject tutorialSolvedView
// @input SceneObject loadingView
// @input SceneObject roomView
// @input Component.Text solvedSecondsText
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MenuController");
Object.setPrototypeOf(script, Module.MenuController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    if (script.onAwake) {
       script.onAwake();
    }
});
