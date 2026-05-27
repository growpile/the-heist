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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Placement Configuration</span>"}
// @input SceneObject placementVisuals {"hint":"Hidden until surface confirmed (e.g. Safe Origin)."}
// @input int placementSettingMode {"widget":"combobox", "values":[{"label":"Near Surface", "value":0}, {"label":"Horizontal", "value":1}, {"label":"Vertical", "value":2}]}
// @input bool useAdjustmentWidget = true {"hint":"Show the height-adjustment slider widget (NEAR_SURFACE only)"}
// @input vec3 widgetOffset = {10,10,0} {"hint":"Offset in cm of the height-adjustment widget from the surface center"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/SafeAnchorPlacement");
Object.setPrototypeOf(script, Module.SafeAnchorPlacement.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("placementSettingMode", []);
    checkUndefined("useAdjustmentWidget", []);
    checkUndefined("widgetOffset", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
