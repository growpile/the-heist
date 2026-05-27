const supabaseModule = require("SupabaseClient.lspkg/supabase-snapcloud")
const createClient =
  supabaseModule && supabaseModule.createClient ? supabaseModule.createClient : supabaseModule

const cameraModule: CameraModule = require("LensStudio:CameraModule")

type SpectatorEntry = string | {name?: string; display_name?: string}

type TextureWithControl = Texture & {
  control?: {
    inputTexture?: Texture
  }
}

/** Fixed AR stream encode settings (not exposed in inspector). */
const STREAM_DEBUG_DISPLAY_TEXTURE = false
const STREAM_DOWNSAMPLE_TEXTURE = true
const STREAM_MAX_RESOLUTION = 400
const STREAM_COMPRESSION_QUALITY = 0
const STREAM_ENCODING_TYPE = 1
const STREAM_MAX_FRAME_BUFFER = 12

export type StreamMetaProvider = () => Record<string, unknown> | null

/** Public API used by GameFlowController (explicit for Lens Studio AssignableType typing). */
export interface CoopNetworkFacade {
  setStreamMetaProvider(provider: StreamMetaProvider | null): void
  startCameraStream(): void
  stopCameraStream(): void
  ensureReady(): Promise<boolean>
  createNewRoom(): Promise<string | null>
  setupRoomUI(roomCode: string): void
  sendCustomMessageWithMeta(message: string, eventName: string, meta: Record<string, unknown>): void
  deleteCurrentRoom(): Promise<boolean>
  disconnectFromRoom(): void
}

@component
export class CoopNetworkController extends BaseScriptComponent implements CoopNetworkFacade {
  @ui.label('<span style="color: #60A5FA;">Snap Cloud</span>')
  @input
  @allowUndefined
  snapCloudRequirements: ScriptComponent

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Realtime Channel</span>')
  @input
  channelName: string = ""

  @input
  baseMessage: string = "dT"

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Room UI</span>')
  @input
  @allowUndefined
  crewCodeText: Text

