// @input bool advancedInputs
// @input int bombTimer {"label":"Bomb Timer (s)"}

/*
@typedef module
@property {string} moduleName
@property {string} moduleId
@property {Asset.ObjectPrefab} prefab
*/
// @input module[] modules
//@ui {"widget":"group_start", "label":"Advanced Inputs", "showIf":"advancedInputs"}
// @input bool enableDebug
// @input Component.Text safeDebugText {"showIf":"enableDebug"}
// @input SceneObject[] moduleSlots
//@ui {"widget":"group_end"}

var safeDebugText = script.safeDebugText;
var moduleSlots = script.moduleSlots;
var modules = script.modules;

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
    print(modules.length);
    modules[global.utils.rng(0, modules.length-1)].prefab.instantiate(moduleSlots[0]);
    modules[global.utils.rng(0, modules.length)].prefab.instantiate(moduleSlots[1]);
    modules[global.utils.rng(0, modules.length)].prefab.instantiate(moduleSlots[2]);
}
spawnRandomModule();

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