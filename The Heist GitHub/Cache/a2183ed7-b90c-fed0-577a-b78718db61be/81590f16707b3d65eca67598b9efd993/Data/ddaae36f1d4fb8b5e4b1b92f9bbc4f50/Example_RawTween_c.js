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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Animation Settings</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure tween timing and behavior</span>"}
// @input float duration = 1000 {"hint":"Duration of the tween in milliseconds (1000 = 1 second)", "widget":"slider", "min":100, "max":5000, "step":100}
// @input float delay {"hint":"Delay before starting the tween in milliseconds", "widget":"slider", "min":0, "max":2000, "step":100}
// @input bool autoPlay = true {"hint":"Play tween automatically on start"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Easing Configuration</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Choose easing function for animation curve</span>"}
// @input int easingType = 4 {"widget":"combobox", "values":[{"label":"Linear", "value":0}, {"label":"Quadratic In", "value":1}, {"label":"Quadratic Out", "value":2}, {"label":"Quadratic InOut", "value":3}, {"label":"Cubic In", "value":4}, {"label":"Cubic Out", "value":5}, {"label":"Cubic InOut", "value":6}, {"label":"Quartic In", "value":7}, {"label":"Quartic Out", "value":8}, {"label":"Quartic InOut", "value":9}, {"label":"Quintic In", "value":10}, {"label":"Quintic Out", "value":11}, {"label":"Quintic InOut", "value":12}, {"label":"Sinusoidal In", "value":13}, {"label":"Sinusoidal Out", "value":14}, {"label":"Sinusoidal InOut", "value":15}, {"label":"Exponential In", "value":16}, {"label":"Exponential Out", "value":17}, {"label":"Exponential InOut", "value":18}, {"label":"Circular In", "value":19}, {"label":"Circular Out", "value":20}, {"label":"Circular InOut", "value":21}, {"label":"Elastic In", "value":22}, {"label":"Elastic Out", "value":23}, {"label":"Elastic InOut", "value":24}, {"label":"Back In", "value":25}, {"label":"Back Out", "value":26}, {"label":"Back InOut", "value":27}, {"label":"Bounce In", "value":28}, {"label":"Bounce Out", "value":29}, {"label":"Bounce InOut", "value":30}]}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Loop Settings</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Configure repeat and yoyo behavior</span>"}
// @input bool enableYoyo {"hint":"Enable yoyo (back-and-forth) animation"}
// @input float repeatCount {"hint":"Number of times to repeat (-1 = infinite)", "widget":"slider", "min":-1, "max":10, "step":1}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Visual Feedback</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Optional target object to visualize tween value (0-1) as scale</span>"}
// @input SceneObject targetObject {"hint":"(Optional) Object to scale based on tween value for visual feedback"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Debug Output</span>"}
// @ui {"widget":"label", "label":"<span style=\"color: #94A3B8; font-size: 11px;\">Enable console logging for tween lifecycle events</span>"}
// @input bool logStart = true {"hint":"Print tween start event to console"}
// @input bool logUpdates {"hint":"Print tween update events to console (verbose)"}
// @input bool logComplete = true {"hint":"Print tween complete event to console"}
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
var Module = require("../../../../../../Modules/Src/Packages/LSTween.lspkg/Examples/Scripts/Example_RawTween");
Object.setPrototypeOf(script, Module.Example_RawTween.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("duration", []);
    checkUndefined("delay", []);
    checkUndefined("autoPlay", []);
    checkUndefined("easingType", []);
    checkUndefined("enableYoyo", []);
    checkUndefined("repeatCount", []);
    checkUndefined("logStart", []);
    checkUndefined("logUpdates", []);
    checkUndefined("logComplete", []);
    checkUndefined("enableLogging", []);
    checkUndefined("enableLoggingLifecycle", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
