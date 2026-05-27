// Simple realtime message sender for Lens Studio
// @input Component.ScriptComponent snapCloudRequirements
// @input string channelName
// @input string baseMessage = "dT"
// @input bool enableDebugLogs = true

var supabaseModule = require("SupabaseClient.lspkg/supabase-snapcloud");
var createClient = supabaseModule && supabaseModule.createClient ? supabaseModule.createClient : supabaseModule;

var client = null;
var realtimeChannel = null;
var spectatorChannel = null;
var userId = "";
var displayName = "Spectacles User";
var isReady = false;
var isSubscribed = false;
var sessionChannelName = "";
var isInitializing = false;
var spectatorsListener = null;

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
    if (comp && typeof comp[name] === "function") {
        return comp[name].apply(comp, args);
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
        return false;
    }

    var isConfigured = callRequirements("isConfigured");
    if (!isConfigured) {
        log("SnapCloudRequirements not configured");
        return false;
    }

    var supabaseProject = callRequirements("getSupabaseProject");
    if (!supabaseProject) {
        log("Could not retrieve Supabase project");
        return false;
    }

    if (!createClient) {
        log("Supabase createClient not found; ensure package is included");
        return false;
    }

    client = createClient(supabaseProject.url, supabaseProject.publicToken, {
        realtime: { heartbeatIntervalMs: 2500 }
    });

    var ok = await signInUser();
    return ok;
}

async function signInUser() {
    if (!client || !client.auth) {
        log("Client or auth not available");
        return false;
    }
    try {
        var result = await client.auth.signInWithIdToken({ provider: "snapchat", token: "" });
        if (result.error) {
            log("Sign in warning: " + JSON.stringify(result.error));
            return false;
        } else {
            if (result.data && result.data.user && result.data.user.id) {
                userId = "" + result.data.user.id;
            } else {
                userId = "spectacles_msg_" + Math.random().toString(36).substr(2, 6);
            }
            log("Signed in Snap Cloud as " + userId);
            global.appState.signedInSnapCloud = true;
            return true;
        }
    } catch (e) {
        log("Sign in exception: " + e);
        return false;
    }
}

// Expose a retry path for external scripts
script.trySignIn = async function () {
    return await signInUser();
};

script.ensureReady = async function () {
    if (isInitializing) {
        // Prevent concurrent init attempts
        log("ensureReady: init in progress");
        return false;
    }
    if (!client) {
        log("ensureReady: initSupabase");
        isInitializing = true;
        await initSupabase();
        isInitializing = false;
    }
    if (!client) {
        log("ensureReady: client missing after init");
        return false;
    }
    if (!userId) {
        log("ensureReady: signInUser");
        await signInUser();
    }
    var ok = !!(client && userId && global.appState.signedInSnapCloud);
    log("ensureReady: ok=" + ok);
    return ok;
};

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

function sendCustomMessageInternal(message, eventName, meta) {
    if (!isReady || !realtimeChannel || !isSubscribed) {
        log("Not ready yet; waiting for channel subscription");
        return;
    }
    var payloadMessage = message || "";
    var eventType = eventName || "custom-message";
    var extra = (meta && typeof meta === "object") ? meta : null;
    var payload = {
        channel_name: sessionChannelName,
        user_id: userId,
        message: payloadMessage,
        timestamp: Date.now()
    };
    if (extra) {
        for (var key in extra) {
            if (extra.hasOwnProperty(key) && payload[key] === undefined) {
                payload[key] = extra[key];
            }
        }
    }

    realtimeChannel.send({
        type: "broadcast",
        event: eventType,
        payload: payload
    });
    log('Sent custom event "' + eventType + '": "' + payloadMessage + '"');
}

script.sendCustomMessage = function (message, eventName) {
    sendCustomMessageInternal(message, eventName, null);
};

script.sendCustomMessageWithMeta = function (message, eventName, meta) {
    sendCustomMessageInternal(message, eventName, meta);
};

script.disconnectFromRoom = function () {
    isReady = false;
    isSubscribed = false;
    sessionChannelName = "";

    if (client && realtimeChannel) {
        try {
            if (client.removeChannel) {
                client.removeChannel(realtimeChannel);
            } else if (client.removeAllChannels) {
                client.removeAllChannels();
            }
        } catch (e) {}
    }
    realtimeChannel = null;
    clearSpectatorChannel();
};

script.deleteCurrentRoom = async function () {
    if (!client || !userId) {
        log("Cannot delete room: client or user missing");
        return false;
    }
    try {
        var res = await client.from("bomb_defusal_rooms").delete().eq("id", userId);
        if (res && res.error) {
            log("Delete room failed: " + JSON.stringify(res.error));
            return false;
        }
        log("Deleted room for user " + userId);
        return true;
    } catch (e) {
        log("Delete room exception: " + e);
        return false;
    }
};

