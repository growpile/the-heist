"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeSolveSequence = void 0;
const LSTween_1 = require("LSTween.lspkg/LSTween");
const Easing_1 = require("LSTween.lspkg/TweenJS/Easing");
const MaterialProgressAnimator_1 = require("./MaterialProgressAnimator");
const DOOR_OPEN_FROM = new vec3(90, 0, 180);
const DOOR_OPEN_TO = new vec3(90, -45, 180);
const DOOR_OPEN_MS = 250;
class SafeSolveSequence {
    constructor(safeBody, safeDoor, safeContents) {
        this.safeBodyMaterial = null;
        this.failedTriggered = false;
        this.safeBody = safeBody;
        this.safeDoor = safeDoor;
        this.safeContents = safeContents || [];
    }
    cloneSafeBodyMaterial() {
        if (!this.safeBody) {
            return;
        }
        const rmv = this.safeBody.getComponent("Component.RenderMeshVisual");
        if (!rmv || !rmv.mainMaterial) {
            return;
        }
        const newBodyMaterial = rmv.mainMaterial.clone();
        rmv.clearMaterials();
        rmv.addMaterial(newBodyMaterial);
        this.safeBodyMaterial = rmv.mainMaterial;
    }
    playFailSequence(onComplete) {
        if (this.failedTriggered) {
            return;
        }
        this.failedTriggered = true;
        global.resetRotation();
        global.utils.delay(3, () => {
            onComplete();
        });
    }
    playWinSequence(safeType, onPresentationReady) {
        if (safeType === "tutorial") {
            global.appState.setStorage("tutorialPlayed", true);
        }
        global.utils.delay(0.5, () => {
            global.resetRotation();
            if (this.safeContents[0]) {
                this.safeContents[0].enabled = false;
            }
            if (this.safeContents[1]) {
                this.safeContents[1].enabled = true;
            }
            global.utils.delay(0.5, () => {
                if (this.safeBodyMaterial) {
                    (0, MaterialProgressAnimator_1.animateProgress)(this.safeBodyMaterial, 1, 0.25);
                }
                const vol = global.appState.checkStorage("masterVolume");
                global.playSfx(26, 1, vol * 0.8);
                global.playSfx(27, 1, vol * 1);
                this.openDoor();
                global.utils.delay(DOOR_OPEN_MS / 1000 + 0.05, () => {
                    onPresentationReady();
                });
            });
        });
    }
    openDoor() {
        if (!this.safeDoor) {
            return;
        }
        const transform = this.safeDoor.getTransform();
        LSTween_1.LSTween.rotateFromToLocalInDegrees(transform, DOOR_OPEN_FROM, DOOR_OPEN_TO, DOOR_OPEN_MS)
            .easing(Easing_1.default.Back.Out)
            .start();
    }
}
exports.SafeSolveSequence = SafeSolveSequence;
//# sourceMappingURL=SafeSolveSequence.js.map