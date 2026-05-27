import { SnapCloudRequirements } from "/SnapCloudRequirements";
import { RealtimeChannel, SupabaseClient, createClient } from "SupabaseClient.lspkg/supabase-snapcloud";

@component
export class RealtimeMessageSender extends BaseScriptComponent {
  // Supabase configuration
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  snapCloudRequirements;

  @input
  @hint("Channel name for simple message broadcast")
  channelName = "demo";

  @input
  @hint("Base string to append a random number to before sending")
  baseMessage = "Spectacles ping";

  @input
  @hint("Show debug logs in the console")
  enableDebugLogs = true;

  // Internal state
  client = null;
  realtimeChannel = null;
  isInitialized = false;
  userId = "";

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initializeSupabase();
    });

    this.createEvent("TapEvent").bind(() => {
      this.handleTap();
    });

    this.createEvent("OnDestroyEvent").bind(() => {
      this.cleanup();
    });
  }

  /**
   * Initialize Supabase client and realtime channel
   */
  async initializeSupabase() {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("SnapCloudRequirements not configured");
      return;
    }

    try {
      const options = {
        realtime: {
          heartbeatIntervalMs: 2500,
        },
      };

      this.client = createClient(
        this.snapCloudRequirements.getSupabaseUrl(),
        this.snapCloudRequirements.getSupabasePublicToken(),
        options
      );

      if (!this.client) {
        this.log("Failed to create Supabase client");
        return;
      }

      await this.signInUser();

      this.userId = "spectacles_msg_" + Math.random().toString(36).substr(2, 6);

      await this.setupRealtimeChannel();

      this.isInitialized = true;
      this.log("Supabase ready for message sends");
    } catch (error) {
      this.log("Initialization error: " + error);
    }
  }

  /**
   * Minimal sign-in for Realtime
   */
  async signInUser() {
    const { error } = await this.client.auth.signInWithIdToken({
      provider: "snapchat",
      token: "",
    });

    if (error) {
      this.log("Sign in warning: " + JSON.stringify(error));
    } else {
      this.log("Signed in for realtime");
    }
  }

  /**
   * Join realtime channel
   */
  async setupRealtimeChannel() {
    this.realtimeChannel = this.client.channel(`simple-${this.channelName}`, {
      config: { broadcast: { self: true } },
    });

    this.realtimeChannel.subscribe((status) => {
      this.log("Channel status: " + status);
    });
  }

  /**
   * Handle tap gesture and send a randomised message
   */
  handleTap() {
    if (!this.isInitialized || !this.realtimeChannel) {
      this.log("Not ready yet; initialize first");
      return;
    }

    const randomNumber = Math.floor(Math.random() * 10000);
    const message = `${this.baseMessage} ${randomNumber}`;

    this.realtimeChannel.send({
      type: "broadcast",
      event: "random-message",
      payload: {
        channel_name: this.channelName,
        user_id: this.userId,
        message: message,
        random: randomNumber,
        timestamp: Date.now(),
      },
    });

    this.log(`Sent: "${message}"`);
  }

  /**
   * Cleanup on destroy
   */
  cleanup() {
    if (this.client) {
      this.client.removeAllChannels();
    }
  }

  /**
   * Logging helper
   */
  log(message) {
    if (this.enableDebugLogs) {
      print(`[RealtimeMessageSender] ${message}`);
    }
  }
}
