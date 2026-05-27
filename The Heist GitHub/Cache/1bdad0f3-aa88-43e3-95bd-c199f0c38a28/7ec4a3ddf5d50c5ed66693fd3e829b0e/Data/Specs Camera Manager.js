let cameraModule = require('LensStudio:CameraModule');
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;
var latestFrame = null;
// @input Component.Image cameraTextureDisplayImage
// @input bool downsampleTexture = false
// @input bool externalReceiver = false
// @ui {"widget":"group_start", "label":"Downsample Settings", "showIf":"downsampleTexture"}
// @input Component.Camera downsampleCamera
// @input Asset.Texture scaledRenderTargetTexture {"showIf":"downsampleTexture"}
// @input int inputMode {"widget":"combobox", "values":[{"label":"Keep Aspect Ratio", "value":"0"}, {"label":"Custom Resolution", "value":"1"}]}
// @input int maxResolution = 250 {"showIf":"inputMode","showIfValue":"0", "label":"Max Resolution (px)"}
// @input vec2 resolution {"showIf":"inputMode","showIfValue":"1", "label":"Resolution (px)"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Encoding Settings", "showIf":"argument","showIfValue":"1"}
// @input bool autoEncode = false {"showIf":"argument","showIfValue":"1"}
// @input int compressionQuality = 0 {"widget" : "combobox", "values" : [{"label" : "Maximum Compression", "value" : "0"}, {"label" : "Low Quality", "value" : "1"}, {"label" : "Intermediate Quality", "value" : "2"}, {"label" : "High Quality", "value" : "3"}, {"label" : "Maximum Quality", "value" : "4"}]}
// @input int encodingType = 0 {"widget" : "combobox", "values" : [{"label" : "PNG", "value" : "0"}, {"label" : "JPG", "value" : "1"}]}
// @input float encodeInterval = 0.5 {"showIf":"argument","showIfValue":"1", "label":"Auto Encode Interval (s)"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"External Receiver", "showIf":"externalReceiver"}
// @input Component.ScriptComponent externalScript
// @input int argument {"widget":"combobox", "values":[{"label":"Texture", "value":"0"}, {"label":"Base64 Encoded Texture", "value":"1"}]}
// @input string functionName
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
var cameraTextureDisplayImage = script.cameraTextureDisplayImage;
var scaledRenderTargetTexture = script.scaledRenderTargetTexture;
var hasSizedRenderTarget = false;

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    script.externalScript[script.functionName](result);
}

function printError(error) {
    print("Error: " + error)
}

// function displayTexture(texture) {
//     // print("Texture: " + texture)
//     if (script.outputImage) {
//         script.outputImage.mainMaterial.mainPass.baseTex = texture
//     }
// }

function encode(texture) {
    return new Promise(function (resolve, reject) {
        Base64.encodeTextureAsync(texture, resolve, reject, script.compressionQuality, script.encodingType)
    })
}

// function decode(encodedString) {
//     return new Promise(function (resolve, reject) {
//         Base64.decodeTextureAsync(encodedString, resolve, reject)
//     })
// }

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
    // if (!hasSizedRenderTarget && scaledRenderTargetTexture && latestFrame) {
    //     var maxRes = Math.max(1, script.maxResolution || 250);
    //     var w = latestFrame.getWidth();
    //     var h = latestFrame.getHeight();
    //     if (w > 0 && h > 0) {
    //         var aspect = w / h;
    //         var targetW, targetH;
    //         if (aspect >= 1) {
    //             targetW = maxRes;
    //             targetH = Math.ceil(maxRes / aspect);
    //         } else {
    //             targetH = maxRes;
    //             targetW = Math.ceil(maxRes * aspect);
    //         }
    //         scaledRenderTargetTexture.control.useScreenResolution = false;
    //         scaledRenderTargetTexture.control.resolution = new vec2(targetW, targetH);
    //         hasSizedRenderTarget = true;
    //     }
    // }

    // Optional throttled encoding to avoid per-frame cost
    if (!script.autoEncode) { return; }

    var now = getTime();
    var interval = Math.max(script.encodeInterval || 0.5, 0.05);
    if (isEncoding || now < nextEncodeTime) { return; }

    isEncoding = true;
    nextEncodeTime = now + interval;

    // encode(scaledRenderTargetTexture)
    encode(scaledRenderTargetTexture)
        .then(handleEncodedTexture)
        .catch(function(){ if(error) printError })
        .finally(function () { isEncoding = false; });
})