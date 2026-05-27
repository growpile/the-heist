// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage
// @input Component.Text debugText
/** @type {Text} */
var debugText = script.debugText;

// @input Component.ScriptComponent cameraAccessHandler2
/** @type {ScriptComponent} */
var cameraAccessHandler2 = script.cameraAccessHandler2;

// @input int testMode {"widget":"combobox","values":[{"label":"CameraRequest","value":0},{"label":"CameraRequest + Encode","value":1},{"label":"CameraRequest + Render","value":2},{"label":"CameraRequest + Render + Encode","value":3},{"label":"ImageRequest","value":4},{"label":"ImageRequest + Encode","value":5},{"label":"ImageRequest + Render","value":6},{"label":"ImageRequest + Render + Encode","value":7}]}

script.createEvent("OnStartEvent").bind(async function() {
    // Event-based test: capture frames with refresh and display
    var ev = cameraAccessHandler2.captureFrame()
        .fromCamera(0)
        .withResolution(400)
        .withRefreshRate(0.2)
        .get();

    if (ev && ev.add) {
        ev.add(function(tex) {
            if (debugImage) {
                debugImage.mainPass.baseTex = tex;
            }
            print("Got frame via event");
        });
    } else {
        // Fallback single capture if event not available
        var tex = await cameraAccessHandler2.captureFrame()
            .fromCamera(0)
            .withResolution(400)
            .get();
        if (debugImage) {
            debugImage.mainPass.baseTex = tex;
        }
        print("Got single frame");
    }
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
