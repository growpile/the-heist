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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Target Configuration</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Specify which object to animate (defaults to this object)</span>"}
// @input SceneObject targetObject {"hint":"(Optional) Target object to animate. Leave empty to animate this object."}
// @input bool autoPlay = true {"hint":"Play chain automatically on start"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Rotation Tween Settings</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">First animation in chain - rotates the object</span>"}
// @input float rotationAngle = 45 {"hint":"Rotation angle in degrees", "widget":"slider", "min":-360, "max":360, "step":15}
// @input int rotationAxis {"widget":"combobox", "values":[{"label":"Up (Y-Axis)", "value":0}, {"label":"Right (X-Axis)", "value":1}, {"label":"Forward (Z-Axis)", "value":2}]}
// @input float rotationDuration = 1000 {"hint":"Duration of rotation in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100}
// @input int rotationInterpolation {"widget":"combobox", "values":[{"label":"LERP (Spherical)", "value":0}, {"label":"SLERP (Linear)", "value":1}]}
// @input int rotationEasing = 3 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic In", "value":1}, {"label":"Cubic Out", "value":2}, {"label":"Cubic InOut", "value":3}, {"label":"Elastic Out", "value":4}, {"label":"Bounce Out", "value":5}, {"label":"Back InOut", "value":6}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Scale Tween Settings</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Second animation in chain - scales the object</span>"}
// @input float scaleMultiplier = 2 {"hint":"Scale multiplier (1.0 = no change, 2.0 = double size)", "widget":"slider", "min":0.1, "max":5, "step":0.1}
// @input float scaleDuration = 1000 {"hint":"Duration of scaling in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100}
// @input int scaleEasing = 4 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic In", "value":1}, {"label":"Cubic Out", "value":2}, {"label":"Cubic InOut", "value":3}, {"label":"Elastic Out", "value":4}, {"label":"Bounce Out", "value":5}, {"label":"Back InOut", "value":6}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Movement Tween Settings</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Third animation in chain - moves the object (optional)</span>"}
// @input bool enableMovement {"hint":"Enable movement animation in the chain"}
// @input vec3 movementOffset = {0,20,0} {"hint":"Movement offset in local space", "showIf":"enableMovement", "showIfValue":true}
// @input float movementDuration = 1000 {"hint":"Duration of movement in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100, "showIf":"enableMovement", "showIfValue":true}
// @input int movementEasing = 2 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic In", "value":1}, {"label":"Cubic Out", "value":2}, {"label":"Cubic InOut", "value":3}, {"label":"Elastic Out", "value":4}, {"label":"Bounce Out", "value":5}, {"label":"Back InOut", "value":6}], "showIf":"enableMovement", "showIfValue":true}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Chain Behavior</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Control how the chain loops and behaves</span>"}
// @input bool loopChain = true {"hint":"Create infinite loop (chain back to first tween)"}
// @input bool resetScaleOnLoop = true {"hint":"Reset scale to original at start of each rotation"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug Output</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Enable console logging for chain events</span>"}
// @input bool logChainEvents = true {"hint":"Print when each tween in the chain starts"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Logging Configuration</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Control logging output for this script instance</span>"}
// @input bool enableLogging {"hint":"Enable general logging (operations, events, etc.)"}
// @input bool enableLoggingLifecycle {"hint":"Enable lifecycle logging (onAwake, onStart, onUpdate, onDestroy, etc.)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../Modules/Src/Packages/LSTween.lspkg/Examples/Scripts/Example_ChainTween");
Object.setPrototypeOf(script, Module.Example_ChainTween.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("autoPlay", []);
    checkUndefined("rotationAngle", []);
    checkUndefined("rotationAxis", []);
    checkUndefined("rotationDuration", []);
    checkUndefined("rotationInterpolation", []);
    checkUndefined("rotationEasing", []);
    checkUndefined("scaleMultiplier", []);
    checkUndefined("scaleDuration", []);
    checkUndefined("scaleEasing", []);
    checkUndefined("enableMovement", []);
    checkUndefined("movementOffset", [["enableMovement",true]]);
    checkUndefined("movementDuration", [["enableMovement",true]]);
    checkUndefined("movementEasing", [["enableMovement",true]]);
    checkUndefined("loopChain", []);
    checkUndefined("resetScaleOnLoop", []);
    checkUndefined("logChainEvents", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
