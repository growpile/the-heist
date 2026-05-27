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

// @input Asset.Texture renderTexture

// hidden
// @input Asset.ObjectPrefab virtualRenderCameraSetup
// @input Asset.Texture screenCropTexture
// @input Asset.Texture compositeTexture

let cameraModule = require('LensStudio:CameraModule');
// let remoteMediaModule = require('LensStudio:RemoteMediaModule');
let events = require('./Resources/Event Module.js');
let cameraTextureProvider;
var latestTexture = null;
var compositeCameraSetup = null;

var nextEncodeTime = 0;
var isEncoding = false;
var updateEvent = null;

var cameraFrameEvent = new events.EventWrapper();
var imageCaptureEvent = new events.EventWrapper();
script.onCameraFrameCaptured = cameraFrameEvent;
script.onImageCaptured = imageCaptureEvent;

// #region Helpers
function printError(error) {
    print("Error: " + error)
}

function encodeTexture(texture, qualityOverride, encodingOverride) {
    return new Promise(function (resolve, reject) {
        var q = (qualityOverride !== undefined && qualityOverride !== null) ? qualityOverride : script.compressionQuality;
        var e = (encodingOverride !== undefined && encodingOverride !== null) ? encodingOverride : script.encodingType;
        try {
            if (Base64.encodeTextureAsync) {
                Base64.encodeTextureAsync(texture, resolve, reject, q, e);
            } else if (Base64.encodeTexture) {
                var result = Base64.encodeTexture(texture, q, e);
                resolve(result);
            } else {
                reject("Base64 encode not available");
            }
        } catch (err) {
            reject(err);
        }
    });
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

    requestOutput(request).then(function (textureResult) {

        if (textureResult) {

            initUpdateEvent();
        }
    });
});

function handleEncodedTexture(result) {
    // print("Encoded texture: " + result)
    if (script.externalScript && script.functionName && script.externalScript[script.functionName]) {
        script.externalScript[script.functionName](result);
    }
}

// archive
// function buildCaptureResult(tex, provider, isStream) {
//     return {
//         texture: tex,
//         encode: function(optionalCompressionQuality, optionalEncodingType, optionalThrottleSeconds) {
//             if (!isStream) {
//                 return encodeTexture(tex);
//             }
//             var ev = new events.EventWrapper();
//             var last = -1e9;
//             var throttleSec = (optionalThrottleSeconds !== undefined && optionalThrottleSeconds !== null) ? optionalThrottleSeconds : 2;
//             if (provider && provider.onNewFrame) {
//                 var reg = provider.onNewFrame.add(function(frame) {
//                     var now = getTime();
//                     if (now - last < throttleSec) { return; }
//                     last = now;
//                     encodeTexture(tex   )
//                         .then(function(str) { ev.trigger(str); })
//                         .catch(printError);
//                 });
//                 ev.stop = function() {
//                     if (reg && provider && provider.onNewFrame) {
//                         provider.onNewFrame.remove(reg);
//                         reg = null;
//                     }
//                 };
//             }
//             return ev;
//         }
//     };
// }

