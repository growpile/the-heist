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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Snap Cloud</span>"}
// @input Component.ScriptComponent snapCloudRequirements
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Realtime Channel</span>"}
// @input string channelName
// @input string baseMessage = "dT"
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Room UI</span>"}
// @input Component.Text crewCodeText
// @input SceneObject[] playerSlots = {}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">AR Camera Stream</span>"}
// @input bool debugDisplayTexture
// @input Component.Image debugDisplayImage {"showIf":"debugDisplayTexture", "showIfValue":true}
// @input bool useCrop = true
// @input vec4 cropValue = {0,0,0,0} {"showIf":"useCrop", "showIfValue":true}
// @input bool downsampleTexture = true
// @input float maxResolution = 250 {"showIf":"downsampleTexture", "showIfValue":true}
// @input float compressionQuality {"hint":"0 = max compression, 4 = max quality."}
// @input float encodingType = 1 {"hint":"0 = PNG, 1 = JPG."}
// @input float targetStreamFps = 10 {"hint":"Frames per second sent over realtime (keep low for 250KB message limit)."}
// @input Asset.Texture renderTexture
// @input Asset.ObjectPrefab virtualRenderCameraSetup
// @input Asset.Texture screenCropTexture
// @input Asset.Texture compositeTexture
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug</span>"}
// @input bool enableDebugLogs = true
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/CoopNetworkController");
Object.setPrototypeOf(script, Module.CoopNetworkController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("channelName", []);
    checkUndefined("baseMessage", []);
    checkUndefined("playerSlots", []);
    checkUndefined("debugDisplayTexture", []);
    checkUndefined("useCrop", []);
    checkUndefined("cropValue", [["useCrop",true]]);
    checkUndefined("downsampleTexture", []);
    checkUndefined("maxResolution", [["downsampleTexture",true]]);
    checkUndefined("compressionQuality", []);
    checkUndefined("encodingType", []);
    checkUndefined("targetStreamFps", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
