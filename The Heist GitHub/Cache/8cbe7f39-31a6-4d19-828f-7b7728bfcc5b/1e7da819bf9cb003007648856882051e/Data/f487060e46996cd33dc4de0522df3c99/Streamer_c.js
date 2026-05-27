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
// @input Component.Text textLog {"hint":"Logs"}
// @input AssignableType snapCloudRequirements {"hint":"Reference to SnapCloudRequirements for centralized Supabase configuration"}
// @input string streamingChannelName = "live-video-stream" {"hint":"Supabase Realtime channel name for live streaming"}
// @input float streamQuality = 15 {"hint":"Stream quality (lower = better performance, higher = better quality) - Keep LOW for Realtime 250KB limit", "widget":"slider", "min":1, "max":100, "step":1}
// @input float streamFPS = 30 {"hint":"Frames per second for live streaming (lower = less bandwidth)", "widget":"slider", "min":1, "max":30, "step":1}
// @input float resolutionScale = 0.3 {"hint":"Stream resolution scale - Keep LOW for Realtime 250KB limit (0.3 = 30% resolution)", "widget":"slider", "min":0.1, "max":1, "step":0.1}
// @input bool useCompositeTexture {"hint":"Use composite texture instead of camera capture for streaming"}
// @input Asset.Texture compositeTexture {"hint":"Pre-composed texture (with AR content) - used when useCompositeTexture is enabled"}
// @input AssignableType_1 streamButton {"hint":"Button to start/stop streaming"}
// @input Component.Text statusText {"hint":"Text component to display streaming status"}
// @input Component.Text buttonText {"hint":"Text component to display button state (Start Stream/Stop Stream)"}
// @input Component.Image previewImage {"hint":"Image component to show local preview"}
// @input bool enableDebugLogs = true {"hint":"Enable detailed debug logging"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/Streamer");
Object.setPrototypeOf(script, Module.VideoStreamingController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("snapCloudRequirements", []);
    checkUndefined("streamingChannelName", []);
    checkUndefined("streamQuality", []);
    checkUndefined("streamFPS", []);
    checkUndefined("resolutionScale", []);
    checkUndefined("useCompositeTexture", []);
    checkUndefined("streamButton", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
