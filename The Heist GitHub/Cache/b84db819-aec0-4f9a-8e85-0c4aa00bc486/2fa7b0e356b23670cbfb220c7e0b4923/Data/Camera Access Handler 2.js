// @input Asset.Texture renderTexture
// @input Asset.Texture screenCropTexture

var CameraModule = require('LensStudio:CameraModule');
var events = require('./Resources/Event Module.js');

function Builder(isImageRequest) {
    this.opts = {
        cameraId: CameraModule.CameraId.Default_Color,
        resolution: null,
        includeRender: false,
        refreshRate: null
    };

    this.fromCamera = function(id) { this.opts.cameraId = id; print(id); return this; };
    this.withResolution = function(res) { this.opts.resolution = res; return this; };
    this.includesLiveRender = function() { this.opts.includeRender = true; return this; };
    this.withRefreshRate = function(sec) { this.opts.refreshRate = sec; return this; };
    this.get = function() { return this.finalize(); };
    this.then = function(onFulfilled, onRejected) { return Promise.resolve(this.finalize()).then(onFulfilled, onRejected); };
    this.catch = function(onRejected) { return Promise.resolve(this.finalize()).catch(onRejected); };

    this.finalize = function() {
        print("[CAH2] finalize called, isImage=" + isImageRequest + ", asEvent=" + (this.opts.refreshRate !== null && this.opts.refreshRate !== undefined));
        var asEvent = this.opts.refreshRate !== null && this.opts.refreshRate !== undefined;

        if (isImageRequest) {
            var promise = (async function(self) {
                var req = CameraModule.createImageRequest();
                if (self.opts.resolution) {
                    req.resolution = new vec2(self.opts.resolution, self.opts.resolution);
                }
                var frame = await CameraModule.requestImage(req);
                var tex = frame.texture;
                if (self.opts.includeRender && script.renderTexture) {
                    try { tex = script.renderTexture.copyFrame(); } catch (e) {}
                }
                if (asEvent) {
                    var ev = new events.EventWrapper();
                    ev.trigger(tex);
                    return ev;
                }
                return tex;
            })(this);
            // Keep thenable behavior for images
            this.then = promise.then.bind(promise);
            this.catch = promise.catch.bind(promise);
            return promise;
        } else {
            var req = CameraModule.createCameraRequest();
            req.cameraId = this.opts.cameraId;
            if (this.opts.resolution) {
                req.imageSmallerDimension = this.opts.resolution;
            }
            print("[CAH2] requestCamera id=" + req.cameraId + " res=" + (this.opts.resolution || "default"));
            var camTex = CameraModule.requestCamera(req);

            if (!asEvent) {
                var selfRef = this;
                return new Promise(function(resolve) {
                    var provider = camTex.control;
                    var handled = false;
                    var finish = function() {
                        if (handled) { return; }
                        handled = true;
                        var texOut = camTex;
                        if (selfRef.opts.includeRender && script.renderTexture) {
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
                        print("[CAH2] waiting for first frame (single capture)");
                        var reg = provider.onNewFrame.add(function() {
                            provider.onNewFrame.remove(reg);
                            print("[CAH2] got first frame");
                            finish();
                        });
                    } else {
                        print("[CAH2] no provider.onNewFrame; finishing immediately");
                        finish();
                    }
                });
            }

            var ev = new events.EventWrapper();
            var provider = camTex.control;
            var last = -1e9;
            var throttleSec = this.opts.refreshRate || 2;
            if (provider && provider.onNewFrame) {
                print("[CAH2] event mode, throttle=" + throttleSec);
                var selfRefEvt = this;
                var reg = provider.onNewFrame.add(function() {
                    var now = getTime();
                    if (now - last < throttleSec) { return; }
                    last = now;
                    var outTex = camTex;
                    if (selfRefEvt.opts.includeRender && script.renderTexture) {
                        outTex = script.renderTexture;
                    }
                    print("[CAH2] triggering event frame");
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
    };
}

// Public entry points
script.captureFrame = function() {
    return new Builder(false);
};

script.captureImage = function() {
    return new Builder(true);
};

// Expose via script.api for other components
if (script.api) {
    script.api.captureFrame = script.captureFrame;
    script.api.captureImage = script.captureImage;
}
