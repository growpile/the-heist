import {LSTween} from "LSTween.lspkg/Examples/Scripts/LSTween"

const TIMER_COLOR_NORMAL = new vec4(0.2, 0.2, 0.2, 1)
const TIMER_COLOR_WARNING = new vec4(0.8, 0.1, 0.1, 1)
const TIMER_COLOR_LERP_DURATION = 0.5

export class SafeTimerController {
  private bombTimer: number
  private remainingSeconds: number
  private timeAccumulator = 0
  private lastDisplayedSecond = -1
  private updateEvent: UpdateEvent | null = null
  private timerScreenRMV: RenderMeshVisual | null
  private timerDigitTexts: Text[]
  private timerBgTexts: Text[]
  private enableDebug: boolean
  private safeDebugText: Text | null
  private onTimeUp: () => void

  constructor(
    bombTimer: number,
    timerScreenRMV: RenderMeshVisual | null,
    timerDigitTexts: Text[],
    timerBgTexts: Text[],
    enableDebug: boolean,
    safeDebugText: Text | null,
    onTimeUp: () => void
  ) {
    this.bombTimer = bombTimer
    this.remainingSeconds = bombTimer
    this.timerScreenRMV = timerScreenRMV
    this.timerDigitTexts = timerDigitTexts || []
    this.timerBgTexts = timerBgTexts || []
    this.enableDebug = enableDebug
    this.safeDebugText = safeDebugText
    this.onTimeUp = onTimeUp
  }

  setBombTimer(seconds: number): void {
    this.bombTimer = seconds
    this.remainingSeconds = seconds
    this.lastDisplayedSecond = -1
    this.updateTimerDisplay()
  }

  getRemainingSeconds(): number {
    return this.remainingSeconds
  }

  applyPenalty(seconds: number): void {
    this.remainingSeconds = Math.max(0, this.remainingSeconds - seconds)
    this.lastDisplayedSecond = -1
    this.updateTimerDisplay()
    if (this.remainingSeconds <= 0) {
      this.stop()
      this.onTimeUp()
    }
  }

  start(): void {
    this.stop()
    this.remainingSeconds = this.bombTimer
    this.timeAccumulator = 0
    this.lastDisplayedSecond = -1
    this.updateTimerDisplay()

    this.updateEvent = this.createUpdateEvent()
    this.updateEvent.bind(() => this.tick())
  }

  stop(): void {
    if (this.updateEvent) {
      this.updateEvent.enabled = false
      this.updateEvent = null
    }
  }

  private createUpdateEvent(): UpdateEvent {
    const ev = new UpdateEvent()
    ev.bind(() => {})
    return ev
  }

  private tick(): void {
    const dt = getDeltaTime()
    this.timeAccumulator += dt

    while (this.timeAccumulator >= 1 && this.remainingSeconds > 0) {
      this.timeAccumulator -= 1
      this.remainingSeconds -= 1
      this.updateTimerDisplay()

      if (this.remainingSeconds <= 0) {
        this.stop()
        this.onTimeUp()
        return
      }
    }
  }

  private updateTimerDisplay(): void {
    const seconds = Math.max(0, Math.floor(this.remainingSeconds))
    if (seconds === this.lastDisplayedSecond) {
      return
    }
    this.lastDisplayedSecond = seconds

    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    const timeString =
      minutes.toString().padStart(2, "0") + ":" + secs.toString().padStart(2, "0")

    for (const text of this.timerDigitTexts) {
      if (text) {
        text.text = timeString
      }
    }

    const isWarning = seconds <= 60
    const targetColor = isWarning ? TIMER_COLOR_WARNING : TIMER_COLOR_NORMAL

    for (const text of this.timerBgTexts) {
      if (text) {
        LSTween.textColorTo(text, targetColor, TIMER_COLOR_LERP_DURATION * 1000).start()
      }
    }

    if (this.timerScreenRMV && this.timerScreenRMV.mainMaterial) {
      LSTween.rawTween(TIMER_COLOR_LERP_DURATION * 1000)
        .onUpdate((t: number) => {
          const smoothT = t * t * (3 - 2 * t)
          const current = this.timerScreenRMV!.mainMaterial.mainPass.baseColor
          const lerped = vec4.lerp(current, targetColor, smoothT)
          this.timerScreenRMV!.mainMaterial.mainPass.baseColor = lerped
        })
        .start()
    }

    if (this.enableDebug && this.safeDebugText) {
      this.safeDebugText.text = "Timer: " + timeString
    }

    if (seconds > 0 && global.playSfx) {
      global.playSfx("timer-tick")
    }
  }
}
