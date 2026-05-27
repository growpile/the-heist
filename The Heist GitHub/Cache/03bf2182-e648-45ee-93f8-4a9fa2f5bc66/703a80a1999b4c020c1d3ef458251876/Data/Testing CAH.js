// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

cameraAccessHandler.captureCameraFrame(function(resultTexture) {
    debugImage.mainPass.baseTex = resultTexture;
})