function emitSpectators(list) {
    if (spectatorsListener) {
        try {
            spectatorsListener(list || []);
        } catch (e) {
            log("Spectator listener error: " + e);
        }
    }
}

async function fetchSpectators(roomCode) {
    if (!client || !roomCode) { return; }
    try {
        var res = await client
            .from("bomb_defusal_rooms")
            .select("spectators")
            .eq("room_code", roomCode)
            .maybeSingle();
        if (!res.error && res.data && res.data.spectators) {
            emitSpectators(res.data.spectators);
        } else if (!res.error && res.data) {
            emitSpectators([]);
        }
    } catch (e) {
        log("Fetch spectators failed: " + e);
    }
}

function clearSpectatorChannel() {
    if (spectatorChannel && spectatorChannel.unsubscribe) {
        try { spectatorChannel.unsubscribe(); } catch (e) {}
    }
    if (client && client.removeChannel && spectatorChannel) {
        try { client.removeChannel(spectatorChannel); } catch (e) {}
    }
    spectatorChannel = null;
}

script.watchSpectators = async function (roomCode, callback) {
    spectatorsListener = callback || null;
    if (!roomCode) {
        emitSpectators([]);
        return false;
    }

    var ready = false;
    if (script.ensureReady) {
        ready = await script.ensureReady();
    } else {
        ready = !!(client && userId);
    }
    if (!ready || !client) {
        emitSpectators([]);
        return false;
    }

    clearSpectatorChannel();
    spectatorChannel = client.channel("room-spectators-" + roomCode);
    spectatorChannel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bomb_defusal_rooms", filter: "room_code=eq." + roomCode },
        function (payload) {
            var row = payload && (payload.new || payload.record || payload.data);
            var spectators = row && row.spectators ? row.spectators : [];
            emitSpectators(spectators);
        }
    );
    spectatorChannel.subscribe(function (status) {
        log("Spectator channel status: " + status);
    });

    await fetchSpectators(roomCode);
    return true;
};

// Exposed function to create/register room and open channel
script.createNewRoom = function () {
    return createRoomAndChannel();
};
// Backward compatibility for existing bindings
script.createRoom = script.createNewRoom;

// Exposed helper: upsert a room row (no uniqueness check on code), logs result
script.upsertRoom = async function () {
    log("Attempting upsertRoom...");
    var done = await script.testUpsertRoom();
    if (done) {
        log("upsertRoom completed");
    } else {
        log("upsertRoom failed");
    }
    return done;
};

// Exposed helper: simple insert with id to verify RLS/insert
script.insertSimpleRow = async function () {
    if (!client || !userId) {
        log("Cannot insert row: client or user missing");
        return false;
    }

    var table = "bomb_defusal_rooms";
    var payload = {
        id: userId,
        room_code: makeRandomRoomCode(),
        owner_name: displayName,
        created_at: new Date().toISOString()
    };

    try {
        var res = await client.from(table).insert(payload);
        if (res.error) {
            log("Simple insert failed: " + JSON.stringify(res.error));
            return false;
        }
        log("Simple insert success with code " + payload.room_code);
        return true;
    } catch (e) {
        log("Simple insert exception: " + e);
        return false;
    }
};

// Test helper: upsert a row with random code (no uniqueness check) using userId as PK
script.testUpsertRoom = async function (callback) {
    if (!client || !userId) {
        log("Cannot upsert test room: client or user missing");
        if (callback) { callback(false); }
        return;
    }

    var table = "bomb_defusal_rooms";
    var payload = {
        id: userId,
        room_code: makeRandomRoomCode(),
        owner_name: displayName,
        created_at: new Date().toISOString()
    };

    try {
        var res = await client.from(table).upsert(payload, { onConflict: "id" });
        if (res.error) {
            log("Test upsert failed: " + JSON.stringify(res.error));
            if (callback) { callback(false); }
        } else {
            log("Test upsert success with code " + payload.room_code);
            if (callback) { callback(true); }
        }
    } catch (e) {
        log("Test upsert exception: " + e);
        if (callback) { callback(false); }
    }
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
                created_at: new Date().toISOString(),
                spectators: []
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

    // Disconnect any existing channel before creating a new one
    if (client && realtimeChannel) {
        try { client.removeAllChannels(); } catch (e) {}
        realtimeChannel = null;
        isSubscribed = false;
        isReady = false;
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

function makeRandomRoomCode() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var code = "";
    for (var i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
