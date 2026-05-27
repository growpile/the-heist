// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage
// @input Component.Text debugText
/** @type {Text} */
var debugText = script.debugText;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

// @input Component.ScriptComponent cameraAccessHandler2
/** @type {ScriptComponent} */
var cameraAccessHandler2 = script.cameraAccessHandler2;

// @input int testMode {"widget":"combobox","values":[{"label":"CameraRequest","value":0},{"label":"CameraRequest + Encode","value":1},{"label":"CameraRequest + Render","value":2},{"label":"CameraRequest + Render + Encode","value":3},{"label":"ImageRequest","value":4},{"label":"ImageRequest + Encode","value":5},{"label":"ImageRequest + Render","value":6},{"label":"ImageRequest + Render + Encode","value":7}]}

script.createEvent("OnStartEvent").bind(function() {
    // function onSuccessCallback(resultTexture) {
    //     if (debugImage) {
    //         debugImage.mainPass.baseTex = resultTexture;
    //     }
    // }

    // var includeRender = (script.testMode === 2 || script.testMode === 3 || script.testMode === 6 || script.testMode === 7);
    // var doEncode = (script.testMode === 1 || script.testMode === 3 || script.testMode === 5 || script.testMode === 7);
    // var useImage = (script.testMode >= 4);
    // var lastMsg = "";
    // var lastCount = 0;

    // function handleEncoded(base64) {
    //     var short = "";
    //     if (base64 && base64.length >= 24) {
    //         var start = Math.max(0, Math.floor((base64.length - 24) / 2));
    //         short = base64.substr(start, 24);
    //     } else {
    //         short = base64 || "";
    //     }
    //     if (short === lastMsg) {
    //         lastCount += 1;
    //     } else {
    //         lastMsg = short;
    //         lastCount = 1;
    //     }
    //     var msg = "[" + lastCount + "]: " + short;
    //     if (debugText) {
    //         debugText.text = msg;
    //     }
    //     print("Got encoded frame: " + msg);
    // }

    // if (!useImage) {
    //     var frameResult = cameraAccessHandler.captureCameraFrameSession(onSuccessCallback, includeRender);
    //     if (doEncode && frameResult && frameResult.encode) {
    //         var ev = frameResult.encode();
    //         if (ev && ev.add) {
    //             ev.add(handleEncoded);
    //         } else if (ev && ev.then) {
    //             ev.then(handleEncoded);
    //         }
    //     }
    // } else {
    //     cameraAccessHandler.captureCameraImage(onSuccessCallback, includeRender).then(function(res) {
    //         if (doEncode && res && res.encode) {
    //             var ev = res.encode();
    //             if (ev && ev.add) {
    //                 ev.add(handleEncoded);
    //             } else if (ev && ev.then) {
    //                 ev.then(handleEncoded);
    //             }
    //         }
    //     });
    // }
    var tex = await cameraAccessHandler2.captureFrame()
        .fromCamera(0)
        .withResolution(400)
        .includesLiveRender()
        .withRefreshEvent(0.1)
    debugImage.mainPass.baseTex = tex;
});

/*
cameraAccessHandler.captureFrame()/.capturePhoto
    ?fromCamera(0) [captureFrame() only]

    ?withResolution(200)

    ?includeLiveRender()
    // overlays live render

    ?aspectRatio()?
    ?crop()?

    ?withRefreshEvent(0.1)
    // turns into event, no longer returns texture

    ?encode()
    // returns base64 string
        ?withQuality()
        ?withType()

    ?turnIntoResource
    // returns RMS resource
*/

// cameraAccessHandler.captureFrame()
//     .fromCamera(0)
//     .withResolution(400)
//     .includesLiveRender()
//     .withRefreshEvent(0.1)
//     .base64Encode("PNG")
//     .withQuality(2)
//     .add(function() {
//     })