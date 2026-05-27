// @input SceneObject[] slotSpinners
/** @type {SceneObject[]} */
var slotSpinners = script.slotSpinners;

// @input SceneObject lever
/** @type {SceneObject} */
var lever = script.lever;

// @input SceneObject leverBall
/** @type {SceneObject} */
var leverBall = script.leverBall;

// @input SceneObject leverHandle
/** @type {SceneObject} */
var leverHandle = script.leverHandle;
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

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

script.setupModule = function(safeContext, safeComponent, slotId) {
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
    var remaining = 0;
    for (var i = 0; i < slotSpinners.length; i++) {
        var spinner = slotSpinners[i];
        if (!spinner) { continue; }
        remaining++;
        var transform = spinner.getTransform();
        var startQuat = transform.getLocalRotation();
        if (spinner.__spinAnim && spinner.__spinAnim.updateEvent) {
            spinner.__spinAnim.updateEvent.enabled = false;
            spinner.__spinAnim.updateEvent = null;
        }
        var step = getSymbolStep(symbols[i] || "diamond");
        var rotations = 5 + i;
        var totalDegrees = 360 * rotations + step * 90;
        var totalRadians = totalDegrees * DEG_TO_RAD;
        var duration = SPIN_DURATION * (rotations / 5);
        var animData = {
            startTime: getTime(),
            updateEvent: script.createEvent("UpdateEvent")
        };
        spinner.__spinAnim = animData;

        (function(tfm, startQ, anim, totalRad, spinIndex, spinDuration) {
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
                    tfm.setLocalRotation(startQ.multiply(quat.angleAxis(totalRad, vec3.right())));
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
                        if (callback) { callback(); }
                    }
                }
            });
        })(transform, startQuat, animData, totalRadians, i, duration);
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
        var swingDir = verticalDelta >= 0 ? "UP" : "DOWN";
        print("Lever Swing " + (swingDir === "UP" ? "Up" : "Down"));
        if (leverInteractableManipulation && leverInteractableManipulation.release) {
            leverInteractableManipulation.release();
        }
        if (leverInteractableManipulation && leverInteractableManipulation.setCanTranslate) {
            leverInteractableManipulation.setCanTranslate(false);
        }
        handleLeverSwing(swingDir);
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
                    leverInteractableManipulation.setCanTranslate(true);
                    leverHandle.getTransform().setWorldPosition(leverBall.getTransform().getWorldPosition());
                }
            }
        }
    }

    var delta = quat.angleAxis(currentLeverAngle * DEG_TO_RAD, vec3.right());
    var newRot = baseLeverRotation.multiply(delta);
    lever.getTransform().setLocalRotation(newRot);
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
        if (streakCount >= 5) {
            print("Casino Carousel Module solved");
            return;
        }
        displayRandomCombo();
    } else {
        print("Casino Carousel Module streak reset");
        streakCount = 0;
        comboCounts = {};
        displayRandomCombo();
    }
}
