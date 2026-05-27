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
exports.MainMenuTabination = exports.MenuTab = void 0;
var __selfType = requireType("./MainMenuTabination");
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
const LSTween_1 = require("LSTween.lspkg/Examples/Scripts/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
/**
 * One main-menu tab: a toggle button plus the UI elements shown for that view.
 */
class MenuTab {
    constructor() {
        this.elements = [];
    }
}
exports.MenuTab = MenuTab;
/**
 * Tab controller for the main menu. Each MenuTab pairs a button with its view elements.
 * Switching tabs pops out the old elements, then pops in the new ones using LSTween.
 */
let MainMenuTabination = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MainMenuTabination = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.tabs = this.tabs;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            this.popOutBumpScale = this.popOutBumpScale;
            this.popInOvershootScale = this.popInOvershootScale;
            this.popOutBumpDurationMs = this.popOutBumpDurationMs;
            this.popOutShrinkDurationMs = this.popOutShrinkDurationMs;
            this.popInOvershootDurationMs = this.popInOvershootDurationMs;
            this.popInSettleDurationMs = this.popInSettleDurationMs;
            this.selectedIndex = -1;
            this.isTransitioning = false;
            this.restScales = new Map();
            this.activeTweens = [];
        }
        __initialize() {
            super.__initialize();
            this.tabs = this.tabs;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            this.popOutBumpScale = this.popOutBumpScale;
            this.popInOvershootScale = this.popInOvershootScale;
            this.popOutBumpDurationMs = this.popOutBumpDurationMs;
            this.popOutShrinkDurationMs = this.popOutShrinkDurationMs;
            this.popInOvershootDurationMs = this.popInOvershootDurationMs;
            this.popInSettleDurationMs = this.popInSettleDurationMs;
            this.selectedIndex = -1;
            this.isTransitioning = false;
            this.restScales = new Map();
            this.activeTweens = [];
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
        }
        onStart() {
            if (!this.tabs || this.tabs.length === 0) {
                print("[MainMenuTabination] No tabs assigned.");
                return;
            }
            this.cacheRestScales();
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab || !tab.button) {
                    continue;
                }
                tab.button.setIsToggleable(true);
                const tabIndex = i;
                const bindTrigger = () => {
                    tab.button.onTriggerUp.add(() => {
                        this.selectTab(tabIndex);
                    });
                };
                if (tab.button.initialized) {
                    bindTrigger();
                }
                else {
                    tab.button.onInitialized.add(bindTrigger);
                }
            }
            const startIndex = Math.min(Math.max(this.defaultSelectedIndex, 0), this.tabs.length - 1);
            this.initializeVisibleTab(startIndex);
            this.selectedIndex = startIndex;
            this.updateTabToggles();
            print(String(startIndex + 1));
        }
        /** Returns the currently selected tab index (0-based), or -1 if none. */
        getSelectedIndex() {
            return this.selectedIndex;
        }
        /** Selects a tab by index, animates view elements, and updates toggle states. */
        selectTab(index) {
            if (!this.tabs || index < 0 || index >= this.tabs.length) {
                return;
            }
            if (this.isTransitioning) {
                return;
            }
            const changed = index !== this.selectedIndex;
            this.updateTabToggles();
            if (!changed) {
                return;
            }
            const previousIndex = this.selectedIndex;
            this.selectedIndex = index;
            print(String(index + 1));
            if (previousIndex < 0) {
                this.popInTab(index, () => { });
                return;
            }
            this.stopActiveTweens();
            this.isTransitioning = true;
            this.popOutTab(previousIndex, () => {
                this.popInTab(index, () => {
                    this.isTransitioning = false;
                });
            });
        }
        initializeVisibleTab(activeIndex) {
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab || !tab.elements) {
                    continue;
                }
                const isActive = i === activeIndex;
                for (const element of tab.elements) {
                    if (!element) {
                        continue;
                    }
                    const restScale = this.getRestScale(element);
                    element.enabled = isActive;
                    element.getTransform().setLocalScale(isActive ? restScale : vec3.zero());
                }
            }
        }
        cacheRestScales() {
            this.restScales.clear();
            for (const tab of this.tabs) {
                if (!tab || !tab.elements) {
                    continue;
                }
                for (const element of tab.elements) {
                    if (!element || this.restScales.has(element)) {
                        continue;
                    }
                    this.restScales.set(element, element.getTransform().getLocalScale());
                }
            }
        }
        getRestScale(element) {
            return this.restScales.get(element) ?? vec3.one();
        }
        updateTabToggles() {
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab || !tab.button) {
                    continue;
                }
                tab.button.isOn = i === this.selectedIndex;
            }
        }
        popOutTab(tabIndex, onComplete) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.animateElementsSequential(elements, (element, transform, restScale, next) => {
                this.popOutElement(element, transform, restScale, next);
            }, onComplete);
        }
        popInTab(tabIndex, onComplete) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.animateElementsSequential(elements, (element, transform, restScale, next) => {
                this.popInElement(element, transform, restScale, next);
            }, onComplete);
        }
        animateElementsSequential(elements, step, onComplete, index = 0) {
            if (index >= elements.length) {
                onComplete();
                return;
            }
            const element = elements[index];
            if (!element) {
                this.animateElementsSequential(elements, step, onComplete, index + 1);
                return;
            }
            const transform = element.getTransform();
            const restScale = this.getRestScale(element);
            step(element, transform, restScale, () => {
                this.animateElementsSequential(elements, step, onComplete, index + 1);
            });
        }
        popOutElement(element, transform, restScale, onComplete) {
            const currentScale = transform.getLocalScale();
            const bumpScale = restScale.uniformScale(this.popOutBumpScale);
            const bumpTween = LSTween_1.LSTween.scaleFromToLocal(transform, currentScale, bumpScale, this.popOutBumpDurationMs).easing(Easing_1.default.Cubic.Out);
            const shrinkTween = LSTween_1.LSTween.scaleFromToLocal(transform, bumpScale, vec3.zero(), this.popOutShrinkDurationMs)
                .easing(Easing_1.default.Cubic.In)
                .onComplete(() => {
                element.enabled = false;
                onComplete();
            });
            bumpTween.chain(shrinkTween);
            this.trackTween(bumpTween);
            this.trackTween(shrinkTween);
            bumpTween.start();
        }
        popInElement(element, transform, restScale, onComplete) {
            element.enabled = true;
            transform.setLocalScale(vec3.zero());
            const overshootScale = restScale.uniformScale(this.popInOvershootScale);
            const overshootTween = LSTween_1.LSTween.scaleFromToLocal(transform, vec3.zero(), overshootScale, this.popInOvershootDurationMs).easing(Easing_1.default.Back.Out);
            const settleTween = LSTween_1.LSTween.scaleFromToLocal(transform, overshootScale, restScale, this.popInSettleDurationMs)
                .easing(Easing_1.default.Cubic.Out)
                .onComplete(() => {
                onComplete();
            });
            overshootTween.chain(settleTween);
            this.trackTween(overshootTween);
            this.trackTween(settleTween);
            overshootTween.start();
        }
        trackTween(tween) {
            this.activeTweens.push(tween);
        }
        stopActiveTweens() {
            for (const tween of this.activeTweens) {
                tween?.stop?.();
            }
            this.activeTweens = [];
        }
    };
    __setFunctionName(_classThis, "MainMenuTabination");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MainMenuTabination = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MainMenuTabination = _classThis;
})();
exports.MainMenuTabination = MainMenuTabination;
//# sourceMappingURL=MainMenuTabination.js.map