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
exports.GameUIController = void 0;
var __selfType = requireType("./GameUIController");
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
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
const PANEL_SHOW_MS = 500;
const PANEL_HIDE_MS = 500;
const PANEL_HIDE_FAST_MS = 250;
let GameUIController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var GameUIController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.solvedWindow = this.solvedWindow;
            this.timedWindow = this.timedWindow;
            this.tutorialSolvedWindow = this.tutorialSolvedWindow;
            this.loadingWindow = this.loadingWindow;
            this.roomWindow = this.roomWindow;
            this.settingsWindow = this.settingsWindow;
            this.solvedSecondsText = this.solvedSecondsText;
            this.activeTweens = [];
        }
        __initialize() {
            super.__initialize();
            this.solvedWindow = this.solvedWindow;
            this.timedWindow = this.timedWindow;
            this.tutorialSolvedWindow = this.tutorialSolvedWindow;
            this.loadingWindow = this.loadingWindow;
            this.roomWindow = this.roomWindow;
            this.settingsWindow = this.settingsWindow;
            this.solvedSecondsText = this.solvedSecondsText;
            this.activeTweens = [];
        }
        onAwake() {
            this.hideAllImmediate();
        }
        setSolvedSeconds(seconds) {
            if (this.solvedSecondsText) {
                this.solvedSecondsText.text = seconds.toFixed(0).toString();
            }
        }
        showSolved(_mode) {
            this.showPanel(this.solvedWindow);
        }
        showTutorialSolved() {
            this.showPanel(this.tutorialSolvedWindow);
        }
        showTimedOut() {
            this.showPanel(this.timedWindow);
        }
        hideSolved(callback) {
            this.hidePanel(this.solvedWindow, callback);
        }
        hideTutorialSolved(callback) {
            this.hidePanel(this.tutorialSolvedWindow, callback);
        }
        hideTimedOut(callback) {
            this.hidePanel(this.timedWindow, callback);
        }
        showLoading() {
            this.showPanel(this.loadingWindow);
        }
        hideLoading(callback) {
            this.hidePanel(this.loadingWindow, callback, PANEL_HIDE_FAST_MS);
        }
        showRoom() {
            this.showPanel(this.roomWindow);
        }
        hideRoom(callback) {
            this.hidePanel(this.roomWindow, callback);
        }
        showSettings() {
            this.showPanel(this.settingsWindow);
        }
        hideSettings(callback) {
            this.hidePanel(this.settingsWindow, callback);
        }
        hideAllImmediate() {
            const panels = [
                this.solvedWindow,
                this.timedWindow,
                this.tutorialSolvedWindow,
                this.loadingWindow,
                this.roomWindow,
                this.settingsWindow
            ];
            for (const panel of panels) {
                if (!panel) {
                    continue;
                }
                panel.enabled = false;
                panel.getTransform().setLocalScale(new vec3(0, 0, 0));
            }
        }
        showPanel(panel) {
            if (!panel) {
                return;
            }
            panel.enabled = true;
            panel.getTransform().setLocalScale(new vec3(0, 0, 0));
            const tween = LSTween_1.LSTween.scaleToWorld(panel.getTransform(), new vec3(1, 1, 1), PANEL_SHOW_MS)
                .easing(Easing_1.default.Quadratic.Out)
                .start();
            this.activeTweens.push(tween);
        }
        hidePanel(panel, callback, durationMs = PANEL_HIDE_MS) {
            if (!panel) {
                callback?.();
                return;
            }
            const tween = LSTween_1.LSTween.scaleToWorld(panel.getTransform(), new vec3(0, 0, 0), durationMs)
                .easing(Easing_1.default.Quadratic.In)
                .onComplete(() => {
                panel.enabled = false;
                callback?.();
            })
                .start();
            this.activeTweens.push(tween);
        }
    };
    __setFunctionName(_classThis, "GameUIController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameUIController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameUIController = _classThis;
})();
exports.GameUIController = GameUIController;
//# sourceMappingURL=GameUIController.js.map