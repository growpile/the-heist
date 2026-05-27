// @input Component.ScriptComponent[] buttonComponents
/** @type {ScriptComponent[]} */
var buttonComponents = script.buttonComponents;

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

script.isModuleReady = false;
let safeContext;
var buttonColors = [];
var buttonMaterials = [];
var correctButtonIdSequence = [];
var currentPressIndex = 0;
script.safeComponent;
script.slotId;

var colorNames = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow"
};

var serialWords = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"];

function applyButtonColors(layout) {
    var materialByColor = {};
    materialByColor[colorNames.RED] = redMaterial;
    materialByColor[colorNames.GREEN] = greenMaterial;
    materialByColor[colorNames.BLUE] = blueMaterial;
    materialByColor[colorNames.YELLOW] = yellowMaterial;

    for (let i = 0; i < buttonComponents.length; i++) {
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
        var color = layout[i];
        var material = materialByColor[color];
        if (!material) { continue; }
        var clonedMaterial = material.clone();
        if (clonedMaterial.mainPass && clonedMaterial.mainPass.glowAmount !== undefined) {
            clonedMaterial.mainPass.glowAmount = 0;
        }
        visual.mainMaterial = clonedMaterial;
        buttonColors[i] = color;
        buttonMaterials[i] = clonedMaterial;
    }
}

function getRandomColorLayout() {
    var colors = [colorNames.RED, colorNames.GREEN, colorNames.BLUE, colorNames.YELLOW];
    for (var i = colors.length - 1; i > 0; i--) {
        var swapIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, i)
            : Math.floor(Math.random() * (i + 1));
        var temp = colors[i];
        colors[i] = colors[swapIndex];
        colors[swapIndex] = temp;
    }
    return colors;
}

function colorToLetter(color) {
    if (color === colorNames.RED) { return "R"; }
    if (color === colorNames.GREEN) { return "G"; }
    if (color === colorNames.BLUE) { return "B"; }
    if (color === colorNames.YELLOW) { return "Y"; }
    return "?";
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

function getSerialInfo(serialNumber) {
    var serialString = "";
    var containsWord = false;
    var letterCount = 0;
    var numberCount = 0;
    var sumDigits = 0;
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

    if (serialString) {
        for (var i = 0; i < serialString.length; i++) {
            var ch = serialString.charAt(i);
            if (ch >= "0" && ch <= "9") {
                if (!hasCounts) {
                    numberCount++;
                }
                sumDigits += parseInt(ch, 10);
            } else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
                if (!hasCounts) {
                    letterCount++;
                }
            }
        }

        if (!containsWord) {
            var upper = serialString.toUpperCase();
            for (var w = 0; w < serialWords.length; w++) {
                if (upper.indexOf(serialWords[w]) !== -1) {
                    containsWord = true;
                    break;
                }
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

script.setupModule = function(safeContext, safeComponent, slotId) {
    script.safeComponent = safeComponent;
    script.slotId = slotId;
    var serialInfo = getSerialInfo(safeContext.serialNumber);
    var fuseColor = safeContext.dynamiteFuseColor || "";

    var orderColors;
    if (serialInfo.letterCount > serialInfo.numberCount) {
        orderColors = serialInfo.containsWord
            ? [colorNames.RED, colorNames.GREEN, colorNames.BLUE, colorNames.YELLOW]
            : [colorNames.BLUE, colorNames.GREEN, colorNames.RED, colorNames.YELLOW];
    } else if (serialInfo.numberCount > serialInfo.letterCount) {
        orderColors = serialInfo.sumDigits > 10
            ? [colorNames.YELLOW, colorNames.GREEN, colorNames.BLUE, colorNames.RED]
            : [colorNames.YELLOW, colorNames.RED, colorNames.BLUE, colorNames.GREEN];
    } else {
        if (fuseColor === colorNames.RED) {
            orderColors = [colorNames.GREEN, colorNames.BLUE, colorNames.RED, colorNames.YELLOW];
        } else if (fuseColor === colorNames.BLUE) {
            orderColors = [colorNames.RED, colorNames.BLUE, colorNames.GREEN, colorNames.YELLOW];
        } else if (fuseColor === colorNames.GREEN) {
            orderColors = [colorNames.BLUE, colorNames.YELLOW, colorNames.GREEN, colorNames.RED];
        } else {
            orderColors = [colorNames.GREEN, colorNames.YELLOW, colorNames.RED, colorNames.BLUE];
        }
    }

    var selectedLayout = getRandomColorLayout();
    applyButtonColors(selectedLayout);

    var pressOrder = [];
    for (var i = 0; i < orderColors.length; i++) {
        var color = orderColors[i];
        var position = buttonColors.indexOf(color);
        if (position === -1) { continue; }
        pressOrder.push(position);
    }

    correctButtonIdSequence = pressOrder;
    var orderLetters = [];
    for (var l = 0; l < orderColors.length; l++) {
        orderLetters.push(colorToLetter(orderColors[l]));
    }
    print("Color order: " + orderLetters.join("") + " | sequence: " + correctButtonIdSequence);
    currentPressIndex = 0;
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
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
            print("Color Order Module complete");
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
        print("Color Order Module incorrect input, reset");
        script.modulePenalty();
    }
}

script.animationFinished = function() {
};

script.moduleCompleted = function() {
    script.safeComponent.completeModule(script.slotId);
};

script.modulePenalty = function() {
    script.safeComponent.applyPenalty(script.slotId);
};
