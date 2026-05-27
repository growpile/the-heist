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
exports.WireFuseboxModule = void 0;
var __selfType = requireType("./WireFuseboxModule");
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
const MODULE_PENALTY_SEC = 20;
/**
 * Wire puzzle manager — socket registry, color assignment, and connection validation.
 * Disable legacy Wire Fusebox Module.js on the same object.
 */
let WireFuseboxModule = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var WireFuseboxModule = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.buttonComponent = this.buttonComponent;
            this.wireReels = this.wireReels;
            this.wireConnectors = this.wireConnectors;
            this.wireColorMaterials = this.wireColorMaterials;
            this.safeComponent = null;
            this.slotId = 0;
            this.socketRegistry = [];
            this.occupancyList = [];
            this.wireColors = [];
            this.requiredConnections = [];
            this.skipSockets = false;
            this.skipRed = false;
            this.buttonMaterial = null;
            this.isSolved = false;
        }
        __initialize() {
            super.__initialize();
            this.buttonComponent = this.buttonComponent;
            this.wireReels = this.wireReels;
            this.wireConnectors = this.wireConnectors;
            this.wireColorMaterials = this.wireColorMaterials;
            this.safeComponent = null;
            this.slotId = 0;
            this.socketRegistry = [];
            this.occupancyList = [];
            this.wireColors = [];
            this.requiredConnections = [];
            this.skipSockets = false;
            this.skipRed = false;
            this.buttonMaterial = null;
            this.isSolved = false;
        }
        registerSockets(sockets) {
            if (!sockets) {
                return;
            }
            for (const socket of sockets) {
                if (!socket || this.socketRegistry.indexOf(socket) >= 0) {
                    continue;
                }
                this.socketRegistry.push(socket);
            }
        }
        unregisterSockets(sockets) {
            if (!sockets) {
                return;
            }
            for (let i = this.socketRegistry.length - 1; i >= 0; i--) {
                if (sockets.indexOf(this.socketRegistry[i]) >= 0) {
                    this.socketRegistry.splice(i, 1);
                }
            }
        }
        isSocketOccupied(socket) {
            return this.occupancyList.some((entry) => entry.socket === socket);
        }
        occupySocket(socket, wire) {
            this.releaseSocket(wire);
            this.occupancyList.push({ socket, wire });
        }
        releaseSocket(wire) {
            for (let i = this.occupancyList.length - 1; i >= 0; i--) {
                if (this.occupancyList[i].wire === wire) {
                    this.occupancyList.splice(i, 1);
                }
            }
        }
        getOccupancy() {
            return this.occupancyList.map((entry) => ({ socket: entry.socket, wire: entry.wire }));
        }
        getSockets() {
            return this.socketRegistry.slice(0);
        }
        setupModule(safeContext, safeComponent, slotId) {
            this.safeComponent = safeComponent;
            this.slotId = slotId;
            const serialInfo = this.getSerialInfo(safeContext.serialNumber);
            const fuseColor = safeContext.dynamiteFuseColor || "";
            this.isSolved = false;
            this.initButtonMaterial();
            this.applyWireMaterials();
            for (const wireScript of this.wireConnectors) {
                if (!wireScript) {
                    continue;
                }
                const wire = wireScript;
                if (wire.setManager) {
                    wire.setManager(this);
                }
                else {
                    wire.wireManager = this;
                }
            }
            this.requiredConnections = this.buildRequiredConnections(serialInfo, fuseColor);
            const solutionParts = this.requiredConnections.map((c) => c.socketIndex + c.colorLetter);
            print("Wire Module Solution: " + solutionParts.join(" "));
        }
        animationFinished() {
            if (this.isSolved) {
                return;
            }
            for (const wireScript of this.wireConnectors) {
                if (!wireScript) {
                    continue;
                }
                const wire = wireScript;
                if (typeof wire.init === "function") {
                    wire.init();
                }
            }
        }
        checkConnections() {
            if (this.isSolved) {
                return;
            }
            const connected = this.getConnectedByColor();
            const requiredByColor = {};
            for (const req of this.requiredConnections) {
                requiredByColor[req.colorLetter] = req.socketIndex;
            }
            const forbiddenSockets = this.skipSockets ? { 1: true, 3: true } : {};
            for (const entry of this.occupancyList) {
                if (!entry?.wire || !entry.socket) {
                    continue;
                }
                const wireIndex = this.wireConnectors.indexOf(entry.wire);
                if (wireIndex < 0) {
                    continue;
                }
                const colorLetter = this.wireColors[wireIndex];
                if (!colorLetter) {
                    continue;
                }
                const socketIndex = this.socketRegistry.indexOf(entry.socket);
                if (socketIndex < 0) {
                    continue;
                }
                if (this.skipRed && colorLetter === "R") {
                    this.failConnections();
                    return;
                }
                if (this.skipSockets && forbiddenSockets[socketIndex]) {
                    this.failConnections();
                    return;
                }
                if (requiredByColor[colorLetter] === undefined) {
                    this.failConnections();
                    return;
                }
                if (requiredByColor[colorLetter] !== socketIndex) {
                    global.playSfx(17, 1, global.appState.checkStorage("masterVolume") * 0.7);
                    this.failConnections();
                    return;
                }
            }
            let solved = true;
            for (const req of this.requiredConnections) {
                if (connected[req.colorLetter] !== req.socketIndex) {
                    solved = false;
                    break;
                }
            }
            if (solved) {
                print("Wire Fusebox Module solved");
                this.isSolved = true;
                this.playSolvedAnimation();
                this.disableCheckButton();
                this.disableAllWires();
                this.moduleCompleted();
                return;
            }
            print("Wire Fusebox Module incorrect connections");
            global.playSfx(17, 1, global.appState.checkStorage("masterVolume") * 0.7);
            this.modulePenalty();
            this.disconnectAllWires();
        }
        tutorialInstaComplete() {
            print("Wire Fusebox Module solved");
            this.isSolved = true;
            this.playSolvedAnimation();
            this.disableCheckButton();
            this.disableAllWires();
            this.moduleCompleted();
        }
        failConnections() {
            print("Wire Fusebox Module incorrect connections");
            this.modulePenalty();
            this.disconnectAllWires();
        }
        disconnectAllWires() {
            for (const wireScript of this.wireConnectors) {
                if (!wireScript) {
                    continue;
                }
                const wire = wireScript;
                if (typeof wire.disconnect === "function") {
                    wire.disconnect();
                }
            }
        }
        disableAllWires() {
            for (const wireScript of this.wireConnectors) {
                if (!wireScript) {
                    continue;
                }
                const wire = wireScript;
                if (typeof wire.disable === "function") {
                    wire.disable();
                }
            }
        }
        disableCheckButton() {
            const button = this.buttonComponent;
            if (button && typeof button.disable === "function") {
                button.disable.call(this.buttonComponent);
            }
        }
        initButtonMaterial() {
            this.buttonMaterial = null;
            if (!this.buttonComponent) {
                return;
            }
            const buttonObject = this.buttonComponent.getSceneObject();
            if (!buttonObject || buttonObject.getChildrenCount() < 1) {
                return;
            }
            const firstChild = buttonObject.getChild(0);
            if (!firstChild || firstChild.getChildrenCount() < 1) {
                return;
            }
            const visualObject = firstChild.getChild(0);
            if (!visualObject) {
                return;
            }
            const visual = visualObject.getComponent("Component.RenderMeshVisual");
            if (!visual?.mainMaterial) {
                return;
            }
            this.buttonMaterial = visual.mainMaterial.clone();
            visual.mainMaterial = this.buttonMaterial;
        }
        animateMaterialProperty(material, propName, targetValue, duration, callback) {
            const mat = material;
            if (!mat.mainPass || mat.mainPass[propName] === undefined) {
                callback?.();
                return;
            }
            if (!mat.__propAnim) {
                mat.__propAnim = {};
            }
            if (mat.__propAnim[propName]?.updateEvent) {
                mat.__propAnim[propName].updateEvent.enabled = false;
                mat.__propAnim[propName].updateEvent = null;
            }
            const startValue = mat.mainPass[propName];
            const animData = {
                startTime: getTime(),
                updateEvent: this.createEvent("UpdateEvent")
            };
            mat.__propAnim[propName] = animData;
            animData.updateEvent.bind(() => {
                const elapsed = getTime() - animData.startTime;
                const t = Math.min(elapsed / duration, 1);
                const smoothT = t * t * (3 - 2 * t);
                mat.mainPass[propName] = startValue + (targetValue - startValue) * smoothT;
                if (t >= 1) {
                    mat.mainPass[propName] = targetValue;
                    animData.updateEvent.enabled = false;
                    animData.updateEvent = null;
                    callback?.();
                }
            });
        }
        playSolvedAnimation() {
            if (!this.buttonMaterial) {
                return;
            }
            this.animateMaterialProperty(this.buttonMaterial, "state", 1, 0.25);
            this.animateMaterialProperty(this.buttonMaterial, "glowAmount", 1, 0.25);
        }
        applyWireMaterials() {
            if (!this.wireColorMaterials || this.wireColorMaterials.length === 0) {
                return;
            }
            const materials = this.wireColorMaterials.slice(0, 4);
            const colorLetters = ["R", "G", "B", "Y"];
            for (let m = materials.length - 1; m > 0; m--) {
                const swapIndex = global.utils && global.utils.rng
                    ? global.utils.rng(0, m)
                    : Math.floor(Math.random() * (m + 1));
                const tempMat = materials[m];
                materials[m] = materials[swapIndex];
                materials[swapIndex] = tempMat;
                const tmpLetter = colorLetters[m];
                colorLetters[m] = colorLetters[swapIndex];
                colorLetters[swapIndex] = tmpLetter;
            }
            this.wireColors = [];
            for (let r = 0; r < this.wireReels.length; r++) {
                const reel = this.wireReels[r];
                if (!reel) {
                    continue;
                }
                const matIndex = r % materials.length;
                const cloned = materials[matIndex].clone();
                reel.clearMaterials();
                reel.mainMaterial = cloned;
            }
            for (let w = 0; w < this.wireConnectors.length; w++) {
                const wireScript = this.wireConnectors[w];
                if (!wireScript) {
                    continue;
                }
                const wireMatIndex = w % materials.length;
                const wire = wireScript;
                wire.wireMaterial = materials[wireMatIndex];
                this.wireColors[w] = colorLetters[wireMatIndex];
            }
        }
        getSerialInfo(serialNumber) {
            let serialString = "";
            let containsWord = false;
            let letterCount = 0;
            let numberCount = 0;
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
            if (serialString && !hasCounts) {
                for (let i = 0; i < serialString.length; i++) {
                    const ch = serialString.charAt(i);
                    if (ch >= "0" && ch <= "9") {
                        numberCount++;
                    }
                    else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
                        letterCount++;
                    }
                }
            }
            return { containsWord, letterCount, numberCount };
        }
        getSocketForColor(colorLetter, fuseColor) {
            if (colorLetter === "B") {
                if (fuseColor === "red")
                    return 1;
                if (fuseColor === "green")
                    return 2;
                if (fuseColor === "blue")
                    return 3;
                if (fuseColor === "yellow")
                    return 4;
            }
            else if (colorLetter === "R") {
                if (fuseColor === "red")
                    return 2;
                if (fuseColor === "green")
                    return 3;
                if (fuseColor === "blue")
                    return 4;
                if (fuseColor === "yellow")
                    return 1;
            }
            else if (colorLetter === "G") {
                if (fuseColor === "red")
                    return 3;
                if (fuseColor === "green")
                    return 4;
                if (fuseColor === "blue")
                    return 1;
                if (fuseColor === "yellow")
                    return 2;
            }
            else if (colorLetter === "Y") {
                if (fuseColor === "red")
                    return 4;
                if (fuseColor === "green")
                    return 1;
                if (fuseColor === "blue")
                    return 2;
                if (fuseColor === "yellow")
                    return 3;
            }
            return null;
        }
        buildRequiredConnections(serialInfo, fuseColor) {
            this.skipSockets = serialInfo.containsWord;
            this.skipRed = serialInfo.numberCount > 3;
            const connections = [];
            const colorOrder = ["R", "G", "B", "Y"];
            for (const colorLetter of colorOrder) {
                if (this.skipRed && colorLetter === "R") {
                    continue;
                }
                const socketIndex = this.getSocketForColor(colorLetter, fuseColor);
                if (!socketIndex) {
                    continue;
                }
                if (this.skipSockets && (socketIndex === 2 || socketIndex === 4)) {
                    continue;
                }
                connections.push({ socketIndex: socketIndex - 1, colorLetter });
            }
            return connections;
        }
        getConnectedByColor() {
            const connected = {};
            for (const entry of this.occupancyList) {
                if (!entry?.wire || !entry.socket) {
                    continue;
                }
                const wireIndex = this.wireConnectors.indexOf(entry.wire);
                if (wireIndex < 0) {
                    continue;
                }
                const colorLetter = this.wireColors[wireIndex];
                if (!colorLetter) {
                    continue;
                }
                const socketIndex = this.socketRegistry.indexOf(entry.socket);
                if (socketIndex < 0) {
                    continue;
                }
                connected[colorLetter] = socketIndex;
            }
            return connected;
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
    __setFunctionName(_classThis, "WireFuseboxModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WireFuseboxModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WireFuseboxModule = _classThis;
})();
exports.WireFuseboxModule = WireFuseboxModule;
//# sourceMappingURL=WireFuseboxModule.js.map