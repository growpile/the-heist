// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

script.createEvent("OnStartEvent").bind(async function() {
    cameraAccessHandler.captureCameraFrameSession(function(resultTexture) {
        debugImage.mainPass.baseTex = resultTexture;
    }
    // , { optionalCameraIdInt: 0, optionalMaxResolutionInt: 20});
    );

    // await cameraAccessHandler.captureCameraImage(function(resultTexture) {
    //     debugImage.mainPass.baseTex = resultTexture;
    // })
})