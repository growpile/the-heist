// @input Component.Image debugImage
/** @type {Image} */
var debugImage = script.debugImage;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

// @input int testMode {"widget":"combobox","values":[{"label":"CameraRequest","value":0},{"label":"CameraRequest + Encode","value":1},{"label":"CameraRequest + Render","value":2},{"label":"CameraRequest + Render + Encode","value":3},{"label":"ImageRequest","value":4},{"label":"ImageRequest + Encode","value":5},{"label":"ImageRequest + Render","value":6},{"label":"ImageRequest + Render + Encode","value":7}]}

script.createEvent("OnStartEvent").bind(function() {
    function onSuccessCallback(resultTexture) {
        if (debugImage) {
            debugImage.mainPass.baseTex = resultTexture;
        }
        print("hi");
    }

    var includeRender = (script.testMode === 2 || script.testMode === 3 || script.testMode === 6 || script.testMode === 7);
    var doEncode = (script.testMode === 1 || script.testMode === 3 || script.testMode === 5 || script.testMode === 7);
    var useImage = (script.testMode >= 4);

    if (!useImage) {
        var frameResult = cameraAccessHandler.captureCameraFrameSession(onSuccessCallback, includeRender);
        if (doEncode && frameResult && frameResult.encode) {
            var ev = frameResult.encode(1, 0, 1);
            if (ev && ev.add) {
                ev.add(function(base64) {
                    print("Got encoded frame: " + base64.substr(0, 24) + "...");
                });
            } else if (ev && ev.then) {
                ev.then(function(base64) {
                    print("Got encoded frame: " + base64.substr(0, 24) + "...");
                });
            }
        }
    } else {
        cameraAccessHandler.captureCameraImage(onSuccessCallback, includeRender).then(function(res) {
            if (doEncode && res && res.encode) {
                var ev = res.encode(1, 0);
                if (ev && ev.add) {
                    ev.add(function(base64) {
                        print("Got encoded frame: " + base64.substr(0, 24) + "...");
                    });
                } else if (ev && ev.then) {
                    ev.then(function(base64) {
                        print("Got encoded frame: " + base64.substr(0, 24) + "...");
                    });
                }
            }
        });
    }
});
