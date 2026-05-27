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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Button face</span>"}
// @input SceneObject buttonFace {"hint":"Moving face object with a Physics collider (size used for hit zone)."}
// @input bool customFaceSize {"hint":"Override collider size for hit detection."}
// @input vec3 faceSize {"showIf":"customFaceSize", "showIfValue":true}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Press feel</span>"}
// @input vec2 pressThresholds = {0.2,0.8} {"hint":"x = hover threshold (0–1), y = trigger threshold (0–1) of max travel."}
// @input float maxTravel = 1.5 {"hint":"Maximum inward travel along the push axis.", "widget":"slider", "min":0.1, "max":5, "step":0.05}
// @input bool pushX {"hint":"Push along local X instead of default Z."}
// @input bool pushY {"hint":"Push along local Y instead of default Z."}
// @input bool pushZ {"hint":"Push along local Z (default when X/Y are off)."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Callback</span>"}
// @input Component.ScriptComponent externalScript {"hint":"Script to invoke on trigger (e.g. Color Order Module)."}
// @input string externalFunctionName {"hint":"Method name on external script (e.g. buttonPress)."}
// @input bool callWithArgument {"hint":"Pass the Argument string to the external method."}
// @input string argument {"showIf":"callWithArgument", "showIfValue":true}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug</span>"}
// @input bool debugLogs
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/PushButton");
Object.setPrototypeOf(script, Module.PushButton.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("customFaceSize", []);
    checkUndefined("faceSize", [["customFaceSize",true]]);
    checkUndefined("pressThresholds", []);
    checkUndefined("maxTravel", []);
    checkUndefined("pushX", []);
    checkUndefined("pushY", []);
    checkUndefined("pushZ", []);
    checkUndefined("externalFunctionName", []);
    checkUndefined("callWithArgument", []);
    checkUndefined("argument", [["callWithArgument",true]]);
    checkUndefined("debugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