  @input
  playerSlots: SceneObject[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">AR Camera Stream</span>')

  @input
  @hint("Frames per second drained from buffer and sent over realtime.")
  targetStreamFps = 24

  @input
  @hint("Max encode starts per second in onNewFrame (independent of send FPS).")
  maxEncodeFps = 24

  @input
  @allowUndefined
  renderTexture: Texture

  @input
  @allowUndefined
  virtualRenderCameraSetup: ObjectPrefab

  @input
  @allowUndefined
  screenCropTexture: Texture

  @input
  @allowUndefined
  compositeTexture: Texture

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Debug</span>')
  @input
  enableDebugLogs: boolean = true

  private client: any = null
  private realtimeChannel: any = null
  private spectatorChannel: any = null
  private userId = ""
  private displayName = "Spectacles User"
  private isReady = false
  private isSubscribed = false
  private sessionChannelName = ""
  private isInitializing = false
  private readyPromise: Promise<boolean> | null = null
  private spectatorsListener: ((list: SpectatorEntry[]) => void) | null = null
  private lastRoomCode = ""
  private textureBroadcastEnabled = false
  private streamMetaProvider: StreamMetaProvider | null = null
  private isCameraStreaming = false
  private isEncodingFrame = false
  private pendingReencode = false
  private streamPumpEnabled = false
  private streamPumpEvent: UpdateEvent | null = null
  private encodedFrameBuffer: string[] = []
  private lastSendTime = -1e9
  private lastEncodeStartTime = -1e9
  private sendIntervalSec = 1 / 10
  private encodeIntervalSec = 1 / 15
  private streamFrameRegistration: EventRegistration | null = null
  private streamingCameraTexture: Texture | null = null
  private streamingProvider: CameraTextureProvider | null = null
  private compositeCameraSetup: SceneObject | null = null
  private framesEncoded = 0
  private framesSent = 0
  private framesDroppedBuffer = 0
  private framesSkippedEncoding = 0
  private framesRejectedSize = 0

  private readonly MAX_GUESTS = 4
  private readonly REALTIME_FRAME_LIMIT_BYTES = 250000

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.setupDisplayName()
    })

    this.streamPumpEvent = this.createEvent("UpdateEvent")
    this.streamPumpEvent.bind(() => this.pumpFrameBuffer())

    this.createEvent("OnDestroyEvent").bind(() => {
      this.stopCameraStream()
      this.clearSpectatorChannel()
      try {
        if (this.client && this.client.removeAllChannels) {
          this.client.removeAllChannels()
        }
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
    })
  }

  async trySignIn(): Promise<boolean> {
    return await this.signInUser()
  }

  async ensureReady(): Promise<boolean> {
    if (this.readyPromise) {
      return this.readyPromise
    }
    this.readyPromise = this.ensureReadyInternal()
    const result = await this.readyPromise
    this.readyPromise = null
    return result
  }

  private async ensureReadyInternal(): Promise<boolean> {
    if (this.isInitializing) {
      this.log("ensureReady: init in progress")
      return false
    }
    if (!this.client) {
      this.log("ensureReady: initSupabase")
      this.isInitializing = true
      await this.initSupabase()
      this.isInitializing = false
    }
    if (!this.client) {
      this.log("ensureReady: client missing after init")
      return false
    }
    if (!this.userId) {
      this.log("ensureReady: signInUser")
      await this.signInUser()
    }
    const ok = !!(this.client && this.userId && global.appState.signedInSnapCloud)
    this.log("ensureReady: ok=" + ok)
    return ok
  }

  sendCustomMessage(message: string, eventName?: string): void {
    this.sendCustomMessageInternal(message, eventName, null)
  }

  sendCustomMessageWithMeta(message: string, eventName: string, meta: Record<string, unknown>): void {
    this.sendCustomMessageInternal(message, eventName, meta)
  }

  disconnectFromRoom(): void {
    this.stopCameraStream()
    this.isReady = false
    this.isSubscribed = false
    this.lastRoomCode = this.sessionChannelName || this.lastRoomCode
    this.sessionChannelName = ""

    if (this.client && this.realtimeChannel) {
      try {
        if (this.client.removeChannel) {
          this.client.removeChannel(this.realtimeChannel)
        } else if (this.client.removeAllChannels) {
          this.client.removeAllChannels()
        }
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
    }
    this.realtimeChannel = null
    this.clearSpectatorChannel()
  }

  async deleteCurrentRoom(): Promise<boolean> {
    const roomCode = this.sessionChannelName || this.lastRoomCode
    if (!this.client || !roomCode) {
      this.log("Cannot delete room: client or room code missing")
      return false
    }
    try {
      const res = await this.client.from("bomb_defusal_rooms").delete().eq("room_code", roomCode)
      if (res && res.error) {
        this.log("Delete room failed: " + JSON.stringify(res.error))
        return false
      }
      this.log("Deleted room for code " + roomCode)
      return true
    } catch (e) {
      this.log("Delete room exception: " + e)
      return false
    }
  }

  async watchSpectators(roomCode: string, callback: (list: SpectatorEntry[]) => void): Promise<boolean> {
    this.spectatorsListener = callback || null
    if (!roomCode) {
      this.emitSpectators([])
      return false
    }

    const ready = await this.ensureReady()
    if (!ready || !this.client) {
      this.emitSpectators([])
      return false
    }

    this.clearSpectatorChannel()
    this.spectatorChannel = this.client.channel("room-spectators-" + roomCode)
    this.spectatorChannel.on(
      "postgres_changes",
      {event: "*", schema: "public", table: "bomb_defusal_rooms", filter: "room_code=eq." + roomCode},
      (payload: any) => {
        try {
          const row = payload && (payload.new || payload.record || payload.data)
          const spectators = row && row.spectators ? row.spectators : []
          if (!Array.isArray(spectators)) {
            this.log("Spectator payload ignored — spectators is not an array")
            return
          }
          this.emitSpectators(spectators)
        } catch (e) {
          this.log("Spectator payload handler error: " + e)
        }
      }
    )
    this.spectatorChannel.subscribe((status: string) => {
      this.log("Spectator channel status: " + status)
    })

    await this.fetchSpectators(roomCode)
    return true
  }

  createNewRoom(): Promise<string | null> {
    return this.createRoomAndChannel()
  }

  createRoom(): Promise<string | null> {
    return this.createNewRoom()
  }

  setStreamMetaProvider(provider: StreamMetaProvider | null): void {
    this.streamMetaProvider = provider
  }

  /** Start AR glasses capture, encode, and broadcast (call when online game begins). */
  startCameraStream(): void {
    this.textureBroadcastEnabled = true
    this.resetStreamBufferState()

    const sendFps = Math.max(1, this.targetStreamFps || 10)
    const encodeFps = Math.max(1, this.maxEncodeFps || 15)
    this.sendIntervalSec = 1 / sendFps
    this.encodeIntervalSec = 1 / encodeFps

    if (!this.streamingProvider || !this.streamingCameraTexture) {
      try {
        const request = CameraModule.createCameraRequest()
        this.applyCameraRequest(request)
        const camTex = cameraModule.requestCamera(request)
        this.streamingCameraTexture = camTex
        this.streamingProvider = camTex.control as CameraTextureProvider
      } catch (e) {
        this.log("Camera request failed: " + e)
        this.textureBroadcastEnabled = false
        return
      }
    }

    if (!this.streamingProvider?.onNewFrame) {
      this.log("Camera provider not available for streaming")
      this.textureBroadcastEnabled = false
      return
    }

    this.detachStreamFrameListener()
    this.isCameraStreaming = true
    this.isEncodingFrame = false
    this.pendingReencode = false
    this.streamPumpEnabled = true

    this.streamFrameRegistration = this.streamingProvider.onNewFrame.add(() => {
      this.onCameraFrame()
    })

    this.log(
      "AR camera stream started (encode max " +
        encodeFps +
        " fps, send " +
        sendFps +
        " fps, buffer " +
        STREAM_MAX_FRAME_BUFFER +
        ")"
    )
  }

  stopCameraStream(): void {
    this.textureBroadcastEnabled = false
    this.isCameraStreaming = false
    this.streamPumpEnabled = false
    this.isEncodingFrame = false
    this.pendingReencode = false
    this.detachStreamFrameListener()
    this.resetStreamBufferState()
    this.log("AR camera stream stopped")
  }

  setupRoomUI(roomCode: string): void {
    if (this.crewCodeText) {
      this.crewCodeText.text = this.formatRoomCodeForDisplay(roomCode)
    }
    this.clearSlots()
    if (roomCode) {
      this.watchSpectators(roomCode, (spectators) => {
        this.applyGuestNames(this.normalizeNames(spectators))
      })
    }
  }

  async beginSession(): Promise<string | null> {
    const ready = await this.ensureReady()
    if (!ready) {
      return null
    }
    return await this.createNewRoom()
  }

  private log(msg: string): void {
    if (this.enableDebugLogs) {
      print("[CoopNetworkController] " + msg)
    }
  }

  /** Display form: one space between each character (e.g. "A B C 1 2 3"). */
  private formatRoomCodeForDisplay(roomCode: string): string {
    if (!roomCode) {
      return ""
    }
    const compact = roomCode.replace(/\s/g, "")
    return compact.split("").join(" ")
  }

  private callRequirements(name: string, ...args: unknown[]): unknown {
    const comp = this.snapCloudRequirements as any
    if (!comp) {
      return null
    }
    if (typeof comp[name] === "function") {
      return comp[name](...args)
    }
    if (comp.api && typeof comp.api[name] === "function") {
      return comp.api[name](...args)
    }
    return null
  }

  private async initSupabase(): Promise<boolean> {
    if (!this.snapCloudRequirements) {
      this.log("SnapCloudRequirements not configured")
      return false
    }

    const isConfigured = this.callRequirements("isConfigured")
    if (!isConfigured) {
      this.log("SnapCloudRequirements not configured")
      return false
    }

    const supabaseProject = this.callRequirements("getSupabaseProject") as {url: string; publicToken: string} | null
    if (!supabaseProject) {
      this.log("Could not retrieve Supabase project")
      return false
    }

    if (!createClient) {
      this.log("Supabase createClient not found")
      return false
    }

    this.client = createClient(supabaseProject.url, supabaseProject.publicToken, {
      realtime: {heartbeatIntervalMs: 2500}
    })

    return await this.signInUser()
  }

  private async signInUser(): Promise<boolean> {
    if (!this.client || !this.client.auth) {
      this.log("Client or auth not available")
      return false
    }
    try {
      const result = await this.client.auth.signInWithIdToken({provider: "snapchat", token: ""})
      if (result.error) {
        this.log("Sign in warning: " + JSON.stringify(result.error))
        return false
      }
      if (result.data && result.data.user && result.data.user.id) {
        this.userId = "" + result.data.user.id
      } else {
        this.userId = "spectacles_msg_" + Math.random().toString(36).substring(2, 8)
      }
      this.log("Signed in Snap Cloud as " + this.userId)
      global.appState.signedInSnapCloud = true
      return true
    } catch (e) {
      this.log("Sign in exception: " + e)
      return false
    }
  }

  private async setupRealtimeChannel(): Promise<void> {
    if (!this.client || !this.sessionChannelName) {
      return
    }

    this.isReady = false
    this.isSubscribed = false
    if (this.client.removeAllChannels && this.realtimeChannel) {
      try {
        this.client.removeAllChannels()
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
    }

    this.realtimeChannel = this.client.channel(this.sessionChannelName, {
      config: {broadcast: {self: true}}
    })

    this.realtimeChannel.subscribe((status: string) => {
      this.log("Channel status: " + status)
      if (status === "SUBSCRIBED") {
        this.isSubscribed = true
        this.isReady = true
      }
    })
  }

  private sendCustomMessageInternal(
    message: string,
    eventName: string | undefined,
    meta: Record<string, unknown> | null
  ): void {
    if (!this.isReady || !this.realtimeChannel || !this.isSubscribed) {
      this.log("Not ready yet; waiting for channel subscription")
      return
    }

    const payload: Record<string, unknown> = {
      channel_name: this.sessionChannelName,
      user_id: this.userId,
      message: message || "",
      timestamp: Date.now()
    }

    if (meta) {
      for (const key in meta) {
        if (Object.prototype.hasOwnProperty.call(meta, key) && payload[key] === undefined) {
          payload[key] = meta[key]
        }
      }
    }

    this.realtimeChannel.send({
      type: "broadcast",
      event: eventName || "custom-message",
      payload
    })
  }

  private emitSpectators(list: SpectatorEntry[]): void {
    if (this.spectatorsListener) {
      try {
        const safeList = Array.isArray(list) ? list : []
        this.spectatorsListener(safeList)
      } catch (e) {
        this.log("Spectator listener error: " + e)
      }
    }
  }

  private async fetchSpectators(roomCode: string): Promise<void> {
    if (!this.client || !roomCode) {
      return
    }
    try {
      const res = await this.client
        .from("bomb_defusal_rooms")
        .select("spectators")
        .eq("room_code", roomCode)
        .maybeSingle()
      if (!res.error && res.data && res.data.spectators) {
        const spectators = res.data.spectators
        this.emitSpectators(Array.isArray(spectators) ? spectators : [])
      } else if (!res.error && res.data) {
        this.emitSpectators([])
      }
    } catch (e) {
      this.log("Fetch spectators failed: " + e)
    }
  }

  private clearSpectatorChannel(): void {
    if (this.spectatorChannel && this.spectatorChannel.unsubscribe) {
      try {
        this.spectatorChannel.unsubscribe()
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
    }
    if (this.client && this.client.removeChannel && this.spectatorChannel) {
      try {
        this.client.removeChannel(this.spectatorChannel)
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
    }
    this.spectatorChannel = null
  }

  private setupDisplayName(): void {
    try {
      if (global.userContextSystem && global.userContextSystem.requestDisplayName) {
        global.userContextSystem.requestDisplayName((name: string) => {
          if (name) {
            this.displayName = name
          }
        })
      }
    } catch (e) {
      this.log("Display name fetch failed: " + e)
    }
  }

  private async createRoomAndChannel(): Promise<string | null> {
    if (!this.client || !this.userId) {
      this.log("Cannot create room/channel: missing client or user")
      return null
    }

    if (this.client && this.realtimeChannel) {
      try {
        this.client.removeAllChannels()
      } catch (e) {
        this.log("OnDestroy cleanup failed: " + e)
      }
      this.realtimeChannel = null
      this.isSubscribed = false
      this.isReady = false
    }

    this.sessionChannelName = await this.ensureRoomRegistration()
    if (!this.sessionChannelName) {
      this.log("Failed to establish room/channel")
      return null
    }

    this.log("Using session channel (room code): " + this.sessionChannelName)
    await this.setupRealtimeChannel()
    return this.sessionChannelName
  }

  private async ensureRoomRegistration(): Promise<string | null> {
    if (!this.client || !this.userId) {
      return null
    }

    const table = "bomb_defusal_rooms"
    let existingCode: string | null = null

    try {
      const existing = await this.client.from(table).select("room_code").eq("id", this.userId).maybeSingle()
      const hasExisting = existing && existing.data && existing.data.room_code
      const isNoRows =
        existing &&
        existing.error &&
        (existing.error.code === "PGRST116" ||
          existing.error.message === "JSON object requested, multiple (or no) rows returned")

      if (hasExisting) {
        existingCode = existing.data.room_code
      } else if (!isNoRows && existing && existing.error) {
        this.log("Existing room check error: " + JSON.stringify(existing.error))
      }
    } catch (e) {
      this.log("Existing room check failed: " + e)
    }

    const tried: Record<string, boolean> = {}
    if (existingCode) {
      tried[existingCode] = true
    }

    for (let attempt = 0; attempt < 20; attempt++) {
      const roomCode = await this.generateUniqueRoomCode(table, tried)
      if (!roomCode) {
        break
      }
      tried[roomCode] = true
      try {
        const upsertRes = await this.client.from(table).upsert(
          {
            id: this.userId,
            room_code: roomCode,
            owner_name: this.displayName,
            created_at: new Date().toISOString(),
            spectators: []
          },
          {onConflict: "id"}
        )

        if (!upsertRes.error) {
          return roomCode
        }

        const code = upsertRes.error && upsertRes.error.code
        const msg = (upsertRes.error && upsertRes.error.message) || ""
        if (code === "23505" || msg.indexOf("duplicate key") !== -1 || code === "PGRST116") {
          continue
        }
        this.log("Room upsert failed: " + JSON.stringify(upsertRes.error))
        return null
      } catch (e) {
        this.log("Room upsert exception: " + e)
        return null
      }
    }

    return null
  }

  private async generateUniqueRoomCode(
    table: string,
    excludeMap: Record<string, boolean>
  ): Promise<string | null> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let attempt = 0
    while (attempt < 20) {
      let code = ""
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      if (excludeMap && excludeMap[code]) {
        attempt++
        continue
      }
      try {
        const exists = await this.client.from(table).select("room_code").eq("room_code", code).maybeSingle()
        if (exists.error && exists.error.code !== "PGRST116") {
          return null
        }
        const hasData = exists && exists.data && exists.data.room_code
        if (!hasData) {
          return code
        }
      } catch (e) {
        this.log("Code check failed: " + e)
        return null
      }
      attempt++
    }
    return null
  }

  private clearSlots(): void {
    if (!this.playerSlots || !this.playerSlots.length) {
      return
    }
    for (const slot of this.playerSlots) {
      if (slot) {
        slot.enabled = false
      }
    }
  }

  private normalizeNames(spectators: SpectatorEntry[]): string[] {
    const names: string[] = []
    if (!spectators || !spectators.length) {
      return names
    }
    for (const entry of spectators) {
      if (typeof entry === "string") {
        names.push(entry)
      } else if (entry && typeof entry.name === "string") {
        names.push(entry.name)
      } else if (entry && typeof entry.display_name === "string") {
        names.push(entry.display_name)
      }
    }
    return names
  }

  private applyCameraRequest(request: CameraModule.CameraRequest): void {
    request.cameraId = CameraModule.CameraId.Default_Color
    if (STREAM_DOWNSAMPLE_TEXTURE) {
      request.imageSmallerDimension = STREAM_MAX_RESOLUTION
    }
  }

  private detachStreamFrameListener(): void {
    if (
      this.streamFrameRegistration !== null &&
      this.streamingProvider?.onNewFrame
    ) {
      this.streamingProvider.onNewFrame.remove(this.streamFrameRegistration)
      this.streamFrameRegistration = null
    }
  }

  private resetStreamBufferState(): void {
    this.encodedFrameBuffer = []
    this.lastSendTime = -1e9
    this.lastEncodeStartTime = -1e9
    this.framesEncoded = 0
    this.framesSent = 0
    this.framesDroppedBuffer = 0
    this.framesSkippedEncoding = 0
    this.framesRejectedSize = 0
  }

  private onCameraFrame(): void {
    if (!this.isCameraStreaming || !this.textureBroadcastEnabled) {
      return
    }

    const baseTexture = this.streamingCameraTexture
    if (!baseTexture) {
      return
    }

    const finalTexture = this.buildCompositeTexture(baseTexture)
    if (this.isEncodingFrame) {
      this.pendingReencode = true
      return
    }

    const now = getTime()
    if (this.pendingReencode) {
      this.pendingReencode = false
    } else if (now - this.lastEncodeStartTime < this.encodeIntervalSec) {
      this.framesSkippedEncoding++
      return
    }

    this.beginEncode(finalTexture, now)
  }

  private beginEncode(texture: Texture, encodeStartTime: number): void {
    this.isEncodingFrame = true
    this.lastEncodeStartTime = encodeStartTime

    this.encodeTexture(texture)
      .then((encoded) => this.enqueueEncodedFrame(encoded))
      .catch((err) => this.log("Encode failed: " + err))
      .finally(() => {
        this.isEncodingFrame = false
      })
  }

  private enqueueEncodedFrame(encoded: string): void {
    if (!encoded) {
      return
    }

    const sizeBytes = encoded.length
    if (sizeBytes > this.REALTIME_FRAME_LIMIT_BYTES) {
      this.framesRejectedSize++
      const sizeKb = (sizeBytes / 1024).toFixed(1)
      this.log("Frame rejected: " + sizeKb + " KB exceeds 250 KB Realtime limit")
      return
    }

    const maxBuffer = Math.max(1, STREAM_MAX_FRAME_BUFFER)
    while (this.encodedFrameBuffer.length >= maxBuffer) {
      this.encodedFrameBuffer.shift()
      this.framesDroppedBuffer++
    }

    this.encodedFrameBuffer.push(encoded)
    this.framesEncoded++

    if (this.enableDebugLogs) {
      const sizeKb = (sizeBytes / 1024).toFixed(1)
      if (this.framesEncoded === 1 || this.framesEncoded % 10 === 0) {
        this.log(
          "Encoded #" +
            this.framesEncoded +
            ": " +
            sizeKb +
            " KB, buffer " +
            this.encodedFrameBuffer.length +
            "/" +
            maxBuffer
        )
      }
      if (sizeBytes > 200000) {
        this.log("Warning: frame " + sizeKb + " KB is close to 250 KB limit")
      }
    }
  }

  private pumpFrameBuffer(): void {
    if (!this.streamPumpEnabled || !this.textureBroadcastEnabled) {
      return
    }

    const now = getTime()
    if (now - this.lastSendTime < this.sendIntervalSec) {
      return
    }
    if (this.encodedFrameBuffer.length === 0) {
      return
    }

    const encoded = this.encodedFrameBuffer.shift()
    if (!encoded) {
      return
    }

    this.lastSendTime = now
    this.broadcastEncodedFrame(encoded)
    this.framesSent++

    if (this.enableDebugLogs && (this.framesSent === 1 || this.framesSent % 30 === 0)) {
      this.log(
        "Stream stats — sent: " +
          this.framesSent +
          ", encoded: " +
          this.framesEncoded +
          ", buffer: " +
          this.encodedFrameBuffer.length +
          ", dropped: " +
          this.framesDroppedBuffer +
          ", skipped encode: " +
          this.framesSkippedEncoding +
          ", rejected size: " +
          this.framesRejectedSize
      )
    }
  }

  private buildCompositeTexture(baseTexture: Texture): Texture {
    const cropTex = this.screenCropTexture as TextureWithControl | null
    if (!cropTex?.control || !this.compositeTexture) {
      return baseTexture
    }

    cropTex.control.inputTexture = baseTexture
    this.ensureCompositeCameraSetup()
    if (this.compositeCameraSetup && this.renderTexture) {
      const augmentedImage = this.compositeCameraSetup
        .getChild(0)
        ?.getChild(0)
        ?.getComponent("Component.Image") as Image | null
      if (augmentedImage) {
        augmentedImage.mainPass.baseTex = this.renderTexture
      }
    }
    return this.compositeTexture
  }

  private ensureCompositeCameraSetup(): void {
    if (!this.compositeCameraSetup && this.virtualRenderCameraSetup) {
      this.compositeCameraSetup = this.virtualRenderCameraSetup.instantiate(
        this.getSceneObject()
      )
    }
  }

  private encodeTexture(texture: Texture): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if (Base64.encodeTextureAsync) {
          Base64.encodeTextureAsync(
            texture,
            resolve,
            reject,
            this.compressionQuality,
            this.encodingType
          )
        } else {
          const syncEncode = (Base64 as unknown as {encodeTexture?: (t: Texture, q: number, e: number) => string})
            .encodeTexture
          if (syncEncode) {
            resolve(syncEncode(texture, this.compressionQuality, this.encodingType))
          } else {
            reject("Base64 encode not available")
          }
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  private broadcastEncodedFrame(encodedString: string): void {
    if (!this.textureBroadcastEnabled || !encodedString) {
      return
    }

    const meta = this.streamMetaProvider?.() ?? null
    const eventName = "defuserTexture"
    if (meta && Object.keys(meta).length > 0) {
      this.sendCustomMessageWithMeta(encodedString, eventName, meta)
    } else {
      this.sendCustomMessage(encodedString, eventName)
    }
  }

  private applyGuestNames(names: string[]): void {
    if (!this.playerSlots || !this.playerSlots.length) {
      return
    }
    const maxSlots = Math.min(this.playerSlots.length, this.MAX_GUESTS)
    for (let i = 0; i < maxSlots; i++) {
      const slot = this.playerSlots[i]
      if (!slot) {
        continue
      }
      const name = names && names[i] ? names[i] : ""
      const hasName = name && name.length > 0
      slot.enabled = !!hasName
      if (hasName) {
        const labelObj = slot.getChild(0)
        const textComp = labelObj ? (labelObj.getComponent("Component.Text") as Text) : null
        if (textComp) {
          textComp.text = name
        }
      }
    }
    for (let j = maxSlots; j < this.playerSlots.length; j++) {
      if (this.playerSlots[j]) {
        this.playerSlots[j].enabled = false
      }
    }
  }
}
