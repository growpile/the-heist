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
exports.VideoStreamingController = void 0;
var __selfType = requireType("./Streamer");
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
/**
 * VideoStreamingController - Live video streaming to Supabase Realtime for real-time viewing
 * Based on Remote ARsistance pattern - streams frames for live viewing, no storage
 *
 * KEY DIFFERENCE from VideoCaptureUploader:
 * - This STREAMS for live viewing (no file storage)
 * - VideoCaptureUploader UPLOADS for video composition (stores files)
 */
let VideoStreamingController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var VideoStreamingController = _classThis = class extends _classSuper {
        constructor() {
            super();
            // Supabase Configuration   
            this.textLog = this.textLog;
            // Debug logging buffer for on-device visibility
            this.logBuffer = [];
            this.maxLogLines = 15;
            // Core Modules
            this.cameraModule = require('LensStudio:CameraModule');
            this.internetModule = require('LensStudio:InternetModule');
            // Supabase Configuration
            this.snapCloudRequirements = this.snapCloudRequirements;
            this.streamingChannelName = this.streamingChannelName;
            this.streamQuality = this.streamQuality;
            this.streamFPS = this.streamFPS;
            this.resolutionScale = this.resolutionScale;
            // Composite Texture Configuration
            this.useCompositeTexture = this.useCompositeTexture;
            this.compositeTexture = this.compositeTexture;
            // UI Components
            this.streamButton = this.streamButton;
            this.statusText = this.statusText;
            this.buttonText = this.buttonText;
            this.previewImage = this.previewImage;
            // Debug Configuration
            this.enableDebugLogs = this.enableDebugLogs;
            // Private State
            this.isStreaming = false;
            this.streamSessionId = "";
            this.frameCount = 0;
            this.streamStartTime = 0;
            this.lastFrameTime = 0;
            this.isAuthenticated = false;
            this.isRealtimeConnected = false;
        }
        __initialize() {
            super.__initialize();
            // Supabase Configuration   
            this.textLog = this.textLog;
            // Debug logging buffer for on-device visibility
            this.logBuffer = [];
            this.maxLogLines = 15;
            // Core Modules
            this.cameraModule = require('LensStudio:CameraModule');
            this.internetModule = require('LensStudio:InternetModule');
            // Supabase Configuration
            this.snapCloudRequirements = this.snapCloudRequirements;
            this.streamingChannelName = this.streamingChannelName;
            this.streamQuality = this.streamQuality;
            this.streamFPS = this.streamFPS;
            this.resolutionScale = this.resolutionScale;
            // Composite Texture Configuration
            this.useCompositeTexture = this.useCompositeTexture;
            this.compositeTexture = this.compositeTexture;
            // UI Components
            this.streamButton = this.streamButton;
            this.statusText = this.statusText;
            this.buttonText = this.buttonText;
            this.previewImage = this.previewImage;
            // Debug Configuration
            this.enableDebugLogs = this.enableDebugLogs;
            // Private State
            this.isStreaming = false;
            this.streamSessionId = "";
            this.frameCount = 0;
            this.streamStartTime = 0;
            this.lastFrameTime = 0;
            this.isAuthenticated = false;
            this.isRealtimeConnected = false;
        }
        onAwake() {
            this.log("🎥 VideoStreamingController INIT");
            this.log("VideoStreamingController initializing...");
            // Validate requirements
            if (!this.snapCloudRequirements) {
                this.logError("SnapCloudRequirements not configured! Please assign in Inspector.");
                return;
            }
            this.log("✅ SnapCloudRequirements found");
            // Setup button handler
            if (this.streamButton) {
                this.streamButton.onTriggerUp.add(() => {
                    this.onStreamButtonPressed();
                });
            }
            // Initialize on start
            this.createEvent("OnStartEvent").bind(() => {
                this.initializeSupabaseAuthentication();
            });
            // Cleanup on destroy
            this.createEvent("OnDestroyEvent").bind(() => {
                this.cleanup();
            });
            this.updateStatus("Ready to stream");
            this.updateButtonText();
        }
        /**
         * Initialize Supabase authentication
         */
        async initializeSupabaseAuthentication() {
            this.log("🚀 INIT: Starting authentication");
            this.log("=== STREAMING AUTHENTICATION START ===");
            if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
                this.logError("SnapCloudRequirements not configured");
                return;
            }
            const supabaseProject = this.snapCloudRequirements.getSupabaseProject();
            this.log(`📡 Supabase URL: ${supabaseProject.url.substring(0, 30)}...`);
            // Create Supabase client
            const { createClient } = require('SupabaseClient.lspkg/supabase-snapcloud');
            const options = {
                realtime: {
                    heartbeatIntervalMs: 2500,
                },
            };
            this.supabaseClient = createClient(supabaseProject.url, supabaseProject.publicToken, options);
            this.log("Supabase client created for streaming");
            if (this.supabaseClient) {
                await this.signInUser();
                this.initializeCamera();
                this.initializeRealtimeChannel();
            }
        }
        /**
         * Sign in user using Snap Cloud authentication
         */
        async signInUser() {
            this.log("Attempting Snap Cloud authentication for streaming...");
            try {
                const { data, error } = await this.supabaseClient.auth.signInWithIdToken({
                    provider: 'snapchat',
                    token: '',
                });
                if (error) {
                    this.logError("Sign in error: " + JSON.stringify(error));
                    this.logError("⚠️ AUTH FAILED - Check Snapchat token");
                    this.isAuthenticated = false;
                }
                else {
                    const { user } = data;
                    if (user?.id) {
                        this.uid = user.id;
                        this.isAuthenticated = true;
                        this.log(`✅ AUTH SUCCESS: ${this.uid.substring(0, 8)}...`);
                    }
                    else {
                        this.logError("User ID not found in authentication response");
                        this.logError("⚠️ No user ID - Auth incomplete");
                        this.isAuthenticated = false;
                    }
                }
            }
            catch (error) {
                this.logError(`Authentication exception: ${error}`);
                this.isAuthenticated = false;
            }
            this.log("=== STREAMING AUTHENTICATION END ===");
        }
        /**
         * Initialize camera for streaming
         */
        initializeCamera() {
            try {
                this.log("Initializing camera for streaming...");
                // Create camera request
                const cameraRequest = CameraModule.createCameraRequest();
                cameraRequest.cameraId = CameraModule.CameraId.Default_Color;
                // Request camera texture
                this.cameraTexture = this.cameraModule.requestCamera(cameraRequest);
                this.cameraTextureProvider = this.cameraTexture.control;
                // Show camera feed in preview (will be overridden if composite texture is used)
                if (this.previewImage && this.cameraTexture) {
                    this.previewImage.mainPass.baseTex = this.cameraTexture;
                }
                this.log("Camera initialized for streaming");
                this.updateStatus("Camera ready for streaming");
            }
            catch (error) {
                this.logError(`Failed to initialize camera for streaming: ${error}`);
                this.updateStatus("Camera initialization failed");
            }
        }
        /**
         * Initialize Supabase Realtime channel for live streaming
         */
        async initializeRealtimeChannel() {
            try {
                this.log("Initializing Supabase Realtime channel for streaming...");
                this.log(`Streaming channel: ${this.streamingChannelName}`);
                if (!this.supabaseClient) {
                    this.logError("Supabase client not initialized");
                    return;
                }
                // Create realtime channel for streaming
                this.realtimeChannel = this.supabaseClient.channel(this.streamingChannelName, {
                    config: {
                        broadcast: { self: false } // Don't receive own broadcasts
                    }
                });
                // Listen for viewer connections and control messages
                this.realtimeChannel
                    .on("broadcast", { event: "viewer-joined" }, (msg) => {
                    this.log(`New viewer joined: ${msg.payload.viewerId}`);
                    this.updateStatus(`Streaming to ${msg.payload.viewerId}`);
                })
                    .on("broadcast", { event: "viewer-left" }, (msg) => {
                    this.log(`Viewer left: ${msg.payload.viewerId}`);
                    this.updateStatus("No active viewers");
                })
                    .on("broadcast", { event: "stream-control" }, (msg) => {
                    this.handleStreamControl(msg.payload);
                });
                // Subscribe to channel
                this.log(`📡 Subscribing to channel: ${this.streamingChannelName}`);
                this.realtimeChannel.subscribe(async (status) => {
                    this.log(`🔔 Channel status: ${status}`);
                    if (status === "SUBSCRIBED") {
                        this.log("✅ REALTIME CONNECTED!");
                        this.log(`📢 Channel: ${this.streamingChannelName}`);
                        this.isRealtimeConnected = true;
                        this.updateStatus("Ready to stream live");
                        // Generate and display stream URL
                        this.generateStreamUrl();
                    }
                    else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
                        this.logError(`Channel error: ${status}`);
                        this.logError("⚠️ REALTIME DISCONNECTED");
                        this.isRealtimeConnected = false;
                        this.updateStatus("Streaming channel disconnected");
                    }
                });
            }
            catch (error) {
                this.logError(`Failed to initialize streaming channel: ${error}`);
                this.updateStatus("Streaming channel initialization failed");
            }
        }
        /**
         * Generate and display streaming URL for viewers
         */
        generateStreamUrl() {
            // In a real implementation, this would be your web viewer URL
            const baseUrl = this.snapCloudRequirements.getSupabaseUrl().replace('https://', '');
            const streamUrl = `https://your-stream-viewer.com/watch/${this.streamingChannelName}`;
            this.log(`Stream URL generated: ${streamUrl}`);
            // Send stream initialization
            this.sendStreamMessage({
                event: "stream-init",
                payload: {
                    channelName: this.streamingChannelName,
                    streamerId: this.uid || 'spectacles_user',
                    timestamp: Date.now(),
                    settings: {
                        fps: this.streamFPS,
                        quality: this.streamQuality,
                        resolution: this.resolutionScale
                    }
                }
            });
        }
        /**
         * Handle stream control messages
         */
        handleStreamControl(payload) {
            switch (payload.action) {
                case 'request-higher-quality':
                    this.log("Viewer requested higher quality");
                    this.streamQuality = Math.min(this.streamQuality + 20, 100);
                    break;
                case 'request-lower-quality':
                    this.log("Viewer requested lower quality due to bandwidth");
                    this.streamQuality = Math.max(this.streamQuality - 20, 20);
                    break;
                case 'stop-stream':
                    this.log("Stream stopped by viewer/admin");
                    this.stopStreaming();
                    break;
                default:
                    this.log(`Unknown stream control action: ${payload.action}`);
            }
        }
        /**
         * Handle stream button press - toggle streaming
         */
        onStreamButtonPressed() {
            this.log("🔘 BUTTON PRESSED!");
            if (this.isStreaming) {
                this.log("Stopping stream...");
                this.stopStreaming();
            }
            else {
                this.log("Attempting to start stream...");
                this.startStreaming();
            }
            this.updateButtonText();
        }
        /**
         * Start live streaming
         */
        startStreaming() {
            this.log("🎬 START STREAM requested");
            if (!this.cameraTextureProvider) {
                this.logError("Camera not ready");
                return;
            }
            if (!this.isRealtimeConnected) {
                this.logError("Realtime not connected");
                return;
            }
            this.log(`✅ Starting stream @ ${this.streamFPS}fps`);
            this.log(`Quality: ${this.streamQuality}%`);
            this.isStreaming = true;
            this.streamSessionId = this.generateSessionId();
            this.frameCount = 0;
            this.streamStartTime = Date.now();
            this.lastFrameTime = 0;
            // Update preview to show what will be streamed
            this.updatePreview();
            this.updateStatus("Streaming live...");
            this.updateButtonText();
            // Calculate frame interval based on desired FPS
            const frameInterval = 1000 / this.streamFPS;
            this.log(`⏱️ Frame interval: ${frameInterval.toFixed(1)}ms`);
            // Use onNewFrame callback - texture is only valid inside this callback!
            this.log("🎥 Registering onNewFrame callback...");
            this.log(`Camera texture provider: ${this.cameraTextureProvider ? 'YES' : 'NO'}`);
            this.log(`Camera texture: ${this.cameraTexture ? 'YES' : 'NO'}`);
            // Subscribe to camera frame updates - encoding MUST happen inside callback
            this.frameRegistration = this.cameraTextureProvider.onNewFrame.add((cameraFrame) => {
                if (!this.isStreaming)
                    return;
                const currentTime = Date.now();
                // FPS throttling - only process at desired frame rate
                if (currentTime - this.lastFrameTime < frameInterval) {
                    return; // Skip this frame to maintain target FPS
                }
                this.lastFrameTime = currentTime;
                // Log first few frames to confirm callback is working
                if (this.frameCount === 0) {
                    this.log("📸 First frame callback - texture is loaded!");
                }
                else if (this.frameCount === 1) {
                    this.log("📸 Second frame callback received");
                }
                // Stream frame while texture data is valid (inside callback)
                this.streamFrame(currentTime);
            });
            this.log("✅ onNewFrame callback registered");
            this.log(`📊 Target FPS: ${this.streamFPS}`);
            // Notify viewers that stream started
            this.log("📤 Sending stream-started event...");
            this.sendStreamMessage({
                event: "stream-started",
                payload: {
                    sessionId: this.streamSessionId,
                    timestamp: Date.now()
                }
            });
            this.log("✅ Stream-started event sent");
        }
        /**
         * Stream a frame via Realtime (Remote ARsistance pattern)
         */
        async streamFrame(timestamp) {
            if (!this.isStreaming)
                return;
            this.frameCount++;
            try {
                let textureToStream;
                let textureSource;
                // Choose between composite texture or camera texture
                if (this.useCompositeTexture && this.compositeTexture) {
                    textureToStream = this.compositeTexture;
                    textureSource = "composite";
                    if (this.frameCount === 1) {
                        this.log("Using composite texture");
                    }
                }
                else {
                    textureToStream = this.cameraTexture;
                    textureSource = "camera";
                    if (this.frameCount === 1) {
                        this.log("Using camera texture");
                    }
                }
                if (!textureToStream) {
                    this.logError(`${textureSource} texture not available for streaming`);
                    return;
                }
                // Log encoding start for first frame
                if (this.frameCount === 1) {
                    this.log("🔄 Encoding frame to base64...");
                }
                // Convert texture to base64 with frame marker (like Remote ARsistance)
                const base64Frame = await this.textureToBase64(textureToStream);
                const frameData = base64Frame + "|||FRAME_END|||";
                // Calculate frame size in KB
                const frameSizeBytes = frameData.length;
                const frameSizeKB = (frameSizeBytes / 1024).toFixed(1);
                // Log frame size for first frame and every 10th frame
                if (this.frameCount === 1 || this.frameCount % 10 === 0) {
                    this.log(`📦 Frame #${this.frameCount}: ${frameSizeKB} KB`);
                    // Warn if approaching or exceeding 250 KB limit
                    if (frameSizeBytes > 250000) {
                        this.logError(`⚠️ OVER LIMIT! ${frameSizeKB} KB > 250 KB`);
                        this.logError("Reduce quality/resolution!");
                    }
                    else if (frameSizeBytes > 200000) {
                        this.log(`⚠️ Warning: ${frameSizeKB} KB (close to 250 KB limit)`);
                    }
                    else {
                        this.log(`✅ Size OK (under 250 KB limit)`);
                    }
                }
                // Send frame via Realtime broadcast
                this.sendStreamMessage({
                    event: "video-frame",
                    payload: {
                        sessionId: this.streamSessionId,
                        frameNumber: this.frameCount,
                        timestamp: timestamp,
                        frameData: frameData,
                        metadata: {
                            fps: this.streamFPS,
                            quality: this.streamQuality,
                            resolution: this.resolutionScale,
                            source: textureSource // Track whether using camera or composite
                        }
                    }
                });
                // Update status and logs (less frequently to avoid spam)
                if (this.frameCount === 1) {
                    this.log(`📹 First frame sent!`);
                }
                else if (this.frameCount % 30 === 0) {
                    const duration = Math.floor((timestamp - this.streamStartTime) / 1000);
                    this.log(`📊 ${this.frameCount} frames (${duration}s)`);
                    this.updateStatus(`Streaming: ${this.frameCount} frames (${duration}s) - ${textureSource}`);
                }
            }
            catch (error) {
                this.logError(`Frame ${this.frameCount} failed: ${error}`);
                // Log detailed error info for debugging
                if (this.frameCount === 1) {
                    this.logError("⚠️ First frame failed - check camera/texture");
                }
            }
        }
        /**
         * Convert texture to base64 for streaming (optimized for real-time)
         * Uses aggressive compression to stay under Realtime 250KB limit
         */
        async textureToBase64(texture) {
            return new Promise((resolve, reject) => {
                try {
                    // Use lower compression quality to fit Realtime 250KB message limit
                    // At quality 15 and 0.3 resolution, we need maximum compression
                    const compressionQuality = this.streamQuality > 50 ?
                        CompressionQuality.IntermediateQuality :
                        CompressionQuality.LowQuality;
                    Base64.encodeTextureAsync(texture, (encodedString) => {
                        resolve(encodedString);
                    }, () => {
                        reject(new Error("Base64 encoding failed"));
                    }, compressionQuality, EncodingType.Jpg);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
        /**
         * Stop live streaming
         */
        stopStreaming() {
            if (!this.isStreaming)
                return;
            this.log("⏹️ STOP STREAM requested");
            this.isStreaming = false;
            // Unsubscribe from frame updates
            if (this.frameRegistration && this.cameraTextureProvider) {
                this.cameraTextureProvider.onNewFrame.remove(this.frameRegistration);
                this.frameRegistration = null;
                this.log("⏹️ onNewFrame callback removed");
            }
            // Notify viewers that stream ended
            this.sendStreamMessage({
                event: "stream-ended",
                payload: {
                    sessionId: this.streamSessionId,
                    timestamp: Date.now(),
                    totalFrames: this.frameCount,
                    duration: Date.now() - this.streamStartTime
                }
            });
            const duration = (Date.now() - this.streamStartTime) / 1000;
            this.log(`✅ STREAM COMPLETE`);
            this.log(`📊 Total: ${this.frameCount} frames in ${duration.toFixed(1)}s`);
            const avgFps = duration > 0 ? (this.frameCount / duration).toFixed(1) : 0;
            this.log(`📈 Avg FPS: ${avgFps}`);
            this.updateStatus(`Stream ended: ${this.frameCount} frames streamed`);
            this.updateButtonText();
        }
        /**
         * Send message via Supabase Realtime
         */
        sendStreamMessage(message) {
            if (this.realtimeChannel && this.isRealtimeConnected) {
                try {
                    this.realtimeChannel.send({
                        type: "broadcast",
                        event: message.event,
                        payload: message.payload
                    });
                }
                catch (error) {
                    this.logError(`Failed to send stream message: ${error}`);
                }
            }
        }
        /**
         * Generate unique session ID
         */
        generateSessionId() {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 9);
            return `stream_${timestamp}_${random}`;
        }
        /**
         * Update status text
         */
        updateStatus(message) {
            if (this.statusText) {
                this.statusText.text = message;
            }
            this.log(`Status: ${message}`);
        }
        /**
         * Update button text based on streaming state
         */
        updateButtonText() {
            if (this.buttonText) {
                if (this.isStreaming) {
                    this.buttonText.text = "Stop Live Stream";
                }
                else {
                    this.buttonText.text = "Start Live Stream";
                }
            }
        }
        /**
         * Update preview to show what will be streamed
         */
        updatePreview() {
            if (this.previewImage) {
                if (this.useCompositeTexture && this.compositeTexture) {
                    this.previewImage.mainPass.baseTex = this.compositeTexture;
                    this.log("Preview updated to show composite texture");
                }
                else if (this.cameraTexture) {
                    this.previewImage.mainPass.baseTex = this.cameraTexture;
                    this.log("Preview updated to show camera texture");
                }
            }
        }
        /**
         * Cleanup resources
         */
        cleanup() {
            // Stop streaming if active
            if (this.isStreaming) {
                this.stopStreaming();
            }
            // Ensure frame registration is cleaned up
            if (this.frameRegistration && this.cameraTextureProvider) {
                this.cameraTextureProvider.onNewFrame.remove(this.frameRegistration);
                this.frameRegistration = null;
            }
            // Close Realtime connection
            if (this.realtimeChannel && this.isRealtimeConnected) {
                this.log("Closing streaming channel...");
                this.supabaseClient.removeChannel(this.realtimeChannel);
                this.isRealtimeConnected = false;
            }
        }
        /**
         * Logging helpers
         */
        log(message) {
            const fullMessage = `[VideoStream] ${message}`;
            if (this.enableDebugLogs) {
                print(fullMessage);
            }
            this.addToLogBuffer(message);
        }
        logError(message) {
            const fullMessage = `[VideoStream] ❌ ERROR: ${message}`;
            print(fullMessage);
            this.addToLogBuffer(`❌ ${message}`);
        }
        /**
         * Add message to on-device log buffer and update textLog component
         */
        addToLogBuffer(message) {
            if (!this.textLog)
                return;
            // Add timestamp to message
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = `[${timestamp}] ${message}`;
            // Add to buffer
            this.logBuffer.push(logMessage);
            // Keep only the most recent messages
            if (this.logBuffer.length > this.maxLogLines) {
                this.logBuffer.shift();
            }
            // Update the text component with the buffer
            this.textLog.text = this.logBuffer.join('\n');
        }
        /**
         * Clear the log buffer
         */
        clearLogBuffer() {
            this.logBuffer = [];
            if (this.textLog) {
                this.textLog.text = "";
            }
        }
    };
    __setFunctionName(_classThis, "VideoStreamingController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VideoStreamingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VideoStreamingController = _classThis;
})();
exports.VideoStreamingController = VideoStreamingController;
//# sourceMappingURL=Streamer.js.map