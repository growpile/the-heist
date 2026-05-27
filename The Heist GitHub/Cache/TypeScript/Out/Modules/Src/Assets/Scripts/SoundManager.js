"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundManager = void 0;
var __selfType = requireType("./SoundManager");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
/**
 * Registers global.playSfx, stopSfx, crossfadeBgm, setBgmVolume, bgmVolume.
 * Disable legacy Sound Manager.js on the same object when using this script.
 */
let SoundManager = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SoundManager = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.multipleSfxInstances = this.multipleSfxInstances;
            this.backgroundAudio = this.backgroundAudio;
            this.backgroundSounds = this.backgroundSounds;
            this.backgroundVolume = this.backgroundVolume;
            this.sounds = this.sounds;
            this.initializedTracks = [];
            this.bgm = null;
            this.sfxById = {};
            this.activeFadeEvent = null;
        }
        __initialize() {
            super.__initialize();
            this.multipleSfxInstances = this.multipleSfxInstances;
            this.backgroundAudio = this.backgroundAudio;
            this.backgroundSounds = this.backgroundSounds;
            this.backgroundVolume = this.backgroundVolume;
            this.sounds = this.sounds;
            this.initializedTracks = [];
            this.bgm = null;
            this.sfxById = {};
            this.activeFadeEvent = null;
        }
        onAwake() {
            this.bindGlobals();
            if (this.backgroundAudio && this.backgroundSounds && this.backgroundSounds.length > 0) {
                this.setupBgm(0, this.backgroundVolume, 0);
            }
        }
        bindGlobals() {
            global.playSfx = (id, times, volume, soundId) => {
                this.playSfx(id, times, volume, soundId);
            };
            global.stopSfx = (soundId) => {
                this.stopSfxById(soundId);
            };
            global.crossfadeBgm = (id, volume, crossfadeDuration) => {
                this.crossfadeBgm(id, volume, crossfadeDuration);
            };
            global.setBgmVolume = (volume, fadeDuration) => {
                this.setBgmVolume(volume, fadeDuration);
            };
            global.bgmVolume = () => this.getBgmVolume();
        }
        playSfx(id, times, volume, soundId) {
            const track = this.sounds?.[id];
            if (!track) {
                return;
            }
            if (soundId) {
                this.stopSfxById(soundId);
                const tagged = this.createAudioTrack();
                tagged.audioTrack = track;
                tagged.volume = volume;
                tagged.play(times);
                this.sfxById[soundId] = tagged;
                tagged.setOnFinish?.((ac) => {
                    if (this.sfxById[soundId] === ac) {
                        delete this.sfxById[soundId];
                    }
                    if (!ac || ac.__manualStop) {
                        return;
                    }
                    this.destroyAudioObject(ac);
                });
                return;
            }
            if (!this.multipleSfxInstances) {
                let pooled = this.initializedTracks[id];
                if (!pooled) {
                    pooled = this.createAudioTrack();
                    pooled.playbackMode = Audio.PlaybackMode.LowLatency;
                    pooled.audioTrack = track;
                    this.initializedTracks[id] = pooled;
                }
                pooled.volume = volume;
                pooled.play(times);
                return;
            }
            const oneShot = this.createAudioTrack();
            oneShot.audioTrack = track;
            oneShot.volume = volume;
            oneShot.play(times);
            oneShot.setOnFinish?.((ac) => {
                this.destroyAudioObject(ac);
            });
        }
        stopSfxById(soundId) {
            if (!soundId) {
                return;
            }
            const active = this.sfxById[soundId];
            if (!active) {
                return;
            }
            active.__manualStop = true;
            if (typeof active.stop === "function") {
                active.stop(true);
            }
            else if (typeof active.pause === "function") {
                active.pause();
            }
            this.destroyAudioObject(active);
            delete this.sfxById[soundId];
        }
        cancelActiveFade() {
            if (this.activeFadeEvent) {
                this.activeFadeEvent.enabled = false;
                this.activeFadeEvent = null;
            }
        }
        crossfadeBgm(id, volume, crossfadeDuration) {
            this.cancelActiveFade();
            if (!this.bgm) {
                this.setupBgm(id, volume, crossfadeDuration);
                return;
            }
            const currentBgm = this.bgm;
            const startVolume = currentBgm.volume;
            let fadeOutTime = 0;
            const fadeOutEvent = this.createEvent("UpdateEvent");
            this.activeFadeEvent = fadeOutEvent;
            fadeOutEvent.bind(() => {
                fadeOutTime += getDeltaTime();
                const progress = fadeOutTime / crossfadeDuration;
                currentBgm.volume = Math.max(0, startVolume * (1 - progress));
                if (progress >= 1.0) {
                    fadeOutEvent.enabled = false;
                    if (this.activeFadeEvent === fadeOutEvent) {
                        this.activeFadeEvent = null;
                    }
                    this.destroyAudioObject(currentBgm);
                }
            });
            this.setupBgm(id, volume, crossfadeDuration);
        }
        setBgmVolume(volume, fadeDuration) {
            if (!this.bgm) {
                return;
            }
            this.cancelActiveFade();
            const target = Math.max(0, Math.min(1, volume !== undefined ? volume : this.bgm.volume));
            const duration = fadeDuration !== undefined ? fadeDuration : 0;
            if (duration <= 0) {
                this.bgm.volume = target;
                return;
            }
            const startVolume = this.bgm.volume;
            let fadeTime = 0;
            const fadeEvent = this.createEvent("UpdateEvent");
            this.activeFadeEvent = fadeEvent;
            fadeEvent.bind(() => {
                fadeTime += getDeltaTime();
                const t = Math.min(fadeTime / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                this.bgm.volume = startVolume + (target - startVolume) * smoothT;
                if (t >= 1) {
                    fadeEvent.enabled = false;
                    if (this.activeFadeEvent === fadeEvent) {
                        this.activeFadeEvent = null;
                    }
                }
            });
        }
        getBgmVolume() {
            return this.bgm ? this.bgm.volume : 0;
        }
        setupBgm(id, volume, fadeInDuration) {
            this.cancelActiveFade();
            const track = this.backgroundSounds?.[id];
            if (!track) {
                return;
            }
            const audioComponent = this.createAudioTrack();
            audioComponent.audioTrack = track;
            audioComponent.volume = fadeInDuration > 0 ? 0 : volume;
            audioComponent.play(999);
            this.bgm = audioComponent;
            if (fadeInDuration > 0) {
                let fadeInTime = 0;
                const fadeInEvent = this.createEvent("UpdateEvent");
                this.activeFadeEvent = fadeInEvent;
                fadeInEvent.bind(() => {
                    fadeInTime += getDeltaTime();
                    const progress = fadeInTime / fadeInDuration;
                    audioComponent.volume = Math.min(volume, volume * progress);
                    if (progress >= 1.0) {
                        fadeInEvent.enabled = false;
                        if (this.activeFadeEvent === fadeInEvent) {
                            this.activeFadeEvent = null;
                        }
                    }
                });
            }
        }
        createAudioTrack() {
            const trackObject = global.scene.createSceneObject("Audio Track");
            trackObject.setParent(this.sceneObject);
            trackObject.createComponent("Component.AudioComponent");
            return trackObject.getComponent("Component.AudioComponent");
        }
        destroyAudioObject(audio) {
            try {
                const sceneObject = audio.getSceneObject?.();
                if (sceneObject) {
                    sceneObject.destroy();
                }
            }
            catch (_e) {
                // Audio object may already be destroyed.
            }
        }
    };
    __setFunctionName(_classThis, "SoundManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SoundManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SoundManager = _classThis;
})();
exports.SoundManager = SoundManager;
//# sourceMappingURL=SoundManager.js.map