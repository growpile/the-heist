// @input SceneObject[] slotSpinners
/** @type {SceneObject[]} */
var slotSpinners = script.slotSpinners;

// @input SceneObject[] sequenceLamps
/** @type {SceneObject[]} */
var sequenceLamps = script.sequenceLamps;

// @input SceneObject lever
/** @type {SceneObject} */
var lever = script.lever;

// @input SceneObject leverBall
/** @type {SceneObject} */
var leverBall = script.leverBall;

// @input SceneObject leverHandle
/** @type {SceneObject} */
var leverHandle = script.leverHandle;
// @input SceneObject[] sequenceLamps
/** @type {SceneObject[]} */
var sequenceLamps = script.sequenceLamps;
// @input float leverMaxDegrees = 30
/** @type {number} */
var leverMaxDegrees = script.leverMaxDegrees;
// @input float leverMinDistance = 0.1
/** @type {number} */
var leverMinDistance = script.leverMinDistance;

var SPIN_DURATION = 3;
var DEG_TO_RAD = 0.0174533;
var spinnerMaterials = [];
var baseLeverRotation = null;
var currentLeverAngle = 0;
var leverAnimState = "idle";
var leverAnimStart = 0;
var leverAnimDirection = 1;
var isLeverAnimating = false;
var currentComboKey = null;
var expectedDirection = null;
var comboCounts = {};
var streakCount = 0;
var conditionKey = "default";
var fuseColor = "red";
var isSpinning = false;
var spinnerBaseRotations = [];
var spinnerBaseInitialized = false;
var spinnerCurrentSteps = [];
var lampMaterials = [];
var spinnerProgress = [];
var spinSfxTimer = 0;
var pendingNextCombo = false;
var pendingResolveDirection = null;
script.safeComponent;
script.slotId;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

script.setupModule = function(safeContext, safeComponent, slotId) {
    script.safeComponent = safeComponent;
    script.slotId = slotId;
    createSpinnerMaterials();
    initPuzzle(safeContext);
};

script.animationFinished = function() {
};

function collectSpinnerVisuals(sceneObject, visuals) {
    if (!sceneObject) { return; }
    var rmv = sceneObject.getComponent("Component.RenderMeshVisual");
    if (rmv) {
        visuals.push(rmv);
    }
    var childCount = sceneObject.getChildrenCount();
    for (var i = 0; i < childCount; i++) {
        collectSpinnerVisuals(sceneObject.getChild(i), visuals);
    }
}

function createSpinnerMaterials() {
    spinnerMaterials = [];
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        if (!spinnerBaseInitialized) {
            spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation();
            spinnerCurrentSteps[i] = 0;
        } else if (!spinnerBaseRotations[i]) {
            spinnerBaseRotations[i] = spinner.getTransform().getLocalRotation();
            spinnerCurrentSteps[i] = 0;
        }
        var visuals = [];
        collectSpinnerVisuals(spinner, visuals);
        var spinnerMats = [];
        for (var v = 0; v < visuals.length; v++) {
            var visual = visuals[v];
            if (!visual || !visual.mainMaterial) { continue; }
            var cloned = visual.mainMaterial.clone();
            visual.clearMaterials();
            visual.mainMaterial = cloned;
            if (cloned.mainPass && cloned.mainPass.progress !== undefined) {
                cloned.mainPass.progress = 0;
            } else if (cloned.progress !== undefined) {
                cloned.progress = 0;
            }
            spinnerMats.push(cloned);
        }
        spinnerMaterials[i] = spinnerMats;
    }
    spinnerBaseInitialized = true;
}

function initSequenceLamps() {
    lampMaterials = [];
    for (var i = 0; i < sequenceLamps.length; i++) {
        var lampObj = sequenceLamps[i];
        if (!lampObj) { continue; }
        var visual = lampObj.getComponent("Component.RenderMeshVisual");
        if (!visual || !visual.mainMaterial) { continue; }
        var cloned = visual.mainMaterial.clone();
        visual.clearMaterials();
        visual.mainMaterial = cloned;
        if (cloned.mainPass && cloned.mainPass.state !== undefined) {
            cloned.mainPass.state = 0;
        }
        if (cloned.mainPass && cloned.mainPass.glowAmount !== undefined) {
            cloned.mainPass.glowAmount = 0;
        }
        lampMaterials[i] = cloned;
    }
}

