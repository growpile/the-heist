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

async script.createRoom = async function(isOn) {
    // await script.realtimeManager.createRoom();
    await script.realtimeManager.upsertRoom();
}

script.toggleTextureBroadcast = function(isOn) {
    sendToRealtime = isOn;
}