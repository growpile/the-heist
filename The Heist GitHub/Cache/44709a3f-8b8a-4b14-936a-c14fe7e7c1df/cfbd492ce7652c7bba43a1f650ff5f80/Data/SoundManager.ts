/**
 * Central audio for the lens. Registers global.playSfx, stopSfx, crossfadeBgm, setBgmVolume, bgmVolume.
 * Disable the legacy Sound Manager.js component on the same object when using this script.
 */
@component
export class SoundManager extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Playback</span>')

  @input
  @hint("When off, reuses one AudioComponent per SFX index (MAI). When on, spawns a new instance each play.")
  multipleSfxInstances: boolean = false

  @input
  @hint("Start background music automatically on lens load.")
  backgroundAudio: boolean = false

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Background music</span>')

  @input
  @showIf("backgroundAudio", true)
  backgroundSounds: AudioTrackAsset[] = []

  @input
  @showIf("backgroundAudio", true)
  @widget(new SliderWidget(0, 1, 0.01))
  @hint("Volume for the initial BGM track (index 0).")
  backgroundVolume: number = 1

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Sound effects</span>')

  @input
  @hint("SFX bank — global.playSfx(id, …) uses this array index.")
  sounds: AudioTrackAsset[] = []

  private readonly initializedTracks: (ManagedAudio | null)[] = []
  private bgm: ManagedAudio | null = null
  private readonly sfxById: Record<string, ManagedAudio> = {}

  onAwake(): void {
    this.bindGlobals()

    if (this.backgroundAudio && this.backgroundSounds && this.backgroundSounds.length > 0) {
      this.setupBgm(0, this.backgroundVolume, 0)
    }
  }

  private bindGlobals(): void {
    global.playSfx = (id: number, times: number, volume: number, soundId?: string) => {
      this.playSfx(id, times, volume, soundId)
    }
    global.stopSfx = (soundId: string) => {
      this.stopSfxById(soundId)
    }
    global.crossfadeBgm = (id: number, volume: number, crossfadeDuration: number) => {
      this.crossfadeBgm(id, volume, crossfadeDuration)
    }
    global.setBgmVolume = (volume: number, fadeDuration?: number) => {
      this.setBgmVolume(volume, fadeDuration)
    }
    global.bgmVolume = () => this.getBgmVolume()
  }

  private playSfx(id: number, times: number, volume: number, soundId?: string): void {
    const track = this.sounds?.[id]
    if (!track) {
      return
    }

    if (soundId) {
      this.stopSfxById(soundId)
      const tagged = this.createAudioTrack()
      tagged.audioTrack = track
      tagged.volume = volume
      tagged.play(times)
      this.sfxById[soundId] = tagged

      tagged.setOnFinish?.((ac: ManagedAudio) => {
        if (this.sfxById[soundId] === ac) {
          delete this.sfxById[soundId]
        }
        if (!ac || ac.__manualStop) {
          return
        }
        this.destroyAudioObject(ac)
      })
      return
    }

    if (!this.multipleSfxInstances) {
      let pooled = this.initializedTracks[id]
      if (!pooled) {
        pooled = this.createAudioTrack()
        pooled.playbackMode = Audio.PlaybackMode.LowLatency
        pooled.audioTrack = track
        this.initializedTracks[id] = pooled
      }
      pooled.volume = volume
      pooled.play(times)
      return
    }

    const oneShot = this.createAudioTrack()
    oneShot.audioTrack = track
    oneShot.volume = volume
    oneShot.play(times)
    oneShot.setOnFinish?.((ac: ManagedAudio) => {
      this.destroyAudioObject(ac)
    })
  }

  private stopSfxById(soundId: string): void {
    if (!soundId) {
      return
    }

    const active = this.sfxById[soundId]
    if (!active) {
      return
    }

    active.__manualStop = true
    if (typeof active.stop === "function") {
      active.stop(true)
    } else if (typeof active.pause === "function") {
      active.pause()
    }

    this.destroyAudioObject(active)
    delete this.sfxById[soundId]
  }

  private crossfadeBgm(id: number, volume: number, crossfadeDuration: number): void {
    if (!this.bgm) {
      this.setupBgm(id, volume, crossfadeDuration)
      return
    }

    const currentBgm = this.bgm
    const startVolume = currentBgm.volume
    let fadeOutTime = 0

    const fadeOutEvent = this.createEvent("UpdateEvent")
    fadeOutEvent.bind(() => {
      fadeOutTime += getDeltaTime()
      const progress = fadeOutTime / crossfadeDuration
      currentBgm.volume = Math.max(0, startVolume * (1 - progress))

      if (progress >= 1.0) {
        fadeOutEvent.enabled = false
        this.destroyAudioObject(currentBgm)
      }
    })

    this.setupBgm(id, volume, crossfadeDuration)
  }

  private setBgmVolume(volume: number, fadeDuration?: number): void {
    if (!this.bgm) {
      return
    }

    const target = Math.max(0, Math.min(1, volume !== undefined ? volume : this.bgm.volume))
    const duration = fadeDuration !== undefined ? fadeDuration : 0

    if (duration <= 0) {
      this.bgm.volume = target
      return
    }

    const startVolume = this.bgm.volume
    let fadeTime = 0
    const fadeEvent = this.createEvent("UpdateEvent")
    fadeEvent.bind(() => {
      fadeTime += getDeltaTime()
      const t = Math.min(fadeTime / duration, 1)
      const smoothT = t * t * (3 - 2 * t)
      this.bgm!.volume = startVolume + (target - startVolume) * smoothT
      if (t >= 1) {
        fadeEvent.enabled = false
      }
    })
  }

  private getBgmVolume(): number {
    return this.bgm ? this.bgm.volume : 0
  }

  private setupBgm(id: number, volume: number, fadeInDuration: number): void {
    const track = this.backgroundSounds?.[id]
    if (!track) {
      return
    }

    const audioComponent = this.createAudioTrack()
    audioComponent.audioTrack = track
    audioComponent.volume = fadeInDuration > 0 ? 0 : volume
    audioComponent.play(999)
    this.bgm = audioComponent

    if (fadeInDuration > 0) {
      let fadeInTime = 0
      const fadeInEvent = this.createEvent("UpdateEvent")
      fadeInEvent.bind(() => {
        fadeInTime += getDeltaTime()
        const progress = fadeInTime / fadeInDuration
        audioComponent.volume = Math.min(volume, volume * progress)

        if (progress >= 1.0) {
          fadeInEvent.enabled = false
        }
      })
    }
  }

  private createAudioTrack(): ManagedAudio {
    const trackObject = global.scene.createSceneObject("Audio Track")
    trackObject.setParent(this.sceneObject)
    trackObject.createComponent("Component.AudioComponent")
    return trackObject.getComponent("Component.AudioComponent") as ManagedAudio
  }

  private destroyAudioObject(audio: ManagedAudio): void {
    try {
      const sceneObject = audio.getSceneObject?.()
      if (sceneObject) {
        sceneObject.destroy()
      }
    } catch (_e) {
      // Audio object may already be destroyed.
    }
  }
}

type ManagedAudio = AudioComponent & {
  __manualStop?: boolean
  setOnFinish?: (callback: (audio: ManagedAudio) => void) => void
  getSceneObject?: () => SceneObject
}
