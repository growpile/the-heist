// @input Component.ScriptComponent buttonComponent
// @input Component.RenderMeshVisual[] wireReels
// @input Component.ScriptComponent[] wireConnectors
// @input Asset.Material[] wireColorMaterials

var socketRegistry = [];
var occupancyList = [];
// 0 - red
// 1 - green
// 2 - blue
// 3 - yellow

function registerSockets(sockets) {
    if (!sockets) { return; }
    for (var i = 0; i < sockets.length; i++) {
        var s = sockets[i];
        if (!s) { continue; }
        var exists = false;
        for (var j = 0; j < socketRegistry.length; j++) {
            if (socketRegistry[j] === s) { exists = true; break; }
        }
        if (!exists) {
            socketRegistry.push(s);
        }
    }
}

function unregisterSockets(sockets) {
    if (!sockets) { return; }
    for (var i = socketRegistry.length - 1; i >= 0; i--) {
        if (sockets.indexOf(socketRegistry[i]) !== -1) {
            socketRegistry.splice(i, 1);
        }
    }
}

function isSocketOccupied(socket) {
    for (var i = 0; i < occupancyList.length; i++) {
        if (occupancyList[i].socket === socket) {
            return true;
        }
    }
    return false;
}

function occupySocket(socket, wire) {
    releaseSocket(wire);
    occupancyList.push({ socket: socket, wire: wire });
}

function releaseSocket(wire) {
    for (var i = occupancyList.length - 1; i >= 0; i--) {
        if (occupancyList[i].wire === wire) {
            occupancyList.splice(i, 1);
        }
    }
}

function getOccupancy() {
    var result = [];
    for (var i = 0; i < occupancyList.length; i++) {
        result.push({ socket: occupancyList[i].socket, wire: occupancyList[i].wire });
    }
    return result;
}

function getSockets() {
    return socketRegistry.slice(0);
}

function applyWireMaterials() {
    if (!script.wireColorMaterials || script.wireColorMaterials.length === 0) { return; }
    var materials = script.wireColorMaterials.slice(0, 4);
    for (var i = materials.length - 1; i > 0; i--) {
        var swapIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, i)
            : Math.floor(Math.random() * (i + 1));
        var temp = materials[i];
        materials[i] = materials[swapIndex];
        materials[swapIndex] = temp;
    }

    for (var r = 0; r < script.wireReels.length; r++) {
        var reel = script.wireReels[r];
        if (!reel) { continue; }
        var matIndex = r % materials.length;
        var cloned = materials[matIndex].clone();
        reel.clearMaterials();
        reel.mainMaterial = cloned;
    }

    for (var w = 0; w < script.wireConnectors.length; w++) {
        var wireScript = script.wireConnectors[w];
        if (!wireScript) { continue; }
        var wireMatIndex = w % materials.length;
        wireScript.wireMaterial = materials[wireMatIndex];
    }
}

script.registerSockets = registerSockets;
script.unregisterSockets = unregisterSockets;
script.isSocketOccupied = isSocketOccupied;
script.occupySocket = occupySocket;
script.releaseSocket = releaseSocket;
script.getOccupancy = getOccupancy;
script.getSockets = getSockets;

script.setupModule = function(safeContext, safeComponent, slotId) {
    applyWireMaterials();
    for (var i = 0; i < script.wireConnectors.length; i++) {
        var wireScript = script.wireConnectors[i];
        if (!wireScript) { continue; }
        if (wireScript.setManager) {
            wireScript.setManager(script);
        } else {
            wireScript.wireManager = script;
        }
    }
}

script.animationFinished = function() {
    for (var i = 0; i < script.wireConnectors.length; i++) {
        var wireScript = script.wireConnectors[i];
        if (wireScript && wireScript.init) {
            wireScript.init();
        }
    }
};
