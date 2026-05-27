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
// @input SceneObject[] pathPoints {"hint":"Array of scene objects that define the path of the 3D line"}
// @input float _radius = 10 {"hint":"Radius of the circular cross-section"}
// @input float _circleSegments = 16 {"hint":"Number of segments around the circle (higher = smoother)"}
// @input float _interpolationSteps = 10 {"hint":"Number of interpolated points between each path point for smooth curves"}
// @input float _smoothness = 0.5 {"hint":"Smoothing factor for spline interpolation (0=linear, 1=smooth)", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input Asset.Material material {"hint":"Material to apply to the 3D line mesh"}
// @input vec3 _color = "{1, 1, 0}" {"widget":"color"}
// @input bool capEnds = true {"hint":"Whether to cap the ends of the tube"}
// @input float _zOffset {"hint":"Manual Z-axis offset to compensate for position alignment issues"}
// @input bool _useWorldPosition = true {"hint":"Use world position instead of local position (fixes most offset issues)"}
// @input bool _autoCorrectOffset = true {"hint":"Enable automatic position offset detection and correction"}
// @input bool _useRelativeToComponent = true {"hint":"Apply additional coordinate space transformation relative to this component's transform"}
// @input bool _debugPositions {"hint":"Debug: Show position information in console"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/VolumetricLine.lspkg/Scripts/VolumetricLine");
Object.setPrototypeOf(script, Module.VolumetricLine.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("pathPoints", []);
    checkUndefined("_radius", []);
    checkUndefined("_circleSegments", []);
    checkUndefined("_interpolationSteps", []);
    checkUndefined("_smoothness", []);
    checkUndefined("material", []);
    checkUndefined("_color", []);
    checkUndefined("capEnds", []);
    checkUndefined("_zOffset", []);
    checkUndefined("_useWorldPosition", []);
    checkUndefined("_autoCorrectOffset", []);
    checkUndefined("_useRelativeToComponent", []);
    checkUndefined("_debugPositions", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
