// @input SceneObject buttonFace
// @input bool customFaceSize
// @input vec3 faceSize {"showIf":"customFaceSize"}
// @input vec2 pressThresholds
// @input float maxTravel = 1.5
// @input Component.ScriptComponent externalScript
// @input string externalFunctionName
// @input bool callWithArgument = false "Call With Argument"
// @input string argument {"showIf":"callWithArgument"}
// @input bool debugLogs = true
// @input bool pushX
// @input bool pushY
// @input bool pushZ

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");
var InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;

var warnedNoFace = false;
var baseLocalPos = null;
var currentDepth = 0;
var targetDepth = 0;
var DEPTH_LERP = 15.0;
var hoverActive = false;
var triggerActive = false;
var pinchStartTime = 0;
var pinchAnimStart = 0;
var pinchAnimating = false;
var PINCH_ANIM_DURATION = 0.25;
var isDisabled = false;

function log(msg) {
    if (script.debugLogs) {
        print("[PushButton] " + msg);
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function getPushAxisConfig(rot, size) {
    var axisLocal = vec3.forward();
    var axisSize = size.z;
    if (script.pushX) {
        axisLocal = vec3.right();
        axisSize = size.x;
    } else if (script.pushY) {
        axisLocal = vec3.up();
        axisSize = size.y;
    } else if (script.pushZ) {
        axisLocal = vec3.forward();
        axisSize = size.z;
    }
    var axisWorld = rot.multiplyVec3(axisLocal).normalize();
    return { axisLocal: axisLocal, axisWorld: axisWorld, axisSize: axisSize };
}

function getPlaneInfo(rot, size) {
    var axisU;
    var axisV;
    var halfU;
    var halfV;
    var halfDepth;

    if (script.pushX) {
        axisU = rot.multiplyVec3(vec3.up()).normalize();
        axisV = rot.multiplyVec3(vec3.forward()).normalize();
        halfU = size.y * 0.5;
        halfV = size.z * 0.5;
        halfDepth = size.x * 0.5;
    } else if (script.pushY) {
        axisU = rot.multiplyVec3(vec3.right()).normalize();
        axisV = rot.multiplyVec3(vec3.forward()).normalize();
        halfU = size.x * 0.5;
        halfV = size.z * 0.5;
        halfDepth = size.y * 0.5;
    } else {
        axisU = rot.multiplyVec3(vec3.right()).normalize();
        axisV = rot.multiplyVec3(vec3.up()).normalize();
        halfU = size.x * 0.5;
        halfV = size.y * 0.5;
        halfDepth = size.z * 0.5;
    }

    return { axisU: axisU, axisV: axisV, halfU: halfU, halfV: halfV, halfDepth: halfDepth };
}

function invokeExternal() {
    if (!script.externalScript || !script.externalFunctionName) {
        return;
    }
    var fn = script.externalScript[script.externalFunctionName];
    if (typeof fn === "function") {
        if (script.callWithArgument) {
            log("External argument: " + (script.argument || ""));
            if (script.argument !== undefined && script.argument !== null && script.argument !== "") {
                fn.call(script.externalScript, script.argument);
                return;
            }
        }
        fn.call(script.externalScript);
    }
}

function getFaceTransform() {
    if (!script.buttonFace) {
        return null;
    }
    return script.buttonFace.getTransform();
}

function isInsideBounds(point, center, halfSize) {
    var offset = point.sub(center);
    return (
        Math.abs(offset.x) <= halfSize.x &&
        Math.abs(offset.y) <= halfSize.y &&
        Math.abs(offset.z) <= halfSize.z
    );
}

function isInsideFacePlane(point, center, planeInfo, axisWorld) {
    var offset = point.sub(center);
    var planeDist = offset.dot(axisWorld);
    if (Math.abs(planeDist) > planeInfo.halfDepth) {
        return false;
    }
    var u = offset.dot(planeInfo.axisU);
    var v = offset.dot(planeInfo.axisV);
    return Math.abs(u) <= planeInfo.halfU && Math.abs(v) <= planeInfo.halfV;
}

function checkHand(hand, center, planeInfo, axisWorld) {
    if (!hand || !hand.isTracked()) {
        return false;
    }
    var tips = [
        { name: "index", pos: hand.indexTip.position },
    ];
    for (var i = 0; i < tips.length; i++) {
        var tip = tips[i];
        if (isInsideFacePlane(tip.pos, center, planeInfo, axisWorld)) {
            log("In face area: " + hand.handType + " " + tip.name);
            return true;
        }
    }
    return false;
}

function isHitButtonFace(hitInfo) {
    if (!hitInfo || !hitInfo.hit || !hitInfo.hit.collider) {
        return false;
    }
    
    var so = hitInfo.hit.collider.getSceneObject();
    while (so) {
        if (so === script.buttonFace) {
            return true;
        }
        so = so.getParent ? so.getParent() : null;
    }
    return false;
}

function checkEditorPinch() {
    if (!global.deviceInfoSystem || !global.deviceInfoSystem.isEditor()) {
        return;
    }
    var interactorList = SIK.InteractionManager.getTargetingInteractors();
    var primaryInteractor = interactorList.length > 0 ? interactorList[0] : null;
    if (!primaryInteractor) {
        return;
    }

    if (primaryInteractor.previousTrigger === InteractorTriggerType.None &&
        primaryInteractor.currentTrigger !== InteractorTriggerType.None) {
        pinchStartTime = getTime();
    }

    if (primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
        primaryInteractor.currentTrigger === InteractorTriggerType.None) {
        if (isHitButtonFace(primaryInteractor.targetHitInfo)) {
            startPinchAnimation();
        }
    }
}

function startPinchAnimation() {
    pinchAnimStart = getTime();
    pinchAnimating = true;
}

function onUpdate() {
    var faceTransform = getFaceTransform();
    if (!faceTransform) {
        if (!warnedNoFace) {
            log("buttonFace not set");
            warnedNoFace = true;
        }
        return;
    }
    warnedNoFace = false;
    if (baseLocalPos === null) {
        baseLocalPos = faceTransform.getLocalPosition();
    }

    if (isDisabled) {
        targetDepth = 0;
        currentDepth = currentDepth + (targetDepth - currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1);
        var idleAxis = getPushAxisConfig(faceTransform.getWorldRotation(), script.buttonFace.getComponent('Physics.ColliderComponent').shape.size);
        var idlePos = baseLocalPos.add(idleAxis.axisLocal.uniformScale(-currentDepth));
        faceTransform.setLocalPosition(idlePos);
        return;
    }

    // Use current world transform so parenting/movement keeps zones aligned
    var center = faceTransform.getWorldPosition();
    var faceRot = faceTransform.getWorldRotation();

    var size = script.buttonFace.getComponent('Physics.ColliderComponent').shape.size;
    if(script.customFaceSize && script.faceSize) {
        size = script.faceSize;
    }

    var half = new vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    var axisConfig = getPushAxisConfig(faceRot, size);
    var planeInfo = getPlaneInfo(faceRot, size);
    // Face position is the front face center; use it directly for detection
    var detectionCenter = center;

    var anyHit = checkHand(leftHand, detectionCenter, planeInfo, axisConfig.axisWorld) ||
        checkHand(rightHand, detectionCenter, planeInfo, axisConfig.axisWorld);

    // Push behavior: move face inward along -forward based on deepest fingertip within bounds, smoothed
    var maxDepth = 0;
    if (anyHit) {
        var hands = [leftHand, rightHand];
        for (var h = 0; h < hands.length; h++) {
            var hand = hands[h];
            if (!hand || !hand.isTracked()) { continue; }
            var tips = [hand.indexTip.position];
            for (var t = 0; t < tips.length; t++) {
                if (!isInsideFacePlane(tips[t], center, planeInfo, axisConfig.axisWorld)) { continue; }
                var offset = tips[t].sub(center);
                var depth = -offset.dot(axisConfig.axisWorld); // positive when pushing inward
                if (depth > maxDepth) { maxDepth = depth; }
            }
        }
    }

    var travelLimit = script.maxTravel !== undefined ? script.maxTravel : axisConfig.axisSize;
    targetDepth = Math.min(Math.max(maxDepth, 0), Math.min(axisConfig.axisSize, travelLimit));

    var isEditor = global.deviceInfoSystem && global.deviceInfoSystem.isEditor();
    var usePinchAnim = pinchAnimating && isEditor;
    if (usePinchAnim) {
        var animElapsed = getTime() - pinchAnimStart;
        var animNormalized = clamp(animElapsed / PINCH_ANIM_DURATION, 0, 1);
        if (animNormalized >= 1) {
            pinchAnimating = false;
            usePinchAnim = false;
        } else {
            var mirrored = animNormalized <= 0.5 ? animNormalized * 2.0 : (1.0 - (animNormalized - 0.5) * 2.0);
            var animDepth = travelLimit * clamp(mirrored, 0, 1);
            targetDepth = animDepth;
            currentDepth = animDepth;
        }
    }

    if (!usePinchAnim) {
        currentDepth = currentDepth + (targetDepth - currentDepth) * clamp(getDeltaTime() * DEPTH_LERP, 0, 1);
    }

    if (baseLocalPos) {
        var localPos = baseLocalPos.add(axisConfig.axisLocal.uniformScale(-currentDepth));
        faceTransform.setLocalPosition(localPos);
    }

    // Progress-based hover/trigger thresholds
    var progress = travelLimit > 0 ? currentDepth / travelLimit : 0;
    var hoverThreshold = script.pressThresholds ? script.pressThresholds.x : 0.2;
    var triggerThreshold = script.pressThresholds ? script.pressThresholds.y : 0.8;

    if (progress >= hoverThreshold && !hoverActive) {
        hoverActive = true;
        log("hover");
        global.playSfx(3, 1, global.appState.checkStorage("masterVolume") * 1);
    } else if (progress < hoverThreshold) {
        hoverActive = false;
    }

    if (progress >= triggerThreshold && !triggerActive) {
        triggerActive = true;
        log("trigger");
        invokeExternal();
        global.playSfx(2, 1, global.appState.checkStorage("masterVolume") * 0.9);
    } else if (progress < triggerThreshold) {
        triggerActive = false;
    }

    checkEditorPinch();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

script.disable = function() {
    isDisabled = true;
    hoverActive = false;
    triggerActive = false;
    pinchAnimating = false;
};
