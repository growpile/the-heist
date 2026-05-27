// @input Component.Text safeDebugText
/** @type {Text} */
var safeDebugText = script.safeDebugText;

/*
@typedef module
@property {string} moduleName
@property {Asset.ObjectPrefab} moduleName


@property {vec3} a {"widget": "color"}
@property {vec4} b {"widget": "color"}
@property {int} c {"label":"My Int", "min":0, "max":25, "step":5}
@property {float} d {"label":"My Float", "min":0.0, "max":1.0, "step":0.001}
@property {int} e {"widget":"slider", "min":0, "max":10, "step":1}
@property {float} f {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
@property {int} g {"widget":"combobox", "values":[{"label":"one", "value":1}, {"label":"two", "value":2}]}
@property {string} h {"widget":"combobox", "values":[{"label":"cat", "value":"cat"}, {"label":"dog", "value":"dog"}, {"label":"bird", "value":"bird"}]}
*/

// @input module[] modules

// @input Asset.ObjectPrefab myObjectPrefab
/** @type {ObjectPrefab} */
var myObjectPrefab = script.myObjectPrefab;

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