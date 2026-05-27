if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef MenuTab
@property {Component.ScriptComponent} button
@property {SceneObject[]} elements = {}
*/
/*
@typedef MenuView
@property {SceneObject} root
@property {SceneObject[]} elements = {} {"hint":"Leave empty to use direct children of root."}
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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Menu Root</span>"}
// @input SceneObject menuRoot
// @input float menuYOffsetFromCameraCm {"hint":"World Y offset from camera (cm). Headlock handles XZ."}
// @input Asset.Material menuBackground {"hint":"Backdrop material — tab 0/1 state, tab 2 fades opacity."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Branding</span>"}
// @input SceneObject logo
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Main Menu Tabs</span>"}
// @input MenuTab[] tabs = {}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Menu Steps</span>"}
// @input MenuView mainMenuView
// @input MenuView soloTipsView
// @input MenuView tutorialTipsView
// @input MenuView onlineRoomView
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Settings</span>"}
// @input SceneObject settingsView
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Post-Game</span>"}
// @input SceneObject postGameRoot
// @input Component.Text timeElapsedText
// @input SceneObject solvedCopy
// @input SceneObject failedCopy
// @input AssignableType menuButton
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Post-Game Stars</span>"}
// @input Asset.Material bronzeMaterial
// @input Asset.Material silverMaterial
// @input Asset.Material goldMaterial
// @input SceneObject starOutlinesParent
// @input SceneObject starsParent
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
    checkUndefined("menuYOffsetFromCameraCm", []);
    checkUndefined("tabs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
