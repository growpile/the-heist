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

    // cameraAccessHandler.captureCameraFrameSession(onSuccessCallback, 
    //     true, { optionalCameraIdInt: 0, optionalMaxResolutionInt: 100});

    var ev = script.captureCameraFrameSession(function(tex) {
    print("Got first frame");
}, false).encode(/* quality */ 1, /* encoding */ 0, /* throttleSeconds */ 1);

// Subscribe to the encoded stream
ev.add(function(base64) {
    print("Got encoded frame:", base64.substr(0, 24) + "...");
});

    // await cameraAccessHandler.captureCameraImage(onSuccessCallback, true);
})