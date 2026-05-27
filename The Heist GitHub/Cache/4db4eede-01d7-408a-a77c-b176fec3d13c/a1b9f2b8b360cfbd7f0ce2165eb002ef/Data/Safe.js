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

function spawnRandomModule(slotIndex, usedIds) {
    var available = [];
    for (var i = 0; i < modules.length; i++) {
        if (!usedIds[modules[i].moduleId]) {
            available.push(modules[i]);
        }
    }
    var pool = available.length > 0 ? available : modules;
    var index = global.utils.rng(0, pool.length - 1);
    var moduleConfig = pool[index];
    moduleConfig.prefab.instantiate(moduleSlots[slotIndex]);
    return moduleConfig.moduleId;
}

function addToAppState(serialNumber, moduleList) {
    global.appState.safe = {
        serialNumber: serialNumber,

    }
}

script.init = function() {

    var serialNumber = generateSerialNumber();

    var moduleList = [];
    var usedIds = {};
    for (let i = 0; i < moduleSlots.length; i++) {
        var moduleId = spawnRandomModule(i, usedIds);
        moduleList.push(moduleId);
        usedIds[moduleId] = true;
    }

    addToAppState(serialNumber, moduleList);

    // generate serial number
    // spawn random modules & configure them
}
