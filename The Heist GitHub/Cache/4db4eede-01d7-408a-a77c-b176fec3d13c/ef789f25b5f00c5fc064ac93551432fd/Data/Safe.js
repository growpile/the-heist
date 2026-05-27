// @input bool enableDebug
// @input bool advanced
// @input Component.Text safeDebugText {"showIf":"enableDebug"}
/*
@typedef module
@property {string} moduleName
@property {string} moduleId
@property {Asset.ObjectPrefab} modulePrefab
*/
// @input module[] modules
// @input SceneObject[] moduleSlots

var safeDebugText = script.safeDebugText;
var moduleSlots = script.moduleSlots;

function generateSerialNumber() {
    // {containsWord, containsOddNumber, containsEvenNumber, numberCount, letterCount}
    return {
        string: "serialNumberString",
        containsWord: false,
        containsOddNumber: true,
        containsEvenNumber: true,
        numberCount: 2,
        letterCount: 4
    }
}

function spawnRandomModule() {

}

function addToAppState(serialNumber) {
    global.appState.safe = {
        serialNumber: serialNumber,

    }
}

script.init = function() {



    serialNumber = generateSerialNumber();

    addToAppState(serialNumber);

    // generate serial number
    // spawn random modules & configure them
}