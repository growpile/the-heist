// @input Component.Text safeDebugText
/** @type {Text} */
var safeDebugText = script.safeDebugText;
/*
@typedef module
@property {string} moduleName
@property {string} moduleId
@property {Asset.ObjectPrefab} modulePrefab
*/
// @input module[] modules

function generateSerialNumber() {
    // {containsWord, containsOddNumber, containsEvenNumber, numberCount, letterCount}
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