// @input Asset.Texture renderTexture
// @input Asset.Texture screenCropTexture

var CameraModule = require('LensStudio:CameraModule');
var events = require('./Resources/Event Module.js');

function createBuilder(isImageRequest) {
    var opts = {
        cameraId: CameraModule.CameraId.Default_Color,
        resolution: null,
        includeRender: false,
        refreshRate: null
    };

    function fromCamera(id) { opts.cameraId = id; return api; }
    function withResolution(res) { opts.resolution = res; return api; }
    function includesLiveRender() { opts.includeRender = true; return api; }
    function withRefreshRate(sec) { opts.refreshRate = sec; return api; }
    function get() { return finalize(); }

    function finalize() {
        var asEvent = opts.refreshRate !== null && opts.refreshRate !== undefined;

        if (isImageRequest) {
            var promise = (async function() {
                var req = CameraModule.createImageRequest();
                if (opts.resolution) {
                    req.resolution = new vec2(opts.resolution, opts.resolution);
                }
                var frame = await CameraModule.requestImage(req);
                var tex = frame.texture;
                if (opts.includeRender && script.renderTexture) {
                    try { tex = script.renderTexture.copyFrame(); } catch (e) {}
                }
                if (asEvent) {
                    var ev = new events.EventWrapper();
                    ev.trigger(tex);
                    return ev;
                }
                return tex;
            })();
            api.then = promise.then.bind(promise);
            api.catch = promise.catch.bind(promise);
            return promise;
        } else {
            var req = CameraModule.createCameraRequest();
            req.cameraId = opts.cameraId;
            if (opts.resolution) {
                req.imageSmallerDimension = opts.resolution;
            }
            var camTex = CameraModule.requestCamera(req);

            if (!asEvent) {
                return new Promise(function(resolve) {
                    var provider = camTex.control;
                    var handled = false;
                    var finish = function() {
                        if (handled) { return; }
                        handled = true;
                        var texOut = camTex;
                        if (opts.includeRender && script.renderTexture) {
                            try { texOut = script.renderTexture.copyFrame(); } catch (e) { texOut = camTex; }
                        } else {
                            try { texOut = camTex.copyFrame(); } catch (e) { texOut = camTex; }
                        }
                        if (script.screenCropTexture && script.screenCropTexture.control) {
                            script.screenCropTexture.control.inputTexture = texOut;
                        }
                        resolve(texOut);
                    };
                    if (provider && provider.onNewFrame) {
                        var reg = provider.onNewFrame.add(function() {
                            provider.onNewFrame.remove(reg);
                            finish();
                        });
                    } else {
                        finish();
                    }
                });
            }

            var ev = new events.EventWrapper();
            var provider = camTex.control;
            var last = -1e9;
            var throttleSec = opts.refreshRate || 2;
            if (provider && provider.onNewFrame) {
                var reg = provider.onNewFrame.add(function() {
                    var now = getTime();
                    if (now - last < throttleSec) { return; }
                    last = now;
                    var outTex = camTex;
                    if (opts.includeRender && script.renderTexture) {
                        outTex = script.renderTexture;
                    }
                    ev.trigger(outTex);
                });
                ev.stop = function() {
                    if (reg && provider && provider.onNewFrame) {
                        provider.onNewFrame.remove(reg);
                        reg = null;
                    }
                };
            } else {
                ev.trigger(camTex);
            }
            return ev;
        }
    }

    var api = {
        fromCamera: fromCamera,
        withResolution: withResolution,
        includesLiveRender: includesLiveRender,
        withRefreshRate: withRefreshRate,
        get: get,
        then: function (onFulfilled, onRejected) {
            return Promise.resolve(finalize()).then(onFulfilled, onRejected);
        },
        catch: function (onRejected) {
            return Promise.resolve(finalize()).catch(onRejected);
        }
    };
    return api;
}

// Public entry points
script.captureFrame = function() {
    return createBuilder(false);
};

script.captureImage = function() {
    return createBuilder(true);
};
