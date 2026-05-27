import { RectangleButton } from 'SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import { SnapCloudRequirements } from './SnapCloudRequirements';

/**
 * VideoStreamingController - Live video streaming to Supabase Realtime for real-time viewing
 * Based on Remote ARsistance pattern - streams frames for live viewing, no storage
 *
 * KEY DIFFERENCE from VideoCaptureUploader:
 * - This STREAMS for live viewing (no file storage)
 * - VideoCaptureUploader UPLOADS for video composition (stores files)
 */
@component
export class VideoStreamingController extends BaseScriptComponent {


    // Supabase Configuration   
    @input
    @hint("Logs")
    @allowUndefined
    public textLog: Text;
  
  // Debug logging buffer for on-device visibility
  private logBuffer: string[] = [];
  private maxLogLines: number = 15;

  // Core Modules
  private cameraModule: CameraModule = require('LensStudio:CameraModule');
  private internetModule: InternetModule = require('LensStudio:InternetModule');

  // Supabase Configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements;

  @input
  @hint("Supabase Realtime channel name for live streaming")
  public streamingChannelName: string = "live-video-stream";

  @input
  @hint("Stream quality (lower = better performance, higher = better quality) - Keep LOW for Realtime 250KB limit")
  @widget(new SliderWidget(1, 100, 1))
  public streamQuality: number = 15;

  @input
  @hint("Frames per second for live streaming (lower = less bandwidth)")
  @widget(new SliderWidget(1, 30, 1))
  public streamFPS: number = 30;

  @input
  @hint("Stream resolution scale - Keep LOW for Realtime 250KB limit (0.3 = 30% resolution)")
  @widget(new SliderWidget(0.1, 1.0, 0.1))
  public resolutionScale: number = 0.3;

  // Composite Texture Configuration
  @input
  @hint("Use composite texture instead of camera capture for streaming")
  public useCompositeTexture: boolean = false;

  @input
  @hint("Pre-composed texture (with AR content) - used when useCompositeTexture is enabled")
  @allowUndefined
  public compositeTexture: Texture;

  // UI Components
  @input
  @hint("Button to start/stop streaming")
  public streamButton: RectangleButton;

  @input
  @hint("Text component to display streaming status")
  @allowUndefined
  public statusText: Text;

  @input
  @hint("Text component to display button state (Start Stream/Stop Stream)")
  @allowUndefined
  public buttonText: Text;

  @input
  @hint("Image component to show local preview")
  @allowUndefined
  public previewImage: Image;

  // Debug Configuration
  @input
  @hint("Enable detailed debug logging")
  public enableDebugLogs: boolean = true;

  // Private State
  private isStreaming: boolean = false;
  private streamSessionId: string = "";
  private frameCount: number = 0;
  private streamStartTime: number = 0;
  private cameraTexture: Texture;
  private cameraTextureProvider: CameraTextureProvider;
  private frameRegistration: any;
  private lastFrameTime: number = 0;

  // Authentication tracking
  private supabaseClient: any;
  private uid: string;
  private isAuthenticated: boolean = false;

  // Supabase Realtime streaming
  private realtimeChannel: any;
  private isRealtimeConnected: boolean = false;

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
  private async initializeSupabaseAuthentication() {
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

    this.supabaseClient = createClient(
      supabaseProject.url,
      supabaseProject.publicToken,
      options
    );

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
  private async signInUser() {
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
      } else {
        const { user } = data;
        if (user?.id) {
          this.uid = user.id;
          this.isAuthenticated = true;
          this.log(`✅ AUTH SUCCESS: ${this.uid.substring(0, 8)}...`);
        } else {
          this.logError("User ID not found in authentication response");
          this.logError("⚠️ No user ID - Auth incomplete");
          this.isAuthenticated = false;
        }
      }
    } catch (error) {
      this.logError(`Authentication exception: ${error}`);
      this.isAuthenticated = false;
    }

