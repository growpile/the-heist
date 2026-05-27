// @input Component.ScriptComponent logic
/** @type {ScriptComponent} */
var logic = script.logic;

// @input Component.ScriptComponent realtimeManager
/** @type {ScriptComponent} */
var realtimeManager = script.realtimeManager;

// @input Component.ScriptComponent cameraAccessHandler
/** @type {ScriptComponent} */
var cameraAccessHandler = script.cameraAccessHandler;

// @input SceneObject[] playerSlots
/** @type {SceneObject[]} */
var playerSlots = script.playerSlots;

// @input Component.Text crewCodeText
/** @type {Text} */
var crewCodeText = script.crewCodeText;

var MAX_GUESTS = 4;

function clearSlots() {
    if (!playerSlots || !playerSlots.length) { return; }
    for (var i = 0; i < playerSlots.length; i++) {
        if (playerSlots[i]) {
            playerSlots[i].enabled = false;
        }
    }
}

function normalizeNames(spectators) {
    var names = [];
    if (!spectators || !spectators.length) { return names; }
    for (var i = 0; i < spectators.length; i++) {
        var entry = spectators[i];
        if (typeof entry === "string") {
            names.push(entry);
        } else if (entry && typeof entry.name === "string") {
            names.push(entry.name);
        } else if (entry && typeof entry.display_name === "string") {
            names.push(entry.display_name);
        }
    }
    return names;
}

function applyGuestNames(names) {
    if (!playerSlots || !playerSlots.length) { return; }
    var maxSlots = Math.min(playerSlots.length, MAX_GUESTS);
    for (var i = 0; i < maxSlots; i++) {
        var slot = playerSlots[i];
        if (!slot) { continue; }
        var name = names && names[i] ? names[i] : "";
        var hasName = name && name.length > 0;
        slot.enabled = !!hasName;
        if (hasName) {
            var labelObj = slot.getChild(0);
            var textComp = labelObj ? labelObj.getComponent("Component.Text") : null;
            if (textComp) {
                textComp.text = name;
            }
        }
    }
    for (var j = maxSlots; j < playerSlots.length; j++) {
        if (playerSlots[j]) {
            playerSlots[j].enabled = false;
        }
    }
}

script.setupRoomUI = function(roomCode) {
    if (crewCodeText) {
        crewCodeText.text = roomCode ? roomCode : "";
    }
    clearSlots();
    if (realtimeManager && typeof realtimeManager.watchSpectators === "function") {
        realtimeManager.watchSpectators(roomCode, function(spectators) {
            applyGuestNames(normalizeNames(spectators));
        });
    }
};
