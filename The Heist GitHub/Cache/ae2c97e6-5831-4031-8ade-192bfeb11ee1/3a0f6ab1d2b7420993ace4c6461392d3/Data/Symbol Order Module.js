// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;
// @input Component.Image[] symbolImageComponents
/** @type {Image[]} */
var symbolImageComponents = script.symbolImageComponents;
// @input Asset.Material redMaterial
/** @type {Material} */
var redMaterial = script.redMaterial;
// @input Asset.Material greenMaterial
/** @type {Material} */
var greenMaterial = script.greenMaterial;
// @input Asset.Material blueMaterial
/** @type {Material} */
var blueMaterial = script.blueMaterial;
// @input Asset.Material yellowMaterial
/** @type {Material} */
var yellowMaterial = script.yellowMaterial;

/*
@typedef symbol
@property {string} symbolId
@property {Asset.Texture} symbolTexture
*/

// @input symbol[] symbols

script.isModuleReady = false;
let safeContext;
let correctButtonIdSequence = [];
let currentPressIndex = 0;
var buttonMaterials = [];
var buttonSymbols = [];

var symbolMapRows = [
    ["verticalLine", "doNotPress", "fork", "helmWheel", "horizontalLine"],
    ["bigYus", "smallDot", "bigDot", "horizontalLine", "fork"],
    ["bigDot", "slavicF", "smallDot", "fork", "sun"],
    ["horizontalLine", "verticalLine", "doNotPress", "slavicF", "bigDot"],
    ["sun", "bigDot", "bigYus", "doNotPress", "verticalLine"],
    ["fork", "helmWheel", "sun", "bigYus", "smallDot"]
];

function getSerialInfo(serialNumber) {
    var serialString = "";
    var containsWord = false;
    var letterCount = 0;
    var numberCount = 0;
    var hasCounts = false;
    var sumDigits = 0;

    if (serialNumber) {
        if (typeof serialNumber === "string") {
            serialString = serialNumber;
        } else {
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
        for (var i = 0; i < serialString.length; i++) {
            var ch = serialString.charAt(i);
            if (ch >= "0" && ch <= "9") {
                if (!hasCounts) { numberCount++; }
                sumDigits += parseInt(ch, 10);
            } else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
                if (!hasCounts) { letterCount++; }
            }
        }
    }

    return {
        containsWord: containsWord,
        letterCount: letterCount,
        numberCount: numberCount,
        sumDigits: sumDigits
    };
}

function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var swapIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, i)
            : Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[swapIndex];
        arr[swapIndex] = temp;
    }
    return arr;
}

function getSymbolTextureMap() {
    var map = {};
    for (var i = 0; i < script.symbols.length; i++) {
        var entry = script.symbols[i];
        if (entry && entry.symbolId && entry.symbolTexture) {
            map[entry.symbolId] = entry.symbolTexture;
        }
    }
    return map;
}

function applyButtonColors() {
    buttonMaterials = [];
    var materials = [redMaterial, greenMaterial, blueMaterial, yellowMaterial].filter(function(material) {
        return material != null;
    });
    if (materials.length === 0) { return; }

    for (var m = materials.length - 1; m > 0; m--) {
        var swapIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, m)
            : Math.floor(Math.random() * (m + 1));
        var temp = materials[m];
        materials[m] = materials[swapIndex];
        materials[swapIndex] = temp;
    }

    for (var i = 0; i < buttonComponents.length; i++) {
        var scriptComp = buttonComponents[i];
        if (!scriptComp) { continue; }
        var buttonObject = scriptComp.getSceneObject();
        if (!buttonObject || buttonObject.getChildrenCount() < 1) { continue; }
        var firstChild = buttonObject.getChild(0);
        if (!firstChild || firstChild.getChildrenCount() < 1) { continue; }
        var visualObject = firstChild.getChild(0);
        if (!visualObject) { continue; }
        var visual = visualObject.getComponent("Component.RenderMeshVisual");
        if (!visual) { continue; }
        var materialIndex = i % materials.length;
        var clonedMaterial = materials[materialIndex].clone();
        if (clonedMaterial.mainPass && clonedMaterial.mainPass.glowAmount !== undefined) {
            clonedMaterial.mainPass.glowAmount = 0;
        }
        visual.mainMaterial = clonedMaterial;
        buttonMaterials[i] = clonedMaterial;
    }
}

function applySymbols(layout, textureMap) {
    buttonSymbols = [];
    for (var i = 0; i < symbolImageComponents.length; i++) {
        var symbolId = layout[i];
        var texture = textureMap[symbolId];
        var image = symbolImageComponents[i];
        if (!image || !image.mainMaterial || !texture) { continue; }
        var newMaterial = image.mainMaterial.clone();
        image.clearMaterials();
        image.addMaterial(newMaterial);
        if (image.mainMaterial && image.mainMaterial.mainPass && image.mainMaterial.mainPass.symbolMap !== undefined) {
            image.mainMaterial.mainPass.symbolMap = texture;
        }
        buttonSymbols[i] = symbolId;
    }
}

