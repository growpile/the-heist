if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef MenuTab
@property {Component.ScriptComponent} button {"hint":"Tab button (assign the RectangleButton Script Component)"}
@property {SceneObject[]} elements = {} {"hint":"UI SceneObjects that belong to this tab's view"}
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
// @input float menuYOffsetFromCameraCm {"hint":"World Y offset from camera (cm). Pitch/Headlock still control XZ; only height is pinned."}
// @input Asset.Material menuBackground {"hint":"Shader material for the menu backdrop. Tab 1: state 0, tab 2: state 1, tab 3: opacity 0."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Main menu tabs</span>"}
// @input MenuTab[] tabs = {} {"hint":"Main menu tabs in left-to-right order (button + tab content elements)."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Menu steps (root + pop elements)</span>"}
// @input MenuView mainMenuView {"hint":"Main menu shell (Main Menu object). Tab bar pieces go in elements; tab panels in tabs[]."}
// @input MenuView soloTipsView
// @input MenuView tutorialTipsView
// @input MenuView onlineRoomView
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8;\">Post-game overlays (enable only; no pop stack yet)</span>"}
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
