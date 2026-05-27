if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef SafeModuleConfig
@property {string} moduleName
@property {string} moduleId
@property {Asset.ObjectPrefab} prefab
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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Game Config</span>"}
// @input float bombTimer = 300
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Modules</span>"}
// @input SafeModuleConfig[] modules = {}
// @input SceneObject[] moduleSlots = {}
// @input Component.Image[] moduleDisplayImages = {}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Visuals</span>"}
// @input SceneObject safeBody
// @input SceneObject safeDoor
// @input SceneObject[] safeContents = {}
// @input Asset.Material[] dynamiteFuseMaterials = {}
// @input SceneObject[] dynamiteFuseObjects = {}
// @input Component.Text serialNumberText
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Timer UI</span>"}
// @input Component.RenderMeshVisual timerScreenRMV
// @input Component.Text[] timerDigitTexts = {}
// @input Component.Text[] timerBgTexts = {}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Flow</span>"}
// @input Component.ScriptComponent gameFlow
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug</span>"}
// @input bool enableDebug
// @input Component.Text safeDebugText {"showIf":"enableDebug", "showIfValue":true}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Scripts/Safe/Safe");
Object.setPrototypeOf(script, Module.Safe.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("bombTimer", []);
    checkUndefined("modules", []);
    checkUndefined("moduleSlots", []);
    checkUndefined("safeContents", []);
    checkUndefined("dynamiteFuseMaterials", []);
    checkUndefined("dynamiteFuseObjects", []);
    checkUndefined("timerDigitTexts", []);
    checkUndefined("timerBgTexts", []);
    checkUndefined("enableDebug", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
