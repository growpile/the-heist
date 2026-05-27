// @input Component.ScriptComponent[] wireButtons
/** @type {ScriptComponent[]} */
var wireButtons = script.wireButtons;
// @input Component.Text ruleText
/** @type {Text} */
var ruleText = script.ruleText;

// state & enums
let puzzleActive = false;
let colors = ["red", "green", "blue", "yellow"];
let reversedWordSerialNumbers = [
    "6YESROH9",
    "OCATE6JH",
    "P4BMOB55",
    "JNETTIKG",
    "RESREVER",
    "08FEIHTF",
    "3PUWOLBX",
    "U7NWORCH",
    "RAB5WORC",
    "KCATKCIT",
    "PU1SEMIT",
    "5TRESSED",
    "4DESSELB",
    "EMESUFED",
    "57SSERTS",
    "8YDNAC2Z",
    "FYTHGIM6",
    "NWOLC3R5",
    "2SYAD785",
    "TSIEHEHT",
    "YADNOM0A"
];

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
    SwapParity: "swap-parity",
    DoNotCutColor: "do-not-cut-color"
});

const InstructionType = Object.freeze({
    Permissive: "cut",
    Prohibitive: "keep",
});

// active puzzle data
let solveDirection = ReadDirection.LeftToRight;
let activeWiresCount = 0;
let wires = [
    // {color: Colors.Red, isEven: false},
]
let instructions = [
    // {
    // type: InstructionType.Permissive, 
    // modifier: Modifiers.CutRightToLeft,
    // afftectedIndexes: [false, false, false, false, false], 
    // instructionMessage: "",
    // },
];
let wireColorCounts = {red: 0, green: 0, blue: 0, yellow: 0};
let solution = [];
let keepLocks = [];
let colorAlias = { red: "red", green: "green", blue: "blue", yellow: "yellow" };
let paritySwapped = false;
let ignoredRuleIndexes = {};
let recompileRequested = false;
let currentRuleEntries = [];
let ruleLines = [];
let cutCount = 0;
let totalToCut = 0;

// helpers
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

function mapParity(parity) {
    if (!paritySwapped) return parity;
    return parity === Parity.Odd ? Parity.Even : Parity.Odd;
}

function positionToIndex(position) {
    if (position < 1 || position > activeWiresCount) return -1;
    if (solveDirection === ReadDirection.LeftToRight) return position - 1;
    return activeWiresCount - position;
}

function collectIndexesByColor(colorName) {
    var name = mapColor(colorName);
    var indexes = [];
    for (var i = 0; i < activeWiresCount; i++) {
        indexes[i] = !!(wires[i] && wires[i].color && wires[i].color.name === name);
    }
    return indexes;
}

function collectIndexesByParity(parity) {
    var indexes = [];
    var target = mapParity(parity);
    for (var i = 0; i < activeWiresCount; i++) {
        var position = solveDirection === ReadDirection.LeftToRight ? i + 1 : activeWiresCount - i;
        var even = position % 2 === 0;
        indexes[i] = target === Parity.Even ? even : !even;
    }
    return indexes;
}

function collectIndexesByColorAndParity(colorName, parity) {
    var colorMask = collectIndexesByColor(colorName);
    var parityMask = collectIndexesByParity(parity);
    var indexes = [];
    for (var i = 0; i < activeWiresCount; i++) {
        indexes[i] = colorMask[i] && parityMask[i];
    }
    return indexes;
}

function applyInstruction(instruction) {
    if (!instruction || !instruction.affectedIndexes) return;
    var targetCut = instruction.type === InstructionType.Permissive;
    for (var i = 0; i < instruction.affectedIndexes.length; i++) {
        if (!instruction.affectedIndexes[i]) continue;
        if (keepLocks[i] && targetCut) continue;
        solution[i] = targetCut;
        if (instruction.lockKeep && !targetCut) {
            keepLocks[i] = true;
        }
    }
}

