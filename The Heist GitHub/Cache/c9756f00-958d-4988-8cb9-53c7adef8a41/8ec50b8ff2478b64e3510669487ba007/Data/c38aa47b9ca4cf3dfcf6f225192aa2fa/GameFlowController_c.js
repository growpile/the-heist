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
// @input AssignableType_3 rotationManager
// @input Component.ScriptComponent volumeSlider
// @input Component.ScriptComponent glovesToggle
// @input Component.ScriptComponent interactionHintController
// @input Asset.ObjectPrefab safePrefab
// @input SceneObject safeOrigin
// @input SceneObject tweens
// @input SceneObject anchorManager
// @input Asset.Material groundPlaneMaterial {"hint":"Table grid / ground plane shader. Fades in during gameplay and rotates with the safe."}
// @input SceneObject gloves
// @input Component.VFXComponent tableImpactVFX
// @input Component.VFXComponent boomVfx
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
    if (script.onAwake) {
       script.onAwake();
    }
});
