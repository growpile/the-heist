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
let cameraRequest;
let cameraTexture;
let cameraTextureProvider;
var latestFrame = null;
var latestImage = null;

var compositeRenderTexture = script.compositeRenderTexture;

var cameraTextureDisplayImage = script.cameraTextureDisplayImage;
var scaledRenderTargetTexture = script.scaledRenderTargetTexture;
var hasSizedRenderTarget = false;

var nextEncodeTime = 0;
var isEncoding = false;
var updateEvent = null;

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
            var imageFrame = await cameraModule.requestImage(request);
            latestImage = imageFrame.texture;
            if (script.debugDisplayTexture && script.debugDisplayImage) {
                script.debugDisplayImage.mainPass.baseTex = latestImage;
            }
            print("Got imageRequest texture");
            return imageFrame.texture;
        } catch (e) {
            printError(e);
            return null;
        }
    } else {
        try {
            var camTex = cameraModule.requestCamera(request);
            latestFrame = camTex;
            cameraTextureProvider = camTex.control;
            cameraTextureProvider.onNewFrame.add(function (frame) {
                latestFrame = camTex;
                if (script.debugDisplayTexture && script.debugDisplayImage) {
                    script.debugDisplayImage.mainPass.baseTex = latestFrame;
                }
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
    requestOutput(request).then(function (tex) {
        if (tex && script.updateCycle) {
            initUpdateEvent();
        } else if (!tex && script.input == 0) {
            // Fallback to camera request if image request not supported
            print("Falling back to camera request");
            script.input = 1;
            var camReq = CameraModule.createCameraRequest();
            handleCameraRequest(camReq);
            requestOutput(camReq).then(function (camTex) {
                if (camTex && script.updateCycle) {
                    initUpdateEvent();
                }
            });
        }
    });
});

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    script.externalScript[script.functionName](result);
}

function initUpdateEvent() {
    if (updateEvent) { return; }
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        if (!script.updateCycle) { return; }
        // Debug: show that frames are coming in
        if (latestFrame) {
            // print("Camera frame size: " + latestFrame.getWidth() + "x" + latestFrame.getHeight());
        } else if (latestImage) {
            // print("Image texture size: " + latestImage.getWidth() + "x" + latestImage.getHeight());
        }

        var now = getTime();
        var interval = Math.max(script.updateInterval || 0.5, 0.05);
        if (isEncoding || now < nextEncodeTime) { return; }

        isEncoding = true;
        nextEncodeTime = now + interval;

        encode(compositeRenderTexture)
            .then(handleEncodedTexture)
            .catch(function(error){ if(error) printError(error); })
            .finally(function () { isEncoding = false; });
    });
}
