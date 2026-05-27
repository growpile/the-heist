// @input Component.ScriptComponent buttonComponent
// @input Component.RenderMeshVisual[] wireReels
// @input Component.ScriptComponent[] wireConnectors
// @input Asset.Material[] wireColorMaterials

var socketRegistry = [];
var occupancyList = [];
var wireColors = [];
var requiredConnections = [];
var skipSockets = false;
var skipRed = false;
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
    var colorLetters = ["R", "G", "B", "Y"];
    for (var i = materials.length - 1; i > 0; i--) {
        var swapIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, i)
            : Math.floor(Math.random() * (i + 1));
        var temp = materials[i];
        materials[i] = materials[swapIndex];
        materials[swapIndex] = temp;
        var tmpLetter = colorLetters[i];
        colorLetters[i] = colorLetters[swapIndex];
        colorLetters[swapIndex] = tmpLetter;
    }

    wireColors = [];
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
        wireColors[w] = colorLetters[wireMatIndex];
    }
}

function getSerialInfo(serialNumber) {
    var serialString = "";
    var containsWord = false;
    var letterCount = 0;
    var numberCount = 0;
    var hasCounts = false;

    if (serialNumber) {
        if (typeof serialNumber === "string") {
            serialString = serialNumber;
        } else {
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
        for (var i = 0; i < serialString.length; i++) {
            var ch = serialString.charAt(i);
            if (ch >= "0" && ch <= "9") {
                numberCount++;
            } else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
                letterCount++;
            }
        }
    }

    return {
        containsWord: containsWord,
        letterCount: letterCount,
        numberCount: numberCount
    };
}

function getSocketForColor(colorLetter, fuseColor) {
    if (colorLetter === "B") {
        if (fuseColor === "red") { return 1; }
        if (fuseColor === "green") { return 2; }
        if (fuseColor === "blue") { return 3; }
        if (fuseColor === "yellow") { return 4; }
    } else if (colorLetter === "R") {
        if (fuseColor === "red") { return 2; }
        if (fuseColor === "green") { return 3; }
        if (fuseColor === "blue") { return 4; }
        if (fuseColor === "yellow") { return 1; }
    } else if (colorLetter === "G") {
        if (fuseColor === "red") { return 3; }
        if (fuseColor === "green") { return 4; }
        if (fuseColor === "blue") { return 1; }
        if (fuseColor === "yellow") { return 2; }
    } else if (colorLetter === "Y") {
        if (fuseColor === "red") { return 4; }
        if (fuseColor === "green") { return 1; }
        if (fuseColor === "blue") { return 2; }
        if (fuseColor === "yellow") { return 3; }
    }
    return null;
}

function buildRequiredConnections(serialInfo, fuseColor) {
    skipSockets = serialInfo.containsWord;
    skipRed = serialInfo.numberCount > 3;
    var connections = [];
    var colorOrder = ["R", "G", "B", "Y"];
    for (var c = 0; c < colorOrder.length; c++) {
        var colorLetter = colorOrder[c];
        if (skipRed && colorLetter === "R") { continue; }
        var socketIndex = getSocketForColor(colorLetter, fuseColor);
        if (!socketIndex) { continue; }
        if (skipSockets && (socketIndex === 2 || socketIndex === 4)) { continue; }
        connections.push({ socketIndex: socketIndex - 1, colorLetter: colorLetter });
    }
    return connections;
}

function getConnectedByColor() {
    var connected = {};
    for (var i = 0; i < occupancyList.length; i++) {
        var entry = occupancyList[i];
        if (!entry || !entry.wire || !entry.socket) { continue; }
        var wireIndex = script.wireConnectors.indexOf(entry.wire);
        if (wireIndex < 0) { continue; }
        var colorLetter = wireColors[wireIndex];
        if (!colorLetter) { continue; }
        var socketIndex = socketRegistry.indexOf(entry.socket);
        if (socketIndex < 0) { continue; }
        connected[colorLetter] = socketIndex;
    }
    return connected;
}

script.registerSockets = registerSockets;
script.unregisterSockets = unregisterSockets;
script.isSocketOccupied = isSocketOccupied;
script.occupySocket = occupySocket;
script.releaseSocket = releaseSocket;
script.getOccupancy = getOccupancy;
script.getSockets = getSockets;

script.setupModule = function(safeContext, safeComponent, slotId) {
    var serialInfo = getSerialInfo(safeContext.serialNumber);
    var fuseColor = safeContext.dynamiteFuseColor || "";

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

    requiredConnections = buildRequiredConnections(serialInfo, fuseColor);
    var solutionParts = [];
    for (var s = 0; s < requiredConnections.length; s++) {
        solutionParts.push(requiredConnections[s].socketIndex + requiredConnections[s].colorLetter);
    }
    print("Wire Module Solution: " + solutionParts.join(" "));
}

script.checkConnections = function() {
    var connected = getConnectedByColor();
    var solved = true;
    for (var i = 0; i < requiredConnections.length; i++) {
        var req = requiredConnections[i];
        if (connected[req.colorLetter] !== req.socketIndex) {
            solved = false;
            break;
        }
    }
    if (solved) {
        print("Wire Fusebox Module solved");
        return;
    }
    print("Wire Fusebox Module incorrect connections");
    for (var w = 0; w < script.wireConnectors.length; w++) {
        var wireScript = script.wireConnectors[w];
        if (wireScript && wireScript.disconnect) {
            wireScript.disconnect();
        }
    }
};

script.animationFinished = function() {
    for (var i = 0; i < script.wireConnectors.length; i++) {
        var wireScript = script.wireConnectors[i];
        if (wireScript && wireScript.init) {
            wireScript.init();
        }
    }
};