function buildCaptureResult(tex, provider, isStream) {
    return {
        texture: tex,
        encode: function(optionalCompressionQuality, optionalEncodingType, optionalThrottleSeconds) {
            var q = (optionalCompressionQuality !== undefined && optionalCompressionQuality !== null) ? optionalCompressionQuality : script.compressionQuality;
            var e = (optionalEncodingType !== undefined && optionalEncodingType !== null) ? optionalEncodingType : script.encodingType;

            if (!isStream) {
                return encodeTexture(tex, q, e);
            }

            var ev = new events.EventWrapper();
            var throttleSec = (optionalThrottleSeconds !== undefined && optionalThrottleSeconds !== null) ? optionalThrottleSeconds : 2;
            var last = -1e9;

            if (provider && provider.onNewFrame) {
                var reg = provider.onNewFrame.add(function(frame) {
                    var now = getTime();
                    if (now - last < throttleSec) { return; }
                    last = now;
                    encodeTexture(tex, q, e)
                        .then(function(str) { ev.trigger(str); })
                        .catch(printError);
                });
                ev.stop = function() {
                    if (reg && provider && provider.onNewFrame) {
                        provider.onNewFrame.remove(reg);
                        reg = null;
                    }
                };
            }
            return ev;
        }
    };
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
            if (includeRenderedContent && script.screenCropTexture && script.screenCropTexture.control) {
                script.screenCropTexture.control.inputTexture = camTex;
                if (!compositeCameraSetup && script.virtualRenderCameraSetup) {
                    compositeCameraSetup = script.virtualRenderCameraSetup.instantiate(script.getSceneObject());
                }
                if (compositeCameraSetup && script.renderTexture) {
                    var augmentedImageComponent = compositeCameraSetup.getChild(0).getChild(0).getComponent('Component.Image');
                    augmentedImageComponent.mainPass.baseTex = script.renderTexture;
                    // Optionally set resolution on compositeTexture if needed:
                    // script.compositeTexture.control.resolution = script.finalCompositeResolutionTarget;
                }
            }
            cameraFrameEvent.trigger(camTex);
            var returnTex = includeRenderedContent && script.compositeTexture ? script.compositeTexture : latestTexture;
            var result = buildCaptureResult(returnTex, provider, true);
            if (callback) { callback(returnTex); }
            return result;
        });
        return buildCaptureResult(camTex, provider, true);
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

        if (includeRenderedContent && script.screenCropTexture && script.screenCropTexture.control) {
            script.screenCropTexture.control.inputTexture = latestTexture;
            if (!compositeCameraSetup && script.virtualRenderCameraSetup) {
                compositeCameraSetup = script.virtualRenderCameraSetup.instantiate(script.getSceneObject());
            }
            if (compositeCameraSetup && script.renderTexture) {
                var augmentedImageComponent = compositeCameraSetup.getChild(0).getChild(0).getComponent('Component.Image');
                augmentedImageComponent.mainPass.baseTex = script.renderTexture.copyFrame();
                // Optionally set resolution on compositeTexture if needed:
                // script.compositeTexture.control.resolution = script.finalCompositeResolutionTarget;
            }
        }

        if (script.debugDisplayTexture && script.debugDisplayImage) {
            script.debugDisplayImage.mainPass.baseTex = latestTexture;
        }
        imageCaptureEvent.trigger(latestTexture);
        var returnTex = includeRenderedContent && script.compositeTexture ? script.compositeTexture : latestTexture;
        var result = buildCaptureResult(returnTex, null, false);
        if (callback) { callback(returnTex); }
        return result;
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
    print("initUpdate")
    if (updateEvent) { return; }
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        var finalTexture = latestTexture;
        if (!finalTexture) { return; }

        var baseTexture = finalTexture;
        if (script.screenCropTexture && script.screenCropTexture.control && script.compositeTexture) {
            script.screenCropTexture.control.inputTexture = baseTexture;
            if (!compositeCameraSetup && script.virtualRenderCameraSetup) {
                compositeCameraSetup = script.virtualRenderCameraSetup.instantiate(script.getSceneObject());
            }
            if (compositeCameraSetup && script.renderTexture) {
                var augmentedImageComponent = compositeCameraSetup.getChild(0).getChild(0).getComponent('Component.Image');
                augmentedImageComponent.mainPass.baseTex = script.renderTexture;
            }
            finalTexture = script.compositeTexture;
        }

        if (script.debugDisplayTexture && script.debugDisplayImage) {
            script.debugDisplayImage.mainPass.baseTex = finalTexture;
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

        encodeTexture(finalTexture)
            .then(handleEncodedTexture)
            .catch(function(error){ if(error) printError(error); })
            .finally(function () { isEncoding = false; });
    });
}

script.startStreaming = function(options) {
    var opts = options || {};

    if (opts.externalScript) { script.externalScript = opts.externalScript; }
    if (opts.functionName) { script.functionName = opts.functionName; }
    if (opts.output !== undefined) { script.output = opts.output; }
    if (opts.updateInterval !== undefined) { script.updateInterval = opts.updateInterval; }
    if (opts.encodingType !== undefined) { script.encodingType = opts.encodingType; }
    if (opts.compressionQuality !== undefined) { script.compressionQuality = opts.compressionQuality; }

    var includeRendered = (opts.includeRenderedContent !== undefined) ? opts.includeRenderedContent : true;
    if (!latestTexture) {
        script.captureCameraFrameSession(null, includeRendered, opts.optionalConfig);
    }

    initUpdateEvent();
};


// for image requests use copyFrame(); to apply only the current render view to the capture
