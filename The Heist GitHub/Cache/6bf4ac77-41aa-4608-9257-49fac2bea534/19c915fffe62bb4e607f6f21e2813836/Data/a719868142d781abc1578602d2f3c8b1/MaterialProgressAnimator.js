"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAllProgressTweens = stopAllProgressTweens;
exports.animateProgress = animateProgress;
const LSTween_1 = require("LSTween.lspkg/LSTween");
const activeTweens = [];
function getProgress(material) {
    if (!material) {
        return null;
    }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        return material.mainPass.progress;
    }
    if (material.progress !== undefined) {
        return material.progress;
    }
    return null;
}
function setProgress(material, value) {
    if (!material) {
        return;
    }
    if (material.mainPass && material.mainPass.progress !== undefined) {
        material.mainPass.progress = value;
    }
    else if (material.progress !== undefined) {
        ;
        material.progress = value;
    }
}
function stopAllProgressTweens() {
    for (const tween of activeTweens) {
        tween?.stop?.();
    }
    activeTweens.length = 0;
}
function animateProgress(material, targetValue, durationSec, onComplete) {
    if (!material) {
        onComplete?.();
        return;
    }
    const startValue = getProgress(material);
    if (startValue === null || startValue === undefined) {
        onComplete?.();
        return;
    }
    const tween = LSTween_1.LSTween.rawTween(durationSec * 1000)
        .onUpdate((t) => {
        const smoothT = t * t * (3 - 2 * t);
        const value = startValue + (targetValue - startValue) * smoothT;
        setProgress(material, value);
    })
        .onComplete(() => {
        setProgress(material, targetValue);
        onComplete?.();
    });
    activeTweens.push(tween);
    tween.start();
}
//# sourceMappingURL=MaterialProgressAnimator.js.map