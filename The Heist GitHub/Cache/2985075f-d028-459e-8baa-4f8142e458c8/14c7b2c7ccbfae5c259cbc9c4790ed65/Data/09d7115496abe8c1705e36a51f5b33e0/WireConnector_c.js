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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Wire Material</span>"}
// @input Asset.Material wireMaterial {"hint":"Assigned at runtime by WireFuseboxModule; may also set in Inspector."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Mesh</span>"}
// @input float wireFaceCount = 8 {"widget":"slider", "min":3, "max":24, "step":1}
// @input float wireRadius = 0.25
// @input float wireSegments = 5 {"widget":"slider", "min":1, "max":30, "step":1}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Transforms</span>"}
// @input SceneObject wireHead
// @input SceneObject wireEnd
// @input SceneObject wireHandle
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Drag & Snap</span>"}
// @input float followSpeed = 10 {"hint":"Follow lerp speed."}
// @input float maxWireLength = 15 {"hint":"Max wire length (cm)."}
// @input float snapDistance = 0.5 {"hint":"Snap distance (cm)."}
// @input SceneObject[] wireSockets = {}
// @input vec3 raiseDirection = {0,1,0}
// @input float raiseOffset = 0.2
// @input Component.ScriptComponent wireManager {"hint":"WireFuseboxModule; also set via setManager()."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/WireConnector");
Object.setPrototypeOf(script, Module.WireConnector.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("wireFaceCount", []);
    checkUndefined("wireRadius", []);
    checkUndefined("wireSegments", []);
    checkUndefined("followSpeed", []);
    checkUndefined("maxWireLength", []);
    checkUndefined("snapDistance", []);
    checkUndefined("wireSockets", []);
    checkUndefined("raiseDirection", []);
    checkUndefined("raiseOffset", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