function animateLamp(material, targetValue, duration, callback) {
    if (!material || !material.mainPass) {
        if (callback) { callback(); }
        return;
    }
    if (!material.__lampAnim) {
        material.__lampAnim = {};
    }
    if (material.__lampAnim.updateEvent) {
        material.__lampAnim.updateEvent.enabled = false;
        material.__lampAnim.updateEvent = null;
    }
    var startState = material.mainPass.state || 0;
    var startGlow = material.mainPass.glowAmount || 0;
    var animData = {
        startTime: getTime(),
        updateEvent: script.createEvent("UpdateEvent")
    };
    material.__lampAnim = animData;
    animData.updateEvent.bind(function() {
        var elapsed = getTime() - animData.startTime;
        var t = Math.min(elapsed / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        if (material.mainPass.state !== undefined) {
            material.mainPass.state = startState + (targetValue - startState) * smoothT;
        }
        if (material.mainPass.glowAmount !== undefined) {
            material.mainPass.glowAmount = startGlow + (targetValue - startGlow) * smoothT;
        }
        if (t >= 1) {
            if (material.mainPass.state !== undefined) {
                material.mainPass.state = targetValue;
            }
            if (material.mainPass.glowAmount !== undefined) {
                material.mainPass.glowAmount = targetValue;
            }
            animData.updateEvent.enabled = false;
            animData.updateEvent = null;
            if (callback) { callback(); }
        }
    });
}

function getSymbolStep(symbolId) {
    if (symbolId === "diamond") { return 0; }
    if (symbolId === "spade") { return 1; }
    if (symbolId === "heart") { return 2; }
    if (symbolId === "club") { return 3; }
    return 0;
}

function spinSlotsToCombo(symbols, callback) {
    if (spinnerMaterials.length === 0) {
        createSpinnerMaterials();
    }
    isSpinning = true;
    spinSfxTimer = 0;
    var remaining = 0;
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        remaining++;
        var transform = spinner.getTransform();
        var startQuat = spinnerBaseRotations[i] || transform.getLocalRotation();
        if (spinner.__spinAnim && spinner.__spinAnim.updateEvent) {
            spinner.__spinAnim.updateEvent.enabled = false;
            spinner.__spinAnim.updateEvent = null;
        }
        var targetStep = getSymbolStep(symbols[i] || "diamond");
        var currentStep = spinnerCurrentSteps[i] !== undefined ? spinnerCurrentSteps[i] : 0;
        var deltaStep = (targetStep - currentStep + 4) % 4;
        var rotations = 3 + i;
        var totalDegrees = 360 * rotations + deltaStep * 90;
        var totalRadians = totalDegrees * DEG_TO_RAD;
        var duration = SPIN_DURATION * (rotations / 3);
        var animData = {
            startTime: getTime(),
            updateEvent: script.createEvent("UpdateEvent")
        };
        spinner.__spinAnim = animData;

        (function(tfm, startQ, anim, totalRad, spinIndex, spinDuration, targetStepValue) {
            anim.updateEvent.bind(function() {
                var elapsed = getTime() - anim.startTime;
                var t = Math.min(elapsed / spinDuration, 1);
                var smoothT = t * t * (3 - 2 * t);
                var angle = totalRad * smoothT;
                var mats = spinnerMaterials[spinIndex] || [];
                for (var m = 0; m < mats.length; m++) {
                    var mat = mats[m];
                    if (!mat) { continue; }
                    var progress = smoothT < 0.25 ? smoothT * 4 : (smoothT > 0.75 ? (1 - smoothT) * 4 : 1);
                    spinnerProgress[spinIndex] = progress;
                    if (mat.mainPass && mat.mainPass.progress !== undefined) {
                        mat.mainPass.progress = progress;
                    } else if (mat.progress !== undefined) {
                        mat.progress = progress;
                    }
                }
                var delta = quat.angleAxis(angle, vec3.right());
                var current = startQ.multiply(delta);
                current.normalize();
                tfm.setLocalRotation(current);
                if (t >= 1) {
                    var finalRot = startQ.multiply(quat.angleAxis(totalRad, vec3.right()));
                    tfm.setLocalRotation(finalRot);
                    spinnerBaseRotations[spinIndex] = finalRot;
                    spinnerCurrentSteps[spinIndex] = targetStepValue;
                    global.playSfx(14, 1, 1);
                    for (var m2 = 0; m2 < mats.length; m2++) {
                        var mat2 = mats[m2];
                        if (!mat2) { continue; }
                        if (mat2.mainPass && mat2.mainPass.progress !== undefined) {
                            mat2.mainPass.progress = 0;
                        } else if (mat2.progress !== undefined) {
                            mat2.progress = 0;
                        }
                    }
                    anim.updateEvent.enabled = false;
                    anim.updateEvent = null;
                    remaining--;
                    if (remaining <= 0) {
                        isSpinning = false;
                        spinnerProgress = [];
                        if (leverInteractableManipulation && leverInteractableManipulation.setCanTranslate && !isLeverAnimating) {
                            leverInteractableManipulation.setCanTranslate(true);
                        }
                        if (callback) { callback(); }
                    }
                }
            });
        })(transform, startQuat, animData, totalRadians, i, duration, targetStep);
    }
}

