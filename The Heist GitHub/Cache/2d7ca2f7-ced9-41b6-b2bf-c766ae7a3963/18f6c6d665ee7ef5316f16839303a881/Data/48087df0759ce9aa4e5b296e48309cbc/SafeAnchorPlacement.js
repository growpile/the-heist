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
exports.SafeAnchorPlacement = void 0;
var __selfType = requireType("./SafeAnchorPlacement");
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
const PlacementSettings_1 = require("../Addons/SurfacePlacement.lspkg/Scripts/PlacementSettings");
const SurfacePlacementController_1 = require("../Addons/SurfacePlacement.lspkg/Scripts/SurfacePlacementController");
/**
 * Scene-attached entry script for the SurfacePlacement.lspkg flow.
 * Duplicated from `SurfacePlacement.lspkg/Example.ts` and adapted so
 * `GameFlowController` can reference it via an `@input` and call
 * `startPlacement(onPlaced, onSliderUpdated?)` after the player taps a
 * play-mode button. The surface confirmation result (world position +
 * rotation) is returned via the `onPlaced` callback.
 */
let SafeAnchorPlacement = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SafeAnchorPlacement = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.placementSettingMode = this.placementSettingMode;
            this.useAdjustmentWidget = this.useAdjustmentWidget;
            this.widgetOffset = this.widgetOffset;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            this.isPlacing = false;
        }
        __initialize() {
            super.__initialize();
            this.placementSettingMode = this.placementSettingMode;
            this.useAdjustmentWidget = this.useAdjustmentWidget;
            this.widgetOffset = this.widgetOffset;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            this.isPlacing = false;
        }
        /**
         * Begins surface calibration. `onPlaced` fires once the user confirms a
         * surface. `onSliderUpdated` (optional) fires continuously while the user
         * drags the height widget — useful for previewing the spawn position
         * before confirmation.
         */
        startPlacement(onPlaced, onSliderUpdated) {
            if (this.isPlacing) {
                this.stopPlacement();
            }
            this.onPlacedCallback = onPlaced;
            this.onSliderCallback = onSliderUpdated || null;
            this.isPlacing = true;
            const settings = this.buildSettings();
            SurfacePlacementController_1.SurfacePlacementController.getInstance().startSurfacePlacement(settings, (pos, rot) => this.handlePlacementConfirmed(pos, rot));
        }
        /** Aborts an in-progress placement session (no callback fires). */
        stopPlacement() {
            if (!this.isPlacing) {
                return;
            }
            SurfacePlacementController_1.SurfacePlacementController.getInstance().stopSurfacePlacement();
            this.isPlacing = false;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
        }
        isActive() {
            return this.isPlacing;
        }
        buildSettings() {
            switch (this.placementSettingMode) {
                case 0:
                    return new PlacementSettings_1.PlacementSettings(PlacementSettings_1.PlacementMode.NEAR_SURFACE, this.useAdjustmentWidget, this.widgetOffset, (pos) => this.handleSliderUpdate(pos));
                case 1:
                    return new PlacementSettings_1.PlacementSettings(PlacementSettings_1.PlacementMode.HORIZONTAL);
                case 2:
                    return new PlacementSettings_1.PlacementSettings(PlacementSettings_1.PlacementMode.VERTICAL);
                default:
                    return new PlacementSettings_1.PlacementSettings(PlacementSettings_1.PlacementMode.NEAR_SURFACE);
            }
        }
        handleSliderUpdate(pos) {
            if (this.onSliderCallback) {
                this.onSliderCallback(pos);
            }
        }
        handlePlacementConfirmed(pos, rot) {
            const cb = this.onPlacedCallback;
            this.isPlacing = false;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            cb?.(pos, rot);
        }
    };
    __setFunctionName(_classThis, "SafeAnchorPlacement");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafeAnchorPlacement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafeAnchorPlacement = _classThis;
})();
exports.SafeAnchorPlacement = SafeAnchorPlacement;
//# sourceMappingURL=SafeAnchorPlacement.js.map