"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAllProgressTweens = stopAllProgressTweens;
exports.animateProgress = animateProgress;
exports.initializeModuleScreenMaterial = initializeModuleScreenMaterial;
exports.animateModuleScreenSolved = animateModuleScreenSolved;
exports.animateGlowAmount = animateGlowAmount;
const MaterialPropertyHelpers_1 = require("./MaterialPropertyHelpers");
const activeTweens = [];
function getProgress(material) {
    return (0, MaterialPropertyHelpers_1.getMaterialScalar)(material, "progress");
}
function setProgress(material, value) {
    (0, MaterialPropertyHelpers_1.setMaterialScalar)(material, "progress", value);
}
function stopAllProgressTweens() {
    for (const tween of activeTweens) {
        tween?.stop?.();
    }
    activeTweens.length = 0;
}
function animateProgress(material, targetValue, durationSec, onComplete) {
    (0, MaterialPropertyHelpers_1.animateMaterialScalar)(material, "progress", targetValue, durationSec, onComplete);
}
/** Module Screen Shader idle — progress full, state unsolved. */
function initializeModuleScreenMaterial(material) {
    if (!material) {
        return;
    }
    (0, MaterialPropertyHelpers_1.setMaterialScalar)(material, "progress", 1);
    (0, MaterialPropertyHelpers_1.setMaterialScalar)(material, "state", 0);
}
/** Module Screen Shader solve — lock in solved state and stop motion. */
function animateModuleScreenSolved(material, durationSec, onComplete) {
    if (!material) {
        onComplete?.();
        return;
    }
    let remaining = 0;
    const finish = () => {
        remaining--;
        if (remaining <= 0) {
            onComplete?.();
        }
    };
    const queue = (key, target) => {
        if ((0, MaterialPropertyHelpers_1.getMaterialScalar)(material, key) === null) {
            return;
        }
        remaining++;
        (0, MaterialPropertyHelpers_1.animateMaterialScalar)(material, key, target, durationSec, finish);
    };
    queue("state", 1);
    queue("speed", 0);
    if (remaining === 0) {
        onComplete?.();
    }
}
function animateGlowAmount(material, targetValue, durationSec, onComplete) {
    (0, MaterialPropertyHelpers_1.animateMaterialScalar)(material, "glowAmount", targetValue, durationSec, onComplete);
}
//# sourceMappingURL=MaterialProgressAnimator.js.map