createSpinnerMaterials();

var following = false;
function onHandleStart() {
    following = true;

}

function onHandleEnd() {
    following = false;
    leverHandle.getTransform().setWorldPosition(leverBall.getTransform().getWorldPosition());
}


var leverInteractableManipulation = leverHandle.getComponent("Component.ScriptComponent");
var leverInteractable = leverHandle.getComponents("Component.ScriptComponent")[1];

script.createEvent("OnStartEvent").bind(function(eventData){
    leverInteractableManipulation.onTranslationStart.add(onHandleStart);
    leverInteractableManipulation.onTranslationEnd.add(onHandleEnd);
});


script.createEvent("UpdateEvent").bind(function(eventData){
    if (!leverHandle || !leverBall || !lever) { return; }
    if (!baseLeverRotation) {
        baseLeverRotation = lever.getTransform().getLocalRotation();
        currentLeverAngle = 0;
    }
    var handlePos = leverHandle.getTransform().getWorldPosition();
    var ballPos = leverBall.getTransform().getWorldPosition();
    var verticalDelta = handlePos.y - ballPos.y;
    var verticalDistance = Math.abs(verticalDelta);
    var direction = verticalDelta >= 0 ? -1 : 1;

    if (!isLeverAnimating && leverAnimState === "idle" && verticalDistance >= (leverMinDistance || 0)) {
        leverAnimState = "swingUp";
        leverAnimStart = getTime();
        leverAnimDirection = direction;
        isLeverAnimating = true;
        global.playSfx(global.utils.rng(10, 12), 1, 1)
        var swingDir = verticalDelta >= 0 ? "UP" : "DOWN";
        print("Lever Swing " + (swingDir === "UP" ? "Up" : "Down"));
        if (leverInteractableManipulation && leverInteractableManipulation.release) {
            leverInteractableManipulation.release();
        }
        if (leverInteractableManipulation && leverInteractableManipulation.setCanTranslate) {
            leverInteractableManipulation.setCanTranslate(false);
        }
        pendingResolveDirection = swingDir;
    }

    if (leverAnimState !== "idle") {
        var elapsed = getTime() - leverAnimStart;
        if (leverAnimState === "swingUp") {
            var tUp = clamp(elapsed / 0.25, 0, 1);
            var smoothUp = tUp * tUp * (3 - 2 * tUp);
            currentLeverAngle = (leverMaxDegrees || 0) * smoothUp * leverAnimDirection;
            if (tUp >= 1) {
                leverAnimState = "hold";
                leverAnimStart = getTime();
            }
        } else if (leverAnimState === "hold") {
            currentLeverAngle = (leverMaxDegrees || 0) * leverAnimDirection;
            if (elapsed >= 0.1) {
                leverAnimState = "swingDown";
                leverAnimStart = getTime();
            }
        } else if (leverAnimState === "swingDown") {
            var tDown = clamp(elapsed / 0.25, 0, 1);
            var smoothDown = tDown * tDown * (3 - 2 * tDown);
            currentLeverAngle = (leverMaxDegrees || 0) * (1 - smoothDown) * leverAnimDirection;
            if (tDown >= 1) {
                currentLeverAngle = 0;
                leverAnimState = "idle";
                leverHandle.getTransform().setWorldPosition(leverBall.getTransform().getWorldPosition());
                isLeverAnimating = false;
                if (leverInteractableManipulation && leverInteractableManipulation.setCanTranslate) {
                    leverHandle.getTransform().setWorldPosition(leverBall.getTransform().getWorldPosition());
                }
                if (pendingResolveDirection) {
                    var resolveDir = pendingResolveDirection;
                    pendingResolveDirection = null;
                    handleLeverSwing(resolveDir);
                }
                if (pendingNextCombo && !isSpinning) {
                    pendingNextCombo = false;
                    displayRandomCombo();
                }
            }
        }
    }

    var delta = quat.angleAxis(currentLeverAngle * DEG_TO_RAD, vec3.right());
    var newRot = baseLeverRotation.multiply(delta);
    lever.getTransform().setLocalRotation(newRot);

    updateSpinSfx();
});

function getSerialInfo(serialNumber) {
    var serialString = "";
    var containsWord = false;
    var numberCount = 0;
    if (serialNumber) {
        if (typeof serialNumber === "string") {
            serialString = serialNumber;
        } else {
            serialString = serialNumber.string || "";
            if (typeof serialNumber.containsWord === "boolean") {
                containsWord = serialNumber.containsWord;
            }
            if (typeof serialNumber.numberCount === "number") {
                numberCount = serialNumber.numberCount;
            }
        }
    }
    if (serialString && typeof serialNumber !== "object") {
        for (var i = 0; i < serialString.length; i++) {
            var ch = serialString.charAt(i);
            if (ch >= "0" && ch <= "9") {
                numberCount++;
            }
        }
    }
    return { containsWord: containsWord, numberCount: numberCount };
}

