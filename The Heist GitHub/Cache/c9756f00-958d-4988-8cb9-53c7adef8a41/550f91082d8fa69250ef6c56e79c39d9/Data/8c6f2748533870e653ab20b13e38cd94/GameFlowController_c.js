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
// @input AssignableType coopNetwork
// @input AssignableType_1 menuController
// @input AssignableType_2 safeAnchorPlacement {"hint":"Scene-attached SafeAnchorPlacement script that runs the surface-placement flow"}
// @input Component.ScriptComponent cameraAccessHandler
// @input Component.ScriptComponent rotationManager
// @input Component.ScriptComponent volumeSlider
// @input Component.ScriptComponent glovesToggle
// @input Component.ScriptComponent interactionHintController
// @input Asset.ObjectPrefab safePrefab
// @input SceneObject safeOrigin
// @input SceneObject tweens
// @input SceneObject anchorManager
// @input Asset.Material tableGridMaterial
// @input SceneObject gloves
// @input Component.VFXComponent tableImpactVFX
// @input Component.VFXComponent boomVfx
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">UI Panels</span>"}
// @input SceneObject solvedWindow
// @input SceneObject timedWindow
// @input SceneObject tutorialSolvedWindow
// @input SceneObject loadingWindow
// @input SceneObject roomWindow
// @input SceneObject settingsWindow
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
var Module = require("../../../../Modules/Src/Assets/Scripts/GameFlowController");
Object.setPrototypeOf(script, Module.GameFlowController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("safePrefab", []);
    checkUndefined("tableGridMaterial", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
