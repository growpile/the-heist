let cameraModule = require('LensStudio:CameraModule');
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;
var latestFrame = null;
// @input Component.Image cameraTextureDisplayImage
// @input bool downsampleTexture = false

// @input Asset.Texture scaledRenderTargetTexture {"showIf":"downsampleTexture"}

// @input int maxResolution = 250 {"showIf":"downsampleTexture"}

// @input bool autoEncode = false
// @input float encodeInterval = 0.5 "Auto Encode Interval (seconds)"
var cameraTextureDisplayImage = script.cameraTextureDisplayImage;
var scaledRenderTargetTexture = script.scaledRenderTargetTexture;
var hasSizedRenderTarget = false;

function printEncodedString(result) {
    // print("Encoded texture: " + result)
    //decode the string back and display
    decode(result).then(displayTexture).catch(printError)
}

function printError(error) {
    print("Error: " + error)

}

function displayTexture(texture) {
    // print("Texture: " + texture)
    if (script.outputImage) {
        script.outputImage.mainMaterial.mainPass.baseTex = texture
    }
}

function encode(texture) {
    return new Promise(function (resolve, reject) {
        Base64.encodeTextureAsync(texture, resolve, reject, CompressionQuality.LowQuality, EncodingType.Png)
    })
}

function decode(encodedString) {
    return new Promise(function (resolve, reject) {
        Base64.decodeTextureAsync(encodedString, resolve, reject)
    })
}

// encode(script.texture).then(printEncodedString).catch(printError);

script.createEvent('OnStartEvent').bind(() => {
    cameraRequest = CameraModule.createCameraRequest();
    cameraRequest.cameraId = CameraModule.CameraId.Default_Color;

    cameraTexture = cameraModule.requestCamera(cameraRequest);
    cameraTextureProvider = cameraTexture.control;

    cameraTextureProvider.onNewFrame.add((cameraFrame) => {
        latestFrame = cameraTexture;
    });
});

global.decodeReturnTexture = function(imgString) {
    return decode(imgString);
}

global.takeSnapEncode = async function() {
    if(latestFrame == null) return;
    var data = await encode(latestFrame);
    return data;
}

var nextEncodeTime = 0;
var isEncoding = false;

script.createEvent("LateUpdateEvent").bind(function() {
    if(!latestFrame) return;

    // show texture on image display
    if(cameraTextureDisplayImage && latestFrame) {
        cameraTextureDisplayImage.mainPass.baseTex = latestFrame;
    }

    // On first frame, size the scaled render target to match aspect within maxResolution
    if (!hasSizedRenderTarget && scaledRenderTargetTexture && latestFrame) {
        var maxRes = Math.max(1, script.maxResolution || 250);
        var w = latestFrame.getWidth();
        var h = latestFrame.getHeight();
        if (w > 0 && h > 0) {
            var aspect = w / h;
            var targetW, targetH;
            if (aspect >= 1) {
                targetW = maxRes;
                targetH = Math.ceil(maxRes / aspect);
            } else {
                targetH = maxRes;
                targetW = Math.ceil(maxRes * aspect);
            }
            scaledRenderTargetTexture.control.useScreenResolution = false;
            scaledRenderTargetTexture.control.resolution = new vec2(targetW, targetH);
            hasSizedRenderTarget = true;
        }
    }

    // Optional throttled encoding to avoid per-frame cost
    if (!script.autoEncode) { return; }

    var now = getTime();
    var interval = Math.max(script.encodeInterval || 0.5, 0.05);
    if (isEncoding || now < nextEncodeTime) { return; }

    isEncoding = true;
    nextEncodeTime = now + interval;

    encode(scaledRenderTargetTexture)
        .then(printEncodedString)
        .catch(printError)
        .finally(function () { isEncoding = false; });
})