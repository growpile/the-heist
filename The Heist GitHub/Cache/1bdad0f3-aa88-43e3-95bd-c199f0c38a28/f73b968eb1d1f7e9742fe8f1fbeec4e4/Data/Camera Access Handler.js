// @input bool debugDisplayTexture
// @input Component.Image debugDisplayImage {"showIf":"debugDisplayTexture"}
// @input int input {"widget":"combobox", "values":[{"label":"Image Request - Hi-Res Image", "value":"0"}, {"label":"Camera Request - Low-Res Frame", "value":"1"}]}

// @ui {"widget":"group_start", "label":"Image Request Properties", "showIf":"input","showIfValue":"0"}
// @input bool customResolution
// @input vec2 resolution {"label":"Capture Resolution (px)", "showIf":"customResolution"}
// @input bool useCrop {"label":"Use Crop"}
// @input vec4 cropValue {"label":"Crop Rect", "showIf":"useCrop"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Camera Request Properties", "showIf":"input","showIfValue":"1"}
// @input bool downsampleTexture = false {"showIf":"input", "showIfValue":"1", "label":"Downsample Camera Texture"}
// @input int maxResolution = 250 {"showIf":"downsampleTexture", "label":"Max Camera Resolution (px)"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// @input vec2 finalCompositeResolutionTarget {"label":"Final Composite Resolution (px)", "showIf":"overlayRender"}

// @input bool overlayRender = false
// @input bool updateCycle = false
// @input int output {"widget":"combobox", "values":[{"label":"Texture", "value":"0"}, {"label":"Base64 String", "value":"1"}]}
// @ui {"widget":"group_start", "label":"Encoding Settings", "showIf":"output","showIfValue":"1"}
// @input int compressionQuality = 0 {"widget" : "combobox", "values" : [{"label" : "Maximum Compression", "value" : "0"}, {"label" : "Low Quality", "value" : "1"}, {"label" : "Intermediate Quality", "value" : "2"}, {"label" : "High Quality", "value" : "3"}, {"label" : "Maximum Quality", "value" : "4"}]}
// @input int encodingType = 0 {"widget" : "combobox", "values" : [{"label" : "PNG", "value" : "0"}, {"label" : "JPG", "value" : "1"}]}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Update Receiver", "showIf":"updateCycle"}
// @input float updateInterval = 0.5 {"showIf":"updateCycle", "label":"Update Interval (s)"}
// @input Component.ScriptComponent externalScript
// @input string functionName
// @ui {"widget":"group_end"}

// hidden
// @input Asset.ObjectPrefab virtualRenderCameraSetup
// @input Asset.Texture screenCropTexture
// @input Asset.Texture compositeRenderTexture

let cameraModule = require('LensStudio:CameraModule');
let cameraTextureProvider;
var latestTexture = null;

var compositeRenderTexture = script.compositeRenderTexture;

var nextEncodeTime = 0;
var isEncoding = false;
var updateEvent = null;

var compositeCameraSetup;

// helpers
function printError(error) {
    print("Error: " + error)
}
function encode(texture) {
    return new Promise(function (resolve, reject) {
        Base64.encodeTextureAsync(texture, resolve, reject, script.compressionQuality, script.encodingType)
    })
}
function decode(encodedString) {
    return new Promise(function (resolve, reject) {
        Base64.decodeTextureAsync(encodedString, resolve, reject)
    })
}
function handleImageRequest(imageRequest) {
    if (script.customResolution && script.resolution) {
        imageRequest.resolution = new vec2(script.resolution.x, script.resolution.y);
    }
    if (script.useCrop) {
        imageRequest.cropRect = Rect.create(
            script.cropValue.x, script.cropValue.y, 
            script.cropValue.z, script.cropValue.w
        );
    }
}
function handleCameraRequest(cameraRequest) {
    cameraRequest.cameraId = CameraModule.CameraId.Default_Color;
    // if downsampling is enabled, set .imageSmallerDimension to the specified resolution or to 200 if 0
    if(script.downsampleTexture) cameraRequest.imageSmallerDimension = script.maxResolution != 0 ? script.maxResolution : 200;
}
async function requestOutput(request) {
    if (script.input == 0) {
        try {
            var imageFrame = cameraModule.getImageFrameAsync
                ? await cameraModule.getImageFrameAsync(request)
                : await cameraModule.requestImage(request);
            latestTexture = imageFrame.texture;
            print("Got imageRequest texture");
            return imageFrame.texture;
        } catch (e) {
            printError(e);
            return null;
        }
    } else {
        try {
            var camTex = cameraModule.requestCamera(request);
            latestTexture = camTex;
            cameraTextureProvider = camTex.control;
            cameraTextureProvider.onNewFrame.add(function (frame) {
                latestTexture = camTex;
            });
            print("Got cameraRequest texture");
            return camTex;
        } catch (e) {
            printError(e);
            return null;
        }
    }
}

script.createEvent('OnStartEvent').bind(() => {
    // create & configure request based on inspector input
    var request = script.input == 0 ? CameraModule.createImageRequest() : CameraModule.createCameraRequest();
    script.input == 0 ? handleImageRequest(request) : handleCameraRequest(request);

    if(script.overlayRender) {
        compositeCameraSetup = script.virtualRenderCameraSetup.instantiate(script.getSceneObject());

        if(script.finalCompositeResolutionTarget.x != 0 && script.finalCompositeResolutionTarget.y != 0) {
            compositeRenderTexture.control.resolution = script.finalCompositeResolutionTarget;
        }
    }

    requestOutput(request).then(function (textureResult) {
        if (tex && script.updateCycle) {
            initUpdateEvent();
        }
    });
});

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    script.externalScript[script.functionName](result);
}

function sendTextureIfNeeded(tex) {
    if (script.externalScript && script.functionName && script.externalScript[script.functionName]) {
        script.externalScript[script.functionName](tex);
    }
}

function initUpdateEvent() {
    if (updateEvent) { return; }
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        var finalTexture = script.overlayRender ? compositeRenderTexture : latestTexture;
        if (!finalTexture) { return; }

        if (script.debugDisplayTexture && script.debugDisplayImage) {
            script.debugDisplayImage.mainPass.baseTex = finalTexture;
        }

        // if overlayRender is enabled and a crop texture is assigned, feed the texture into it
        if (script.overlayRender && script.screenCropTexture && script.screenCropTexture.control) {
            script.screenCropTexture.control.inputTexture = latestTexture;
        }

        // if output is texture, forward it
        if (script.output === 0) {
            sendTextureIfNeeded(finalTexture);
            return;
        }

        // encode on interval
        var now = getTime();
        var interval = Math.max(script.updateInterval || 0.5, 0.05);
        if (isEncoding || now < nextEncodeTime) { return; }

        isEncoding = true;
        nextEncodeTime = now + interval;

        encode(finalTexture)
            .then(handleEncodedTexture)
            .catch(function(error){ if(error) printError(error); })
            .finally(function () { isEncoding = false; });
    });
}
