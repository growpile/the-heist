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
// @input Component.RenderMeshVisual timerScreenRMV
// @input SceneObject[] safeContents
// @input Component.Text serialNumberText
// @input Component.Text[] timerDigitTexts
// @input SceneObject[] moduleSlots
// @input Asset.Material[] dynamiteFuseMaterials
// @input SceneObject safeBody
// @input SceneObject[] dynamiteFuseObjects
// @ui {"widget":"group_end"}


var dynamiteFuseMaterials = script.dynamiteFuseMaterials;
var dynamiteFuseObjects = script.dynamiteFuseObjects;
var safeDebugText = script.safeDebugText;
var moduleSlots = script.moduleSlots;
var modules = script.modules;
var activeSerialNumber = null;
var activeModuleList = [];
var activeModuleObjects = [];
var solvedModules = [false, false, false];
var countdownActive = false;
var countdownSeconds = 0;
var countdownAccumulator = 0;
var beepAccumulator = 0;
var criticalTimeActive = false;
var safeBodyMaterial;
var safeFailedTriggered = false;
script.safeFailed = safeFailed;

function displayTimerValue(value) {
    var clampedValue = Math.max(0, Math.min(999, Math.floor(value || 0)));
    var hundreds = Math.floor(clampedValue / 100);
    var tens = Math.floor((clampedValue % 100) / 10);
    var ones = clampedValue % 10;
    script.timerDigitTexts[0].text = "" + hundreds;
    script.timerDigitTexts[1].text = "" + tens;
    script.timerDigitTexts[2].text = "" + ones;
}

function getProgressValue(material) {
    if (!material) { return null; }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        return material.mainPass.progress;
    }
    if (material.progress !== undefined) {
        return material.progress;
    }
    return null;
}

function setProgressValue(material, value) {
    if (!material) { return; }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        material.mainPass.progress = value;
    } else if (material.progress !== undefined) {
        material.progress = value;
    }
}

function animateProgress(material, targetValue, duration) {
    if (!material) { return; }
    var startValue = getProgressValue(material);
    if (startValue === null || startValue === undefined) { return; }

    if (material.__progressAnim && material.__progressAnim.updateEvent) {
        material.__progressAnim.updateEvent.enabled = false;
        material.__progressAnim.updateEvent = null;
    }

    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    material.__progressAnim = animData;

    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        var value = startValue + (targetValue - startValue) * smoothT;
        setProgressValue(material, value);
        if (t >= 1) {
            setProgressValue(material, targetValue);
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
        }
    });
}

function startCountdown(seconds) {
    countdownSeconds = Math.max(0, Math.floor(seconds || 0));
    countdownAccumulator = 0;
    beepAccumulator = 0;
    countdownActive = countdownSeconds > 0;
    criticalTimeActive = false;
    displayTimerValue(countdownSeconds);
    if (countdownActive && countdownSeconds < 60) {
        criticalTimeActive = true;
        global.playSfx(19, -1, 0.5, "criticalTime");
    }
}

function onUpdate() {
    if (!countdownActive) {
        return;
    }
    var dt = getDeltaTime();
    if (dt <= 0) { return; }
    countdownAccumulator += dt;

    while (countdownAccumulator >= 1.0 && countdownSeconds > 0) {
        countdownAccumulator -= 1.0;
        var prevSeconds = countdownSeconds;
        countdownSeconds -= 1;
        displayTimerValue(countdownSeconds);
        if (prevSeconds > 60) {
            global.playSfx(18, 1, 0.5);
        }
        if (!criticalTimeActive && prevSeconds >= 60 && countdownSeconds < 60) {
            criticalTimeActive = true;
            global.playSfx(19, -1, 0.5, "criticalTime");
        }
        if (countdownSeconds <= 0) {
            if (criticalTimeActive) {
                global.stopSfx("criticalTime");
                criticalTimeActive = false;
            }
            countdownActive = false;
            safeFailed();
            break;
        }
    }

    if (countdownSeconds >= 60 || countdownSeconds <= 0) {
        beepAccumulator = 0;
    }
}