function animateGlow(material, targetValue, duration, callback) {
    if (!material || !material.mainPass || material.mainPass.glowAmount === undefined) {
        if (callback) { callback(); }
        return;
    }

    if (material.__glowAnim && material.__glowAnim.updateEvent) {
        material.__glowAnim.updateEvent.enabled = false;
        material.__glowAnim.updateEvent = null;
    }

    var startValue = material.mainPass.glowAmount;
    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    material.__glowAnim = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        material.mainPass.glowAmount = startValue + (targetValue - startValue) * smoothT;
        if (t >= 1) {
            material.mainPass.glowAmount = targetValue;
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
            if (callback) { callback(); }
        }
    });
}

function resetAllGlow() {
    for (var i = 0; i < buttonMaterials.length; i++) {
        if (buttonMaterials[i]) {
            animateGlow(buttonMaterials[i], 0, 0.25);
        }
    }
}

function buildOrderedSymbols(fuseColor, serialInfo) {
    var useColumn = fuseColor === "red" || fuseColor === "green";
    var reverseOrder = false;
    if (fuseColor === "green" || fuseColor === "yellow") {
        reverseOrder = true;
    }

    var list = [];
    var axisIndex = 0;
    if (useColumn) {
        var colIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, symbolMapRows[0].length - 1)
            : Math.floor(Math.random() * symbolMapRows[0].length);
        axisIndex = colIndex;
        for (var r = 0; r < symbolMapRows.length; r++) {
            list.push(symbolMapRows[r][colIndex]);
        }
    } else {
        var rowIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, symbolMapRows.length - 1)
            : Math.floor(Math.random() * symbolMapRows.length);
        axisIndex = rowIndex;
        list = symbolMapRows[rowIndex].slice(0);
    }

    if (reverseOrder) {
        list.reverse();
    }

    var chosen = list.slice(0);
    shuffleArray(chosen);
    var selected = chosen.slice(0, 4);
    var selectedSet = {};
    for (var s = 0; s < selected.length; s++) {
        selectedSet[selected[s]] = true;
    }
    var orderedSelected = [];
    for (var o = 0; o < list.length; o++) {
        if (selectedSet[list[o]]) {
            orderedSelected.push(list[o]);
        }
    }

    var skipDontPress = serialInfo.numberCount > serialInfo.letterCount;
    var pressList = skipDontPress
        ? orderedSelected.filter(function(id) { return id !== "doNotPress"; })
        : orderedSelected;

    return {
        symbols: selected,
        pressSymbols: pressList,
        useColumn: useColumn,
        axisIndex: axisIndex,
        reverseOrder: reverseOrder
    };
}

script.setupModule = function(safeContext, safeComponent, slotId) {
    var serialInfo = getSerialInfo(safeContext.serialNumber);
    var fuseColor = safeContext.dynamiteFuseColor || "";

    var orderedInfo = buildOrderedSymbols(fuseColor, serialInfo);
    var orderedSymbols = orderedInfo.symbols;
    var pressSymbols = orderedInfo.pressSymbols || orderedSymbols;
    var layout = shuffleArray(orderedSymbols.slice(0));
    var textureMap = getSymbolTextureMap();
    applyButtonColors();
    applySymbols(layout, textureMap);

    var pressOrder = [];
    for (var i = 0; i < pressSymbols.length; i++) {
        var symbolId = pressSymbols[i];
        var position = buttonSymbols.indexOf(symbolId);
        if (position === -1) { continue; }
        pressOrder.push(position);
    }

    correctButtonIdSequence = pressOrder;
    var axisLabel = orderedInfo.useColumn ? "column" : "row";
    var axisIndexReadable = orderedInfo.axisIndex + 1;
    print("Symbols order: " + orderedSymbols.join(",") +
        " | press: " + pressSymbols.join(",") +
        " | sequence: " + correctButtonIdSequence +
        " | " + axisLabel + ": " + axisIndexReadable);
    currentPressIndex = 0;
    script.isModuleReady = true;
}

function handleButtonPress(id) {
    if(!script.isModuleReady) return;
    if (correctButtonIdSequence.length === 0) { return; }

    var expectedId = correctButtonIdSequence[currentPressIndex];
    var pressedId = id;
    if (typeof pressedId === "string") {
        var parsed = parseInt(pressedId, 10);
        if (!isNaN(parsed)) {
            pressedId = parsed;
        }
    }

    if (pressedId === expectedId) {
        currentPressIndex++;
        if (buttonMaterials[pressedId]) {
            animateGlow(buttonMaterials[pressedId], 1, 0.25);
        }
        if (currentPressIndex >= correctButtonIdSequence.length) {
            script.isModuleReady = false;
            print("Symbol Order Module complete");
            for (var i = 0; i < buttonComponents.length; i++) {
                if (buttonComponents[i] && buttonComponents[i].disable) {
                    buttonComponents[i].disable();
                }
            }
            script.moduleCompleted();
        }
    } else {
        currentPressIndex = 0;
        resetAllGlow();
        print("Symbol Order Module incorrect input, reset");
        script.modulePenalty();
    }

}

script.buttonPress = handleButtonPress;
script.pressButton = handleButtonPress;

script.animationFinished = function() {
};

script.moduleCompleted = function() {
};

script.modulePenalty = function() {
};
