// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraManager
var cameraManager = script.cameraManager;
var realtimeManager = script.realtimeManager;
var sendToRealtime = false;

script.textureEncoded = function(encodedString) {
    if(sendToRealtime) {
        script.realtimeManager.sendCustomMessage(encodedString, "defuserTexture");
    }
    // print(encodedString);
}

script.createRoom = async function() {
    await script.realtimeManager.createRoom();
    // await script.realtimeManager.insertSimpleRow();
}

script.toggleTextureBroadcast = function(isOn) {
    sendToRealtime = isOn;
}