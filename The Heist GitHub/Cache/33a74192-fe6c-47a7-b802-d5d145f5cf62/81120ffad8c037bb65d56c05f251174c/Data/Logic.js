// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraManager
var cameraManager = script.cameraManager;
var realtimeManager = script.realtimeManager;
var sendToRealtime = false;

script.textureEncoded = function(encodedString) {
    if(sendToRealtime) {
        script.sendCustomMessage()
    }
    print(encodedString);
}

script.toggleTextureBroadcast = function(isOn) {
    sendToRealtime = isOn;
}