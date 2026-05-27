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
/**
 * Tab controller for the main menu. Wire toggleable RectangleButton tabs in order.
 * All tabs keep their PrimaryNeutral style; selection is shown via the toggle state.
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
            this.selectedIndex = -1;
        }
        __initialize() {
            super.__initialize();
            this.tabs = this.tabs;
            this.defaultSelectedIndex = this.defaultSelectedIndex;
            this.selectedIndex = -1;
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
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab) {
                    continue;
                }
                tab.setIsToggleable(true);
                const tabIndex = i;
                const bindTrigger = () => {
                    tab.onTriggerUp.add(() => {
                        this.selectTab(tabIndex);
                    });
                };
                if (tab.initialized) {
                    bindTrigger();
                }
                else {
                    tab.onInitialized.add(bindTrigger);
                }
            }
            const startIndex = Math.min(Math.max(this.defaultSelectedIndex, 0), this.tabs.length - 1);
            this.selectTab(startIndex);
        }
        /** Returns the currently selected tab index (0-based), or -1 if none. */
        getSelectedIndex() {
            return this.selectedIndex;
        }
        /** Selects a tab by index and updates toggle states. */
        selectTab(index) {
            if (!this.tabs || index < 0 || index >= this.tabs.length) {
                return;
            }
            if (index === this.selectedIndex) {
                return;
            }
            this.selectedIndex = index;
            this.updateTabToggles();
            print(String(index + 1));
        }
        updateTabToggles() {
            for (let i = 0; i < this.tabs.length; i++) {
                const tab = this.tabs[i];
                if (!tab) {
                    continue;
                }
                tab.isOn = i === this.selectedIndex;
            }
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