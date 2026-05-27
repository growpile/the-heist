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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Flow</span>"}
// @input AssignableType menuController
// @input AssignableType_1 coopNetwork
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Safe & Placement</span>"}
// @input Asset.ObjectPrefab safePrefab
// @input SceneObject safeOrigin
// @input AssignableType_2 safeAnchorPlacement
// @input AssignableType_3 rotationManager
// @input SceneObject groundPlane {"hint":"Ground plane object. Material is read from its mesh at runtime."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Settings UI</span>"}
// @input Component.ScriptComponent volumeSlider
// @input Component.ScriptComponent glovesToggle
// @input SceneObject gloves
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Feedback</span>"}
// @input Component.ScriptComponent interactionHintController
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
