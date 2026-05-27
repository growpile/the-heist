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
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Playback</span>"}
// @input bool multipleSfxInstances {"hint":"Off = pool one AudioComponent per SFX index."}
// @input bool backgroundAudio {"hint":"Start background music automatically on lens load."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Background music</span>"}
// @input Asset.AudioTrackAsset[] backgroundSounds = {} {"showIf":"backgroundAudio", "showIfValue":true}
// @input float backgroundVolume = 1 {"hint":"Volume for the initial BGM track (index 0).", "widget":"slider", "min":0, "max":1, "step":0.01, "showIf":"backgroundAudio", "showIfValue":true}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"<span style=\"color: #60A5FA;\">Sound effects</span>"}
// @input Asset.AudioTrackAsset[] sounds = {} {"hint":"SFX bank — global.playSfx(id, …) uses this array index."}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/SoundManager");
Object.setPrototypeOf(script, Module.SoundManager.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("multipleSfxInstances", []);
    checkUndefined("backgroundAudio", []);
    checkUndefined("backgroundSounds", [["backgroundAudio",true]]);
    checkUndefined("backgroundVolume", [["backgroundAudio",true]]);
    checkUndefined("sounds", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
