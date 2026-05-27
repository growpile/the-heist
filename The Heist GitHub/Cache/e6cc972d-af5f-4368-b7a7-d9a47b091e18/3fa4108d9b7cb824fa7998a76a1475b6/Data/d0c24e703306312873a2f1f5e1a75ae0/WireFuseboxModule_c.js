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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Check Button</span>"}
// @input Component.ScriptComponent buttonComponent {"hint":"PushButton that calls checkConnections (external callback)."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Wire Reels</span>"}
// @input Component.RenderMeshVisual[] wireReels = {} {"hint":"Reel mesh visuals — materials applied in color order."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Wire Connectors</span>"}
// @input Component.ScriptComponent[] wireConnectors = {} {"hint":"WireConnector script on each draggable wire."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Wire Materials</span>"}
// @input Asset.Material[] wireColorMaterials = {} {"hint":"Red, green, blue, yellow materials (index 0–3)."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Scripts/Modules/WireFuseboxModule");
Object.setPrototypeOf(script, Module.WireFuseboxModule.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("wireReels", []);
    checkUndefined("wireConnectors", []);
    checkUndefined("wireColorMaterials", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
