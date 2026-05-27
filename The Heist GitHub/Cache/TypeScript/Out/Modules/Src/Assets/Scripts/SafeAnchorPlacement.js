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
/** Surface placement wrapper — GameFlowController calls startPlacement before safe spawn. */
let SafeAnchorPlacement = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SafeAnchorPlacement = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.placementVisuals = this.placementVisuals;
            this.placementSettingMode = this.placementSettingMode;
            this.useAdjustmentWidget = this.useAdjustmentWidget;
            this.widgetOffset = this.widgetOffset;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            this.isPlacing = false;
            this.placementTransform = null;
            this.resetButton = null;
        }
        __initialize() {
            super.__initialize();
            this.placementVisuals = this.placementVisuals;
            this.placementSettingMode = this.placementSettingMode;
            this.useAdjustmentWidget = this.useAdjustmentWidget;
            this.widgetOffset = this.widgetOffset;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            this.isPlacing = false;
            this.placementTransform = null;
            this.resetButton = null;
        }
        onAwake() {
            this.placementTransform = this.getSceneObject().getTransform();
            this.resolvePlacementVisuals();
            this.setPlacementVisualsVisible(false);
            this.createEvent("OnStartEvent").bind(() => {
                this.setPlacementVisualsVisible(false);
            });
        }
        /** Finds Anchor / VisualParent child from the SurfacePlacement Example hierarchy if not wired. */
        resolvePlacementVisuals() {
            if (this.placementVisuals) {
                this.cacheResetButton();
                return;
            }
            const root = this.getSceneObject();
            for (let i = 0; i < root.getChildrenCount(); i++) {
                const child = root.getChild(i);
                if (!child) {
                    continue;
                }
                const name = child.name;
                if (name.indexOf("VisualParent") !== -1 || name.indexOf("Anchor") !== -1) {
                    this.placementVisuals = child;
                    print("[SafeAnchorPlacement] Auto-assigned placementVisuals: " + child.name);
                    this.cacheResetButton();
                    return;
                }
            }
            if (root.getChildrenCount() > 0) {
                const firstChild = root.getChild(0);
                if (firstChild) {
                    this.placementVisuals = firstChild;
                    print("[SafeAnchorPlacement] Auto-assigned placementVisuals to first child: " + firstChild.name);
                    this.cacheResetButton();
                    return;
                }
            }
            print("[SafeAnchorPlacement] placementVisuals not assigned — anchor preview may stay visible at scene center");
        }
        cacheResetButton() {
            if (!this.placementVisuals) {
                return;
            }
            this.resetButton = this.findChildByName(this.placementVisuals, "ResetButton");
        }
        findChildByName(parent, targetName) {
            if (parent.name === targetName) {
                return parent;
            }
            for (let i = 0; i < parent.getChildrenCount(); i++) {
                const child = parent.getChild(i);
                if (!child) {
                    continue;
                }
                const found = this.findChildByName(child, targetName);
                if (found) {
                    return found;
                }
            }
            return null;
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
            this.setPlacementVisualsVisible(false);
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
            this.setPlacementVisualsVisible(false);
        }
        /**
         * Scales placement visuals away and hides them when returning to the main menu.
         * Resets local scale while disabled so the next session starts at full size.
         */
        hideForMenu(onComplete) {
            this.stopPlacement();
            const visuals = this.placementVisuals;
            if (!visuals) {
                onComplete?.();
                return;
            }
            const finish = () => {
                visuals.getTransform().setLocalScale(new vec3(1, 1, 1));
                this.setPlacementVisualsVisible(false);
                onComplete?.();
            };
            if (!visuals.enabled) {
                finish();
                return;
            }
            global.utils.animateScale(visuals, true, new vec3(0, 0, 0), 0.25, finish);
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
            if (this.placementTransform) {
                this.placementTransform.setWorldPosition(pos);
            }
            if (this.onSliderCallback) {
                this.onSliderCallback(pos);
            }
        }
        handlePlacementConfirmed(pos, rot) {
            const cb = this.onPlacedCallback;
            this.isPlacing = false;
            this.onPlacedCallback = null;
            this.onSliderCallback = null;
            if (this.placementTransform) {
                this.placementTransform.setWorldPosition(pos);
                this.placementTransform.setWorldRotation(rot);
            }
            this.setPlacementVisualsVisible(true);
            cb?.(pos, rot);
        }
        setPlacementVisualsVisible(visible) {
            if (this.placementVisuals) {
                this.placementVisuals.enabled = visible;
            }
            if (this.resetButton) {
                this.resetButton.enabled = visible;
            }
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