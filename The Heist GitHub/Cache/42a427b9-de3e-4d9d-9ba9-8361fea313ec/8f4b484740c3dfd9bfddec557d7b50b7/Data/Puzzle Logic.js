// @input Component.ScriptComponent[] wireButtons
/** @type {ScriptComponent[]} */
var wireButtons = script.wireButtons;
// @input Component.Text ruleText
/** @type {Text} */
var ruleText = script.ruleText;

// ---------------------------------------------------------------------
// Puzzle state
// ---------------------------------------------------------------------

let puzzleActive = false;
let colors = ["red", "green", "blue", "yellow"];

// active puzzle data
let wireColors = {
    red: 0,
    green: 0,
    blue: 0,
    yellow: 0
};
let activeWiresCount = 0;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    var i, j, temp;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getColorVec(colorName) {
    if (colorName === "red") {
        return new vec4(1, 0, 0, 1);
    }
    if (colorName === "green") {
        return new vec4(0, 1, 0, 1);
    }
    if (colorName === "yellow") {
        return new vec4(1, 1, 0, 1);
    }
    // default blue
    return new vec4(0, 0, 1, 1);
}

// ---------------------------------------------------------------------
// Win / fail handlers
// ---------------------------------------------------------------------

function handleFailure(reason) {
    print("Puzzle failed: " + reason);
    ruleText.text = ruleText.text + "\n\nFAIL: " + reason;

    for (var i = 0; i < wireButtons.length; i++) {
        wireButtons[i].enabled = false;
    }
    puzzleActive = false;
}

function handleSuccess() {
    print("Puzzle solved!");
    ruleText.text = ruleText.text + "\n\nSUCCESS: Correct wires cut.";

    for (var i = 0; i < wireButtons.length; i++) {
        wireButtons[i].enabled = false;
    }
    puzzleActive = false;
}

// ---------------------------------------------------------------------
// Wire cutting logic
// ---------------------------------------------------------------------

function attemptWireCut(wireId) {
    if (!puzzleActive) {
        print("No active puzzle, ignoring cut.");
        return;
    }
    if (wireId < 0 || wireId >= activeWiresCount) {
        print("Wire " + (wireId + 1) + " is not part of this puzzle.");
        return;
    }
    // Already cut? Ignore.
    if (!wireButtons[wireId].enabled) {
        return;
    }

    print("Attempting to cut wire " + (wireId + 1));

    // Wrong wire => immediate failure
    if (!solution[wireId]) {
        handleFailure("You cut wire " + (wireId + 1) + ", which should not be cut.");
        return;
    }

    // Visually cut the wire
    wireButtons[wireId].enabled = false;

    var buttonSO = wireButtons[wireId].getSceneObject();
    var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
    textComponent.text = "Cut " + (wireId + 1);
    textComponent.textFill.color = new vec4(1, 1, 1, 1); // white = cut

    cutCount++;

    // Because we fail on the first wrong cut, reaching totalToCut here
    // means we've cut exactly the required set.
    if (cutCount >= totalToCut) {
        handleSuccess();
    }
}

// ---------------------------------------------------------------------
// Puzzle generation
// ---------------------------------------------------------------------

script.generatePuzzle = function() {
    print("Generating new puzzle...");

    var i;
    activeWiresCount = randomInt(3, Math.min(5, wireButtons.length));
    wireColors = {
        red: 0,
        green: 0,
        blue: 0,
        yellow: 0
    };
    solution = [];
    cutCount = 0;
    puzzleActive = true;

    // Setup each wire button
    for (i = 0; i < wireButtons.length; i++) {
        var buttonSO = wireButtons[i].getSceneObject();

        if (i < activeWiresCount) {
            buttonSO.enabled = true;
            wireButtons[i].enabled = true;
            if (wireButtons[i].initialize) {
                wireButtons[i].initialize();
            }

            var colorName = colors[randomInt(0, colors.length - 1)];
            wireColors[colorName]++;

            var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
            textComponent.text = "Wire " + (i + 1);
            textComponent.textFill.color = getColorVec(colorName);

            print("Wire " + (i + 1) + " is active. Color: " + colorName);
        } else {
            buttonSO.enabled = false;
            wireButtons[i].enabled = false;
            wireColors[i] = null;
        }

        solution[i] = false; // reset
    }
    print(wireColors.red + " red, " + wireColors.green + " green, " + wireColors.blue + " blue, " + wireColors.yellow + " yellow.");
};

// ---------------------------------------------------------------------
// UI hooks (already wired)
// ---------------------------------------------------------------------

script.cutWire1 = function(value) {
    if (value) attemptWireCut(0);
};
script.cutWire2 = function(value) {
    if (value) attemptWireCut(1);
};
script.cutWire3 = function(value) {
    if (value) attemptWireCut(2);
};
script.cutWire4 = function(value) {
    if (value) attemptWireCut(3);
};
script.cutWire5 = function(value) {
    if (value) attemptWireCut(4);
};
