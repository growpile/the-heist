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
exports.AppState = void 0;
var __selfType = requireType("./AppState");
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
const STORAGE_DEFAULTS = {
    enabledGloves: { type: "bool", defaultValue: true },
    masterVolume: { type: "float", defaultValue: 1 },
    safesOpened: { type: "int", defaultValue: 0 },
    safesFailed: { type: "int", defaultValue: 0 },
    tutorialPlayed: { type: "bool", defaultValue: false },
    currencyCount: { type: "int", defaultValue: 0 }
};
function getPersistentStore() {
    if (global.persistentStorageSystem && global.persistentStorageSystem.store) {
        return global.persistentStorageSystem.store;
    }
    return null;
}
function storeHasKey(store, key, type) {
    if (!store) {
        return false;
    }
    if (typeof store.has === "function") {
        return store.has(key);
    }
    if (typeof store.contains === "function") {
        return store.contains(key);
    }
    if (type === "float" && typeof store.getFloat === "function") {
        const val = store.getFloat(key);
        return val !== null && val !== undefined && !isNaN(val);
    }
    if (type === "int" && typeof store.getInt === "function") {
        const val = store.getInt(key);
        return val !== null && val !== undefined && !isNaN(val);
    }
    if (type === "bool" && typeof store.getBool === "function") {
        const val = store.getBool(key);
        return val !== null && val !== undefined;
    }
    if (typeof store.getString === "function") {
        const val = store.getString(key);
        return val !== null && val !== undefined && val !== "";
    }
    return false;
}
function readFromStore(store, key, type) {
    if (!store) {
        return undefined;
    }
    if (type === "bool") {
        if (typeof store.getBool === "function") {
            return store.getBool(key);
        }
        if (typeof store.getBoolean === "function") {
            return store.getBoolean(key);
        }
    }
    else if (type === "int") {
        if (typeof store.getInt === "function") {
            return store.getInt(key);
        }
        if (typeof store.getNumber === "function") {
            return store.getNumber(key);
        }
    }
    else if (type === "float") {
        if (typeof store.getFloat === "function") {
            return store.getFloat(key);
        }
        if (typeof store.getNumber === "function") {
            return store.getNumber(key);
        }
    }
    if (typeof store.getString === "function") {
        return store.getString(key);
    }
    return undefined;
}
function writeToStore(store, key, value, type) {
    if (!store) {
        return;
    }
    if (type === "bool") {
        if (typeof store.putBool === "function") {
            store.putBool(key, value);
            return;
        }
        if (typeof store.putBoolean === "function") {
            store.putBoolean(key, value);
            return;
        }
    }
    else if (type === "int") {
        if (typeof store.putInt === "function") {
            store.putInt(key, value);
            return;
        }
        if (typeof store.putNumber === "function") {
            store.putNumber(key, value);
            return;
        }
    }
    else if (type === "float") {
        if (typeof store.putFloat === "function") {
            store.putFloat(key, value);
            return;
        }
        if (typeof store.putNumber === "function") {
            store.putNumber(key, value);
            return;
        }
    }
    if (typeof store.putString === "function") {
        store.putString(key, String(value));
    }
    else if (typeof store.setString === "function") {
        store.setString(key, String(value));
    }
}
function coerceValue(value, type, fallback) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }
    if (type === "bool") {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
        return !!value;
    }
    if (type === "int") {
        const intVal = parseInt(String(value), 10);
        return isNaN(intVal) ? fallback : intVal;
    }
    if (type === "float") {
        const floatVal = parseFloat(String(value));
        return isNaN(floatVal) ? fallback : floatVal;
    }
    return fallback;
}
function checkStorage(key) {
    const def = STORAGE_DEFAULTS[key];
    if (!def) {
        return undefined;
    }
    const state = global.appState;
    if (state.storage.hasOwnProperty(key)) {
        return state.storage[key];
    }
    const store = getPersistentStore();
    const hasKey = storeHasKey(store, key, def.type);
    const rawValue = hasKey ? readFromStore(store, key, def.type) : undefined;
    const value = coerceValue(rawValue, def.type, def.defaultValue);
    state.storage[key] = value;
    if (!hasKey) {
        writeToStore(store, key, value, def.type);
    }
    return value;
}
function setStorage(key, value) {
    const def = STORAGE_DEFAULTS[key];
    if (!def) {
        return;
    }
    const coerced = coerceValue(value, def.type, def.defaultValue);
    global.appState.storage[key] = coerced;
    const store = getPersistentStore();
    writeToStore(store, key, coerced, def.type);
}
function initGlobalAppState() {
    if (global.appState) {
        return;
    }
    const checkStorageFn = checkStorage;
    const setStorageFn = setStorage;
    global.appState = {
        currentState: "intro",
        anchorManager: null,
        inTransition: false,
        signedInSnapCloud: false,
        currentClientTime: null,
        safe: {},
        storage: {},
        checkStorage: checkStorageFn,
        getMasterVolume: () => checkStorage("masterVolume"),
        setStorage: setStorageFn
    };
}
// Match legacy AppState.js: available as soon as this script loads.
initGlobalAppState();
/**
 * Initializes `global.appState` and persistent storage helpers.
 * Attach on Prerequisites → AppState (replaces AppState.js).
 */
let AppState = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var AppState = _classThis = class extends _classSuper {
        constructor() {
            super();
        }
        __initialize() {
            super.__initialize();
        }
        onAwake() {
            initGlobalAppState();
        }
    };
    __setFunctionName(_classThis, "AppState");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppState = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppState = _classThis;
})();
exports.AppState = AppState;
//# sourceMappingURL=AppState.js.map