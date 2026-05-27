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
var displayName = "Spectacles User";
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
    setupDisplayName();
    initSupabase();
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

    log("Supabase ready; call script.createRoom() to register room and open channel");
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
            if (result.data && result.data.user && result.data.user.id) {
                userId = "" + result.data.user.id;
            } else {
                userId = "spectacles_msg_" + Math.random().toString(36).substr(2, 6);
            }
            log("Signed in for realtime as " + userId);
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

    // Reset any previous channel
    isReady = false;
    isSubscribed = false;
    if (client.removeAllChannels && realtimeChannel) {
        try { client.removeAllChannels(); } catch (e) {}
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

script.sendCustomMessage = function (message, eventName) {
    sendCustomMessageInternal(message, eventName);
};

// Exposed function to create/register room and open channel
script.createRoom = function () {
    return createRoomAndChannel();
};

// --- Room registration helpers ------------------------------------------------

function setupDisplayName() {
    try {
        if (global.userContextSystem && global.userContextSystem.requestDisplayName) {
            global.userContextSystem.requestDisplayName(function (name) {
                if (name) { displayName = name; }
            });
        }
    } catch (e) {
        log("Display name fetch failed: " + e);
    }
}

async function ensureRoomRegistration() {
    if (!client || !userId) {
        log("Cannot register room: client or user missing");
        return null;
    }

    var table = "bomb_defusal_rooms";

    var existingCode = null;
    try {
        var existing = await client.from(table).select("room_code").eq("id", userId).maybeSingle();
        var hasExisting = existing && existing.data && existing.data.room_code;
        var isNoRows = existing && existing.error && (existing.error.code === "PGRST116" || existing.error.message === "JSON object requested, multiple (or no) rows returned");

        if (hasExisting) {
            existingCode = existing.data.room_code;
        } else if (!isNoRows && existing && existing.error) {
            log("Existing room check error: " + JSON.stringify(existing.error));
        }
    } catch (e) {
        log("Existing room check failed: " + e);
    }

    var tried = {};
    if (existingCode) { tried[existingCode] = true; }

    // Generate a unique room code and upsert; retry on conflict
    for (var attempt = 0; attempt < 20; attempt++) {
        var roomCode = await generateUniqueRoomCode(table, tried);
        if (!roomCode) { break; }
        tried[roomCode] = true;
        try {
            var upsertRes = await client.from(table).upsert({
                id: userId,
                room_code: roomCode,
                owner_name: displayName,
                created_at: new Date().toISOString()
            }, { onConflict: "id" });

            if (!upsertRes.error) {
                return roomCode;
            }

            var code = upsertRes.error && upsertRes.error.code;
            var msg = upsertRes.error && upsertRes.error.message || "";
            if (code === "23505" || msg.indexOf("duplicate key") !== -1 || code === "PGRST116") {
                // Conflict on room_code or id; try another
                continue;
            }

            log("Room upsert failed: " + JSON.stringify(upsertRes.error));
            return null;
        } catch (e) {
            log("Room upsert exception: " + e);
            return null;
        }
    }

    log("Could not generate unique room code after attempts");
    return null;
}

async function createRoomAndChannel() {
    if (!client || !userId) {
        log("Cannot create room/channel: missing client or user");
        return null;
    }

    sessionChannelName = await ensureRoomRegistration();
    if (!sessionChannelName) {
        log("Failed to establish room/channel");
        return null;
    }

    log("Using session channel (room code): " + sessionChannelName);
    await setupRealtimeChannel();
    return sessionChannelName;
}

async function generateUniqueRoomCode(table, excludeMap) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var attempt = 0;
    while (attempt < 20) {
        var code = "";
        for (var i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (excludeMap && excludeMap[code]) {
            attempt++;
            continue;
        }
        try {
            var exists = await client.from(table).select("room_code").eq("room_code", code).maybeSingle();
            if (exists.error && exists.error.code !== "PGRST116") {
                // Unexpected error; bail
                return null;
            }
            var hasData = exists && exists.data && exists.data.room_code;
            if (!hasData) {
                return code; // available
            }
        } catch (e) {
            log("Code check failed: " + e);
            return null;
        }
        attempt++;
    }
    return null;
}
