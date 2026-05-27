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
exports.MenuController = void 0;
var __selfType = requireType("./MenuController");
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
const MENU_SHOW_MS = 400;
const MENU_HIDE_MS = 250;
/**
 * Owns the main menu root and all in-menu overlays (settings, solved, coop room, etc.).
 * Game flow scales `menuRoot` up/down; overlays are toggled via enable/disable only.
 */
let MenuController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MenuController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mainMenuTabination = this.mainMenuTabination;
            this.menuRoot = this.menuRoot;
            this.mainMenuContent = this.mainMenuContent;
            this.settingsView = this.settingsView;
            this.solvedView = this.solvedView;
            this.timedView = this.timedView;
            this.tutorialSolvedView = this.tutorialSolvedView;
            this.loadingView = this.loadingView;
            this.roomView = this.roomView;
            this.solvedSecondsText = this.solvedSecondsText;
            this.activeTween = null;
            this.isMenuVisible = false;
            this.useUtilsScale = false;
        }
        __initialize() {
            super.__initialize();
            this.mainMenuTabination = this.mainMenuTabination;
            this.menuRoot = this.menuRoot;
            this.mainMenuContent = this.mainMenuContent;
            this.settingsView = this.settingsView;
            this.solvedView = this.solvedView;
            this.timedView = this.timedView;
            this.tutorialSolvedView = this.tutorialSolvedView;
            this.loadingView = this.loadingView;
            this.roomView = this.roomView;
            this.solvedSecondsText = this.solvedSecondsText;
            this.activeTween = null;
            this.isMenuVisible = false;
            this.useUtilsScale = false;
        }
        onAwake() {
            this.hideOverlayViewsImmediate();
            this.prepareMenuHidden();
        }
        /** Pop up the main menu (default tab content). Call after intro / play area setup. */
        showMainMenu(callback) {
            this.setActiveOverlay("main");
            this.show(callback);
        }
        /** Pop up the menu showing a specific overlay (settings, solved, loading, room, …). */
        showOverlay(overlay, callback) {
            this.setActiveOverlay(overlay);
            this.show(callback);
        }
        /** Scale menu up (keeps current overlay selection). */
        show(callback) {
            if (!this.menuRoot) {
                print("[MenuController] show() skipped — menuRoot not assigned");
                callback?.();
                return;
            }
            this.cancelActiveTween();
            this.menuRoot.enabled = true;
            this.snapMenuHeadlock();
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.isMenuVisible = true;
            if (global.appState) {
                global.appState.currentState = "mainMenu";
            }
            print("[MenuController] Showing menu");
            if (this.tryAnimateScale(this.menuRoot, new vec3(1, 1, 1), MENU_SHOW_MS, callback)) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(1, 1, 1));
            callback?.();
        }
        /** Scale menu down (solo start, coop start, entering gameplay). */
        hide(callback) {
            if (!this.menuRoot) {
                callback?.();
                return;
            }
            this.cancelActiveTween();
            print("[MenuController] Hiding menu");
            if (this.tryAnimateScale(this.menuRoot, new vec3(0, 0, 0), MENU_HIDE_MS, () => {
                if (this.menuRoot) {
                    this.menuRoot.enabled = false;
                }
                this.isMenuVisible = false;
                callback?.();
            })) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.menuRoot.enabled = false;
            this.isMenuVisible = false;
            callback?.();
        }
        setSolvedSeconds(seconds) {
            if (this.solvedSecondsText) {
                this.solvedSecondsText.text = seconds.toFixed(0).toString();
            }
        }
        isVisible() {
            return this.isMenuVisible;
        }
        prepareMenuHidden() {
            if (!this.menuRoot) {
                return;
            }
            this.menuRoot.getTransform().setLocalScale(new vec3(0, 0, 0));
            this.menuRoot.enabled = false;
        }
        tryAnimateScale(target, toScale, durationMs, onComplete) {
            const durationSec = durationMs / 1000;
            if (global.utils && typeof global.utils.animateScale === "function") {
                this.useUtilsScale = true;
                global.utils.animateScale(target, true, toScale, durationSec, () => {
                    onComplete?.();
                });
                return true;
            }
            try {
                this.useUtilsScale = false;
                this.activeTween = LSTween_1.LSTween.scaleToLocal(target.getTransform(), toScale, durationMs)
                    .easing(toScale.x > 0 ? Easing_1.default.Back.Out : Easing_1.default.Quadratic.In)
                    .onComplete(() => {
                    this.activeTween = null;
                    onComplete?.();
                })
                    .start();
                return true;
            }
            catch (e) {
                print("[MenuController] LSTween scale failed: " + e);
                return false;
            }
        }
        setActiveOverlay(overlay) {
            const overlayOnly = [
                this.settingsView,
                this.solvedView,
                this.timedView,
                this.tutorialSolvedView,
                this.loadingView,
                this.roomView
            ];
            for (const view of overlayOnly) {
                if (view) {
                    view.enabled = false;
                }
            }
            if (overlay === "main") {
                const main = this.mainMenuContent || this.menuRoot;
                if (main) {
                    main.enabled = true;
                }
                return;
            }
            const map = {
                main: this.mainMenuContent || this.menuRoot,
                settings: this.settingsView,
                solved: this.solvedView,
                timed: this.timedView,
                tutorialSolved: this.tutorialSolvedView,
                loading: this.loadingView,
                room: this.roomView
            };
            const active = map[overlay];
            if (active) {
                active.enabled = true;
            }
        }
        hideOverlayViewsImmediate() {
            const overlayOnly = [
                this.settingsView,
                this.solvedView,
                this.timedView,
                this.tutorialSolvedView,
                this.loadingView,
                this.roomView
            ];
            for (const view of overlayOnly) {
                if (view) {
                    view.enabled = false;
                }
            }
        }
        cancelActiveTween() {
            if (this.activeTween && typeof this.activeTween.stop === "function") {
                this.activeTween.stop();
            }
            this.activeTween = null;
        }
        /**
         * Re-anchor the menu Headlock to the current camera so opening pitch does not
         * place the UI above/below eye level. Requires Headlock locked pitch on menuRoot.
         */
        snapMenuHeadlock() {
            if (!this.menuRoot) {
                return;
            }
            const scriptComponents = this.menuRoot.getComponents("Component.ScriptComponent");
            for (const comp of scriptComponents) {
                const snap = comp.snapToOffsetPosition;
                if (typeof snap === "function") {
                    snap.call(comp);
                    return;
                }
            }
        }
    };
    __setFunctionName(_classThis, "MenuController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MenuController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MenuController = _classThis;
})();
exports.MenuController = MenuController;
//# sourceMappingURL=MenuController.js.map