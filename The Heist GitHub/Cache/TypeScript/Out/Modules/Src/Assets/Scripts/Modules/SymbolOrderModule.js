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
exports.SymbolOrderModule = void 0;
var __selfType = requireType("./SymbolOrderModule");
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
const MaterialProgressAnimator_1 = require("../Safe/MaterialProgressAnimator");
const MODULE_PENALTY_SEC = 30;
const SYMBOL_MAP_ROWS = [
    ["verticalLine", "doNotPress", "fork", "helmWheel", "horizontalLine"],
    ["bigYus", "smallDot", "bigDot", "horizontalLine", "fork"],
    ["bigDot", "slavicF", "smallDot", "fork", "sun"],
    ["horizontalLine", "verticalLine", "doNotPress", "slavicF", "bigDot"],
    ["sun", "bigDot", "bigYus", "doNotPress", "verticalLine"],
    ["fork", "helmWheel", "sun", "bigYus", "smallDot"]
];
/**
 * Symbol-sequence puzzle on four PushButtons. Disable legacy Symbol Order Module.js on the same object.
 */
let SymbolOrderModule = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SymbolOrderModule = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.buttonComponents = this.buttonComponents;
            this.symbolImageComponents = this.symbolImageComponents;
            this.redMaterial = this.redMaterial;
            this.greenMaterial = this.greenMaterial;
            this.blueMaterial = this.blueMaterial;
            this.yellowMaterial = this.yellowMaterial;
            this.symbols = this.symbols;
            this.isModuleReady = false;
            this.safeComponent = null;
            this.slotId = 0;
            this.correctButtonIdSequence = [];
            this.currentPressIndex = 0;
            this.buttonMaterials = [];
            this.buttonSymbols = [];
        }
        __initialize() {
            super.__initialize();
            this.buttonComponents = this.buttonComponents;
            this.symbolImageComponents = this.symbolImageComponents;
            this.redMaterial = this.redMaterial;
            this.greenMaterial = this.greenMaterial;
            this.blueMaterial = this.blueMaterial;
            this.yellowMaterial = this.yellowMaterial;
            this.symbols = this.symbols;
            this.isModuleReady = false;
            this.safeComponent = null;
            this.slotId = 0;
            this.correctButtonIdSequence = [];
            this.currentPressIndex = 0;
            this.buttonMaterials = [];
            this.buttonSymbols = [];
        }
        setupModule(safeContext, safeComponent, slotId) {
            this.safeComponent = safeComponent;
            this.slotId = slotId;
            const serialInfo = this.getSerialInfo(safeContext.serialNumber);
            const fuseColor = (safeContext.dynamiteFuseColor || "").toLowerCase();
            const orderedInfo = this.buildOrderedSymbols(fuseColor, serialInfo);
            const orderedSymbols = orderedInfo.symbols;
            const pressSymbols = orderedInfo.pressSymbols.length > 0 ? orderedInfo.pressSymbols : orderedSymbols;
            const layout = this.shuffleArray([...orderedSymbols]);
            const textureMap = this.getSymbolTextureMap();
            this.applyButtonColors();
            this.applySymbols(layout, textureMap);
            const pressOrder = [];
            for (const symbolId of pressSymbols) {
                const position = this.buttonSymbols.indexOf(symbolId);
                if (position === -1) {
                    continue;
                }
                pressOrder.push(position);
            }
            this.correctButtonIdSequence = pressOrder;
            const axisLabel = orderedInfo.useColumn ? "column" : "row";
            const axisIndexReadable = orderedInfo.axisIndex + 1;
            print("Symbols order: " +
                orderedSymbols.join(",") +
                " | press: " +
                pressSymbols.join(",") +
                " | sequence: " +
                this.correctButtonIdSequence.join(",") +
                " | " +
                axisLabel +
                ": " +
                axisIndexReadable);
            this.currentPressIndex = 0;
            this.isModuleReady = true;
        }
        animationFinished() {
            // No-op — safe landing does not drive this module.
        }
        /** External callback from PushButton (primary). */
        buttonPress(id) {
            this.handleButtonPress(id);
        }
        /** Alias used by some scene button wiring. */
        pressButton(id) {
            this.handleButtonPress(id);
        }
        /** Tutorial flow — instant solve without player input. */
        tutorialInstaComplete() {
            this.isModuleReady = false;
            print("Symbol Order Module complete");
            this.disableAllButtons();
            this.moduleCompleted();
        }
        handleButtonPress(id) {
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
                    print("Symbol Order Module complete");
                    this.disableAllButtons();
                    this.moduleCompleted();
                }
            }
            else {
                this.currentPressIndex = 0;
                this.resetAllGlow();
                print("Symbol Order Module incorrect input, reset");
                this.modulePenalty();
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
                    if (typeof serialNumber.letterCount === "number") {
                        letterCount = serialNumber.letterCount;
                        hasCounts = true;
                    }
                    if (typeof serialNumber.numberCount === "number") {
                        numberCount = serialNumber.numberCount;
                        hasCounts = true;
                    }
                    if (typeof serialNumber.containsWord === "boolean") {
                        containsWord = serialNumber.containsWord;
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
            }
            return { containsWord, letterCount, numberCount, sumDigits };
        }
        shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const swapIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, i)
                    : Math.floor(Math.random() * (i + 1));
                const temp = arr[i];
                arr[i] = arr[swapIndex];
                arr[swapIndex] = temp;
            }
            return arr;
        }
        getSymbolTextureMap() {
            const map = {};
            for (const entry of this.symbols) {
                if (entry?.symbolId && entry.symbolTexture) {
                    map[entry.symbolId] = entry.symbolTexture;
                }
            }
            return map;
        }
        applyButtonColors() {
            const materials = [this.redMaterial, this.greenMaterial, this.blueMaterial, this.yellowMaterial].filter((m) => !!m);
            if (materials.length === 0) {
                return;
            }
            for (let m = materials.length - 1; m > 0; m--) {
                const swapIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, m)
                    : Math.floor(Math.random() * (m + 1));
                const temp = materials[m];
                materials[m] = materials[swapIndex];
                materials[swapIndex] = temp;
            }
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
                const materialIndex = i % materials.length;
                const cloned = materials[materialIndex].clone();
                if (cloned.mainPass?.glowAmount !== undefined) {
                    cloned.mainPass.glowAmount = 0;
                }
                visual.mainMaterial = cloned;
                this.buttonMaterials[i] = cloned;
            }
        }
        applySymbols(layout, textureMap) {
            for (let i = 0; i < this.symbolImageComponents.length; i++) {
                const symbolId = layout[i];
                const texture = symbolId ? textureMap[symbolId] : undefined;
                const image = this.symbolImageComponents[i];
                if (!image?.mainMaterial || !texture) {
                    continue;
                }
                const newMaterial = image.mainMaterial.clone();
                image.clearMaterials();
                image.addMaterial(newMaterial);
                if (image.mainMaterial?.mainPass &&
                    image.mainMaterial.mainPass.symbolMap !== undefined) {
                    image.mainMaterial.mainPass.symbolMap = texture;
                }
                this.buttonSymbols[i] = symbolId;
            }
        }
        buildOrderedSymbols(fuseColor, serialInfo) {
            const useColumn = fuseColor === "red" || fuseColor === "green";
            let reverseOrder = false;
            if (fuseColor === "green" || fuseColor === "yellow") {
                reverseOrder = true;
            }
            let list = [];
            let axisIndex = 0;
            if (useColumn) {
                const colIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, SYMBOL_MAP_ROWS[0].length - 1)
                    : Math.floor(Math.random() * SYMBOL_MAP_ROWS[0].length);
                axisIndex = colIndex;
                for (let r = 0; r < SYMBOL_MAP_ROWS.length; r++) {
                    list.push(SYMBOL_MAP_ROWS[r][colIndex]);
                }
            }
            else {
                const rowIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, SYMBOL_MAP_ROWS.length - 1)
                    : Math.floor(Math.random() * SYMBOL_MAP_ROWS.length);
                axisIndex = rowIndex;
                list = [...SYMBOL_MAP_ROWS[rowIndex]];
            }
            if (reverseOrder) {
                list.reverse();
            }
            const chosen = [...list];
            this.shuffleArray(chosen);
            const selected = chosen.slice(0, 4);
            const selectedSet = {};
            for (const id of selected) {
                selectedSet[id] = true;
            }
            const orderedSelected = [];
            for (const id of list) {
                if (selectedSet[id]) {
                    orderedSelected.push(id);
                }
            }
            const skipDontPress = serialInfo.numberCount > serialInfo.letterCount;
            const pressList = skipDontPress
                ? orderedSelected.filter((id) => id !== "doNotPress")
                : orderedSelected;
            return {
                symbols: selected,
                pressSymbols: pressList,
                useColumn,
                axisIndex,
                reverseOrder
            };
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
        disableAllButtons() {
            for (const buttonComp of this.buttonComponents) {
                const pushButton = buttonComp;
                pushButton?.disable?.();
            }
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
    __setFunctionName(_classThis, "SymbolOrderModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SymbolOrderModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SymbolOrderModule = _classThis;
})();
exports.SymbolOrderModule = SymbolOrderModule;
//# sourceMappingURL=SymbolOrderModule.js.map