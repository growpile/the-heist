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
// @input bool autoPlay = true {"hint":"Play animation automatically on start"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Animation Type</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Choose what property to animate with yoyo effect</span>"}
// @input int animationType {"widget":"combobox", "values":[{"label":"Position (Movement)", "value":0}, {"label":"Rotation (Spinning)", "value":1}, {"label":"Scale (Breathing)", "value":2}, {"label":"Position + Rotation", "value":3}, {"label":"Position + Scale", "value":4}, {"label":"All Three", "value":5}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Position Animation</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure movement back-and-forth (used for Position, Position+Rotation, Position+Scale, All)</span>"}
// @input vec3 movementOffset = {50,0,0} {"hint":"Movement offset (how far to move)"}
// @input float movementDuration = 1500 {"hint":"Duration for one direction in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100}
// @input int movementEasing = 1 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic InOut", "value":1}, {"label":"Sinusoidal InOut", "value":2}, {"label":"Elastic InOut", "value":3}, {"label":"Bounce InOut", "value":4}, {"label":"Back InOut", "value":5}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Rotation Animation</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure spinning back-and-forth (used for Rotation, Position+Rotation, All)</span>"}
// @input float rotationAngle = 90 {"hint":"Rotation angle in degrees (will rotate this amount then back)", "widget":"slider", "min":-360, "max":360, "step":15}
// @input int rotationAxis {"widget":"combobox", "values":[{"label":"Up (Y-Axis)", "value":0}, {"label":"Right (X-Axis)", "value":1}, {"label":"Forward (Z-Axis)", "value":2}]}
// @input float rotationDuration = 1500 {"hint":"Duration for one direction in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100}
// @input int rotationEasing = 1 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic InOut", "value":1}, {"label":"Sinusoidal InOut", "value":2}, {"label":"Elastic InOut", "value":3}, {"label":"Bounce InOut", "value":4}, {"label":"Back InOut", "value":5}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Scale Animation</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure breathing/pulsing back-and-forth (used for Scale, Position+Scale, All)</span>"}
// @input float scaleMultiplier = 1.5 {"hint":"Target scale multiplier (1.0 = original, 2.0 = double)", "widget":"slider", "min":0.1, "max":5, "step":0.1}
// @input float scaleDuration = 1500 {"hint":"Duration for one direction in milliseconds", "widget":"slider", "min":100, "max":5000, "step":100}
// @input int scaleEasing = 2 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Cubic InOut", "value":1}, {"label":"Sinusoidal InOut", "value":2}, {"label":"Elastic InOut", "value":3}, {"label":"Bounce InOut", "value":4}, {"label":"Back InOut", "value":5}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Yoyo Behavior</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure repeat and timing behavior</span>"}
// @input float repeatCount = -1 {"hint":"Number of yoyo cycles (-1 = infinite)", "widget":"slider", "min":-1, "max":20, "step":1}
// @input float initialDelay = 100 {"hint":"Delay before starting in milliseconds (fixes TweenJS yoyo jump bug)", "widget":"slider", "min":0, "max":1000, "step":50}
// @input float repeatDelay {"hint":"Delay between yoyo cycles in milliseconds", "widget":"slider", "min":0, "max":2000, "step":100}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug Output</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Enable console logging for yoyo events</span>"}
// @input bool logYoyoEvents = true {"hint":"Print when yoyo direction changes"}
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
var Module = require("../../../../../../Modules/Src/Packages/LSTween.lspkg/Examples/Scripts/Example_YoyoTween");
Object.setPrototypeOf(script, Module.Example_YoyoTween.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("autoPlay", []);
    checkUndefined("animationType", []);
    checkUndefined("movementOffset", []);
    checkUndefined("movementDuration", []);
    checkUndefined("movementEasing", []);
    checkUndefined("rotationAngle", []);
    checkUndefined("rotationAxis", []);
    checkUndefined("rotationDuration", []);
    checkUndefined("rotationEasing", []);
    checkUndefined("scaleMultiplier", []);
    checkUndefined("scaleDuration", []);
    checkUndefined("scaleEasing", []);
    checkUndefined("repeatCount", []);
    checkUndefined("initialDelay", []);
    checkUndefined("repeatDelay", []);
    checkUndefined("logYoyoEvents", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