function resetRuleState() {
    resetSolutionState();
    colorAlias = { red: "red", green: "green", blue: "blue", yellow: "yellow" };
    paritySwapped = false;
    ignoredRuleIndexes = {};
    recompileRequested = false;
    ruleLines = [];
}

function resetSolutionState() {
    solution = new Array(activeWiresCount);
    keepLocks = new Array(activeWiresCount);
    for (var i = 0; i < activeWiresCount; i++) {
        solution[i] = false;
        keepLocks[i] = false;
    }
}

function rulesRecompile() {
    recompileRequested = true;
}
// procedural generation logic
script.generatePuzzle = function() {
    createWires(createRules);
}

function createWires(onSuccess) {
    var i;
    activeWiresCount = randomInt(3, Math.min(5, wireButtons.length));
    wireColors = { red: 0, green: 0, blue: 0, yellow: 0 };

    // setup each wire button
    for (i = 0; i < wireButtons.length; i++) {
        setupWire(i);
    }

    if (onSuccess) onSuccess();
};

function setupWire(i) {
    var buttonSO = wireButtons[i].getSceneObject();

    if (i < activeWiresCount) {
        buttonSO.enabled = true;
        wireButtons[i].enabled = true;
        if (wireButtons[i].initialize) wireButtons[i].initialize();

        var colorData = Object.values(Colors)[randomInt(0, Object.values(Colors).length - 1)];
        wireColorCounts[colorData.name]++;

        var textComponent = buttonSO.getChild(0).getComponent("Component.Text");
        textComponent.text = "Wire " + (i + 1);
        textComponent.textFill.color = colorData.color;

        print("Wire " + (i + 1) + " is active. Color: " + colorData.name);
        wires[i] = {color: colorData, isEven: ((i + 1) % 2 === 0)};
    } else {
        buttonSO.enabled = false;
        wireButtons[i].enabled = false;
        wireColors[i] = null;
    }
}

function generateSerialNumber() {
    var serialNumber = "";
    var containsWord = false;
    if (Math.random() < 0.2) {
        serialNumber = reversedWordSerialNumbers[randomInt(0, reversedWordSerialNumbers.length - 1)];
        containsWord = true;
    } else {
        var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        var digits = "0123456789".split('');
        knuthShuffle(letters);
        knuthShuffle(digits);
        for (var i = 0; i < 8; i++) {
            if (i % 2 === 0) {
                serialNumber += letters[i / 2];
            } else {
                serialNumber += digits[Math.floor(i / 2)];
            }
        }
    }
    return {serialNumber: serialNumber, containsWord: containsWord};
}
function getTimeToMidnightNoon() {
    var now = new Date();
    var hours = now.getHours();
    var hoursToMidnight = (24 - hours) % 24;
    var hoursToNoon = (12 - hours + 24) % 24;
    return {hoursToMidnight: hoursToMidnight, hoursToNoon: hoursToNoon};
}

