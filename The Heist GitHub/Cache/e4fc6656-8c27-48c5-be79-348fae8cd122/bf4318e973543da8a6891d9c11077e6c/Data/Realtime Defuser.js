// Simple realtime message sender for Lens Studio
// @input Component.ScriptComponent snapCloudRequirements
// @input string channelName
// @input string baseMessage = "dT"
// @input bool enableDebugLogs = true

var supabaseModule = require("SupabaseClient.lspkg/supabase-snapcloud");
var createClient = supabaseModule && supabaseModule.createClient ? supabaseModule.createClient : supabaseModule;

var client = null;
var realtimeChannel = null;
var userId = "";
var isReady = false;
var isSubscribed = false;
var sessionChannelName = "";

// Logger
function log(msg) {
    if (script.enableDebugLogs) {
        print("[RealtimeMessageSender] " + msg);
    }
}

// Helpers to call SnapCloudRequirements (api or direct)
function callRequirements(name /* ...args */) {
    var comp = script.snapCloudRequirements;
    if (!comp) { return null; }
    var args = Array.prototype.slice.call(arguments, 1);
    if (comp.api && typeof comp.api[name] === "function") {
        return comp.api[name].apply(comp.api, args);
    }
    if (typeof comp[name] === "function") {
        return comp[name].apply(comp, args);
    }
    return null;
}

// Lifecycle
script.createEvent("OnStartEvent").bind(function () {
    initSupabase();
});

script.createEvent("TapEvent").bind(function () {
    sendRandomMessage();
});

script.createEvent("OnDestroyEvent").bind(function () {
    try {
        if (client && client.removeAllChannels) {
            client.removeAllChannels();
        }
    } catch (e) {}
});

async function initSupabase() {
    if (!script.snapCloudRequirements) {
        log("SnapCloudRequirements not configured");
        return;
    }

    var isConfigured = callRequirements("isConfigured");
    if (!isConfigured) {
        log("SnapCloudRequirements not configured");
        return;
    }

    var supabaseProject = callRequirements("getSupabaseProject");
    if (!supabaseProject) {
        log("Could not retrieve Supabase project");
        return;
    }

    if (!createClient) {
        log("Supabase createClient not found; ensure package is included");
        return;
    }

    client = createClient(supabaseProject.url, supabaseProject.publicToken, {
        realtime: { heartbeatIntervalMs: 2500 }
    });

    log("Client initialized");
    await signInUser();
    userId = "spectacles_msg_" + Math.random().toString(36).substr(2, 6);
    sessionChannelName = buildSessionChannelName();
    log("Using session channel: " + sessionChannelName);
    await setupRealtimeChannel();
}

async function signInUser() {
    if (!client || !client.auth) {
        log("Client or auth not available");
        return;
    }
    try {
        var result = await client.auth.signInWithIdToken({ provider: "snapchat", token: "" });
        if (result.error) {
            log("Sign in warning: " + JSON.stringify(result.error));
        } else {
            log("Signed in for realtime");
        }
    } catch (e) {
        log("Sign in exception: " + e);
    }
}

async function setupRealtimeChannel() {
    if (!client) { return; }
    if (!sessionChannelName) {
        log("Session channel name missing");
        return;
    }
    realtimeChannel = client.channel(sessionChannelName, {
        config: { broadcast: { self: true } }
    });

    realtimeChannel.subscribe(function (status) {
        log("Channel status: " + status);
        if (status === "SUBSCRIBED") {
            isSubscribed = true;
            isReady = true;
            log("Realtime ready; tap to send");
        }
    });
}

function sendRandomMessage() {
    if (!isReady || !realtimeChannel || !isSubscribed) {
        log("Not ready yet; waiting for channel subscription");
        return;
    }

    var randomNumber = Math.floor(Math.random() * 10000);
    var base = script.baseMessage || "Spectacles ping";
    var message = base + " " + randomNumber;

    realtimeChannel.send({
        type: "broadcast",
        event: "random-message",
        payload: {
            channel_name: sessionChannelName,
            user_id: userId,
            message: message,
            random: randomNumber,
            timestamp: Date.now()
        }
    });

    log('Sent: "' + message + '"');
}

function sendCustomMessageInternal(message, eventName) {
    if (!isReady || !realtimeChannel || !isSubscribed) {
        log("Not ready yet; waiting for channel subscription");
        return;
    }
    var payloadMessage = message || "";
    var eventType = eventName || "custom-message";

    realtimeChannel.send({
        type: "broadcast",
        event: eventType,
        payload: {
            channel_name: sessionChannelName,
            user_id: userId,
            message: payloadMessage,
            timestamp: Date.now()
        }
    });
    log('Sent custom event "' + eventType + '": "' + payloadMessage + '"');
}

function buildSessionChannelName() {
    var base = script.channelName;
    return base + "-" + userId;
}

// Exposed helper: call script.sendCustomMessage("hello", "my-event") to push custom payloads
script.sendCustomMessage = function (message, eventName) {
    sendCustomMessageInternal(message, eventName);
};