function initPuzzle(safeContext) {
    var serialInfo = getSerialInfo(safeContext.serialNumber);
    fuseColor = (safeContext.dynamiteFuseColor || "red").toLowerCase();
    if (serialInfo.containsWord) {
        conditionKey = "word";
    } else if (serialInfo.numberCount > 3) {
        conditionKey = "numbers";
    } else {
        conditionKey = "default";
    }
    comboCounts = {};
    streakCount = 0;
    initSequenceLamps();
    displayRandomCombo();
}

function getComboDefinitions() {
    return {
        HHH: ["heart", "heart", "heart"],
        DCD: ["diamond", "club", "diamond"],
        SSS: ["spade", "spade", "spade"],
        CDS: ["club", "diamond", "spade"]
    };
}

function getRuleTable() {
    return {
        word: {
            HHH: { red: "DOWN", green: "DOWN", blue: "UP", yellow: "DOWN" },
            DCD: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN" },
            SSS: { red: "UP", green: "DOWN", blue: "UP", yellow: "UP" },
            CDS: { red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN" }
        },
        numbers: {
            SSS: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "DOWN" },
            DCD: { red: "UP", green: "DOWN", blue: "UP", yellow: "UP" },
            CDS: { red: "DOWN", green: "DOWN", blue: "UP", yellow: "UP" },
            HHH: { red: "UP", green: "UP", blue: "DOWN", yellow: "UP" }
        },
        default: {
            CDS: { red: "UP", green: "UP", blue: "DOWN", yellow: "DOWN" },
            HHH: { red: "DOWN", green: "DOWN", blue: "DOWN", yellow: "UP" },
            DCD: { red: "DOWN", green: "UP", blue: "DOWN", yellow: "UP" },
            SSS: { red: "UP", green: "DOWN", blue: "UP", yellow: "DOWN" }
        }
    };
}

function displayRandomCombo() {
    var combos = getComboDefinitions();
    var keys = Object.keys(combos);
    var idx = global.utils && global.utils.rng
        ? global.utils.rng(0, keys.length - 1)
        : Math.floor(Math.random() * keys.length);
    currentComboKey = keys[idx];
    var symbols = combos[currentComboKey];
    if (!comboCounts[currentComboKey]) {
        comboCounts[currentComboKey] = 0;
    }
    comboCounts[currentComboKey] += 1;
    var baseDir = getRuleTable()[conditionKey][currentComboKey][fuseColor];
    var flip = comboCounts[currentComboKey] % 2 === 0;
    expectedDirection = flip ? (baseDir === "UP" ? "DOWN" : "UP") : baseDir;
    spinSlotsToCombo(symbols);
}

function handleLeverSwing(direction) {
    if (isSpinning) { return; }
    if (!currentComboKey || !expectedDirection) { return; }
    if (direction === expectedDirection) {
        streakCount++;
        if (lampMaterials[streakCount - 1]) {
            global.playSfx(15, 1, 1);
            animateLamp(lampMaterials[streakCount - 1], 1, 0.25);
        }
        if (streakCount >= 5) {
            print("Casino Carousel Module solved");
            if (leverInteractableManipulation && leverInteractableManipulation.setCanTranslate) {
                leverInteractableManipulation.setCanTranslate(false);
            }
            if (leverHandle) {
                leverHandle.enabled = false;
            }
            script.moduleCompleted();
            return;
        }
        pendingNextCombo = true;
    } else {
        print("Casino Carousel Module streak reset");
        streakCount = 0;
        comboCounts = {};
        for (var i = 0; i < lampMaterials.length; i++) {
            if (lampMaterials[i]) {
                animateLamp(lampMaterials[i], 0, 0.25);
            }
        }
        script.modulePenalty();
        pendingNextCombo = true;
    }
}

function updateSpinSfx() {
    if (!isSpinning) {
        spinSfxTimer = 0;
        return;
    }
    var maxProgress = 0;
    for (var i = 0; i < spinnerProgress.length; i++) {
        if (spinnerProgress[i] > maxProgress) {
            maxProgress = spinnerProgress[i];
        }
    }
    var rate = 2 + (2 * maxProgress); // 2/sec up to 4/sec
    var interval = rate > 0 ? 1 / rate : 0.5;
    spinSfxTimer += getDeltaTime();
    while (spinSfxTimer >= interval) {
        spinSfxTimer -= interval;
        global.playSfx(13, 1, 1);
        print("a");
    }
}

script.moduleCompleted = function() {
    script.safeComponent.completeModule(script.slotId);
};

script.modulePenalty = function() {
    script.safeComponent.applyPenalty(20);
};
