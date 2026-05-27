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
exports.MainMenuTabination = void 0;
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
const MenuViewTransitions_1 = require("./MenuViewTransitions");
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
            this.defaultSelectedIndex = 0;
            this.tabSwitchCooldownSec = 0.5;
            this.selectedIndex = -1;
            this.isTransitioning = false;
            this.tabSwitchLocked = false;
            this.transitionToken = 0;
            this.viewTransitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.tabChangedListener = null;
        }
        __initialize() {
            super.__initialize();
            this.tabs = this.tabs;
            this.defaultSelectedIndex = 0;
            this.tabSwitchCooldownSec = 0.5;
            this.selectedIndex = -1;
            this.isTransitioning = false;
            this.tabSwitchLocked = false;
            this.transitionToken = 0;
            this.viewTransitions = new MenuViewTransitions_1.MenuViewTransitions();
            this.tabChangedListener = null;
        }
        onAwake() {
            this.unlockTabSwitchEvent = this.createEvent("DelayedCallbackEvent");
            this.unlockTabSwitchEvent.bind(() => {
                this.tabSwitchLocked = false;
                this.setTabButtonsInteractable(true);
            });
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
                const button = this.getTabButton(tab);
                if (!button) {
                    continue;
                }
                button.setIsToggleable(true);
                const tabIndex = i;
                const bindTrigger = () => {
                    button.onTriggerUp.add(() => {
                        this.selectTab(tabIndex);
                    });
                };
                if (button.initialized) {
                    bindTrigger();
                }
                else {
                    button.onInitialized.add(bindTrigger);
                }
            }
            const startIndex = Math.min(Math.max(this.defaultSelectedIndex, 0), this.tabs.length - 1);
            this.initializeVisibleTab(startIndex);
            this.selectedIndex = startIndex;
            this.updateTabToggles();
            this.notifyTabChanged(startIndex);
            print(String(startIndex + 1));
        }
        /** Returns the currently selected tab index (0-based), or -1 if none. */
        getSelectedIndex() {
            return this.selectedIndex;
        }
        /** Elements for a tab (defaults to the selected tab). Used when leaving the main menu step. */
        getTabElements(tabIndex) {
            if (!this.tabs || this.tabs.length === 0) {
                return [];
            }
            const index = tabIndex !== undefined && tabIndex >= 0
                ? Math.min(tabIndex, this.tabs.length - 1)
                : this.selectedIndex;
            if (index < 0) {
                return [];
            }
            return (this.tabs[index]?.elements ?? []).filter((element) => !!element);
        }
        /** Called when the selected tab changes (and on initial tab setup). */
        setTabChangedListener(listener) {
            this.tabChangedListener = listener;
        }
        /** Selects a tab by index, animates view elements, and updates toggle states. */
        selectTab(index) {
            if (!this.tabs || index < 0 || index >= this.tabs.length) {
                return;
            }
            if (this.tabSwitchLocked) {
                this.updateTabToggles();
                return;
            }
            const changed = index !== this.selectedIndex;
            const previousIndex = this.selectedIndex;
            this.selectedIndex = index;
            this.updateTabToggles();
            if (!changed) {
                return;
            }
            this.notifyTabChanged(index);
            this.lockTabSwitch();
            print(String(index + 1));
            if (this.isTransitioning) {
                this.interruptAndShowTab(index);
                return;
            }
            if (previousIndex < 0) {
                const token = this.beginTransition();
                this.popInTab(index, () => {
                    this.finishTransition(token);
                });
                return;
            }
            const token = this.beginTransition();
            this.popOutTab(previousIndex, () => {
                if (!this.isTransitionTokenCurrent(token)) {
                    return;
                }
                this.popInTab(index, () => {
                    this.finishTransition(token);
                });
            });
        }
        lockTabSwitch() {
            this.tabSwitchLocked = true;
            this.setTabButtonsInteractable(false);
            this.unlockTabSwitchEvent.reset(this.tabSwitchCooldownSec);
        }
        setTabButtonsInteractable(enabled) {
            for (const tab of this.tabs) {
                const button = this.getTabButton(tab);
                if (!button?.interactable) {
                    continue;
                }
                button.interactable.enabled = enabled;
            }
        }
        beginTransition() {
            this.viewTransitions.stopAll();
            this.transitionToken++;
            this.isTransitioning = true;
            return this.transitionToken;
        }
        finishTransition(token) {
            if (!this.isTransitionTokenCurrent(token)) {
                return;
            }
            this.isTransitioning = false;
        }
        isTransitionTokenCurrent(token) {
            return token === this.transitionToken;
        }
        /** Interrupt an in-flight transition and show the newly selected tab immediately. */
        interruptAndShowTab(index) {
            const token = this.beginTransition();
            this.hideAllTabElementsExcept(index);
            this.popInTab(index, () => {
                this.finishTransition(token);
            });
        }
        hideAllTabElementsExcept(activeIndex) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (i === activeIndex) {
                    this.prepareTabElementsForPopIn(i);
                }
                else {
                    this.setTabElementsHidden(i);
                }
            }
        }
        setTabElementsHidden(tabIndex) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.viewTransitions.setElementsHidden(elements.filter((element) => !!element));
        }
        prepareTabElementsForPopIn(tabIndex) {
            const elements = this.tabs[tabIndex]?.elements ?? [];
            this.viewTransitions.prepareElementsForPopIn(elements.filter((element) => !!element));
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
            const elements = [];
            for (const tab of this.tabs) {
                if (!tab?.elements) {
                    continue;
                }
                for (const element of tab.elements) {
                    if (element) {
                        elements.push(element);
                    }
                }
            }
            this.viewTransitions.cacheRestScales(elements);
        }
        getRestScale(element) {
            return this.viewTransitions.getRestScale(element);
        }
        getTabButton(tab) {
            if (!tab?.button) {
                return null;
            }
            return tab.button;
        }
        updateTabToggles() {
            for (let i = 0; i < this.tabs.length; i++) {
                const button = this.getTabButton(this.tabs[i]);
                if (!button) {
                    continue;
                }
                button.toggle(i === this.selectedIndex);
            }
        }
        popOutTab(tabIndex, onComplete) {
            const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element);
            this.viewTransitions.popOutElements(elements, onComplete);
        }
        popInTab(tabIndex, onComplete) {
            const elements = (this.tabs[tabIndex]?.elements ?? []).filter((element) => !!element);
            this.viewTransitions.popInElements(elements, onComplete);
        }
        notifyTabChanged(tabIndex) {
            this.tabChangedListener?.(tabIndex);
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