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
var correctButtonIdSequence = [];
var currentPressIndex = 0;

var colorNames = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow"
};

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
        visual.mainMaterial = material.clone();
        buttonColors[i] = color;
    }
}

function getPressPosition(index, color) {
    if (index === 0) {
        if (color === colorNames.RED) { return 2; }
        if (color === colorNames.GREEN) { return 4; }
        if (color === colorNames.BLUE) { return 3; }
        if (color === colorNames.YELLOW) { return 1; }
    } else if (index === 1) {
        if (color === colorNames.BLUE) { return 4; }
        if (color === colorNames.RED) { return 3; }
        if (color === colorNames.YELLOW) { return 2; }
        if (color === colorNames.GREEN) { return 1; }
    } else if (index === 2) {
        if (color === colorNames.YELLOW) { return 3; }
        if (color === colorNames.BLUE) { return 1; }
        if (color === colorNames.GREEN) { return 2; }
        if (color === colorNames.RED) { return 4; }
    } else if (index === 3) {
        if (color === colorNames.GREEN) { return 3; }
        if (color === colorNames.YELLOW) { return 4; }
        if (color === colorNames.RED) { return 1; }
        if (color === colorNames.BLUE) { return 2; }
    }
    return null;
}

function getValidLayouts(indexOrder) {
    var colors = [colorNames.RED, colorNames.GREEN, colorNames.BLUE, colorNames.YELLOW];
    var results = [];

    function permute(remaining, current) {
        if (remaining.length === 0) {
            var usedPressPositions = {};
            for (var pos = 0; pos < current.length; pos++) {
                var index = indexOrder[pos];
                var pressPos = getPressPosition(index, current[pos]);
                if (pressPos == null || usedPressPositions[pressPos]) {
                    return;
                }
                usedPressPositions[pressPos] = true;
            }
            results.push(current.slice(0));
            return;
        }
        for (var i = 0; i < remaining.length; i++) {
            current.push(remaining[i]);
            var nextRemaining = remaining.slice(0);
            nextRemaining.splice(i, 1);
            permute(nextRemaining, current);
            current.pop();
        }
    }

    permute(colors, []);
    return results;
}

script.setupModule = function(safeContext, safeComponent, slotId) {
    print("setting up...")
    var modulesList = safeContext.modulesList || safeContext.moduleIds || [];

    // Determine index mapping for each physical position (top->bottom, left->right).
    var indexOrder;
    if (safeContext.serialNumber && safeContext.serialNumber.containsWord &&
        global.utils.arrayContains(modulesList, "casinoCarousel")) {
        indexOrder = [0, 2, 1, 3];
    } else if (safeContext.serialNumber && safeContext.serialNumber.numbers > 3) {
        indexOrder = [3, 2, 1, 0];
    } else if (global.utils.arrayContains(modulesList, "casinoCarousel")) {
        indexOrder = [2, 1, 0, 3];
    } else {
        indexOrder = [0, 1, 2, 3];
    }

    var validLayouts = getValidLayouts(indexOrder);
    var layoutIndex = 0;
    if (validLayouts.length > 0) {
        layoutIndex = global.utils && global.utils.rng
            ? global.utils.rng(0, validLayouts.length - 1)
            : Math.floor(Math.random() * validLayouts.length);
    }
    var selectedLayout = validLayouts[layoutIndex];
    if (selectedLayout) {
        applyButtonColors(selectedLayout);
    }

    // Build press order: array of button positions in the order to press (0..3).
    var pressOrder = [];
    for (var position = 0; position < indexOrder.length; position++) {
        var buttonIndex = indexOrder[position];
        var color = buttonColors[position];
        if (!color) { continue; }

        var pressPosition = getPressPosition(buttonIndex, color);

        if (pressPosition != null) {
            pressOrder[pressPosition - 1] = position;
        }
    }

    correctButtonIdSequence = pressOrder;
    print(correctButtonIdSequence);
    currentPressIndex = 0;
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;
    if (correctButtonIdSequence.length === 0) { return; }

    var expectedId = correctButtonIdSequence[currentPressIndex];
    if (id === expectedId) {
        currentPressIndex++;
        if (currentPressIndex >= correctButtonIdSequence.length) {
            script.isModuleReady = false;
            print("Color Order Module complete");
        }
    } else {
        currentPressIndex = 0;
        print("Color Order Module incorrect input, reset");
    }
}
