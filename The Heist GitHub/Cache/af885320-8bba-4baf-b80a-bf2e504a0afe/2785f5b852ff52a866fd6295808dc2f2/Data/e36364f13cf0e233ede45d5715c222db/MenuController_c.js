if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef MenuTab
@property {Component.ScriptComponent} button {"hint":"Tab button — assign the RectangleButton component."}
@property {SceneObject[]} elements = {} {"hint":"Scene objects shown for this tab's panel."}
*/
/*
@typedef MenuView
@property {SceneObject} root {"hint":"Parent object for this step (e.g. Solo Reminder Window, Team Room)."}
@property {SceneObject[]} elements = {} {"hint":"UI pieces that animate with pop-in / pop-out. If empty, direct children of root are used."}
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
// @input SceneObject menuRoot
// @input float menuYOffsetFromCameraCm {"hint":"World Y offset from camera in cm. Pitch and Headlock control XZ; this pins height only."}
// @input Asset.Material menuBackground {"hint":"Shader material for menu backdrop. Tab 1 state 0, tab 2 state 1, tab 3 opacity 0."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Main Menu Tabs</span>"}
// @input MenuTab[] tabs = {} {"hint":"Tabs left to right. Each entry is a button plus that tab's content elements."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Menu Steps</span>"}
// @input MenuView mainMenuView {"hint":"Main Menu shell. Tab bar in elements; tab panels in tabs."}
// @input MenuView soloTipsView
// @input MenuView tutorialTipsView
// @input MenuView onlineRoomView
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8;\">Post-Game Overlays</span>"}
// @input SceneObject settingsView
// @input SceneObject solvedView
// @input SceneObject timedView
// @input SceneObject tutorialSolvedView
// @input SceneObject loadingView
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
    checkUndefined("menuYOffsetFromCameraCm", []);
    checkUndefined("tabs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
