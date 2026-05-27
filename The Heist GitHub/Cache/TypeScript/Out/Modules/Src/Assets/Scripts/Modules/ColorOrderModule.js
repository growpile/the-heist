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
exports.ColorOrderModule = void 0;
var __selfType = requireType("./ColorOrderModule");
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
const SafeTypes_1 = require("../Safe/SafeTypes");
const MaterialProgressAnimator_1 = require("../Safe/MaterialProgressAnimator");
const MODULE_PENALTY_SEC = 20;
const COLOR_NAMES = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow"
};
/**
 * Four-button color sequence puzzle. PushButton components call buttonPress(id) via external callback.
 */
let ColorOrderModule = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ColorOrderModule = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.buttonComponents = this.buttonComponents;
            this.redMaterial = this.redMaterial;
            this.greenMaterial = this.greenMaterial;
            this.blueMaterial = this.blueMaterial;
            this.yellowMaterial = this.yellowMaterial;
            this.isModuleReady = false;
            this.safeComponent = null;
            this.slotId = 0;
            this.buttonColors = [];
            this.buttonMaterials = [];
            this.correctButtonIdSequence = [];
            this.currentPressIndex = 0;
        }
        __initialize() {
            super.__initialize();
            this.buttonComponents = this.buttonComponents;
            this.redMaterial = this.redMaterial;
            this.greenMaterial = this.greenMaterial;
            this.blueMaterial = this.blueMaterial;
            this.yellowMaterial = this.yellowMaterial;
            this.isModuleReady = false;
            this.safeComponent = null;
            this.slotId = 0;
            this.buttonColors = [];
            this.buttonMaterials = [];
            this.correctButtonIdSequence = [];
            this.currentPressIndex = 0;
        }
        setupModule(safeContext, safeComponent, slotId) {
            this.safeComponent = safeComponent;
            this.slotId = slotId;
            const serialInfo = this.getSerialInfo(safeContext.serialNumber);
            const fuseColor = (safeContext.dynamiteFuseColor || "").toLowerCase();
            let orderColors;
            if (serialInfo.letterCount > serialInfo.numberCount) {
                orderColors = serialInfo.containsWord
                    ? [COLOR_NAMES.RED, COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.YELLOW]
                    : [COLOR_NAMES.BLUE, COLOR_NAMES.GREEN, COLOR_NAMES.RED, COLOR_NAMES.YELLOW];
            }
            else if (serialInfo.numberCount > serialInfo.letterCount) {
                orderColors =
                    serialInfo.sumDigits > 10
                        ? [COLOR_NAMES.YELLOW, COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.RED]
                        : [COLOR_NAMES.YELLOW, COLOR_NAMES.RED, COLOR_NAMES.BLUE, COLOR_NAMES.GREEN];
            }
            else {
                if (fuseColor === COLOR_NAMES.RED) {
                    orderColors = [COLOR_NAMES.GREEN, COLOR_NAMES.BLUE, COLOR_NAMES.RED, COLOR_NAMES.YELLOW];
                }
                else if (fuseColor === COLOR_NAMES.BLUE) {
                    orderColors = [COLOR_NAMES.RED, COLOR_NAMES.BLUE, COLOR_NAMES.GREEN, COLOR_NAMES.YELLOW];
                }
                else if (fuseColor === COLOR_NAMES.GREEN) {
                    orderColors = [COLOR_NAMES.BLUE, COLOR_NAMES.YELLOW, COLOR_NAMES.GREEN, COLOR_NAMES.RED];
                }
                else {
                    orderColors = [COLOR_NAMES.GREEN, COLOR_NAMES.YELLOW, COLOR_NAMES.RED, COLOR_NAMES.BLUE];
                }
            }
            const selectedLayout = this.getRandomColorLayout();
            this.applyButtonColors(selectedLayout);
            const pressOrder = [];
            for (const color of orderColors) {
                const position = this.buttonColors.indexOf(color);
                if (position === -1) {
                    continue;
                }
                pressOrder.push(position);
            }
            this.correctButtonIdSequence = pressOrder;
            const orderLetters = orderColors.map((c) => this.colorToLetter(c));
            print("Color order: " +
                orderLetters.join("") +
                " | sequence: " +
                this.correctButtonIdSequence.join(","));
            this.currentPressIndex = 0;
            this.isModuleReady = true;
        }
        animationFinished() {
            // No-op — safe landing does not drive this module.
        }
        /** Called from PushButton external callback (argument = button index). */
        buttonPress(id) {
            if (!this.isModuleReady || this.correctButtonIdSequence.length === 0) {
                return;
            }
            const expectedId = this.correctButtonIdSequence[this.currentPressIndex];
            let pressedId = id;
            if (typeof pressedId === "string") {
                const parsed = parseInt(pressedId, 10);
                if (!isNaN(parsed)) {
                    pressedId = parsed;
                }
            }
            if (pressedId === expectedId) {
                this.currentPressIndex++;
                const mat = this.buttonMaterials[pressedId];
                if (mat) {
                    this.animateGlow(mat, 1, 0.25);
                }
                if (this.currentPressIndex >= this.correctButtonIdSequence.length) {
                    this.isModuleReady = false;
                    print("Color Order Module complete");
                    for (const buttonComp of this.buttonComponents) {
                        const pushButton = buttonComp;
                        pushButton?.disable?.();
                    }
                    this.moduleCompleted();
                }
            }
            else {
                this.currentPressIndex = 0;
                this.resetAllGlow();
                print("Color Order Module incorrect input, reset");
                this.modulePenalty();
            }
        }
        applyButtonColors(layout) {
            const materialByColor = {
                red: this.redMaterial,
                green: this.greenMaterial,
                blue: this.blueMaterial,
                yellow: this.yellowMaterial
            };
            for (let i = 0; i < this.buttonComponents.length; i++) {
                const scriptComp = this.buttonComponents[i];
                if (!scriptComp) {
                    continue;
                }
                const buttonObject = scriptComp.getSceneObject();
                if (!buttonObject || buttonObject.getChildrenCount() < 1) {
                    continue;
                }
                const firstChild = buttonObject.getChild(0);
                if (!firstChild || firstChild.getChildrenCount() < 1) {
                    continue;
                }
                const visualObject = firstChild.getChild(0);
                if (!visualObject) {
                    continue;
                }
                const visual = visualObject.getComponent("Component.RenderMeshVisual");
                if (!visual) {
                    continue;
                }
                const color = layout[i];
                const sourceMaterial = materialByColor[color];
                if (!sourceMaterial) {
                    continue;
                }
                const cloned = sourceMaterial.clone();
                if (cloned.mainPass?.glowAmount !== undefined) {
                    cloned.mainPass.glowAmount = 0;
                }
                visual.mainMaterial = cloned;
                this.buttonColors[i] = color;
                this.buttonMaterials[i] = cloned;
            }
        }
        getRandomColorLayout() {
            const colors = [
                COLOR_NAMES.RED,
                COLOR_NAMES.GREEN,
                COLOR_NAMES.BLUE,
                COLOR_NAMES.YELLOW
            ];
            for (let i = colors.length - 1; i > 0; i--) {
                const swapIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, i)
                    : Math.floor(Math.random() * (i + 1));
                const temp = colors[i];
                colors[i] = colors[swapIndex];
                colors[swapIndex] = temp;
            }
            return colors;
        }
        colorToLetter(color) {
            switch (color) {
                case COLOR_NAMES.RED:
                    return "R";
                case COLOR_NAMES.GREEN:
                    return "G";
                case COLOR_NAMES.BLUE:
                    return "B";
                case COLOR_NAMES.YELLOW:
                    return "Y";
                default:
                    return "?";
            }
        }
        animateGlow(material, targetValue, duration, callback) {
            (0, MaterialProgressAnimator_1.animateGlowAmount)(material, targetValue, duration, callback);
        }
        resetAllGlow() {
            for (const mat of this.buttonMaterials) {
                if (mat) {
                    this.animateGlow(mat, 0, 0.25);
                }
            }
        }
        getSerialInfo(serialNumber) {
            let serialString = "";
            let containsWord = false;
            let letterCount = 0;
            let numberCount = 0;
            let sumDigits = 0;
            let hasCounts = false;
            if (serialNumber) {
                if (typeof serialNumber === "string") {
                    serialString = serialNumber;
                }
                else {
                    serialString = serialNumber.string || "";
                    if (typeof serialNumber.containsWord === "boolean") {
                        containsWord = serialNumber.containsWord;
                    }
                    if (typeof serialNumber.letterCount === "number") {
                        letterCount = serialNumber.letterCount;
                        hasCounts = true;
                    }
                    if (typeof serialNumber.numberCount === "number") {
                        numberCount = serialNumber.numberCount;
                        hasCounts = true;
                    }
                }
            }
            if (serialString) {
                for (let i = 0; i < serialString.length; i++) {
                    const ch = serialString.charAt(i);
                    if (ch >= "0" && ch <= "9") {
                        if (!hasCounts) {
                            numberCount++;
                        }
                        sumDigits += parseInt(ch, 10);
                    }
                    else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
                        if (!hasCounts) {
                            letterCount++;
                        }
                    }
                }
                if (!containsWord) {
                    const upper = serialString.toUpperCase();
                    for (const word of SafeTypes_1.SERIAL_WORDS) {
                        if (upper.indexOf(word) !== -1) {
                            containsWord = true;
                            break;
                        }
                    }
                }
            }
            return { containsWord, letterCount, numberCount, sumDigits };
        }
        moduleCompleted() {
            const safe = this.safeComponent;
            safe?.completeModule?.(this.slotId);
        }
        modulePenalty() {
            const safe = this.safeComponent;
            safe?.applyPenalty?.(MODULE_PENALTY_SEC);
        }
    };
    __setFunctionName(_classThis, "ColorOrderModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ColorOrderModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ColorOrderModule = _classThis;
})();
exports.ColorOrderModule = ColorOrderModule;
//# sourceMappingURL=ColorOrderModule.js.map