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

var colorNames = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow"
};

function setupButtonColors() {
    var materials = [redMaterial, greenMaterial, blueMaterial, yellowMaterial].filter(function(material) {
        return material != null;
    });
    if (materials.length === 0) { return; }

    // Shuffle materials so each button gets a unique random color.
    for (var m = materials.length - 1; m > 0; m--) {
        var swapIndex = global.utils && global.utils.rng ? global.utils.rng(0, m) : Math.floor(Math.random() * (m + 1));
        var temp = materials[m];
        materials[m] = materials[swapIndex];
        materials[swapIndex] = temp.clone();
    }

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
        var materialIndex = i % materials.length;
        var assignedMaterial = materials[materialIndex];
        visual.mainMaterial = assignedMaterial;
        if (assignedMaterial === redMaterial) { buttonColors[i] = colorNames.RED; }
        else if (assignedMaterial === greenMaterial) { buttonColors[i] = colorNames.GREEN; }
        else if (assignedMaterial === blueMaterial) { buttonColors[i] = colorNames.BLUE; }
        else if (assignedMaterial === yellowMaterial) { buttonColors[i] = colorNames.YELLOW; }
    }
}

script.setupModule = function(safeContext) {
    print("setting up...")
    setupButtonColors();

    var serialString = safeContext.serialNumber || "";
    var modulesList = safeContext.moduleIds || [];
    var containsWord = /SAFE|BOMB|CAT|GOLD|BOOM|TICK|LENS/.test(serialString);
    var numberCount = (serialString.match(/\d/g) || []).length;
    var hasCasinoCarousel = global.utils.arrayContains(modulesList, "casinoCarousel");

    // Determine index mapping for each physical position (top->bottom, left->right).
    var indexOrder;
    if (containsWord && !hasCasinoCarousel) {
        indexOrder = [0, 2, 1, 3];
    } else if (numberCount > 3) {
        indexOrder = [3, 2, 1, 0];
    } else if (hasCasinoCarousel) {
        indexOrder = [2, 1, 0, 3];
    } else {
        indexOrder = [0, 1, 2, 3];
    }

    // Build press order: array of button positions in the order to press (0..3).
    var pressOrder = [];
    for (var position = 0; position < indexOrder.length; position++) {
        var buttonIndex = indexOrder[position];
        var color = buttonColors[position];
        if (!color) { continue; }

        var pressPosition = null;
        if (buttonIndex === 0) {
            if (color === colorNames.RED) { pressPosition = 2; }
            else if (color === colorNames.GREEN) { pressPosition = 4; }
            else if (color === colorNames.BLUE) { pressPosition = 3; }
            else if (color === colorNames.YELLOW) { pressPosition = 1; }
        } else if (buttonIndex === 1) {
            if (color === colorNames.BLUE) { pressPosition = 4; }
            else if (color === colorNames.RED) { pressPosition = 3; }
            else if (color === colorNames.YELLOW) { pressPosition = 2; }
            else if (color === colorNames.GREEN) { pressPosition = 1; }
        } else if (buttonIndex === 2) {
            if (color === colorNames.YELLOW) { pressPosition = 3; }
            else if (color === colorNames.BLUE) { pressPosition = 1; }
            else if (color === colorNames.GREEN) { pressPosition = 2; }
            else if (color === colorNames.RED) { pressPosition = 4; }
        } else if (buttonIndex === 3) {
            if (color === colorNames.GREEN) { pressPosition = 3; }
            else if (color === colorNames.YELLOW) { pressPosition = 4; }
            else if (color === colorNames.RED) { pressPosition = 1; }
            else if (color === colorNames.BLUE) { pressPosition = 2; }
        }

        if (pressPosition != null) {
            pressOrder[pressPosition - 1] = position;
        }
    }

    correctButtonIdSequence = pressOrder;
    script.isModuleReady = true;
};

script.buttonPress = function(id) {
    if(!script.isModuleReady) return;
    print("Pressed: " + id);
}
