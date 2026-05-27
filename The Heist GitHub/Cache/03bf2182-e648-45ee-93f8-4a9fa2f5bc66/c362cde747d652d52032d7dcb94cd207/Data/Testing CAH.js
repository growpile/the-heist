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

    var encodeEvent = cameraAccessHandler.captureCameraFrameSession(function(tex) {
        print("Got first frame");
    }, false).encode(1,0,1);

    // Subscribe to the encoded stream
    encodeEvent.add(function(base64) {
    print("Got encoded frame:", base64.substr(0, 24) + "...");
    }); 

    // await cameraAccessHandler.captureCameraImage(onSuccessCallback, true);
})