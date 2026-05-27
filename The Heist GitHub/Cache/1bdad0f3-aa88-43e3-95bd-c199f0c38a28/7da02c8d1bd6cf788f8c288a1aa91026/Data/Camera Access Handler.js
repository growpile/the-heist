// @input bool debugDisplayTexture
// @input Component.Image debugDisplayImage {"showIf":"debugDisplayTexture"}

// @ui {"widget":"group_start", "label":"Image Request Properties"}
// @input bool customResolution
// @input vec2 resolution {"label":"Capture Resolution (px)", "showIf":"customResolution"}
// @input bool useCrop {"label":"Use Crop"}
// @input vec4 cropValue {"label":"Crop Rect", "showIf":"useCrop"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Camera Request Properties"}
// @input bool downsampleTexture = false {"label":"Downsample Texture"}
// @input int maxResolution = 250 {"showIf":"downsampleTexture", "label":"Max Camera Resolution (px)"}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Base64 Encoding Properties"}
// @input int compressionQuality = 0 {"widget" : "combobox", "values" : [{"label" : "Maximum Compression", "value" : "0"}, {"label" : "Low Quality", "value" : "1"}, {"label" : "Intermediate Quality", "value" : "2"}, {"label" : "High Quality", "value" : "3"}, {"label" : "Maximum Quality", "value" : "4"}]}
// @input int encodingType = 0 {"widget" : "combobox", "values" : [{"label" : "PNG", "value" : "0"}, {"label" : "JPG", "value" : "1"}]}
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

// hidden
// @input Asset.ObjectPrefab virtualRenderCameraSetup
// @input Asset.Texture screenCropTexture
// @input Asset.Texture compositeTexture

let cameraModule = require('LensStudio:CameraModule');
let remoteMediaModule = require('LensStudio:RemoteMediaModule');
let events = require('./Resources/Event Module.js');
let cameraTextureProvider;
var latestTexture = null;

var nextEncodeTime = 0;
var isEncoding = false;
var updateEvent = null;

var compositeCameraSetup;
var cameraFrameEvent = new events.EventWrapper();
var imageCaptureEvent = new events.EventWrapper();
script.onCameraFrameCaptured = cameraFrameEvent;
script.onImageCaptured = imageCaptureEvent;

// #region Helpers
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
// #endregion

// #region Camera Module Request Handlers
function handleImageRequest(imageRequest, config) {
    var customRes = config && config.optionalCustomResolutionVec2
        ? config.optionalCustomResolutionVec2
        : (script.customResolution ? script.resolution : null);
    if (customRes && customRes.x && customRes.y) {
        imageRequest.resolution = new vec2(customRes.x, customRes.y);
    }

    var crop = config && config.optionalCropVec4
        ? config.optionalCropVec4
        : (script.useCrop ? script.cropValue : null);
    if (crop) {
        imageRequest.cropRect = Rect.create(crop.x, crop.y, crop.z, crop.w);
    }
}
function handleCameraRequest(cameraRequest, config) {
    var camId = config && config.optionalCameraIdInt !== undefined ? config.optionalCameraIdInt : CameraModule.CameraId.Default_Color;
    cameraRequest.cameraId = camId;

    var maxRes = (config && config.optionalMaxResolutionInt !== undefined) ? config.optionalMaxResolutionInt : (script.downsampleTexture ? (script.maxResolution != 0 ? script.maxResolution : 200) : null);
    if (maxRes) {
        cameraRequest.imageSmallerDimension = maxRes;
    }
}
// #endregion

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
    script.input == 0 ? handleImageRequest(request, null) : handleCameraRequest(request, null);

    compositeCameraSetup = script.virtualRenderCameraSetup.instantiate(script.getSceneObject());
    // apply aspect ratio settings here!!!

    requestOutput(request).then(function (textureResult) {
        if (textureResult && script.updateCycle) {
            initUpdateEvent();
        }
    });
});

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    script.externalScript[script.functionName](result);
}

script.captureCameraFrameSession = function(callback, includeRenderedContent, optionalConfig) {
    var req = CameraModule.createCameraRequest();
    handleCameraRequest(req, optionalConfig);
    try {
        var camTex = cameraModule.requestCamera(req);
        var provider = camTex.control;
        var registration = provider.onNewFrame.add(function(frame) {
            provider.onNewFrame.remove(registration);
            latestTexture = camTex;
            if (script.overlayRender && script.screenCropTexture && script.screenCropTexture.control) {
                script.screenCropTexture.control.inputTexture = camTex;
            }
            if (includeRenderedContent) {
                // set resolution
                // compositeRenderTexture.control.resolution = script.finalCompositeResolutionTarget;
                script.debugDisplayImage.mainPass.baseTex = latestTexture;
            }
            cameraFrameEvent.trigger(camTex);
            // var returnTex = includeRenderedContent && script.compositeTexture ? script.compositeTexture : latestTexture;
            var returnTex = latestTexture;
            if (callback) { callback(returnTex); }
        });
        return returnTex;
    } catch (e) {
        printError(e);
        if (callback) { callback(null); }
        return null;
    }
};

script.captureCameraImage = async function(callback, includeRenderedContent, optionalConfig) {
    var req = CameraModule.createImageRequest();
    handleImageRequest(req, optionalConfig);
    try {
        var imageFrame = cameraModule.getImageFrameAsync
            ? await cameraModule.getImageFrameAsync(req)
            : await cameraModule.requestImage(req);
        latestTexture = imageFrame.texture;
        // if (includeRenderedContent) {
        //     // set resolution
        //     // compositeRenderTexture.control.resolution = script.finalCompositeResolutionTarget;
        //     // script.screenCropTexture.control.inputTexture = latestTexture;
        // }
        if (script.debugDisplayTexture && script.debugDisplayImage) {
            script.debugDisplayImage.mainPass.baseTex = latestTexture;
        }
        imageCaptureEvent.trigger(latestTexture);
        // var returnTex = includeRenderedContent && script.compositeTexture ? script.compositeTexture : latestTexture;
        var returnTex = latestTexture;
        if (callback) { callback(returnTex); }
        return returnTex;
    } catch (e) {
        printError(e);
        if (callback) { callback(null); }
        return null;
    }
};

function sendTextureIfNeeded(tex) {
    if (script.externalScript && script.functionName && script.externalScript[script.functionName]) {
        script.externalScript[script.functionName](tex);
    }
}

function initUpdateEvent() {
    if (updateEvent) { return; }
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        var finalTexture = latestTexture;
        if (!finalTexture) { return; }

        if (script.debugDisplayTexture && script.debugDisplayImage) {
            script.debugDisplayImage.mainPass.baseTex = finalTexture;
        }

        // if overlayRender is enabled and a crop texture is assigned, feed the texture into it
        if (script.overlayRender && script.includeRenderedContent && script.screenCropTexture && script.screenCropTexture.control) {
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


// for image requests use copyFrame(); to apply only the current render view to the capture