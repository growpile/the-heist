global.appState = {
    currentState: "intro",
    anchorManager: null,
    inTransition: false,
    signedInSnapCloud: false,
    currentClientTime: null,
    safe: {},
    storage: {},
}

var storageDefaults = {
    enabledGloves: { type: "bool", defaultValue: false },
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

function storeHasKey(store, key) {
    if (!store) { return false; }
    if (typeof store.has === "function") { return store.has(key); }
    if (typeof store.contains === "function") { return store.contains(key); }
    if (typeof store.getString === "function") {
        var val = store.getString(key);
        return val !== null && val !== undefined && val !== "";
    }
    return false;
}

function readFromStore(store, key, type) {
    if (!store) { return undefined; }
    if (type === "bool") {
        if (typeof store.getBool === "function") { return store.getBool(key); }
        if (typeof store.getBoolean === "function") { return store.getBoolean(key); }
    } else if (type === "int") {
        if (typeof store.getInt === "function") { return store.getInt(key); }
        if (typeof store.getNumber === "function") { return store.getNumber(key); }
    } else if (type === "float") {
        if (typeof store.getFloat === "function") { return store.getFloat(key); }
        if (typeof store.getNumber === "function") { return store.getNumber(key); }
    }
    if (typeof store.getString === "function") {
        return store.getString(key);
    }
    return undefined;
}

function writeToStore(store, key, value, type) {
    if (!store) { return; }
    if (type === "bool") {
        if (typeof store.putBool === "function") { store.putBool(key, value); return; }
        if (typeof store.putBoolean === "function") { store.putBoolean(key, value); return; }
    } else if (type === "int") {
        if (typeof store.putInt === "function") { store.putInt(key, value); return; }
        if (typeof store.putNumber === "function") { store.putNumber(key, value); return; }
    } else if (type === "float") {
        if (typeof store.putFloat === "function") { store.putFloat(key, value); return; }
        if (typeof store.putNumber === "function") { store.putNumber(key, value); return; }
    }
    if (typeof store.putString === "function") {
        store.putString(key, String(value));
    } else if (typeof store.setString === "function") {
        store.setString(key, String(value));
    }
}

function coerceValue(value, type, fallback) {
    if (value === undefined || value === null || value === "") { return fallback; }
    if (type === "bool") {
        if (typeof value === "boolean") { return value; }
        if (typeof value === "string") { return value.toLowerCase() === "true"; }
        return !!value;
    }
    if (type === "int") {
        var intVal = parseInt(value, 10);
        return isNaN(intVal) ? fallback : intVal;
    }
    if (type === "float") {
        var floatVal = parseFloat(value);
        return isNaN(floatVal) ? fallback : floatVal;
    }
    return value;
}

global.appState.checkStorage = function(key) {
    if (!storageDefaults[key]) { return undefined; }
    if (global.appState.storage.hasOwnProperty(key)) {
        return global.appState.storage[key];
    }

    var def = storageDefaults[key];
    var store = getPersistentStore();
    var hasKey = storeHasKey(store, key);
    var rawValue = hasKey ? readFromStore(store, key, def.type) : undefined;
    var value = coerceValue(rawValue, def.type, def.defaultValue);
    global.appState.storage[key] = value;

    if (!hasKey) {
        writeToStore(store, key, value, def.type);
    }
    return value;
};

global.appState.setStorage = function(key, value) {
    if (!storageDefaults[key]) { return; }
    var def = storageDefaults[key];
    var coerced = coerceValue(value, def.type, def.defaultValue);
    global.appState.storage[key] = coerced;
    var store = getPersistentStore();
    writeToStore(store, key, coerced, def.type);
};

global.appState.checkStorage("tutorialPlayed");

// script.createEvent("UpdateEvent").bind(function(eventData){
//     print(global.appState.currentState);
// });
