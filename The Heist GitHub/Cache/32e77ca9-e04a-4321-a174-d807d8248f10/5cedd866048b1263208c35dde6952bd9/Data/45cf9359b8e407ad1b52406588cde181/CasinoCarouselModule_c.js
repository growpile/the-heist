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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Slot reels</span>"}
// @input SceneObject[] slotSpinners = {} {"hint":"Three slot spinner roots (left to right)."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Streak lamps</span>"}
// @input SceneObject[] sequenceLamps = {} {"hint":"Five lamps — light in order on correct lever swings."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Lever</span>"}
// @input SceneObject lever {"hint":"Lever arm pivot object."}
// @input SceneObject leverBall {"hint":"Ball anchor the handle snaps back to."}
// @input SceneObject leverHandle {"hint":"Draggable handle (needs Interactable Manipulation as first ScriptComponent)."}
// @input float leverMaxDegrees = 30 {"hint":"Max lever rotation in degrees during a swing.", "widget":"slider", "min":5, "max":90, "step":1}
// @input float leverMinDistance = 0.1 {"hint":"Minimum vertical pull distance to register a swing.", "widget":"slider", "min":0.05, "max":10, "step":0.05}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Scripts/Modules/CasinoCarouselModule");
Object.setPrototypeOf(script, Module.CasinoCarouselModule.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("slotSpinners", []);
    checkUndefined("sequenceLamps", []);
    checkUndefined("leverMaxDegrees", []);
    checkUndefined("leverMinDistance", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
