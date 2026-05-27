let cameraModule = require('LensStudio:CameraModule');
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;
var latestFrame = null;

// @input bool debugTexture
// @input Component.Image debugImage
// @input int input {"widget":"combobox", "values":[{"label":"Image Request - Hi-Res Image", "value":"0"}, {"label":"Camera Request - Low-Res Frame", "value":"1"}]}

// @ui {"widget":"group_start", "label":"Image Request Properties", "showIf":"input","showIfValue":"0"}
// @input vec2 resolution {"label":"Capture Resolution (px)"}
// @input vec4 crop {"label":"Crop"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Camera Request Properties", "showIf":"input","showIfValue":"1"}
// @input bool downsampleTexture = false {"showIf":"input", "showIfValue":"1", "label":"Downsample Camera Texture"}
// @input int maxResolution = 250 {"showIf":"downsampleTexture", "label":"Max Camera Resolution (px)"}
// @ui {"widget":"group_end"}

// @input vec2 finalCompositeResolutionTarget_Texture {"label":"Final Composite Resolution (px)", "showIf":"output", "showIfValue":"2"}
// @input vec2 finalCompositeResolutionTarget_Codable {"label":"Final Composite Resolution (px)", "showIf":"output", "showIfValue":"3"}

// @input bool updateCycle = false
// @input int output {"widget":"combobox", "values":[{"label":"Camera Texture", "value":"0"}, {"label":"Base64 Camera Texture String", "value":"1"}, {"label":"Render Texture", "value":"2"}, {"label":"Base64 Render Texture String", "value":"3"}]}
// @ui {"widget":"group_start", "label":"Encoding Settings", "showIf":"output","showIfValue":"1"}
// @input int compressionQuality = 0 {"widget" : "combobox", "values" : [{"label" : "Maximum Compression", "value" : "0"}, {"label" : "Low Quality", "value" : "1"}, {"label" : "Intermediate Quality", "value" : "2"}, {"label" : "High Quality", "value" : "3"}, {"label" : "Maximum Quality", "value" : "4"}]}
// @input int encodingType = 0 {"widget" : "combobox", "values" : [{"label" : "PNG", "value" : "0"}, {"label" : "JPG", "value" : "1"}]}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Update Receiver", "showIf":"updateCycle"}
// @input float updateInterval = 0.5 {"showIf":"updateCycle", "label":"Update Interval (s)"}
// @input Component.ScriptComponent externalScript
// @input string functionName
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// @input Asset.ObjectPrefab virtualRenderCameraSetup
// @input Asset.Texture screenCropTexture
// @input Asset.Texture compositeRenderTexture
var compositeRenderTexture = script.compositeRenderTexture;

var cameraTextureDisplayImage = script.cameraTextureDisplayImage;
var scaledRenderTargetTexture = script.scaledRenderTargetTexture;
var hasSizedRenderTarget = false;

var nextEncodeTime = 0;
var isEncoding = false;

// helpers

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

function printError(error) {
    print("Error: " + error)
}

script.createEvent('OnStartEvent').bind(() => {
    cameraRequest = CameraModule.createCameraRequest();
    cameraRequest.cameraId = CameraModule.CameraId.Default_Color;
    cameraRequest.imageSmallerDimension = script.maxResolution;

    var sceneRootObject = global.scene.getRootObject(2);
    script.virtualRenderCameraSetup.instantiate(sceneRootObject);

    cameraTexture = cameraModule.requestCamera(cameraRequest);
    cameraTextureProvider = cameraTexture.control;
    if (script.screenCropTexture && script.screenCropTexture.control) {
        var cropTexControl = script.screenCropTexture.control;
        cropTexControl.inputTexture = cameraTexture;
    }
    
    cameraTextureProvider.onNewFrame.add((cameraFrame) => {
        latestFrame = cameraTexture;
    });
});

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    script.externalScript[script.functionName](result);
}

script.createEvent("LateUpdateEvent").bind(function() {
    if(!latestFrame) return;

    // show texture on image display
    if(cameraTextureDisplayImage && latestFrame) {
        // cameraTextureDisplayImage.mainPass.baseTex = latestFrame;
        // print(latestFrame.getHeight());
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
    if (!script.updateCycle) { return; }

    var now = getTime();
    var interval = Math.max(script.updateInterval || 0.5, 0.05);
    if (isEncoding || now < nextEncodeTime) { return; }

    isEncoding = true;
    nextEncodeTime = now + interval;

    // encode(scaledRenderTargetTexture)
    print(compositeRenderTexture.getWidth());
    encode(compositeRenderTexture)
        .then(handleEncodedTexture)
        .catch(function(){ if(error) printError })
        .finally(function () { isEncoding = false; });
})