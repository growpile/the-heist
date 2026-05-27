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
    function withRefreshRate(sec) { opts.refreshRate = sec; return finalize(true); }
    function get() { return finalize(false); }

    function finalize(asEvent) {
        if (isImageRequest) {
            return (async function() {
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
        } else {
            var req = CameraModule.createCameraRequest();
            req.cameraId = opts.cameraId;
            if (opts.resolution) {
                req.imageSmallerDimension = opts.resolution;
            }
            var camTex = CameraModule.requestCamera(req);

            if (!asEvent) {
                // single frame; try to freeze
                var tex = camTex;
                if (opts.includeRender && script.renderTexture) {
                    try { tex = script.renderTexture.copyFrame(); } catch (e) { tex = camTex; }
                } else {
                    try { tex = camTex.copyFrame(); } catch (e) { tex = camTex; }
                }
                if (script.screenCropTexture && script.screenCropTexture.control) {
                    script.screenCropTexture.control.inputTexture = tex;
                }
                return tex;
            }

            // event stream
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
        get: get
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
