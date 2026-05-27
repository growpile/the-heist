// @input bool advancedInputs
// @input int bombTimer {"label":"Bomb Timer (s)"}

/*
@typedef module
@property {string} moduleName
@property {string} moduleId
@property {Asset.ObjectPrefab} prefab
*/
// @input module[] modules
// @ui {"widget":"group_start", "label":"Advanced Inputs", "showIf":"advancedInputs"}
// @input bool enableDebug
// @input Component.Text safeDebugText {"showIf":"enableDebug"}
// @input SceneObject[] moduleSlots
// @ui {"widget":"group_end"}

var safeDebugText = script.safeDebugText;
var moduleSlots = script.moduleSlots;
var modules = script.modules;
var activeSerialNumber = null;
var activeModuleList = [];
var activeModuleObjects = [];

function generateSerialNumber() {
    var words = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"];
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var digits = "0123456789";
    function randInt(min, max) {
        if (global.utils && global.utils.rng) {
            return global.utils.rng(min, max);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var chars = [];
    var letterCount = 0;
    var numberCount = 0;
    var containsOddNumber = false;
    var containsEvenNumber = false;
    for (var i = 0; i < 6; i++) {
        var lastIsLetter = i > 0 && /[A-Z]/.test(chars[i - 1]);
        var useLetter = !lastIsLetter && randInt(0, 1) === 1;
        if (useLetter) {
            var li = randInt(0, letters.length - 1);
            chars.push(letters.charAt(li));
            letterCount++;
        } else {
            var di = randInt(0, digits.length - 1);
            var digit = digits.charAt(di);
            chars.push(digit);
            numberCount++;
            var num = parseInt(digit, 10);
            if (num % 2 === 0) { containsEvenNumber = true; }
            else { containsOddNumber = true; }
        }
    }

    var serial = chars.join("");
    var containsWord = false;
    for (var w = 0; w < words.length; w++) {
        if (serial.indexOf(words[w]) !== -1) {
            containsWord = true;
            break;
        }
    }

    return {
        string: serial,
        containsWord: containsWord,
        containsOddNumber: containsOddNumber,
        containsEvenNumber: containsEvenNumber,
        numberCount: numberCount,
        letterCount: letterCount
    };
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
    var moduleObject = moduleConfig.prefab.instantiate(moduleSlots[slotIndex]);
    return { moduleId: moduleConfig.moduleId, moduleObject: moduleObject };
}

function addToAppState(serialNumber, moduleList) {
    global.appState.safe = {
        serialNumber: serialNumber,
        moduleList: moduleList
    }
}

function configureModules() {
    for (var i = 0; i < activeModuleObjects.length; i++) {
        var moduleObject = activeModuleObjects[i];
        if (!moduleObject) { continue; }
        var scriptComponents = moduleObject.getComponents("Component.ScriptComponent");
        for (var j = 0; j < scriptComponents.length; j++) {
            if (scriptComponents[j] && scriptComponents[j].setupModule) {
                scriptComponents[j].setupModule(global.appState.safe);
            }
        }
    }
}

script.init = function() {
    print("init")
    var serialNumber = generateSerialNumber();
    safeDebugText.text = safeDebugText.text + "\n" + serialNumber;

    var moduleList = [];
    var moduleObjects = [];
    var usedIds = {};
    for (let i = 0; i < moduleSlots.length; i++) {
        var spawnResult = spawnRandomModule(i, usedIds);
        moduleList.push(spawnResult.moduleId);
        moduleObjects.push(spawnResult.moduleObject);
        usedIds[spawnResult.moduleId] = true;
    }
    activeSerialNumber = serialNumber;
    activeModuleList = moduleList;
    activeModuleObjects = moduleObjects;

    configureModules();
    
    addToAppState(serialNumber, moduleList);
}

script.getContext = function() {
    return {
        serialNumber: activeSerialNumber ? activeSerialNumber.string : "",
        moduleIds: activeModuleList
    };
};