function generateSerialNumber() {
    var words = ["SAFE", "BOMB", "CAT", "GOLD", "BOOM", "TICK", "LENS"];
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var digits = "0123456789";
    var forceWord = Math.random() < 0.1;
    var forcedWord = forceWord ? words[Math.floor(Math.random() * words.length)] : "";
    var wordInsertIndex = 0;
    var wordLength = forcedWord.length;
    if (forceWord) {
        wordInsertIndex = Math.floor(Math.random() * (6 - wordLength + 1));
    }
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
        if (forceWord && i >= wordInsertIndex && i < wordInsertIndex + wordLength) {
            var forcedChar = forcedWord.charAt(i - wordInsertIndex);
            chars.push(forcedChar);
            letterCount++;
            continue;
        }
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

function applyRandomDynamiteFuse() {
    if (!dynamiteFuseMaterials || dynamiteFuseMaterials.length === 0) {
        return "";
    }
    var colorNames = ["red", "green", "blue", "yellow"];
    var maxIndex = Math.min(dynamiteFuseMaterials.length, colorNames.length) - 1;
    var index = global.utils && global.utils.rng
        ? global.utils.rng(0, maxIndex)
        : Math.floor(Math.random() * (maxIndex + 1));
    var selectedMaterial = dynamiteFuseMaterials[index];
    if (!selectedMaterial) {
        return "";
    }
    var clonedMaterial = selectedMaterial.clone();
    for (var i = 0; i < dynamiteFuseObjects.length; i++) {
        var obj = dynamiteFuseObjects[i];
        if (!obj) { continue; }
        var visual = obj.getComponent("Component.RenderMeshVisual");
        if (!visual) { continue; }
        visual.mainMaterial = clonedMaterial;
    }
    return colorNames[index] || "";
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

function cloneModuleDisplayMaterials() {
    for(var m = 0; m < moduleSlots.length; m++) {
        var imageComponent = script.moduleSlots[m].getChild(0).getChild(0).getChild(0).getComponent('Component.Image');
        var newMaterial = imageComponent.mainMaterial.clone();
        imageComponent.clearMaterials();
        imageComponent.addMaterial(newMaterial);
    }
}

function cloneSafeBodyMaterial() {
    var safeRMV = script.safeBody.getComponent('Component.RenderMeshVisual');
    var newBodyMaterial = safeRMV.mainMaterial.clone();
    safeRMV.clearMaterials();
    safeRMV.addMaterial(newBodyMaterial);
    safeBodyMaterial = safeRMV.mainMaterial;
}

function cloneTimerScreenMaterial() {
    var newTimerMaterial = script.timerScreenRMV.mainMaterial.clone();
}

// WIN CONDITIONS
function safeFailed() {
    if (safeFailedTriggered) { return; }
    safeFailedTriggered = true;

    global.resetRotation();
    global.utils.delay(3, function() {
        global.safeFailed();
    });
}

function checkSafeSolved() {
    if(!global.utils.arrayAllTrue(solvedModules)) return;

    global.utils.delay(0.5, function() {
        global.resetRotation();
        global.utils.delay(0.5, function() {
            // here we want to transition safeBodyMaterial's progress property to 1, in 0.25s
            if (safeBodyMaterial) {
                animateProgress(safeBodyMaterial, 1, 0.25);
            }
            global.tweenManager.startTween(script.getSceneObject(), "safe-door-open", function() {
                global.utils.delay(3, function() {
                    global.safeComplete();
                });
            });
        });
    });
}

script.completeModule = function(slotId) {
    solvedModules[slotId] = true;
    var imageComponent = script.moduleSlots[slotId].getChild(0).getChild(0).getChild(0).getComponent('Component.Image');
    if (imageComponent && imageComponent.mainMaterial) {
        animateProgress(imageComponent.mainMaterial, 1, 0.25);
    }
    global.playSfx(20, 1, 1);
    checkSafeSolved();
}

script.applyPenalty = function(seconds) {
    var penalty = Math.max(0, Math.floor(seconds || 0));
    if (penalty <= 0) { return; }
    var prevSeconds = countdownSeconds;
    countdownSeconds = Math.max(0, countdownSeconds - penalty);
    displayTimerValue(countdownSeconds);
    global.playSfx(21, 1, 1);

    if (!criticalTimeActive && prevSeconds >= 60 && countdownSeconds < 60 && countdownSeconds > 0) {
        criticalTimeActive = true;
        global.playSfx(19, 1, 1, "criticalTime");
    }

    if (countdownSeconds <= 0) {
        if (criticalTimeActive) {
            global.stopSfx("criticalTime");
            criticalTimeActive = false;
        }
        countdownActive = false;
        safeFailed();
    }
}

function addToAppState(serialNumber, fuseColor, moduleList) {
    global.appState.safe = {
        object: script.getSceneObject(),
        serialNumber: serialNumber,
        moduleList: moduleList,
        dynamiteFuseColor: fuseColor
    }
}

function debug(label, debugValue) {
    if(!script.enableDebug) return;
    safeDebugText.text = safeDebugText.text + "\n" + label + ": " + debugValue;
}

function configureModules() {
    for (var i = 0; i < activeModuleObjects.length; i++) {
        var moduleObject = activeModuleObjects[i];
        if (!moduleObject) { continue; }
        var scriptComponents = moduleObject.getComponents("Component.ScriptComponent");
        for (var j = 0; j < scriptComponents.length; j++) {
            if (scriptComponents[j] && scriptComponents[j].setupModule) {
                scriptComponents[j].setupModule(global.appState.safe, script, i);
            }
        }
    }
}

script.animationFinished = function() {
    for (var i = 0; i < activeModuleObjects.length; i++) {
        var moduleObject = activeModuleObjects[i];
        if (!moduleObject) { continue; }
        var scriptComponents = moduleObject.getComponents("Component.ScriptComponent");
        for (var j = 0; j < scriptComponents.length; j++) {
            if (scriptComponents[j] && scriptComponents[j].animationFinished) {
                scriptComponents[j].animationFinished();
            }
        }
    }
};

script.init = function() {
    var dynamiteFuseColor = applyRandomDynamiteFuse();

    cloneSafeBodyMaterial();

    cloneModuleDisplayMaterials();

    var serialNumber = generateSerialNumber();


    script.serialNumberText.text = serialNumber.string;
    debug("Serial Number", serialNumber.string);


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
    
    addToAppState(serialNumber, dynamiteFuseColor, moduleList);

    configureModules();

    startCountdown(script.bombTimer);
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

script.getContext = function() {
    return {
        serialNumber: activeSerialNumber ? activeSerialNumber.string : "",
        moduleIds: activeModuleList,
        solved: solvedModules
    };
};