function createRules() {
    var serial = generateSerialNumber();
    var timeContext = getTimeToMidnightNoon();
    var maxRules = 4;
    var maxModifiers = 2;
    var maxAttempts = 6;
    var success = false;
    var attempt = 0;

    function makeInstruction(opts) {
        var size = opts.size || activeWiresCount;
        var affected = new Array(size);
        for (var i = 0; i < size; i++) {
            affected[i] = !!opts.indexes && !!opts.indexes[i];
        }
        return {
            type: opts.type || InstructionType.Permissive,
            affectedIndexes: affected,
            lockKeep: !!opts.lockKeep,
            message: opts.message || ""
        };
    }

    function maskFirstN(mask, count) {
        var chosen = new Array(mask.length);
        for (var i = 0; i < chosen.length; i++) chosen[i] = false;
        var picked = 0;
        for (var j = 0; j < mask.length && picked < count; j++) {
            if (mask[j]) {
                chosen[j] = true;
                picked++;
            }
        }
        return chosen;
    }

    // #region Standard Rules

    function cutAllColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        return {
            id: "cut-all-color",
            description: "Cut all " + color + " wires",
            instructionType: InstructionType.Permissive,
            createInstruction: function() {
                return makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: collectIndexesByColor(color),
                    message: "Cut all " + color + " wires"
                });
            }
        };
    }

    function cutAllParityWires() {
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "cut-all-parity",
            description: "Cut all " + parity + " wires",
            instructionType: InstructionType.Permissive,
            createInstruction: function() {
                return makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: collectIndexesByParity(parity),
                    message: "Cut all " + parity + " wires"
                });
            }
        };
    }

    function doNotCutColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        return {
            id: "keep-color",
            description: "Do not cut any " + color + " wires",
            instructionType: InstructionType.Prohibitive,
            createInstruction: function() {
                return makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: collectIndexesByColor(color),
                    message: "Do not cut " + color + " wires"
                });
            }
        };
    }

    function doNotCutFirstLastWire() {
        var target = randomInt(0, 1) === 0 ? "first" : "last";
        return {
            id: "keep-edge",
            description: "Do not cut the " + target + " wire",
            instructionType: InstructionType.Prohibitive,
            createInstruction: function() {
                var indexes = new Array(activeWiresCount);
                for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                var pos = target === "first" ? 1 : activeWiresCount;
                var idx = positionToIndex(pos);
                if (idx >= 0) indexes[idx] = true;
                return makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: indexes,
                    message: "Do not cut the " + target + " wire"
                });
            }
        };
    }

    function doNotCutParityWires() {
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "keep-parity",
            description: "Do not cut any " + parity + " wires",
            instructionType: InstructionType.Prohibitive,
            createInstruction: function() {
                return makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: collectIndexesByParity(parity),
                    message: "Do not cut any " + parity + " wires"
                });
            }
        };
    }

    function cutNColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        var maxCount = Math.max(1, wireColorCounts[mapColor(color)]);
        var n = randomInt(1, Math.max(1, maxCount));
        return {
            id: "cut-n-color",
            description: "Cut " + n + " " + color + " wire(s)",
            instructionType: InstructionType.Permissive,
            createInstruction: function() {
                var mask = collectIndexesByColor(color);
                var chosen = maskFirstN(mask, n);
                return makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: chosen,
                    message: "Cut " + n + " " + color + " wire(s)"
                });
            }
        };
    }

    function cutNParityWires() {
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        var parityCount = parity === Parity.Even ? Math.floor(activeWiresCount / 2) : Math.ceil(activeWiresCount / 2);
        var n = randomInt(1, Math.max(1, parityCount));
        return {
            id: "cut-n-parity",
            description: "Cut " + n + " " + parity + " wire(s)",
            instructionType: InstructionType.Permissive,
            createInstruction: function() {
                var mask = collectIndexesByParity(parity);
                var chosen = maskFirstN(mask, n);
                return makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: chosen,
                    message: "Cut " + n + " " + parity + " wire(s)"
                });
            }
        };
    }

    function cutTwoWires() {
        var firstPos = randomInt(1, activeWiresCount);
        var secondPos = randomInt(1, activeWiresCount);
        return {
            id: "cut-two-wires",
            description: "Cut the " + firstPos + "th and " + secondPos + "th wires",
            instructionType: InstructionType.Permissive,
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
                    message: "Cut the " + firstPos + "th and " + secondPos + "th wires"
                });
            }
        };
    }

    function cutParityColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "cut-color-parity",
            description: "Cut any wire that is " + parity + " and " + color,
            instructionType: InstructionType.Permissive,
            createInstruction: function() {
                return makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: collectIndexesByColorAndParity(color, parity),
                    message: "Cut " + parity + " " + color + " wires"
                });
            }
        };
    }

    // #endregion
    
    // #region Unique Rules
    
    function cutWireBasedOnOtherWire() {
        var n = randomInt(1, activeWiresCount);
        var m = randomInt(1, activeWiresCount);
        var g = randomInt(1, activeWiresCount);
        var color = colors[randomInt(0, colors.length - 1)];
        return {
            id: "unique-other-wire",
            description: "Cut the " + n + "th wire if the " + (n + m) + "th is " + color + ", otherwise cut the " + (n + g) + "th wire if the wire before it is " + color + ".",
            instructionType: InstructionType.Permissive,
            applyUnique: function() {
                var idxN = positionToIndex(n);
                var idxM = positionToIndex(n + m);
                var idxG = positionToIndex(n + g);
                var indexes = new Array(activeWiresCount);
                for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                if (idxM >= 0 && wires[idxM] && wires[idxM].color.name === mapColor(color)) {
                    if (idxN >= 0) indexes[idxN] = true;
                } else if (idxG > 0 && wires[idxG - 1] && wires[idxG - 1].color.name === mapColor(color)) {
                    if (idxG >= 0) indexes[idxG] = true;
                }
                applyInstruction(makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: indexes,
                    message: "Conditional wire cut"
                }));
                return indexes.some(function(val) { return val; });
            }
        };
    }
    
    function cutBasedOnSerialReversedWord() {
        var color = colors[randomInt(0, colors.length - 1)];
        var primaryParity = mapParity(randomInt(0, 1) === 0 ? Parity.Even : Parity.Odd);
        var secondaryParity = primaryParity === Parity.Even ? Parity.Odd : Parity.Even;
        return {
            id: "unique-serial",
            description: "If the serial is a reversed word, cut all " + primaryParity + " " + color + " wires, otherwise cut all " + secondaryParity + " " + color + " wires.",
            instructionType: InstructionType.Permissive,
            applyUnique: function() {
                var reversed = serial.containsWord || (serial.serialNumber === serial.serialNumber.split("").reverse().join(""));
                var chosenParity = reversed ? primaryParity : secondaryParity;
                var indexes = collectIndexesByColorAndParity(color, chosenParity);
                applyInstruction(makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: indexes,
                    message: "Serial based cut"
                }));
                return indexes.some(function(val) { return val; });
            }
        };
    }
    
    function cutWireBasedOnTimeToMidnightNoon() {
        var n = randomInt(1, activeWiresCount);
        var moreThan = randomInt(0, 1) === 0;
        return {
            id: "unique-time",
            description: "Cut the " + n + "th wire if there are " + (moreThan ? "more" : "less") + " than " + n + " hours to midnight/noon.",
            instructionType: InstructionType.Permissive,
            applyUnique: function() {
                var condition = moreThan ? (timeContext.hoursToMidnight > n || timeContext.hoursToNoon > n) : (timeContext.hoursToMidnight < n || timeContext.hoursToNoon < n);
                if (!condition) return false;
                var idx = positionToIndex(n);
                var indexes = new Array(activeWiresCount);
                for (var i = 0; i < activeWiresCount; i++) indexes[i] = false;
                if (idx >= 0) indexes[idx] = true;
                applyInstruction(makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: indexes,
                    message: "Time based cut"
                }));
                return true;
            }
        };
    }
    
    function cutAdditionalParityColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "unique-additional-parity",
            description: "If any rules cut " + color + " wires, also cut all " + parity + " " + color + " wires.",
            instructionType: InstructionType.Permissive,
            applyUnique: function(plannedCutColors) {
                if (!plannedCutColors[color]) return false;
                var indexes = collectIndexesByColorAndParity(color, parity);
                applyInstruction(makeInstruction({
                    type: InstructionType.Permissive,
                    indexes: indexes,
                    message: "Add parity cuts for " + color
                }));
                return indexes.some(function(val) { return val; });
            }
        };
    }
    
    function cutAdjacentAfterCuttingParityColorWire() {
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        var color = colors[randomInt(0, colors.length - 1)];
        return {
            id: "unique-adjacent-follow",
            description: "If you had to cut an " + parity + " " + color + " wire, also cut the wire after that wire.",
            instructionType: InstructionType.Permissive,
            applyUnique: function() {
                var applied = false;
                for (var i = 0; i < solution.length; i++) {
                    var matches = solution[i] && wires[i] && wires[i].color.name === mapColor(color) && collectIndexesByParity(parity)[i];
                    if (matches && i + 1 < solution.length) {
                        var mask = new Array(activeWiresCount);
                        for (var j = 0; j < activeWiresCount; j++) mask[j] = false;
                        mask[i + 1] = true;
                        applyInstruction(makeInstruction({
                            type: InstructionType.Permissive,
                            indexes: mask,
                            message: "Cut wire after matched " + parity + " " + color
                        }));
                        applied = true;
                    }
                }
                return applied;
            }
        };
    }

    // #endregion

    // #region Ifs

    function ifMoreColor1ThanColor2() {
        var c1 = colors[randomInt(0, colors.length - 1)];
        var c2 = colors[randomInt(0, colors.length - 1)];
        return {
            id: "if-more-color",
            text: "there are more " + c1 + " wires than " + c2 + " wires",
            predicate: function() { return wireColorCounts[mapColor(c1)] > wireColorCounts[mapColor(c2)]; }
        };
    }

    function ifMoreParity1ThanParity2() {
        var main = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        var other = main === Parity.Odd ? Parity.Even : Parity.Odd;
        return {
            id: "if-more-parity",
            text: "there are more " + main + " wires than " + other + " wires",
            predicate: function() {
                var parityArray = getIndividualParityArray(solveDirection);
                var mainCount = 0;
                for (var i = 0; i < parityArray.length; i++) {
                    var mapped = mapParity(parityArray[i]);
                    if (mapped === main) mainCount++;
                }
                return mainCount > parityArray.length - mainCount;
            }
        };
    }

    function ifFirstLastWireIsColor() {
        var color = colors[randomInt(0, colors.length - 1)];
        return {
            id: "if-first-last-color",
            text: "the first wire is " + color + " or the last wire is " + color,
            predicate: function() {
                if (wires.length === 0) return false;
                var firstIdx = positionToIndex(1);
                var lastIdx = positionToIndex(activeWiresCount);
                var firstMatch = wires[firstIdx] && wires[firstIdx].color.name === mapColor(color);
                var lastMatch = wires[lastIdx] && wires[lastIdx].color.name === mapColor(color);
                return !!(firstMatch || lastMatch);
            }
        };
    }

    function ifFirstLastWireIsColorParity() {
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "if-first-last-parity",
            text: "the first wire is " + color + " or " + parity + " and the last wire is " + color + " or " + parity,
            predicate: function() {
                if (wires.length === 0) return false;
                var firstIdx = positionToIndex(1);
                var lastIdx = positionToIndex(activeWiresCount);
                var firstMatch = wires[firstIdx] && (wires[firstIdx].color.name === mapColor(color) || collectIndexesByParity(parity)[firstIdx]);
                var lastMatch = wires[lastIdx] && (wires[lastIdx].color.name === mapColor(color) || collectIndexesByParity(parity)[lastIdx]);
                return !!(firstMatch && lastMatch);
            }
        };
    }

    function ifNumberOfWiresIsParity() {
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "if-count-parity",
            text: "the number of wires is " + parity,
            predicate: function() {
                var even = activeWiresCount % 2 === 0;
                return parity === Parity.Even ? even : !even;
            }
        };
    }

    function ifSerialContainsVowelConsonantDigit() {
        var target = ["vowel", "consonant", "digit"][randomInt(0, 2)];
        return {
            id: "if-serial",
            text: "the bomb's serial number contains a " + target,
            predicate: function() {
                if (target === "digit") return /\d/.test(serial.serialNumber);
                if (target === "vowel") return /[aeiou]/i.test(serial.serialNumber);
                return /[bcdfghjklmnpqrstvwxyz]/i.test(serial.serialNumber);
            }
        };
    }

    function ifSecondToLastWireIsColorParity() {
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "if-second-last",
            text: "the second-to-last wire is " + color + " or " + parity,
            predicate: function() {
                if (activeWiresCount < 2) return false;
                var idx = positionToIndex(activeWiresCount - 1);
                var colorMatch = wires[idx] && wires[idx].color.name === mapColor(color);
                var parityMatch = collectIndexesByParity(parity)[idx];
                return !!(colorMatch || parityMatch);
            }
        };
    }

    function ifNthWireIsColorParity() {
        var n = randomInt(1, activeWiresCount);
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return {
            id: "if-nth",
            text: "the " + n + "th wire is " + color + " or " + parity,
            predicate: function() {
                var idx = positionToIndex(n);
                if (idx < 0 || idx >= wires.length) return false;
                var colorMatch = wires[idx] && wires[idx].color.name === mapColor(color);
                var parityMatch = collectIndexesByParity(parity)[idx];
                return !!(colorMatch || parityMatch);
            }
        };
    }

    // #endregion
    
    // #region Modifiers
    // Always count wires right to left. This rule disregards order priority. (only once)
    function modifierCountRightToLeft() {
        return { id: Modifiers.CutRightToLeft, text: "Always count wires right to left." };
    }

    // The next/previous rule is a lie. (only once)
    function modifierNextPreviousRuleIsLie() {
        var target = randomInt(0, 1) === 0 ? "next" : "previous";
        return { id: target === "next" ? Modifiers.NextRuleIsLie : Modifiers.PreviousRuleIsLie, text: "The " + target + " rule is a lie." };
    }

    // Do not cut any wires adjacent to COLOR/odd/even wires. (only once)
    function modifierDoNotCutAdjacentToColorParity() {
        var byColor = randomInt(0, 1) === 0;
        var color = colors[randomInt(0, colors.length - 1)];
        var parity = mapParity(randomInt(0, 1) === 0 ? Parity.Odd : Parity.Even);
        return { id: Modifiers.DoNotCutAdjacent, text: "Do not cut any wires adjacent to " + (byColor ? color : parity) + " wires.", data: { color: byColor ? color : null, parity: byColor ? null : parity } };
    }

    // Other rules colors are swapped. When they say COLOR1, they mean COLOR2. (only once)
    function modifierSwapColors() {
        var c1 = colors[randomInt(0, colors.length - 1)];
        var c2 = colors[randomInt(0, colors.length - 1)];
        return { id: Modifiers.SwapColors, text: "Other rules colors are swapped. When they say " + c1 + ", they mean " + c2 + ".", data: { from: c1, to: c2 } };
    }

    // Other rules parity is swapped. When they say even/odd, they mean odd/even. (only once)
    function modifierSwapParity() {
        return { id: Modifiers.SwapParity, text: "Other rules parity is swapped. When they say even, they mean odd (and vice versa).", data: {} };
    }

    // Do not cut COLOR wires even if another rule says to, disregard order priority. (only once)
    function modifierDoNotCutColorWires() {
        var color = colors[randomInt(0, colors.length - 1)];
        return { id: Modifiers.DoNotCutColor, text: "Do not cut " + color + " wires even if another rule says to.", data: { color: color } };
    }

    // #endregion

    function runModifier(modifier, idx) {
        if (!modifier) return;
        switch (modifier.id) {
            case Modifiers.CutRightToLeft:
                solveDirection = ReadDirection.RightToLeft;
                rulesRecompile();
                break;
            case Modifiers.NextRuleIsLie:
                if (idx + 1 < currentRuleEntries.length) {
                    ignoredRuleIndexes[idx + 1] = true;
                    rulesRecompile();
                }
                break;
            case Modifiers.PreviousRuleIsLie:
                if (idx - 1 >= 0) {
                    ignoredRuleIndexes[idx - 1] = true;
                    rulesRecompile();
                }
                break;
            case Modifiers.DoNotCutAdjacent:
                var adjMask = new Array(activeWiresCount);
                for (var i = 0; i < activeWiresCount; i++) adjMask[i] = false;
                for (var w = 0; w < activeWiresCount; w++) {
                    var matches = false;
                    if (modifier.data && modifier.data.color) {
                        matches = wires[w] && wires[w].color.name === mapColor(modifier.data.color);
                    } else if (modifier.data && modifier.data.parity) {
                        matches = collectIndexesByParity(modifier.data.parity)[w];
                    }
                    if (matches) {
                        if (w - 1 >= 0) adjMask[w - 1] = true;
                        if (w + 1 < activeWiresCount) adjMask[w + 1] = true;
                    }
                }
                applyInstruction(makeInstruction({
                    type: InstructionType.Prohibitive,
                    indexes: adjMask,
                    message: modifier.text
                }));
                rulesRecompile();
                break;
            case Modifiers.SwapColors:
                if (modifier.data) {
                    swapColors(modifier.data.from, modifier.data.to);
                    rulesRecompile();
                }
                break;
            case Modifiers.SwapParity:
                paritySwapped = !paritySwapped;
                rulesRecompile();
                break;
            case Modifiers.DoNotCutColor:
                if (modifier.data) {
                    applyInstruction(makeInstruction({
                        type: InstructionType.Prohibitive,
                        indexes: collectIndexesByColor(modifier.data.color),
                        message: "Do not cut " + modifier.data.color + " wires",
                        lockKeep: true
                    }));
                    rulesRecompile();
                }
                break;
            default:
                break;
        }
    }

    function makeRuleEntries() {
        var standardFactories = [
            cutAllColorWires,
            cutAllParityWires,
            doNotCutColorWires,
            doNotCutFirstLastWire,
            doNotCutParityWires,
            cutNColorWires,
            cutNParityWires,
            cutTwoWires,
            cutParityColorWires
        ];

        var uniqueFactories = [
            cutWireBasedOnOtherWire,
            cutBasedOnSerialReversedWord,
            cutWireBasedOnTimeToMidnightNoon,
            cutAdditionalParityColorWires,
            cutAdjacentAfterCuttingParityColorWire
        ];

        var ifFactories = [
            ifMoreColor1ThanColor2,
            ifMoreParity1ThanParity2,
            ifFirstLastWireIsColor,
            ifFirstLastWireIsColorParity,
            ifNumberOfWiresIsParity,
            ifSerialContainsVowelConsonantDigit,
            ifSecondToLastWireIsColorParity,
            ifNthWireIsColorParity
        ];

        var modifierFactories = [
            modifierCountRightToLeft,
            modifierNextPreviousRuleIsLie,
            modifierDoNotCutAdjacentToColorParity,
            modifierSwapColors,
            modifierSwapParity,
            modifierDoNotCutColorWires
        ];

        var entries = [];
        var includeUnique = randomInt(0, 1) === 1;
        if (includeUnique) {
            entries.push({ rule: uniqueFactories[randomInt(0, uniqueFactories.length - 1)](), isUnique: true });
        }

        var neededPermissive = 2;
        var neededProhibitive = 1;
        while (entries.length < maxRules) {
            var pick = standardFactories[randomInt(0, standardFactories.length - 1)]();
            var remaining = maxRules - entries.length - 1;
            var canStillSatisfy = true;
            var permCount = entries.filter(function(e) { return !e.isUnique && e.rule.instructionType === InstructionType.Permissive; }).length + (pick.instructionType === InstructionType.Permissive ? 1 : 0);
            var prohibCount = entries.filter(function(e) { return !e.isUnique && e.rule.instructionType === InstructionType.Prohibitive; }).length + (pick.instructionType === InstructionType.Prohibitive ? 1 : 0);
            if (permCount < neededPermissive && permCount + remaining < neededPermissive) canStillSatisfy = false;
            if (prohibCount < neededProhibitive && prohibCount + remaining < neededProhibitive) canStillSatisfy = false;
            if (!canStillSatisfy) continue;
            entries.push({ rule: pick, isUnique: false });
        }

        knuthShuffle(entries);

        var usedMods = 0;
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry.isUnique && randomInt(0, 1) === 1) {
                entry.condition = ifFactories[randomInt(0, ifFactories.length - 1)]();
            }
            if (!entry.isUnique && usedMods < maxModifiers && randomInt(0, 1) === 1) {
                entry.modifier = modifierFactories[randomInt(0, modifierFactories.length - 1)]();
                usedMods++;
            }
            entry.modifierAttachedToIf = !!(entry.modifier && entry.condition);
        }

        return entries;
    }

    function applyRulesOnce(plannedCutColors) {
        var truthyCount = 0;
        var permissiveCount = 0;
        var prohibitiveCount = 0;
        ruleLines = [];

        for (var i = 0; i < currentRuleEntries.length; i++) {
            var entry = currentRuleEntries[i];
            var label = entry.rule.description;
            var modifierText = entry.modifier ? " (" + entry.modifier.text + ")" : "";

            if (ignoredRuleIndexes[i]) {
                ruleLines.push("- " + label + modifierText + " (ignored as lie)");
                continue;
            }

            if (entry.isUnique) {
                var applied = entry.rule.applyUnique(plannedCutColors || {});
                if (applied) truthyCount++;
                if (entry.rule.instructionType === InstructionType.Permissive) permissiveCount++; else prohibitiveCount++;
                ruleLines.push("- " + label + " [Standalone]");
                continue;
            }

            var conditionMet = true;
            if (entry.condition) {
                label += " if " + entry.condition.text;
                conditionMet = entry.condition.predicate();
            }

            if (!conditionMet) {
                ruleLines.push("- " + label + " (ignored)");
                continue;
            }

            if (entry.modifierAttachedToIf) {
                runModifier(entry.modifier, i);
            }

            var instruction = entry.rule.createInstruction();
            if (instruction) {
                applyInstruction(instruction);
                if (instruction.type === InstructionType.Permissive) permissiveCount++; else prohibitiveCount++;
                if (instruction.affectedIndexes && instruction.affectedIndexes.some(function(val) { return val; })) {
                    truthyCount++;
                }
                if (instruction.type === InstructionType.Permissive && instruction.message.indexOf("Cut") === 0) {
                    var match = instruction.message.match(/Cut(?: all)? (\w+)/i);
                    if (match && match[1]) {
                        plannedCutColors[match[1]] = true;
                    }
                }
            }

            if (!entry.modifierAttachedToIf && entry.modifier) {
                runModifier(entry.modifier, i);
            }

            ruleLines.push("- " + label + modifierText);
        }

        return { truthyCount: truthyCount, permissiveCount: permissiveCount, prohibitiveCount: prohibitiveCount };
    }

    function applyRulesWithRecompile() {
        var attempts = 0;
        var plannedCutColors = {};
        var counts = { truthyCount: 0, permissiveCount: 0, prohibitiveCount: 0 };
        do {
            attempts++;
            recompileRequested = false;
            resetSolutionState();
            counts = applyRulesOnce(plannedCutColors);
        } while (recompileRequested && attempts < 5);
        return counts;
    }

    while (!success && attempt < maxAttempts) {
        attempt++;
        resetRuleState();
        currentRuleEntries = makeRuleEntries();
        var counts = applyRulesWithRecompile();
        if (counts.permissiveCount >= 2 && counts.prohibitiveCount >= 1 && counts.truthyCount >= 2) {
            success = true;
        }
    }

    ruleText.text = "Cut the wires according to these rules:\n" + ruleLines.join("\n");
    ruleText.text += "\n\nSerial: " + serial.serialNumber;
}

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
