// State and persistence helpers for Score Component

function createStorage() {
    return {
        score: 0
    };
}

function initStorage(script) {
    var hasStorage = script.persistentScore && global.persistentStorageSystem && global.persistentStorageSystem.store;
    var scoreStorage = hasStorage ? global.persistentStorageSystem.store : null;
    var name = script.getSceneObject() ? script.getSceneObject().name : "ScoreComponent";
    name = name.replace(/\s+/g, "_");

    var storageKeys = {
        int: name + "_savedPBInt",
        float: name + "_savedPBFloat"
    };

    return {
        hasStorage: hasStorage,
        scoreStorage: scoreStorage,
        storageKeys: storageKeys
    };
}

function setScore(state, value) {
    state.score = value;
}

function modifyScore(state, dir, amount) {
    state.score += dir === "add" ? amount : -amount;
}

function getPB(script, state, storageCtx) {
    if (!storageCtx.hasStorage || !storageCtx.scoreStorage) {
        return null;
    }
    var keys = storageCtx.storageKeys;
    var storage = storageCtx.scoreStorage;

    return script.scoreType == 0 ? storage.getInt(keys.int) : storage.getFloat(keys.float);
}

function isScorePB(script, state, storageCtx) {
    var pb = getPB(script, state, storageCtx);
    if (pb == null || isNaN(pb)) {
        return true;
    }
    return state.score > pb;
}

function getPBString(script, state, storageCtx) {
    var pb = getPB(script, state, storageCtx);
    if (pb == null || isNaN(pb)) {
        return "0";
    }
    return script.scoreType == 0 ? pb.toString() : pb.toFixed(script.decimals).toString();
}

function updatePB(script, state, storageCtx, callbacks) {
    if (!storageCtx.hasStorage || !storageCtx.scoreStorage || !script.allowPersonalBest || !isScorePB(script, state, storageCtx)) {
        return false;
    }
    var storage = storageCtx.scoreStorage;
    var keys = storageCtx.storageKeys;

    if (script.scoreType == 0) {
        storage.putInt(keys.int, state.score);
    } else {
        storage.putFloat(keys.float, state.score);
    }
    if (callbacks && callbacks.playVfx) callbacks.playVfx();
    if (callbacks && callbacks.onPersonalBest) callbacks.onPersonalBest(state.score);
    return true;
}

function resetSavedScore(storageCtx) {
    if(storageCtx && storageCtx.scoreStorage) {
        storageCtx.scoreStorage.putInt(storageCtx.storageKeys.int, 0);
        storageCtx.scoreStorage.putFloat(storageCtx.storageKeys.float, 0);
    }
}

module.exports = {
    createStorage: createStorage,
    initStorage: initStorage,
    setScore: setScore,
    modifyScore: modifyScore,
    getPB: getPB,
    isScorePB: isScorePB,
    getPBString: getPBString,
    updatePB: updatePB,
    resetSavedScore: resetSavedScore
};