    this.log("=== STREAMING AUTHENTICATION END ===");
  }

  /**
   * Initialize camera for streaming
   */
  private initializeCamera() {
    try {
      this.log("Initializing camera for streaming...");

      // Create camera request
      const cameraRequest = CameraModule.createCameraRequest();
      cameraRequest.cameraId = CameraModule.CameraId.Default_Color;

      // Request camera texture
      this.cameraTexture = this.cameraModule.requestCamera(cameraRequest);
      this.cameraTextureProvider = this.cameraTexture.control as CameraTextureProvider;

      // Show camera feed in preview (will be overridden if composite texture is used)
      if (this.previewImage && this.cameraTexture) {
        this.previewImage.mainPass.baseTex = this.cameraTexture;
      }

      this.log("Camera initialized for streaming");
      this.updateStatus("Camera ready for streaming");

    } catch (error) {
      this.logError(`Failed to initialize camera for streaming: ${error}`);
      this.updateStatus("Camera initialization failed");
    }
  }

  /**
   * Initialize Supabase Realtime channel for live streaming
   */
  private async initializeRealtimeChannel() {
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

        } else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          this.logError(`Channel error: ${status}`);
          this.logError("⚠️ REALTIME DISCONNECTED");
          this.isRealtimeConnected = false;
          this.updateStatus("Streaming channel disconnected");
        }
      });

    } catch (error) {
      this.logError(`Failed to initialize streaming channel: ${error}`);
      this.updateStatus("Streaming channel initialization failed");
    }
  }

  /**
   * Generate and display streaming URL for viewers
   */
  private generateStreamUrl() {
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
  private handleStreamControl(payload: any) {
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
  private onStreamButtonPressed() {
    this.log("🔘 BUTTON PRESSED!");
    
    if (this.isStreaming) {
      this.log("Stopping stream...");
      this.stopStreaming();
    } else {
      this.log("Attempting to start stream...");
      this.startStreaming();
    }
    this.updateButtonText();
  }

  /**
   * Start live streaming
   */
  private startStreaming() {
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
      if (!this.isStreaming) return;
      
      const currentTime = Date.now();
      
      // FPS throttling - only process at desired frame rate
      if (currentTime - this.lastFrameTime < frameInterval) {
        return; // Skip this frame to maintain target FPS
      }
      
      this.lastFrameTime = currentTime;
      
      // Log first few frames to confirm callback is working
      if (this.frameCount === 0) {
        this.log("📸 First frame callback - texture is loaded!");
      } else if (this.frameCount === 1) {
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
  private async streamFrame(timestamp: number) {
    if (!this.isStreaming) return;

    this.frameCount++;

    try {
      let textureToStream: Texture;
      let textureSource: string;

      // Choose between composite texture or camera texture
      if (this.useCompositeTexture && this.compositeTexture) {
        textureToStream = this.compositeTexture;
        textureSource = "composite";
        if (this.frameCount === 1) {
          this.log("Using composite texture");
        }
      } else {
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
        } else if (frameSizeBytes > 200000) {
          this.log(`⚠️ Warning: ${frameSizeKB} KB (close to 250 KB limit)`);
        } else {
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
      } else if (this.frameCount % 30 === 0) {
        const duration = Math.floor((timestamp - this.streamStartTime) / 1000);
        this.log(`📊 ${this.frameCount} frames (${duration}s)`);
        this.updateStatus(`Streaming: ${this.frameCount} frames (${duration}s) - ${textureSource}`);
      }

    } catch (error) {
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
  private async textureToBase64(texture: Texture): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Use lower compression quality to fit Realtime 250KB message limit
        // At quality 15 and 0.3 resolution, we need maximum compression
        const compressionQuality = this.streamQuality > 50 ?
          CompressionQuality.IntermediateQuality :
          CompressionQuality.LowQuality;

        Base64.encodeTextureAsync(
          texture,
          (encodedString: string) => {
            resolve(encodedString);
          },
          () => {
            reject(new Error("Base64 encoding failed"));
          },
          compressionQuality,
          EncodingType.Jpg
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop live streaming
   */
  private stopStreaming() {
    if (!this.isStreaming) return;

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
  private sendStreamMessage(message: { event: string, payload: any }) {
    if (this.realtimeChannel && this.isRealtimeConnected) {
      try {
        this.realtimeChannel.send({
          type: "broadcast",
          event: message.event,
          payload: message.payload
        });
      } catch (error) {
        this.logError(`Failed to send stream message: ${error}`);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `stream_${timestamp}_${random}`;
  }

  /**
   * Update status text
   */
  private updateStatus(message: string) {
    if (this.statusText) {
      this.statusText.text = message;
    }
    this.log(`Status: ${message}`);
  }

  /**
   * Update button text based on streaming state
   */
  private updateButtonText() {
    if (this.buttonText) {
      if (this.isStreaming) {
        this.buttonText.text = "Stop Live Stream";
      } else {
        this.buttonText.text = "Start Live Stream";
      }
    }
  }

  /**
   * Update preview to show what will be streamed
   */
  private updatePreview() {
    if (this.previewImage) {
      if (this.useCompositeTexture && this.compositeTexture) {
        this.previewImage.mainPass.baseTex = this.compositeTexture;
        this.log("Preview updated to show composite texture");
      } else if (this.cameraTexture) {
        this.previewImage.mainPass.baseTex = this.cameraTexture;
        this.log("Preview updated to show camera texture");
      }
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
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
  private log(message: string) {
    const fullMessage = `[VideoStream] ${message}`;
    if (this.enableDebugLogs) {
      print(fullMessage);
    }
    this.addToLogBuffer(message);
  }

  private logError(message: string) {
    const fullMessage = `[VideoStream] ❌ ERROR: ${message}`;
    print(fullMessage);
    this.addToLogBuffer(`❌ ${message}`);
  }

  /**
   * Add message to on-device log buffer and update textLog component
   */
  private addToLogBuffer(message: string) {
    if (!this.textLog) return;

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
  private clearLogBuffer() {
    this.logBuffer = [];
    if (this.textLog) {
      this.textLog.text = "";
    }
  }
}