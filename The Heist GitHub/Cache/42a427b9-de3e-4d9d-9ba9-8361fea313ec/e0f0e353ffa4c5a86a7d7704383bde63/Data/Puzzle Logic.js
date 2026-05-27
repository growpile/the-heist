// @input Component.ScriptComponent[] wireButtons
/** @type {ScriptComponent[]} */
var wireButtons = script.wireButtons;
// @input Component.Text ruleText
/** @type {Text} */
var ruleText = script.ruleText;

// ---------------------------------------------------------------------
// Puzzle state
// ---------------------------------------------------------------------

var colors = ["red", "green", "blue"];
/** @type {string[]} */
var wireColors = [];          // color name per wire index
/** @type {boolean[]} */
var solution = [];            // true = this wire must be cut
var activeWiresCount = 0;
var totalToCut = 0;
var cutCount = 0;
var puzzleActive = false;

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
    // default blue
    return new vec4(0, 0, 1, 1);
}

// indices are 0-based, but text is 1-based
function formatWireList(indices) {
    var copy = indices.slice(0);
    copy.sort(function(a, b) { return a - b; });

    if (copy.length === 1) {
        return "wire " + (copy[0] + 1);
    }

    var i;
    var text = "wires ";
    for (i = 0; i < copy.length; i++) {
        var num = copy[i] + 1;
        if (i === 0) {
            text += num;
        } else if (i === copy.length - 1) {
            text += " and " + num;
        } else {
            text += ", " + num;
        }
    }
    return text;
}

// Build an optional color-based rule (always consistent with solution).
// Sometimes also adds a fake conditional rule that's always harmless.
function createColorBasedRule(cutIndices) {
    var candidates = [];
    var i, j;

    for (i = 0; i < colors.length; i++) {
        var colorName = colors[i];
        var hasColor = false;
        var allCut = true;
        var allNotCut = true;

        for (j = 0; j < activeWiresCount; j++) {
            if (wireColors[j] === colorName) {
                hasColor = true;
                if (solution[j]) {
                    allNotCut = false;
                } else {
                    allCut = false;
                }
            }
        }

        if (!hasColor) {
            continue;
        }

        if (allCut) {
            candidates.push("Cut all " + colorName + " wires.");
        } else if (allNotCut) {
            candidates.push("Do not cut any " + colorName + " wires.");
        }
    }

    // Optional “fake” conditional rule: its condition is false in this bomb,
    // so it never actually changes the logic, but looks Bombcorp-y.
    if (Math.random() < 0.5) {
        var fakeColor = colors[randomInt(0, colors.length - 1)];
        var countColor = 0;
        for (i = 0; i < activeWiresCount; i++) {
            if (wireColors[i] === fakeColor) {
                countColor++;
            }
        }
        // Condition is false in this puzzle => rule is vacuously true
        if (countColor !== 1) {
            candidates.push("If there is exactly one " + fakeColor + " wire, cut it.");
        }
    }

    if (candidates.length === 0) {
        return null;
    }

    shuffleArray(candidates);
    return candidates[0];
}

// Build the text for A–D based on the chosen solution
function buildRulesText(cutIndices) {
    var lines = [];

    // Core rules – these two alone define a unique solution:
    // 1) how many wires are cut, 2) exactly which ones.
    lines.push("Exactly " + totalToCut + " wires must be cut.");
    lines.push("Cut " + formatWireList(cutIndices) + ".");

    // Extra rule: mention some wires that must NOT be cut
    var nonCutIndices = [];
    var i;
    for (i = 0; i < activeWiresCount; i++) {
        if (!solution[i]) {
            nonCutIndices.push(i);
        }
    }

    if (nonCutIndices.length > 0 && lines.length < 4) {
        shuffleArray(nonCutIndices);
        var subsetSize = nonCutIndices.length > 2 ? 2 : nonCutIndices.length;
        var subset = nonCutIndices.slice(0, subsetSize);
        var dontText = "Do not cut " + formatWireList(subset) + ".";
        lines.push(dontText);
    }

    // Another extra rule: color-based or conditional, if we have room
    if (lines.length < 4) {
        var colorRule = createColorBasedRule(cutIndices);
        if (colorRule) {
            lines.push(colorRule);
        }
    }

    // Fill remaining slots with dummy text so we always have A–D
    while (lines.length < 4) {
        lines.push("This rule intentionally left blank.");
    }

    var labels = ["A", "B", "C", "D"];
    var text = "";
    for (i = 0; i < 4; i++) {
        text += labels[i] + ": " + lines[i];
        if (i < 3) {
            text += "\n\n";
        }
    }
    return text;
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
    wireColors = [];
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
            wireColors[i] = colorName;

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

    // Choose how many wires must be cut (at least 1, not all)
    totalToCut = 0;
    while (totalToCut === 0 || totalToCut === activeWiresCount) {
        totalToCut = randomInt(1, activeWiresCount - 1);
    }

    // Choose which exact wires must be cut
    var indices = [];
    for (i = 0; i < activeWiresCount; i++) {
        indices.push(i);
    }
    shuffleArray(indices);

    var cutIndices = [];
    for (i = 0; i < totalToCut; i++) {
        var idx = indices[i];
        solution[idx] = true;
        cutIndices.push(idx);
    }

    print("Solution wires (1-based): " + formatWireList(cutIndices));

    // Generate and show the rules
    ruleText.text = buildRulesText(cutIndices);
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
