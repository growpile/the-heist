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

// procedural generation logic
script.generatePuzzle = function() {
    createWires(ruleBuilder);
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

function createRules() {
    instructions = [];
    
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
}

function ruleBuilder() {

    let bombContext = {
        serialNumber: serialNumber,
        containsWord: containsWord,
        wires: wires,

        // not included in context yet
        hoursToMidnight: 5,
        hoursToNoon: 7,
        displayNames: ["Alice", "Bob"]
    };

    print(JSON.stringify(bombContext));

    // #region Standard Rules

    // Cut all COLOR wires
    function cutAllColorWires() {
    }

    // Cut all odd/even wires
    function cutAllParityWires() {
    }

    // Do not cut any COLOR wires
    function doNotCutColorWires() {
    }

    // Do not cut the first/last wire
    function doNotCutFirstLastWire() {
    }

    // Do not cut any odd/even wires
    function doNotCutParityWires() {
    }

    // Cut N COLOR wires
    function cutNColorWires() {
    }

    // Cut N odd/even wires
    function cutNParityWires() {
    }

    // Cut the Nth and Mth wires
    function cutTwoWires() {
    }

    // Cut any wire that is odd/even and COLOR
    function cutParityColorWires() {
    }

    // #endregion
    
    // #region Unique Rules
    
    // Cut the Nth wire, if the Mth wire is COLOR/parity, otherwise cut the Gth wire if the wire before it is COLOR/parity.
    function cutWireBasedOnOtherWire() {
    }
    
    // If the serial number spells a reversed word, cut ?all even/odd COLOR wires, otherwise cut ?all odd/even COLOR wires.
    function cutBasedOnSerialReversedWord() {
    }
    
    // Cut the Nth wire if there is a digit in one of the user's names.
    function cutWireIfDigitInName() {
    }
    
    // Cut the Nth wire if there are more/less than N hours to midnight/noon.
    function cutWireBasedOnTimeToMidnightNoon() {
    }
    
    // If any rules specify cutting COLOR wires, also cut all odd/even COLOR wires.
    function cutAdditionalParityColorWires() {
    }
    
    // If you had to cut an odd/even COLOR wire, also cut the wire after that wire.
    function cutAdjacentAfterCuttingParityColorWire() {
    }

    // #endregion

    // #region Ifs

    // if there are more COLOR1 wires than COLOR2 wires.
    function ifMoreColor1ThanColor2() {
    }

    // if there are more odd/even wires than even/odd wires.
    function ifMoreParity1ThanParity2() {
    }

    // if the first/last wire is COLOR.
    function ifFirstLastWireIsColor() {
    }

    // if the first wire is COLOR/parity and the last wire is COLOR/parity.
    function ifFirstLastWireIsColorParity() {
    }

    // if the number of wires is odd/even.
    function ifNumberOfWiresIsParity() {
    }

    // if the bomb's serial number contains a vowel/consonant/digit.
    function ifSerialContainsVowelConsonantDigit() {
    }

    // if the second-to-last wire is COLOR/parity.
    function ifSecondToLastWireIsColorParity() {
    }

    // if the Nth wire is COLOR/parity.
    function ifNthWireIsColorParity() {
    }

    // #endregion
    
    // #region MModifiers
    // Always count wires right to left. This rule disregards order priority. (only once)
    function modifierCountRightToLeft() {
    }

    // The next/previous rule is a lie. (only once)
    function modifierNextPreviousRuleIsLie() {
    }

    // Do not cut any wires adjacent to COLOR/odd/even wires. (only once)
    function modifierDoNotCutAdjacentToColorParity() {
    }

    // Other rules colors are swapped. When they say COLOR1, they mean COLOR2. (only once)
    function modifierSwapColors() {
    }

    // Other rules parity is swapped. When they say even/odd, they mean odd/even. (only once)
    function modifierSwapParity() {
    }

    // Do not cut COLOR wires even if another rule says to, disregard order priority. (only once)
    function modifierDoNotCutColorWires() {
    }

    // #endregion
}


// UNIQUE, these are more complex standalone rules. (can't apply IFS or MODIFIERS here). 
// Cut the Nth wire, if the N+Mth wire is COLOR, otherwise cut the N+Gth wire if the wire before it is COLOR.
// If the serial number contains a reversed word, cut all even/odd COLOR wires, otherwise cut all odd/even COLOR wires.
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