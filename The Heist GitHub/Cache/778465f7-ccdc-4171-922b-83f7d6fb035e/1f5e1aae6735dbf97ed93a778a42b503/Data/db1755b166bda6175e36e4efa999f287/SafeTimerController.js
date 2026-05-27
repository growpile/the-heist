"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeTimerController = void 0;
class SafeTimerController {
    constructor(bombTimer, timerScreenRMV, timerDigitTexts, timerBgTexts, onTimeUp) {
        this.countdownSeconds = 0;
        this.countdownAccumulator = 0;
        this.countdownActive = false;
        this.timerProgressActive = false;
        this.timerProgressElapsed = 0;
        this.timerProgressDuration = 0;
        this.tickingFast = false;
        this.updateEvent = null;
        this.timerScreenMaterial = null;
        this.timerDigitBaseColors = [];
        this.timerBgBaseColors = [];
        this.bombTimer = bombTimer;
        this.timerDigitTexts = timerDigitTexts || [];
        this.timerBgTexts = timerBgTexts || [];
        this.onTimeUp = onTimeUp;
        if (timerScreenRMV && timerScreenRMV.mainMaterial) {
            const cloned = timerScreenRMV.mainMaterial.clone();
            timerScreenRMV.clearMaterials();
            timerScreenRMV.addMaterial(cloned);
            this.timerScreenMaterial = timerScreenRMV.mainMaterial;
        }
    }
    cacheBaseColors() {
        this.timerDigitBaseColors = [];
        for (const text of this.timerDigitTexts) {
            if (text && text.textFill && text.textFill.color) {
                this.timerDigitBaseColors.push(text.textFill.color);
            }
            else {
                this.timerDigitBaseColors.push(new vec4(1, 1, 1, 1));
            }
        }
        this.timerBgBaseColors = [];
        for (const text of this.timerBgTexts) {
            if (text && text.textFill && text.textFill.color) {
                this.timerBgBaseColors.push(text.textFill.color);
            }
            else {
                this.timerBgBaseColors.push(new vec4(1, 1, 1, 1));
            }
        }
    }
    setBombTimer(seconds) {
        this.bombTimer = seconds;
    }
    getRemainingSeconds() {
        if (!this.countdownActive) {
            return Math.max(0, this.countdownSeconds);
        }
        const remaining = this.countdownSeconds - this.countdownAccumulator;
        return Math.max(0, remaining);
    }
    getSolvedSeconds(bombTimer, solveStarted) {
        if (!solveStarted) {
            return 0;
        }
        return Math.max(0, bombTimer - this.countdownSeconds + this.countdownAccumulator);
    }
    startCountdown(seconds) {
        this.countdownSeconds = Math.max(0, Math.floor(seconds || 0));
        this.countdownAccumulator = 0;
        this.countdownActive = this.countdownSeconds > 0;
        this.timerProgressActive = false;
        this.timerProgressElapsed = 0;
        this.timerProgressDuration = 0;
        this.displayTimerValue(this.countdownSeconds);
        if (this.countdownActive && this.countdownSeconds < 60) {
            this.enterCriticalPhase(this.countdownSeconds);
        }
    }
    applyPenalty(seconds) {
        const penalty = Math.max(0, Math.floor(seconds || 0));
        if (penalty <= 0) {
            return;
        }
        const prevSeconds = this.countdownSeconds;
        this.countdownSeconds = Math.max(0, this.countdownSeconds - penalty);
        this.displayTimerValue(this.countdownSeconds);
        global.playSfx(21, 1, 1);
        if (!this.timerProgressActive &&
            prevSeconds >= 60 &&
            this.countdownSeconds < 60 &&
            this.countdownSeconds > 0) {
            this.enterCriticalPhase(this.countdownSeconds);
        }
        if (this.timerProgressActive && this.timerProgressDuration > 0 && prevSeconds > this.countdownSeconds) {
            const remaining = this.countdownSeconds;
            let progress = 1 - remaining / this.timerProgressDuration;
            progress = Math.max(0, Math.min(progress, 1));
            this.timerProgressElapsed = progress * this.timerProgressDuration;
            this.setTimerScreenProgress(progress);
            this.setTimerDigitColorProgress(progress);
        }
        if (this.countdownSeconds <= 0) {
            this.countdownActive = false;
            this.stopTickingSfx();
            this.onTimeUp();
        }
    }
    startNormalTicking() {
        this.stopTickingSfx();
        const vol = global.appState.checkStorage("masterVolume");
        global.playSfx(18, -1, vol * 0.6, "tickNormal");
    }
    bindUpdate(updateEvent) {
        this.updateEvent = updateEvent;
        updateEvent.bind(() => this.onUpdate());
    }
    stop() {
        this.countdownActive = false;
        this.timerProgressActive = false;
        this.stopTickingSfx();
    }
    onUpdate() {
        if (!this.countdownActive) {
            return;
        }
        const dt = getDeltaTime();
        if (dt <= 0) {
            return;
        }
        this.countdownAccumulator += dt;
        while (this.countdownAccumulator >= 1.0 && this.countdownSeconds > 0) {
            this.countdownAccumulator -= 1.0;
            const prevSeconds = this.countdownSeconds;
            this.countdownSeconds -= 1;
            this.displayTimerValue(this.countdownSeconds);
            if (!this.timerProgressActive && prevSeconds >= 60 && this.countdownSeconds < 60) {
                this.enterCriticalPhase(this.countdownSeconds);
            }
            if (this.countdownSeconds <= 0) {
                this.countdownActive = false;
                this.stopTickingSfx();
                this.onTimeUp();
                break;
            }
        }
        if (this.timerProgressActive && this.timerProgressDuration > 0) {
            this.timerProgressElapsed += dt;
            const t = Math.min(this.timerProgressElapsed / this.timerProgressDuration, 1);
            this.setTimerScreenProgress(t);
            this.setTimerDigitColorProgress(t);
            if (t >= 1) {
                this.timerProgressActive = false;
                this.setTimerScreenProgress(1);
            }
        }
    }
    enterCriticalPhase(remainingSeconds) {
        this.timerProgressActive = true;
        this.timerProgressDuration = remainingSeconds;
        this.timerProgressElapsed = 0;
        this.setTimerScreenProgress(0);
        this.setTimerDigitColorProgress(0);
        if (!this.tickingFast) {
            this.startFastTicking();
        }
    }
    startFastTicking() {
        global.stopSfx("tickNormal");
        const vol = global.appState.checkStorage("masterVolume");
        global.playSfx(19, -1, vol * 0.7, "tickFast");
        this.tickingFast = true;
    }
    stopTickingSfx() {
        global.stopSfx("tickNormal");
        global.stopSfx("tickFast");
        this.tickingFast = false;
    }
    /** Three digits as M:SS — e.g. 659 = 6:59, 500 = 5:00, 959 = 9:59. */
    displayTimerValue(totalSeconds) {
        const clamped = Math.max(0, Math.floor(totalSeconds || 0));
        const minutes = Math.floor(clamped / 60);
        const seconds = clamped % 60;
        const secondsTens = Math.floor(seconds / 10);
        const secondsOnes = seconds % 10;
        if (this.timerDigitTexts[0]) {
            this.timerDigitTexts[0].text = "" + minutes;
        }
        if (this.timerDigitTexts[1]) {
            this.timerDigitTexts[1].text = "" + secondsTens;
        }
        if (this.timerDigitTexts[2]) {
            this.timerDigitTexts[2].text = "" + secondsOnes;
        }
    }
    setTimerScreenProgress(progress) {
        if (!this.timerScreenMaterial) {
            return;
        }
        const t = Math.min(Math.max(progress, 0), 1);
        if (this.timerScreenMaterial.mainPass && this.timerScreenMaterial.mainPass.progress !== undefined) {
            this.timerScreenMaterial.mainPass.progress = t;
        }
    }
    setTimerDigitColorProgress(progress) {
        const t = Math.min(Math.max(progress, 0), 1);
        const target = new vec4(1, 0, 0, 1);
        const darkTarget = new vec4(0.7, 0, 0, 1);
        for (let i = 0; i < this.timerDigitTexts.length; i++) {
            const text = this.timerDigitTexts[i];
            if (!text || !text.textFill) {
                continue;
            }
            const base = this.timerDigitBaseColors[i] || new vec4(1, 1, 1, 1);
            text.textFill.color = new vec4(base.r + (target.r - base.r) * t, base.g + (target.g - base.g) * t, base.b + (target.b - base.b) * t, base.a + (target.a - base.a) * t);
        }
        for (let j = 0; j < this.timerBgTexts.length; j++) {
            const bgText = this.timerBgTexts[j];
            if (!bgText || !bgText.textFill) {
                continue;
            }
            const baseBg = this.timerBgBaseColors[j] || new vec4(1, 1, 1, 1);
            bgText.textFill.color = new vec4(baseBg.r + (darkTarget.r - baseBg.r) * t, baseBg.g + (darkTarget.g - baseBg.g) * t, baseBg.b + (darkTarget.b - baseBg.b) * t, baseBg.a + (darkTarget.a - baseBg.a) * t);
        }
    }
}
exports.SafeTimerController = SafeTimerController;
//# sourceMappingURL=SafeTimerController.js.map