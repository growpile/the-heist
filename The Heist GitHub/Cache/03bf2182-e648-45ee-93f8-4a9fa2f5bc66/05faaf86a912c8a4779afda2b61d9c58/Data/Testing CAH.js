// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

script.createEvent("OnStartEvent").bind(function() {

})

cameraAccessHandler.captureCameraFrame(function(resultTexture) {
    debugImage.mainPass.baseTex = resultTexture;
})

await cameraAccessHandler.captureCameraImage(function(resultTexture) {
    debugImage.mainPass.baseTex = resultTexture;
})