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
let currentRuleEntries = [];
let ignoredRuleIndexes = {};
let modifierRunHistory = {};
let recompileRequested = false;

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
    for (var i = 0; i < activeWiresCount; i++) {
        indexes[i] = wires[i] && wires[i].color === resolved;
    }
    return indexes;
}

function collectIndexesByParity(parity) {
    var indexes = [];
    for (var i = 0; i < activeWiresCount; i++) {
        indexes[i] = isIndexParity(i, parity);
    }
    return indexes;
}

function collectIndexesByColorAndParity(colorName, parity) {
    var indexes = [];
    for (var i = 0; i < activeWiresCount; i++) {
        indexes[i] = wires[i] && wires[i].color === mapColor(colorName) && isIndexParity(i, parity);
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

function resetSolutionState() {
    solution = new Array(activeWiresCount);
    keepLocks = new Array(activeWiresCount);
    for (var i = 0; i < activeWiresCount; i++) {
        solution[i] = false;
        keepLocks[i] = false;
    }
    plannedCutColors = {};
    cutCount = 0;
    totalToCut = 0;
}

function resetRuleMetaState() {
    ignoredRuleIndexes = {};
    modifierRunHistory = {};
    recompileRequested = false;
    solveDirection = ReadDirection.LeftToRight;
    colorAlias = { red: "red", green: "green", blue: "blue", yellow: "yellow" };
}

function rulesRecompile() {
    recompileRequested = true;
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
        wires[i] = null;
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
    resetRuleMetaState();
    resetSolutionState();

    var colorList = ["red", "green", "blue", "yellow"];
    var maxRuleCount = 4;
    var maxModifiers = 2;

    function makeStandardRules() {
        return [
            function() {
                var color = sample(colorList);
                return {
                    id: "cut-all-color",
                    description: "Cut all " + color + " wires",
                    createInstruction: function() {
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: collectIndexesByColor(color),
                            message: "Cut all " + color + " wires",
                            size: activeWiresCount,
                            meta: { color: color }
                        });
                    }
                };
            },
            function() {
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "cut-parity",
                    description: "Cut all " + parity + " wires",
                    createInstruction: function() {
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: collectIndexesByParity(parity),
                            message: "Cut all " + parity + " wires",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var color = sample(colorList);
                return {
                    id: "keep-color",
                    description: "Do not cut any " + color + " wires",
                    createInstruction: function() {
                        return makeInstruction({
                            type: InstructionType.Prohibitive,
                            indexes: collectIndexesByColor(color),
                            message: "Do not cut " + color + " wires",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var target = randomInt(0, 1) === 0 ? "first" : "last";
                return {
                    id: "keep-edge",
                    description: "Do not cut the " + target + " wire",
                    createInstruction: function() {
                        var indexes = new Array(activeWiresCount);
                        for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                        var pos = target === "first" ? 1 : activeWiresCount;
                        var idx = positionToIndex(pos);
                        if (idx >= 0) indexes[idx] = true;
                        return makeInstruction({
                            type: InstructionType.Prohibitive,
                            indexes: indexes,
                            message: "Do not cut the " + target + " wire",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "keep-parity",
                    description: "Do not cut any " + parity + " wires",
                    createInstruction: function() {
                        return makeInstruction({
                            type: InstructionType.Prohibitive,
                            indexes: collectIndexesByParity(parity),
                            message: "Do not cut any " + parity + " wires",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var color = sample(colorList);
                var maxCount = Math.max(1, wireColorCounts[mapColor(color)]);
                var n = randomInt(1, Math.max(1, maxCount));
                return {
                    id: "cut-n-color",
                    description: "Cut " + n + " " + color + " wire(s)",
                    createInstruction: function() {
                        var mask = collectIndexesByColor(color);
                        var chosen = maskFirstN(mask, n);
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: chosen,
                            message: "Cut " + n + " " + color + " wire(s)",
                            size: activeWiresCount,
                            meta: { color: color }
                        });
                    }
                };
            },
            function() {
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                var countParity = parity === Parity.Even ? Math.floor(activeWiresCount / 2) : Math.ceil(activeWiresCount / 2);
                var n = randomInt(1, Math.max(1, countParity));
                return {
                    id: "cut-n-parity",
                    description: "Cut " + n + " " + parity + " wire(s)",
                    createInstruction: function() {
                        var mask = collectIndexesByParity(parity);
                        var chosen = maskFirstN(mask, n);
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: chosen,
                            message: "Cut " + n + " " + parity + " wire(s)",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var firstPos = randomInt(1, activeWiresCount);
                var secondPos = randomInt(1, activeWiresCount);
                return {
                    id: "cut-two-positions",
                    description: "Cut the " + firstPos + "th and " + secondPos + "th wires",
                    createInstruction: function() {
                        var indexes = new Array(activeWiresCount);
                        for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                        var idxA = positionToIndex(firstPos);
                        var idxB = positionToIndex(secondPos);
                        if (idxA >= 0) indexes[idxA] = true;
                        if (idxB >= 0) indexes[idxB] = true;
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: indexes,
                            message: "Cut the " + firstPos + "th and " + secondPos + "th wires",
                            size: activeWiresCount
                        });
                    }
                };
            },
            function() {
                var color = sample(colorList);
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "cut-color-parity",
                    description: "Cut any wire that is " + parity + " and " + color,
                    createInstruction: function() {
                        return makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: collectIndexesByColorAndParity(color, parity),
                            message: "Cut " + parity + " " + color + " wires",
                            size: activeWiresCount,
                            meta: { color: color }
                        });
                    }
                };
            }
        ];
    }

    function makeUniqueRules() {
        return [
            function() {
                var n = randomInt(1, activeWiresCount);
                var m = randomInt(1, activeWiresCount);
                var g = randomInt(1, activeWiresCount);
                var color = sample(colorList);
                return {
                    id: "unique-conditional-chain",
                    description: "Cut the " + n + "th wire, if the " + (n + m) + "th wire is " + color + ", otherwise cut the " + (n + g) + "th wire if the wire before it is " + color + ".",
                    applyUnique: function() {
                        var idxN = positionToIndex(n);
                        var idxM = positionToIndex(n + m);
                        var idxG = positionToIndex(n + g);
                        var indexes = new Array(activeWiresCount);
                        for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                        if (idxM >= 0 && wires[idxM] && wires[idxM].color === mapColor(color)) {
                            if (idxN >= 0) indexes[idxN] = true;
                        } else if (idxG > 0 && wires[idxG - 1] && wires[idxG - 1].color === mapColor(color)) {
                            if (idxG >= 0) indexes[idxG] = true;
                        }
                        var instr = makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: indexes,
                            message: "Standalone: conditional chain cut",
                            size: activeWiresCount
                        });
                        applyInstruction(instr);
                        return "Standalone rule applied.";
                    }
                };
            },
            function() {
                var color = sample(colorList);
                var primaryParity = randomInt(0, 1) === 0 ? Parity.Even : Parity.Odd;
                var secondaryParity = primaryParity === Parity.Even ? Parity.Odd : Parity.Even;
                return {
                    id: "unique-serial-reversed",
                    description: "If the serial number spells a reversed word, cut all " + primaryParity + " " + color + " wires, otherwise cut all " + secondaryParity + " " + color + " wires.",
                    applyUnique: function() {
                        var serial = buildRuleContext().serial;
                        var reversed = serial === serial.split("").reverse().join("");
                        var parityToUse = reversed ? primaryParity : secondaryParity;
                        var instr = makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: collectIndexesByColorAndParity(color, parityToUse),
                            message: "Standalone serial check",
                            size: activeWiresCount
                        });
                        applyInstruction(instr);
                        return "Standalone serial rule.";
                    }
                };
            },
            function() {
                var n = randomInt(1, activeWiresCount);
                return {
                    id: "unique-digit-in-name",
                    description: "Cut the " + n + "th wire if there is a digit in one of the user's names.",
                    applyUnique: function() {
                        var hasDigit = randomInt(0, 1) === 1;
                        if (hasDigit) {
                            var idx = positionToIndex(n);
                            if (idx >= 0) {
                                var mask = new Array(activeWiresCount);
                                for (var i = 0; i < activeWiresCount; i++) mask[i] = false;
                                mask[idx] = true;
                                applyInstruction(makeInstruction({
                                    type: InstructionType.Permissive,
                                    indexes: mask,
                                    message: "Standalone digit-in-name",
                                    size: activeWiresCount
                                }));
                            }
                            return "Standalone digit condition met.";
                        }
                        return "Standalone digit condition not met.";
                    }
                };
            },
            function() {
                var n = randomInt(1, activeWiresCount);
                var moreThan = randomInt(0, 1) === 0;
                return {
                    id: "unique-hours",
                    description: "Cut the " + n + "th wire if there are " + (moreThan ? "more" : "less") + " than " + n + " hours to midnight/noon.",
                    applyUnique: function() {
                        var ctx = buildRuleContext();
                        var condition = moreThan ? ctx.hoursToMidnight > n : ctx.hoursToMidnight < n;
                        if (condition) {
                            var idx = positionToIndex(n);
                            if (idx >= 0) {
                                var mask = new Array(activeWiresCount);
                                for (var i = 0; i < activeWiresCount; i++) mask[i] = false;
                                mask[idx] = true;
                                applyInstruction(makeInstruction({
                                    type: InstructionType.Permissive,
                                    indexes: mask,
                                    message: "Standalone hours rule",
                                    size: activeWiresCount
                                }));
                            }
                            return "Standalone hours condition met.";
                        }
                        return "Standalone hours condition not met.";
                    }
                };
            },
            function() {
                var color = sample(colorList);
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "unique-also-cut-parity",
                    description: "If any rules specify cutting " + color + " wires, also cut all " + parity + " " + color + " wires.",
                    applyUnique: function() {
                        if (plannedCutColors[color]) {
                            applyInstruction(makeInstruction({
                                type: InstructionType.Permissive,
                                indexes: collectIndexesByColorAndParity(color, parity),
                                message: "Standalone also cut parity color",
                                size: activeWiresCount,
                                meta: { color: color }
                            }));
                            return "Standalone extra cuts applied.";
                        }
                        return "Standalone extra cuts not triggered.";
                    }
                };
            },
            function() {
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                var color = sample(colorList);
                return {
                    id: "unique-cut-following",
                    description: "If you had to cut an " + parity + " " + color + " wire, also cut the wire after that wire.",
                    applyUnique: function() {
                        for (var i = 0; i < solution.length; i++) {
                            var matches = solution[i] && isIndexParity(i, parity) && wires[i].color === mapColor(color);
                            if (matches) {
                                var nextIdx = i + 1;
                                if (nextIdx < solution.length) {
                                    var mask = new Array(activeWiresCount);
                                    for (var j = 0; j < activeWiresCount; j++) mask[j] = false;
                                    mask[nextIdx] = true;
                                    applyInstruction(makeInstruction({
                                        type: InstructionType.Permissive,
                                        indexes: mask,
                                        message: "Standalone cut following wire",
                                        size: activeWiresCount
                                    }));
                                }
                            }
                        }
                        return "Standalone follow-up processed.";
                    }
                };
            }
        ];
    }

    function makeIfFactories() {
        return [
            function() {
                var c1 = sample(colorList);
                var c2 = sample(colorList.filter(function(c) { return c !== c1; })) || c1;
                return {
                    id: "if-more-color",
                    text: "there are more " + c1 + " wires than " + c2 + " wires",
                    predicate: function(ctx) { return ctx.wireColors[mapColor(c1)] > ctx.wireColors[mapColor(c2)]; }
                };
            },
            function() {
                var parityMain = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                var parityOther = parityMain === Parity.Odd ? Parity.Even : Parity.Odd;
                return {
                    id: "if-more-parity",
                    text: "there are more " + parityMain + " wires than " + parityOther + " wires",
                    predicate: function(ctx) {
                        var countMain = 0;
                        var countOther = 0;
                        for (var i = 0; i < ctx.wireColorsInOrder.length; i++) {
                            var even = (i + 1) % 2 === 0;
                            var currentParity = even ? Parity.Even : Parity.Odd;
                            if (currentParity === parityMain) countMain++; else countOther++;
                        }
                        return countMain > countOther;
                    }
                };
            },
            function() {
                var pos = randomInt(0, 1) === 0 ? "first" : "last";
                var color = sample(colorList);
                return {
                    id: "if-edge-color",
                    text: "the " + pos + " wire is " + color,
                    predicate: function(ctx) {
                        var idx = pos === "first" ? 0 : ctx.wireColorsInOrder.length - 1;
                        return ctx.wireColorsInOrder[idx] === mapColor(color);
                    }
                };
            },
            function() {
                var first = sample(colorList);
                var last = sample(colorList);
                return {
                    id: "if-first-last",
                    text: "the first wire is " + first + " and the last wire is " + last,
                    predicate: function(ctx) {
                        if (ctx.wireColorsInOrder.length === 0) return false;
                        return ctx.wireColorsInOrder[0] === mapColor(first) && ctx.wireColorsInOrder[ctx.wireColorsInOrder.length - 1] === mapColor(last);
                    }
                };
            },
            function() {
                var parity = randomInt(0, 1) === 0 ? Parity.Even : Parity.Odd;
                return {
                    id: "if-count-parity",
                    text: "the number of wires is " + parity,
                    predicate: function(ctx) {
                        var even = ctx.activeWiresCount % 2 === 0;
                        return parity === Parity.Even ? even : !even;
                    }
                };
            },
            function() {
                var target = ["vowel", "consonant", "digit"][randomInt(0, 2)];
                return {
                    id: "if-serial-contains",
                    text: "the bomb's serial number contains a " + target,
                    predicate: function(ctx) {
                        var serial = ctx.serial || "";
                        if (target === "digit") return /\d/.test(serial);
                        if (target === "vowel") return /[aeiou]/i.test(serial);
                        return /[bcdfghjklmnpqrstvwxyz]/i.test(serial);
                    }
                };
            },
            function() {
                var color = sample(colorList);
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "if-second-last",
                    text: "the second-to-last wire is " + color + " or " + parity,
                    predicate: function(ctx) {
                        if (ctx.activeWiresCount < 2) return false;
                        var idx = ctx.activeWiresCount - 2;
                        return ctx.wireColorsInOrder[idx] === mapColor(color) || isIndexParity(idx, parity);
                    }
                };
            },
            function() {
                var n = randomInt(1, Math.max(1, activeWiresCount));
                var color = sample(colorList);
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return {
                    id: "if-nth-color-parity",
                    text: "the " + n + "th wire is " + color + " or " + parity,
                    predicate: function(ctx) {
                        var idx = positionToIndex(n);
                        if (idx < 0 || idx >= ctx.wireColorsInOrder.length) return false;
                        return ctx.wireColorsInOrder[idx] === mapColor(color) || isIndexParity(idx, parity);
                    }
                };
            }
        ];
    }

    function makeModifierFactories() {
        return [
            function() {
                return { id: Modifiers.CutRightToLeft, text: "Always count wires right to left.", data: {} };
            },
            function() {
                return { id: Modifiers.NextRuleIsLie, text: "The next rule is a lie.", data: {} };
            },
            function() {
                return { id: Modifiers.PreviousRuleIsLie, text: "The previous rule is a lie.", data: {} };
            },
            function() {
                var byColor = randomInt(0, 1) === 0;
                var color = sample(colorList);
                var parity = randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even;
                return { id: Modifiers.DoNotCutAdjacent, text: "Do not cut any wires adjacent to " + (byColor ? color : parity) + " wires.", data: { color: byColor ? color : null, parity: byColor ? null : parity } };
            },
            function() {
                var c1 = sample(colorList);
                var c2 = sample(colorList.filter(function(c) { return c !== c1; })) || c1;
                return { id: Modifiers.SwapColors, text: "Other rules colors are swapped. When they say " + c1 + ", they mean " + c2 + ".", data: { from: c1, to: c2 } };
            },
            function() {
                var color = sample(colorList);
                return { id: Modifiers.DoNotCutColor, text: "Do not cut " + color + " wires even if another rule says to.", data: { color: color } };
            }
        ];
    }

    function takeRuleFromFactories(factories, usedMap) {
        var attempts = 0;
        while (attempts < 10 && factories.length > 0) {
            var pickedFactory = sample(factories);
            var candidate = pickedFactory && pickedFactory();
            if (candidate && !usedMap[candidate.id]) {
                usedMap[candidate.id] = true;
                return candidate;
            }
            attempts++;
        }
        return null;
    }

    var standardFactories = makeStandardRules();
    var uniqueFactories = makeUniqueRules();
    var ifFactories = makeIfFactories();
    var modifierFactories = makeModifierFactories();

    var ruleEntries = [];
    var usedRuleIds = {};
    var includeUnique = randomInt(0, 1) === 1;

    if (includeUnique) {
        var uniqueRule = takeRuleFromFactories(uniqueFactories, usedRuleIds);
        if (uniqueRule) {
            ruleEntries.push({ rule: uniqueRule, isUnique: true });
        }
    }

    while (ruleEntries.length < maxRuleCount) {
        var standardRule = takeRuleFromFactories(standardFactories, usedRuleIds);
        if (!standardRule) {
            break;
        }
        ruleEntries.push({ rule: standardRule, isUnique: false });
    }

    knuthShuffle(ruleEntries);

    var usedIfs = {};
    var usedModifiers = {};
    var assignedMods = 0;

    for (var r = 0; r < ruleEntries.length; r++) {
        var entry = ruleEntries[r];
        if (entry.isUnique) {
            continue;
        }
        if (randomInt(0, 1) === 1) {
            var cond = takeRuleFromFactories(ifFactories, usedIfs);
            if (cond) {
                entry.condition = cond;
            }
        }
        if (assignedMods < maxModifiers && randomInt(0, 1) === 1) {
            var mod = takeRuleFromFactories(modifierFactories, usedModifiers);
            if (mod) {
                entry.modifier = mod;
                assignedMods++;
            }
        }
        entry.modifierAttachedToIf = !!(entry.modifier && entry.condition);
    }

    currentRuleEntries = ruleEntries;

    function applyModifier(modifier, ruleIndex) {
        var stateChanged = false;
        var firstRun = !modifierRunHistory[ruleIndex];
        modifierRunHistory[ruleIndex] = true;

        switch (modifier.id) {
            case Modifiers.CutRightToLeft:
                if (solveDirection !== ReadDirection.RightToLeft) {
                    solveDirection = ReadDirection.RightToLeft;
                    stateChanged = true;
                }
                break;
            case Modifiers.SwapColors:
                var beforeAlias = JSON.stringify(colorAlias);
                swapColors(modifier.data.from, modifier.data.to);
                stateChanged = stateChanged || beforeAlias !== JSON.stringify(colorAlias);
                break;
            case Modifiers.NextRuleIsLie:
                var nextIdx = ruleIndex + 1;
                if (nextIdx < currentRuleEntries.length && !ignoredRuleIndexes[nextIdx]) {
                    ignoredRuleIndexes[nextIdx] = true;
                    stateChanged = true;
                }
                break;
            case Modifiers.PreviousRuleIsLie:
                var prevIdx = ruleIndex - 1;
                if (prevIdx >= 0 && !ignoredRuleIndexes[prevIdx]) {
                    ignoredRuleIndexes[prevIdx] = true;
                    stateChanged = true;
                }
                break;
            case Modifiers.DoNotCutAdjacent:
                var adjMask = new Array(activeWiresCount);
                for (var a = 0; a < activeWiresCount; a++) adjMask[a] = false;
                for (var b = 0; b < activeWiresCount; b++) {
                    var match = false;
                    if (modifier.data.color) {
                        match = wires[b].color === mapColor(modifier.data.color);
                    } else if (modifier.data.parity) {
                        match = isIndexParity(b, modifier.data.parity);
                    }
                    if (match) {
                        if (b - 1 >= 0) adjMask[b - 1] = true;
                        if (b + 1 < activeWiresCount) adjMask[b + 1] = true;
                    }
                }
                applyInstruction(makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: adjMask,
                    message: "Do not cut adjacent wires",
                    size: activeWiresCount
                }));
                stateChanged = true;
                break;
            case Modifiers.DoNotCutColor:
                applyInstruction(makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: collectIndexesByColor(modifier.data.color),
                    message: "Do not cut " + modifier.data.color + " wires",
                    size: activeWiresCount,
                    lockKeep: true
                }));
                stateChanged = true;
                break;
            default:
                break;
        }

        if (firstRun || stateChanged) {
            rulesRecompile();
        }

        return stateChanged;
    }

    function applyRulesOnce() {
        var ruleLines = [];

        for (var ri = 0; ri < currentRuleEntries.length; ri++) {
            var entry = currentRuleEntries[ri];
            var label = entry.rule.description;
            var modifierText = entry.modifier ? " (" + entry.modifier.text + ")" : "";

            if (ignoredRuleIndexes[ri]) {
                ruleLines.push("- " + label + modifierText + " (ignored as lie)");
                continue;
            }

            if (entry.isUnique) {
                var uniqueMsg = entry.rule.applyUnique();
                ruleLines.push("- " + label + " [Standalone]" + (uniqueMsg ? " (" + uniqueMsg + ")" : ""));
                continue;
            }

            var ctx = buildRuleContext();
            var conditionMet = true;
            if (entry.condition) {
                label += " if " + entry.condition.text;
                conditionMet = entry.condition.predicate(ctx);
            }

            if (!conditionMet) {
                ruleLines.push("- " + label + " (ignored)");
                continue;
            }

            if (entry.modifierAttachedToIf && entry.modifier) {
                applyModifier(entry.modifier, ri);
            }

            var instruction = entry.rule.createInstruction();
            if (!instruction) {
                ruleLines.push("- " + label + " (no effect)");
                continue;
            }

            applyInstruction(instruction);
            if (instruction.meta && instruction.meta.color) {
                plannedCutColors[instruction.meta.color] = true;
            }

            if (!entry.modifierAttachedToIf && entry.modifier) {
                applyModifier(entry.modifier, ri);
            }

            ruleLines.push("- " + label + modifierText);
        }

        return ruleLines;
    }

    function applyRulesWithRecompile() {
        var attempts = 0;
        var lastRuleLines = [];
        do {
            attempts++;
            recompileRequested = false;
            resetSolutionState();
            plannedCutColors = {};
            lastRuleLines = applyRulesOnce();
        } while (recompileRequested && attempts < 5);

        finalizeSolution();

        ruleText.text = "Cut the wires according to these rules:\n" + lastRuleLines.join("\n");
        if (totalToCut === 0) {
            ruleText.text += "\n- No wires need to be cut. Press the big red button to defuse the bomb.";
        } else {
            ruleText.text += "\n- Total wires to cut: " + totalToCut;
        }
        ruleText.text += "\n\nRules apply in order; later rules override earlier ones where possible.";
        print("Generated rules. Wires to cut: " + totalToCut + " Solution: " + JSON.stringify(solution));
    }

    applyRulesWithRecompile();
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
