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

const Parity = Object.freeze({
    Odd: "odd",
    Even: "even"
});

const Colors = Object.freeze({
    Red: {color: new vec4(1, 0, 0, 1), name: "red"},
    Green: {color: new vec4(0, 1, 0, 1), name: "green"},
    Blue: {color: new vec4(0, 0, 1, 1), name: "blue"},
    Yellow: {color: new vec4(1, 1, 0, 1), name: "yellow"}
});

const ReadDirection = Object.freeze({
    LeftToRight: 1,
    RightToLeft: -1
});

const Modifiers = Object.freeze({
    None: "none",
    CutRightToLeft: "cut-right-to-left",
    NextRuleIsLie: "next-rule-is-lie",
    PreviousRuleIsLie: "previous-rule-is-lie",
    DoNotCutAdjacent: "do-not-cut-adjacent",
    SwapColors: "swap-colors",
    DoNotCutColor: "do-not-cut-color"
});

const InstructionType = Object.freeze({
    Permissive: "cut",
    Prohibitive: "keep",
});

// active puzzle data
let solveDirection = ReadDirection.LeftToRight;
let activeWiresCount = 0;
let wires = [];
let instructions = [];
let wireColorCounts = {red: 0, green: 0, blue: 0, yellow: 0};
let solution = [];
let cutCount = 0;
let totalToCut = 0;
let keepLocks = [];
let wireColorsInOrder = [];
let colorAlias = { red: "red", green: "green", blue: "blue", yellow: "yellow" };
let plannedCutColors = {};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function knuthShuffle(array) {
  let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function sample(array) {
    if (!array || array.length === 0) {
        return null;
    }
    return array[randomInt(0, array.length - 1)];
}

function getParity() {
    return (activeWiresCount % 2 === 0) ? Parity.Even : Parity.Odd;
}

function getIndividualParityArray(direction) {
    var parityArray = [];
    for (var i = 0; i < activeWiresCount; i++) {
        var isEven = (i + 1) % 2 === 0;
        if (direction === ReadDirection.LeftToRight) {
            parityArray[i] = isEven ? Parity.Even : Parity.Odd;
        } else {
            parityArray[activeWiresCount - 1 - i] = isEven ? Parity.Even : Parity.Odd;
        }
    }
    return parityArray;
}

function makeInstruction(opts) {
    var size = opts.size || activeWiresCount;
    var affected = new Array(size);
    for (var i = 0; i < size; i++) {
        affected[i] = !!opts.indexes && !!opts.indexes[i];
    }
    return {
        type: opts.type || InstructionType.Permissive,
        modifier: opts.modifier || Modifiers.None,
        affectedIndexes: affected,
        instructionMessage: opts.message || "",
        lockKeep: !!opts.lockKeep,
        meta: opts.meta || {}
    };
}

function invertInstruction(instruction) {
    var inverted = makeInstruction({
        type: instruction.type === InstructionType.Permissive ? InstructionType.Prohibitive : InstructionType.Permissive,
        modifier: instruction.modifier,
        message: instruction.instructionMessage + " (inverted lie)",
        indexes: instruction.affectedIndexes,
        size: instruction.affectedIndexes.length,
        lockKeep: instruction.lockKeep,
        meta: instruction.meta
    });
    return inverted;
}

function buildRuleContext() {
    return {
        wires: wires.slice(),
        wireColors: Object.assign({}, wireColorCounts),
        wireColorsInOrder: wireColorsInOrder.slice(),
        activeWiresCount: activeWiresCount,
        parityArray: getIndividualParityArray(solveDirection),
        serial: "", // placeholder for future data
        playerNames: [], // placeholder
        hoursToMidnight: randomInt(0, 23) // placeholder random
    };
}

function mapColor(colorName) {
    return colorAlias[colorName] || colorName;
}

function swapColors(colorA, colorB) {
    var nextAlias = Object.assign({}, colorAlias);
    for (var key in nextAlias) {
        if (nextAlias[key] === colorA) {
            nextAlias[key] = colorB;
        } else if (nextAlias[key] === colorB) {
            nextAlias[key] = colorA;
        }
    }
    colorAlias = nextAlias;
}

function isIndexParity(index, parity) {
    var position = (solveDirection === ReadDirection.LeftToRight)
        ? index + 1
        : (activeWiresCount - index);
    var even = position % 2 === 0;
    return parity === Parity.Even ? even : !even;
}

function collectIndexesByColor(colorName) {
    var resolved = mapColor(colorName);
    var indexes = [];
    for (var i = 0; i < wires.length; i++) {
        indexes[i] = wires[i].color === resolved;
    }
    return indexes;
}

function collectIndexesByParity(parity) {
    var indexes = [];
    for (var i = 0; i < wires.length; i++) {
        indexes[i] = isIndexParity(i, parity);
    }
    return indexes;
}

function collectIndexesByColorAndParity(colorName, parity) {
    var indexes = [];
    for (var i = 0; i < wires.length; i++) {
        indexes[i] = wires[i].color === mapColor(colorName) && isIndexParity(i, parity);
    }
    return indexes;
}

function positionToIndex(position) {
    if (position < 1 || position > activeWiresCount) {
        return -1;
    }
    if (solveDirection === ReadDirection.LeftToRight) {
        return position - 1;
    }
    return activeWiresCount - position;
}

function maskFirstN(mask, count) {
    var chosen = new Array(mask.length);
    for (var i = 0; i < chosen.length; i++) {
        chosen[i] = false;
    }
    var order = [];
    for (var j = 0; j < mask.length; j++) {
        order.push(positionToIndex(j + 1));
    }
    var picked = 0;
    for (var k = 0; k < order.length && picked < count; k++) {
        var idx = order[k];
        if (mask[idx]) {
            chosen[idx] = true;
            picked++;
        }
    }
    return chosen;
}

function applyInstruction(instruction) {
    var targetCut = instruction.type === InstructionType.Permissive;
    var affected = instruction.affectedIndexes || [];
    for (var i = 0; i < affected.length; i++) {
        if (!affected[i]) {
            continue;
        }
        if (keepLocks[i] && targetCut) {
            continue;
        }
        solution[i] = targetCut;
        if (instruction.lockKeep && !targetCut) {
            keepLocks[i] = true;
        }
    }
}

function finalizeSolution() {
    totalToCut = 0;
    for (var i = 0; i < solution.length; i++) {
        if (solution[i]) {
            totalToCut++;
        }
    }
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
    createWires(function() {
        createRules();
        puzzleActive = true;
    });
}

function setupWire(i) {
    var buttonSO = wireButtons[i].getSceneObject();

    if (i < activeWiresCount) {
        buttonSO.enabled = true;
        wireButtons[i].enabled = true;
        if (wireButtons[i].initialize) wireButtons[i].initialize();

        // pick a random color from the Colors enum
        var colorData = Object.values(Colors)[randomInt(0, Object.values(Colors).length - 1)];
        var isEven = (i + 1) % 2 === 0;
        wireColorCounts[colorData.name]++;
        wireColorsInOrder[i] = colorData.name;
        wires[i] = { color: colorData.name, colorVec: colorData.color, isEven: isEven };

        var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
        textComponent.text = "Wire " + (i + 1);
        textComponent.textFill.color = colorData.color;

        print("Wire " + (i + 1) + " is active. Color: " + colorData.name);
    } else {
        buttonSO.enabled = false;
        wireButtons[i].enabled = false;
        wireColors[i] = null;
    }
}

function createWires(onSuccess) {
    print("Generating new puzzle...");

    var i;
    activeWiresCount = randomInt(3, Math.min(5, wireButtons.length));
    wireColorCounts = { red: 0, green: 0, blue: 0, yellow: 0 };
    wireColorsInOrder = [];
    wires = [];
    solution = [];
    keepLocks = [];
    cutCount = 0;
    totalToCut = 0;
    solveDirection = ReadDirection.LeftToRight;

    // setup each wire button
    for (i = 0; i < wireButtons.length; i++) {
        setupWire(i);
    }

    if (onSuccess) onSuccess();
};

function createRules() {
    instructions = [];

}



    // STANDARD RULES
    // Cut all COLOR wires
    // Cut all odd/even wires
    // Do not cut any COLOR wires
    // Do not cut the first/last wire.
    // Do not cut any odd/even wires.
    // Cut N COLOR wires
    // Cut N odd/even wires.
    // Cut the Nth and Mth wires.
    // Cut any wire that is odd/even and COLOR.


    // UNIQUE, these are more complex standalone rules. (can't apply IFS or MODIFIERS here). 
    // Cut the Nth wire, if the N+Mth wire is COLOR, otherwise cut the N+Gth wire if the wire before it is COLOR.
    // If the serial number spells a reversed word, cut all even/odd COLOR wires, otherwise cut all odd/even COLOR wires.
    // Cut the Nth wire if there is a digit in one of the user's names.
    // Cut the Nth wire if there are more/less than N hours to midnight/noon.
    // If any rules specify cutting COLOR wires, also cut all odd/even COLOR wires.
    // If you had to cut an odd/even COLOR wire, also cut the wire after that wire.

    // IFS, these can randomly appear after standard rules with a comma.
    // if there are more COLOR1 wires than COLOR2 wires.
    // if there are more odd/even wires than even/odd wires.
    // if the first/last wire is COLOR.
    // if the first wire is COLOR/parity and the last wire is COLOR/parity.
    // if the number of wires is odd/even.
    // if the bomb's serial number contains a vowel/consonant/digit.
    // if the second-to-last wire is COLOR/parity.
    // if the Nth wire is COLOR/parity.

    // MODIFIERS, these can randomly appear after the initial rule, as a sentence. (only 2 of these can appear per round)
    // Always count wires right to left. This rule disregards order priority. (only once)
    // The next/previous rule is a lie. (only once)
    // Do not cut any wires adjacent to COLOR/odd/even wires. (only once)
    // Other rules colors are swapped. When they say COLOR1, they mean COLOR2. (only once)
    // Do not cut COLOR wires even if another rule says to, disregard order priority. (only once)

// Rules for the rules:
// Rules are applied in order, with later rules overriding earlier ones where applicable, unless noted otherwise.
// If a rule cannot be fully applied, it is partially applied where possible.
// If no wires need to be cut, press the big red button to defuse the bomb.
// If a rule is failed... you blow up in pieces and your mom gets mad at you.

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
