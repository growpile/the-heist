"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoopNetworkController = void 0;
var __selfType = requireType("./CoopNetworkController");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const supabaseModule = require("SupabaseClient.lspkg/supabase-snapcloud");
const createClient = supabaseModule && supabaseModule.createClient ? supabaseModule.createClient : supabaseModule;
const cameraModule = require("LensStudio:CameraModule");
let CoopNetworkController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CoopNetworkController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.snapCloudRequirements = this.snapCloudRequirements;
            this.channelName = this.channelName;
            this.baseMessage = this.baseMessage;
            this.crewCodeText = this.crewCodeText;
            this.playerSlots = this.playerSlots;
            this.debugDisplayTexture = this.debugDisplayTexture;
            this.debugDisplayImage = this.debugDisplayImage;
            this.useCrop = this.useCrop;
            this.cropValue = this.cropValue;
            this.downsampleTexture = this.downsampleTexture;
            this.maxResolution = this.maxResolution;
            this.compressionQuality = this.compressionQuality;
            this.encodingType = this.encodingType;
            this.targetStreamFps = this.targetStreamFps;
            this.renderTexture = this.renderTexture;
            this.virtualRenderCameraSetup = this.virtualRenderCameraSetup;
            this.screenCropTexture = this.screenCropTexture;
            this.compositeTexture = this.compositeTexture;
            this.enableDebugLogs = this.enableDebugLogs;
            this.client = null;
            this.realtimeChannel = null;
            this.spectatorChannel = null;
            this.userId = "";
            this.displayName = "Spectacles User";
            this.isReady = false;
            this.isSubscribed = false;
            this.sessionChannelName = "";
            this.isInitializing = false;
            this.spectatorsListener = null;
            this.lastRoomCode = "";
            this.textureBroadcastEnabled = false;
            this.streamMetaProvider = null;
            this.isCameraStreaming = false;
            this.isEncodingFrame = false;
            this.streamLastTime = -1e9;
            this.streamIntervalSec = 1 / 10;
            this.streamFrameRegistration = null;
            this.streamingCameraTexture = null;
            this.streamingProvider = null;
            this.compositeCameraSetup = null;
            this.MAX_GUESTS = 4;
        }
        __initialize() {
            super.__initialize();
            this.snapCloudRequirements = this.snapCloudRequirements;
            this.channelName = this.channelName;
            this.baseMessage = this.baseMessage;
            this.crewCodeText = this.crewCodeText;
            this.playerSlots = this.playerSlots;
            this.debugDisplayTexture = this.debugDisplayTexture;
            this.debugDisplayImage = this.debugDisplayImage;
            this.useCrop = this.useCrop;
            this.cropValue = this.cropValue;
            this.downsampleTexture = this.downsampleTexture;
            this.maxResolution = this.maxResolution;
            this.compressionQuality = this.compressionQuality;
            this.encodingType = this.encodingType;
            this.targetStreamFps = this.targetStreamFps;
            this.renderTexture = this.renderTexture;
            this.virtualRenderCameraSetup = this.virtualRenderCameraSetup;
            this.screenCropTexture = this.screenCropTexture;
            this.compositeTexture = this.compositeTexture;
            this.enableDebugLogs = this.enableDebugLogs;
            this.client = null;
            this.realtimeChannel = null;
            this.spectatorChannel = null;
            this.userId = "";
            this.displayName = "Spectacles User";
            this.isReady = false;
            this.isSubscribed = false;
            this.sessionChannelName = "";
            this.isInitializing = false;
            this.spectatorsListener = null;
            this.lastRoomCode = "";
            this.textureBroadcastEnabled = false;
            this.streamMetaProvider = null;
            this.isCameraStreaming = false;
            this.isEncodingFrame = false;
            this.streamLastTime = -1e9;
            this.streamIntervalSec = 1 / 10;
            this.streamFrameRegistration = null;
            this.streamingCameraTexture = null;
            this.streamingProvider = null;
            this.compositeCameraSetup = null;
            this.MAX_GUESTS = 4;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.setupDisplayName();
                this.initSupabase();
            });
            this.createEvent("OnDestroyEvent").bind(() => {
                this.stopCameraStream();
                try {
                    if (this.client && this.client.removeAllChannels) {
                        this.client.removeAllChannels();
                    }
                }
                catch (_e) {
                    /* ignore */
                }
            });
        }
        async trySignIn() {
            return await this.signInUser();
        }
        async ensureReady() {
            if (this.isInitializing) {
                this.log("ensureReady: init in progress");
                return false;
            }
            if (!this.client) {
                this.log("ensureReady: initSupabase");
                this.isInitializing = true;
                await this.initSupabase();
                this.isInitializing = false;
            }
            if (!this.client) {
                this.log("ensureReady: client missing after init");
                return false;
            }
            if (!this.userId) {
                this.log("ensureReady: signInUser");
                await this.signInUser();
            }
            const ok = !!(this.client && this.userId && global.appState.signedInSnapCloud);
            this.log("ensureReady: ok=" + ok);
            return ok;
        }
        sendCustomMessage(message, eventName) {
            this.sendCustomMessageInternal(message, eventName, null);
        }
        sendCustomMessageWithMeta(message, eventName, meta) {
            this.sendCustomMessageInternal(message, eventName, meta);
        }
        disconnectFromRoom() {
            this.stopCameraStream();
            this.isReady = false;
            this.isSubscribed = false;
            this.lastRoomCode = this.sessionChannelName || this.lastRoomCode;
            this.sessionChannelName = "";
            if (this.client && this.realtimeChannel) {
                try {
                    if (this.client.removeChannel) {
                        this.client.removeChannel(this.realtimeChannel);
                    }
                    else if (this.client.removeAllChannels) {
                        this.client.removeAllChannels();
                    }
                }
                catch (_e) {
                    /* ignore */
                }
            }
            this.realtimeChannel = null;
            this.clearSpectatorChannel();
        }
        async deleteCurrentRoom() {
            const roomCode = this.sessionChannelName || this.lastRoomCode;
            if (!this.client || !roomCode) {
                this.log("Cannot delete room: client or room code missing");
                return false;
            }
            try {
                const res = await this.client.from("bomb_defusal_rooms").delete().eq("room_code", roomCode);
                if (res && res.error) {
                    this.log("Delete room failed: " + JSON.stringify(res.error));
                    return false;
                }
                this.log("Deleted room for code " + roomCode);
                return true;
            }
            catch (e) {
                this.log("Delete room exception: " + e);
                return false;
            }
        }
        async watchSpectators(roomCode, callback) {
            this.spectatorsListener = callback || null;
            if (!roomCode) {
                this.emitSpectators([]);
                return false;
            }
            const ready = await this.ensureReady();
            if (!ready || !this.client) {
                this.emitSpectators([]);
                return false;
            }
            this.clearSpectatorChannel();
            this.spectatorChannel = this.client.channel("room-spectators-" + roomCode);
            this.spectatorChannel.on("postgres_changes", { event: "*", schema: "public", table: "bomb_defusal_rooms", filter: "room_code=eq." + roomCode }, (payload) => {
                const row = payload && (payload.new || payload.record || payload.data);
                const spectators = row && row.spectators ? row.spectators : [];
                this.emitSpectators(spectators);
            });
            this.spectatorChannel.subscribe((status) => {
                this.log("Spectator channel status: " + status);
            });
            await this.fetchSpectators(roomCode);
            return true;
        }
        createNewRoom() {
            return this.createRoomAndChannel();
        }
        createRoom() {
            return this.createNewRoom();
        }
        setStreamMetaProvider(provider) {
            this.streamMetaProvider = provider;
        }
        /** Start AR glasses capture, encode, and broadcast (call when online game begins). */
        startCameraStream() {
            this.textureBroadcastEnabled = true;
            const fps = Math.max(1, this.targetStreamFps || 10);
            this.streamIntervalSec = 1 / fps;
            if (!this.streamingProvider || !this.streamingCameraTexture) {
                try {
                    const request = CameraModule.createCameraRequest();
                    this.applyCameraRequest(request);
                    const camTex = cameraModule.requestCamera(request);
                    this.streamingCameraTexture = camTex;
                    this.streamingProvider = camTex.control;
                }
                catch (e) {
                    this.log("Camera request failed: " + e);
                    this.textureBroadcastEnabled = false;
                    return;
                }
            }
            if (!this.streamingProvider?.onNewFrame) {
                this.log("Camera provider not available for streaming");
                this.textureBroadcastEnabled = false;
                return;
            }
            this.detachStreamFrameListener();
            this.isCameraStreaming = true;
            this.streamLastTime = -1e9;
            this.isEncodingFrame = false;
            this.streamFrameRegistration = this.streamingProvider.onNewFrame.add(() => {
                this.onCameraFrame();
            });
            this.log("AR camera stream started");
        }
        stopCameraStream() {
            this.textureBroadcastEnabled = false;
            this.isCameraStreaming = false;
            this.isEncodingFrame = false;
            this.detachStreamFrameListener();
            this.log("AR camera stream stopped");
        }
        setupRoomUI(roomCode) {
            if (this.crewCodeText) {
                this.crewCodeText.text = this.formatRoomCodeForDisplay(roomCode);
            }
            this.clearSlots();
            if (roomCode) {
                this.watchSpectators(roomCode, (spectators) => {
                    this.applyGuestNames(this.normalizeNames(spectators));
                });
            }
        }
        async beginSession() {
            const ready = await this.ensureReady();
            if (!ready) {
                return null;
            }
            return await this.createNewRoom();
        }
        log(msg) {
            if (this.enableDebugLogs) {
                print("[CoopNetworkController] " + msg);
            }
        }
        /** Display form: one space between each character (e.g. "A B C 1 2 3"). */
        formatRoomCodeForDisplay(roomCode) {
            if (!roomCode) {
                return "";
            }
            const compact = roomCode.replace(/\s/g, "");
            return compact.split("").join(" ");
        }
        callRequirements(name, ...args) {
            const comp = this.snapCloudRequirements;
            if (!comp) {
                return null;
            }
            if (typeof comp[name] === "function") {
                return comp[name](...args);
            }
            if (comp.api && typeof comp.api[name] === "function") {
                return comp.api[name](...args);
            }
            return null;
        }
        async initSupabase() {
            if (!this.snapCloudRequirements) {
                this.log("SnapCloudRequirements not configured");
                return false;
            }
            const isConfigured = this.callRequirements("isConfigured");
            if (!isConfigured) {
                this.log("SnapCloudRequirements not configured");
                return false;
            }
            const supabaseProject = this.callRequirements("getSupabaseProject");
            if (!supabaseProject) {
                this.log("Could not retrieve Supabase project");
                return false;
            }
            if (!createClient) {
                this.log("Supabase createClient not found");
                return false;
            }
            this.client = createClient(supabaseProject.url, supabaseProject.publicToken, {
                realtime: { heartbeatIntervalMs: 2500 }
            });
            return await this.signInUser();
        }
        async signInUser() {
            if (!this.client || !this.client.auth) {
                this.log("Client or auth not available");
                return false;
            }
            try {
                const result = await this.client.auth.signInWithIdToken({ provider: "snapchat", token: "" });
                if (result.error) {
                    this.log("Sign in warning: " + JSON.stringify(result.error));
                    return false;
                }
                if (result.data && result.data.user && result.data.user.id) {
                    this.userId = "" + result.data.user.id;
                }
                else {
                    this.userId = "spectacles_msg_" + Math.random().toString(36).substr(2, 6);
                }
                this.log("Signed in Snap Cloud as " + this.userId);
                global.appState.signedInSnapCloud = true;
                return true;
            }
            catch (e) {
                this.log("Sign in exception: " + e);
                return false;
            }
        }
        async setupRealtimeChannel() {
            if (!this.client || !this.sessionChannelName) {
                return;
            }
            this.isReady = false;
            this.isSubscribed = false;
            if (this.client.removeAllChannels && this.realtimeChannel) {
                try {
                    this.client.removeAllChannels();
                }
                catch (_e) {
                    /* ignore */
                }
            }
            this.realtimeChannel = this.client.channel(this.sessionChannelName, {
                config: { broadcast: { self: true } }
            });
            this.realtimeChannel.subscribe((status) => {
                this.log("Channel status: " + status);
                if (status === "SUBSCRIBED") {
                    this.isSubscribed = true;
                    this.isReady = true;
                }
            });
        }
        sendCustomMessageInternal(message, eventName, meta) {
            if (!this.isReady || !this.realtimeChannel || !this.isSubscribed) {
                this.log("Not ready yet; waiting for channel subscription");
                return;
            }
            const payload = {
                channel_name: this.sessionChannelName,
                user_id: this.userId,
                message: message || "",
                timestamp: Date.now()
            };
            if (meta) {
                for (const key in meta) {
                    if (Object.prototype.hasOwnProperty.call(meta, key) && payload[key] === undefined) {
                        payload[key] = meta[key];
                    }
                }
            }
            this.realtimeChannel.send({
                type: "broadcast",
                event: eventName || "custom-message",
                payload
            });
        }
        emitSpectators(list) {
            if (this.spectatorsListener) {
                try {
                    this.spectatorsListener(list || []);
                }
                catch (e) {
                    this.log("Spectator listener error: " + e);
                }
            }
        }
        async fetchSpectators(roomCode) {
            if (!this.client || !roomCode) {
                return;
            }
            try {
                const res = await this.client
                    .from("bomb_defusal_rooms")
                    .select("spectators")
                    .eq("room_code", roomCode)
                    .maybeSingle();
                if (!res.error && res.data && res.data.spectators) {
                    this.emitSpectators(res.data.spectators);
                }
                else if (!res.error && res.data) {
                    this.emitSpectators([]);
                }
            }
            catch (e) {
                this.log("Fetch spectators failed: " + e);
            }
        }
        clearSpectatorChannel() {
            if (this.spectatorChannel && this.spectatorChannel.unsubscribe) {
                try {
                    this.spectatorChannel.unsubscribe();
                }
                catch (_e) {
                    /* ignore */
                }
            }
            if (this.client && this.client.removeChannel && this.spectatorChannel) {
                try {
                    this.client.removeChannel(this.spectatorChannel);
                }
                catch (_e) {
                    /* ignore */
                }
            }
            this.spectatorChannel = null;
        }
        setupDisplayName() {
            try {
                if (global.userContextSystem && global.userContextSystem.requestDisplayName) {
                    global.userContextSystem.requestDisplayName((name) => {
                        if (name) {
                            this.displayName = name;
                        }
                    });
                }
            }
            catch (e) {
                this.log("Display name fetch failed: " + e);
            }
        }
        async createRoomAndChannel() {
            if (!this.client || !this.userId) {
                this.log("Cannot create room/channel: missing client or user");
                return null;
            }
            if (this.client && this.realtimeChannel) {
                try {
                    this.client.removeAllChannels();
                }
                catch (_e) {
                    /* ignore */
                }
                this.realtimeChannel = null;
                this.isSubscribed = false;
                this.isReady = false;
            }
            this.sessionChannelName = await this.ensureRoomRegistration();
            if (!this.sessionChannelName) {
                this.log("Failed to establish room/channel");
                return null;
            }
            this.log("Using session channel (room code): " + this.sessionChannelName);
            await this.setupRealtimeChannel();
            return this.sessionChannelName;
        }
        async ensureRoomRegistration() {
            if (!this.client || !this.userId) {
                return null;
            }
            const table = "bomb_defusal_rooms";
            let existingCode = null;
            try {
                const existing = await this.client.from(table).select("room_code").eq("id", this.userId).maybeSingle();
                const hasExisting = existing && existing.data && existing.data.room_code;
                const isNoRows = existing &&
                    existing.error &&
                    (existing.error.code === "PGRST116" ||
                        existing.error.message === "JSON object requested, multiple (or no) rows returned");
                if (hasExisting) {
                    existingCode = existing.data.room_code;
                }
                else if (!isNoRows && existing && existing.error) {
                    this.log("Existing room check error: " + JSON.stringify(existing.error));
                }
            }
            catch (e) {
                this.log("Existing room check failed: " + e);
            }
            const tried = {};
            if (existingCode) {
                tried[existingCode] = true;
            }
            for (let attempt = 0; attempt < 20; attempt++) {
                const roomCode = await this.generateUniqueRoomCode(table, tried);
                if (!roomCode) {
                    break;
                }
                tried[roomCode] = true;
                try {
                    const upsertRes = await this.client.from(table).upsert({
                        id: this.userId,
                        room_code: roomCode,
                        owner_name: this.displayName,
                        created_at: new Date().toISOString(),
                        spectators: []
                    }, { onConflict: "id" });
                    if (!upsertRes.error) {
                        return roomCode;
                    }
                    const code = upsertRes.error && upsertRes.error.code;
                    const msg = (upsertRes.error && upsertRes.error.message) || "";
                    if (code === "23505" || msg.indexOf("duplicate key") !== -1 || code === "PGRST116") {
                        continue;
                    }
                    this.log("Room upsert failed: " + JSON.stringify(upsertRes.error));
                    return null;
                }
                catch (e) {
                    this.log("Room upsert exception: " + e);
                    return null;
                }
            }
            return null;
        }
        async generateUniqueRoomCode(table, excludeMap) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let attempt = 0;
            while (attempt < 20) {
                let code = "";
                for (let i = 0; i < 5; i++) {
                    code += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                if (excludeMap && excludeMap[code]) {
                    attempt++;
                    continue;
                }
                try {
                    const exists = await this.client.from(table).select("room_code").eq("room_code", code).maybeSingle();
                    if (exists.error && exists.error.code !== "PGRST116") {
                        return null;
                    }
                    const hasData = exists && exists.data && exists.data.room_code;
                    if (!hasData) {
                        return code;
                    }
                }
                catch (e) {
                    this.log("Code check failed: " + e);
                    return null;
                }
                attempt++;
            }
            return null;
        }
        clearSlots() {
            if (!this.playerSlots || !this.playerSlots.length) {
                return;
            }
            for (const slot of this.playerSlots) {
                if (slot) {
                    slot.enabled = false;
                }
            }
        }
        normalizeNames(spectators) {
            const names = [];
            if (!spectators || !spectators.length) {
                return names;
            }
            for (const entry of spectators) {
                if (typeof entry === "string") {
                    names.push(entry);
                }
                else if (entry && typeof entry.name === "string") {
                    names.push(entry.name);
                }
                else if (entry && typeof entry.display_name === "string") {
                    names.push(entry.display_name);
                }
            }
            return names;
        }
        applyCameraRequest(request) {
            request.cameraId = CameraModule.CameraId.Default_Color;
            if (this.downsampleTexture) {
                const maxRes = this.maxResolution > 0 ? this.maxResolution : 250;
                request.imageSmallerDimension = maxRes;
            }
        }
        detachStreamFrameListener() {
            if (this.streamFrameRegistration !== null &&
                this.streamingProvider?.onNewFrame) {
                this.streamingProvider.onNewFrame.remove(this.streamFrameRegistration);
                this.streamFrameRegistration = null;
            }
        }
        onCameraFrame() {
            if (!this.isCameraStreaming || !this.textureBroadcastEnabled) {
                return;
            }
            const now = getTime();
            if (now - this.streamLastTime < this.streamIntervalSec) {
                return;
            }
            this.streamLastTime = now;
            const baseTexture = this.streamingCameraTexture;
            if (!baseTexture) {
                return;
            }
            const finalTexture = this.buildCompositeTexture(baseTexture);
            if (this.debugDisplayTexture && this.debugDisplayImage) {
                this.debugDisplayImage.mainPass.baseTex = finalTexture;
            }
            if (this.isEncodingFrame) {
                return;
            }
            this.isEncodingFrame = true;
            this.encodeTexture(finalTexture)
                .then((encoded) => this.broadcastEncodedFrame(encoded))
                .catch((err) => this.log("Encode failed: " + err))
                .finally(() => {
                this.isEncodingFrame = false;
            });
        }
        buildCompositeTexture(baseTexture) {
            const cropTex = this.screenCropTexture;
            if (!cropTex?.control || !this.compositeTexture) {
                return baseTexture;
            }
            cropTex.control.inputTexture = baseTexture;
            this.ensureCompositeCameraSetup();
            if (this.compositeCameraSetup && this.renderTexture) {
                const augmentedImage = this.compositeCameraSetup
                    .getChild(0)
                    ?.getChild(0)
                    ?.getComponent("Component.Image");
                if (augmentedImage) {
                    augmentedImage.mainPass.baseTex = this.renderTexture;
                }
            }
            return this.compositeTexture;
        }
        ensureCompositeCameraSetup() {
            if (!this.compositeCameraSetup && this.virtualRenderCameraSetup) {
                this.compositeCameraSetup = this.virtualRenderCameraSetup.instantiate(this.getSceneObject());
            }
        }
        encodeTexture(texture) {
            return new Promise((resolve, reject) => {
                try {
                    if (Base64.encodeTextureAsync) {
                        Base64.encodeTextureAsync(texture, resolve, reject, this.compressionQuality, this.encodingType);
                    }
                    else {
                        const syncEncode = Base64
                            .encodeTexture;
                        if (syncEncode) {
                            resolve(syncEncode(texture, this.compressionQuality, this.encodingType));
                        }
                        else {
                            reject("Base64 encode not available");
                        }
                    }
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        broadcastEncodedFrame(encodedString) {
            if (!this.textureBroadcastEnabled || !encodedString) {
                return;
            }
            const meta = this.streamMetaProvider?.() ?? null;
            const eventName = "defuserTexture";
            if (meta && Object.keys(meta).length > 0) {
                this.sendCustomMessageWithMeta(encodedString, eventName, meta);
            }
            else {
                this.sendCustomMessage(encodedString, eventName);
            }
        }
        applyGuestNames(names) {
            if (!this.playerSlots || !this.playerSlots.length) {
                return;
            }
            const maxSlots = Math.min(this.playerSlots.length, this.MAX_GUESTS);
            for (let i = 0; i < maxSlots; i++) {
                const slot = this.playerSlots[i];
                if (!slot) {
                    continue;
                }
                const name = names && names[i] ? names[i] : "";
                const hasName = name && name.length > 0;
                slot.enabled = !!hasName;
                if (hasName) {
                    const labelObj = slot.getChild(0);
                    const textComp = labelObj ? labelObj.getComponent("Component.Text") : null;
                    if (textComp) {
                        textComp.text = name;
                    }
                }
            }
            for (let j = maxSlots; j < this.playerSlots.length; j++) {
                if (this.playerSlots[j]) {
                    this.playerSlots[j].enabled = false;
                }
            }
        }
    };
    __setFunctionName(_classThis, "CoopNetworkController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CoopNetworkController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CoopNetworkController = _classThis;
})();
exports.CoopNetworkController = CoopNetworkController;
//# sourceMappingURL=CoopNetworkController.js.map