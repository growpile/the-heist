export class SafeTimerController {
  private bombTimer: number
  private countdownSeconds = 0
  private countdownAccumulator = 0
  private countdownActive = false
  private timerProgressActive = false
  private timerProgressElapsed = 0
  private timerProgressDuration = 0
  private tickingFast = false
  private updateEvent: UpdateEvent | null = null
  private timerScreenMaterial: Material | null = null
  private timerDigitTexts: Text[]
  private timerBgTexts: Text[]
  private timerDigitBaseColors: vec4[] = []
  private timerBgBaseColors: vec4[] = []
  private onTimeUp: () => void

  constructor(
    bombTimer: number,
    timerScreenRMV: RenderMeshVisual | null,
    timerDigitTexts: Text[],
    timerBgTexts: Text[],
    onTimeUp: () => void
  ) {
    this.bombTimer = bombTimer
    this.timerDigitTexts = timerDigitTexts || []
    this.timerBgTexts = timerBgTexts || []
    this.onTimeUp = onTimeUp

    if (timerScreenRMV && timerScreenRMV.mainMaterial) {
      const cloned = timerScreenRMV.mainMaterial.clone()
      timerScreenRMV.clearMaterials()
      timerScreenRMV.addMaterial(cloned)
      this.timerScreenMaterial = timerScreenRMV.mainMaterial
    }
  }

  cacheBaseColors(): void {
    this.timerDigitBaseColors = []
    for (const text of this.timerDigitTexts) {
      if (text && text.textFill && text.textFill.color) {
        this.timerDigitBaseColors.push(text.textFill.color)
      } else {
        this.timerDigitBaseColors.push(new vec4(1, 1, 1, 1))
      }
    }

    this.timerBgBaseColors = []
    for (const text of this.timerBgTexts) {
      if (text && text.textFill && text.textFill.color) {
        this.timerBgBaseColors.push(text.textFill.color)
      } else {
        this.timerBgBaseColors.push(new vec4(1, 1, 1, 1))
      }
    }
  }

  setBombTimer(seconds: number): void {
    this.bombTimer = seconds
  }

  getRemainingSeconds(): number {
    if (!this.countdownActive) {
      return Math.max(0, this.countdownSeconds)
    }
    const remaining = this.countdownSeconds - this.countdownAccumulator
    return Math.max(0, remaining)
  }

  getSolvedSeconds(bombTimer: number, solveStarted: boolean): number {
    if (!solveStarted) {
      return 0
    }
    return Math.max(0, bombTimer - this.countdownSeconds + this.countdownAccumulator)
  }

  startCountdown(seconds: number): void {
    this.countdownSeconds = Math.max(0, Math.floor(seconds || 0))
    this.countdownAccumulator = 0
    this.countdownActive = this.countdownSeconds > 0
    this.timerProgressActive = false
    this.timerProgressElapsed = 0
    this.timerProgressDuration = 0
    this.displayTimerValue(this.countdownSeconds)

    if (this.countdownActive && this.countdownSeconds < 60) {
      this.enterCriticalPhase(this.countdownSeconds)
    }
  }

  applyPenalty(seconds: number): void {
    const penalty = Math.max(0, Math.floor(seconds || 0))
    if (penalty <= 0) {
      return
    }

    const prevSeconds = this.countdownSeconds
    this.countdownSeconds = Math.max(0, this.countdownSeconds - penalty)
    this.displayTimerValue(this.countdownSeconds)
    global.playSfx(21, 1, 1)

    if (
      !this.timerProgressActive &&
      prevSeconds >= 60 &&
      this.countdownSeconds < 60 &&
      this.countdownSeconds > 0
    ) {
      this.enterCriticalPhase(this.countdownSeconds)
    }

    if (this.timerProgressActive && this.timerProgressDuration > 0 && prevSeconds > this.countdownSeconds) {
      const remaining = this.countdownSeconds
      let progress = 1 - remaining / this.timerProgressDuration
      progress = Math.max(0, Math.min(progress, 1))
      this.timerProgressElapsed = progress * this.timerProgressDuration
      this.setTimerScreenProgress(progress)
      this.setTimerDigitColorProgress(progress)
    }

    if (this.countdownSeconds <= 0) {
      this.countdownActive = false
      this.stopTickingSfx()
      this.onTimeUp()
    }
  }

  startNormalTicking(): void {
    this.stopTickingSfx()
    const vol = global.appState?.checkStorage?.("masterVolume") ?? 1
    global.playSfx(18, -1, vol * 0.6, "tickNormal")
  }

  bindUpdate(updateEvent: UpdateEvent): void {
    this.updateEvent = updateEvent
    updateEvent.bind(() => this.onUpdate())
  }

  stop(): void {
    this.countdownActive = false
    this.timerProgressActive = false
    this.stopTickingSfx()
  }

  private onUpdate(): void {
    if (!this.countdownActive) {
      return
    }

    const dt = getDeltaTime()
    if (dt <= 0) {
      return
    }

    this.countdownAccumulator += dt

    while (this.countdownAccumulator >= 1.0 && this.countdownSeconds > 0) {
      this.countdownAccumulator -= 1.0
      const prevSeconds = this.countdownSeconds
      this.countdownSeconds -= 1
      this.displayTimerValue(this.countdownSeconds)

      if (!this.timerProgressActive && prevSeconds >= 60 && this.countdownSeconds < 60) {
        this.enterCriticalPhase(this.countdownSeconds)
      }

      if (this.countdownSeconds <= 0) {
        this.countdownActive = false
        this.stopTickingSfx()
        this.onTimeUp()
        break
      }
    }

    if (this.timerProgressActive && this.timerProgressDuration > 0) {
      this.timerProgressElapsed += dt
      const t = Math.min(this.timerProgressElapsed / this.timerProgressDuration, 1)
      this.setTimerScreenProgress(t)
      this.setTimerDigitColorProgress(t)
      if (t >= 1) {
        this.timerProgressActive = false
        this.setTimerScreenProgress(1)
      }
    }
  }

  private enterCriticalPhase(remainingSeconds: number): void {
    this.timerProgressActive = true
    this.timerProgressDuration = remainingSeconds
    this.timerProgressElapsed = 0
    this.setTimerScreenProgress(0)
    this.setTimerDigitColorProgress(0)
    if (!this.tickingFast) {
      this.startFastTicking()
    }
  }

  private startFastTicking(): void {
    global.stopSfx("tickNormal")
    const vol = global.appState?.checkStorage?.("masterVolume") ?? 1
    global.playSfx(19, -1, vol * 0.7, "tickFast")
    this.tickingFast = true
  }

  private stopTickingSfx(): void {
    global.stopSfx("tickNormal")
    global.stopSfx("tickFast")
    this.tickingFast = false
  }

  private displayTimerValue(value: number): void {
    const clamped = Math.max(0, Math.min(999, Math.floor(value || 0)))
    const hundreds = Math.floor(clamped / 100)
    const tens = Math.floor((clamped % 100) / 10)
    const ones = clamped % 10

    if (this.timerDigitTexts[0]) {
      this.timerDigitTexts[0].text = "" + hundreds
    }
    if (this.timerDigitTexts[1]) {
      this.timerDigitTexts[1].text = "" + tens
    }
    if (this.timerDigitTexts[2]) {
      this.timerDigitTexts[2].text = "" + ones
    }
  }

  private setTimerScreenProgress(progress: number): void {
    if (!this.timerScreenMaterial) {
      return
    }
    const t = Math.min(Math.max(progress, 0), 1)
    if (this.timerScreenMaterial.mainPass && this.timerScreenMaterial.mainPass.progress !== undefined) {
      this.timerScreenMaterial.mainPass.progress = t
    }
  }

  private setTimerDigitColorProgress(progress: number): void {
    const t = Math.min(Math.max(progress, 0), 1)
    const target = new vec4(1, 0, 0, 1)
    const darkTarget = new vec4(0.7, 0, 0, 1)

    for (let i = 0; i < this.timerDigitTexts.length; i++) {
      const text = this.timerDigitTexts[i]
      if (!text || !text.textFill) {
        continue
      }
      const base = this.timerDigitBaseColors[i] || new vec4(1, 1, 1, 1)
      text.textFill.color = new vec4(
        base.r + (target.r - base.r) * t,
        base.g + (target.g - base.g) * t,
        base.b + (target.b - base.b) * t,
        base.a + (target.a - base.a) * t
      )
    }

    for (let j = 0; j < this.timerBgTexts.length; j++) {
      const bgText = this.timerBgTexts[j]
      if (!bgText || !bgText.textFill) {
        continue
      }
      const baseBg = this.timerBgBaseColors[j] || new vec4(1, 1, 1, 1)
      bgText.textFill.color = new vec4(
        baseBg.r + (darkTarget.r - baseBg.r) * t,
        baseBg.g + (darkTarget.g - baseBg.g) * t,
        baseBg.b + (darkTarget.b - baseBg.b) * t,
        baseBg.a + (darkTarget.a - baseBg.a) * t
      )
    }
  }
}
