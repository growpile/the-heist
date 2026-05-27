// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

script.createEvent("OnStartEvent").bind(async function() {

    function onSuccessCallback(resultTexture) {
        debugImage.mainPass.baseTex = resultTexture;
    }

    cameraAccessHandler.captureCameraFrameSession(onSuccessCallback, 
        true, { optionalCameraIdInt: 0, optionalMaxResolutionInt: 100});

    // await cameraAccessHandler.captureCameraImage(onSuccessCallback, true);

    var data = global.createName("nick")// .greetName();
    print("data: " + data);
})