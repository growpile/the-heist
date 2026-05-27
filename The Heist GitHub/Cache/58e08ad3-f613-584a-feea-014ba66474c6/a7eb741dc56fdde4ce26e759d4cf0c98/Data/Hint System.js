//@input Asset.Material textOccluder
//@input Component.Text hintTextComponent
//@input float typewriterDuration = 0.5 {"label":"Typewriter Duration (s)"}
//@input float occluderShowAlpha = 0.7 {"label":"Occluder Show Alpha"}
//@input float hintDisplayTime = 1.0 {"label":"Display Time (s)"}

// --- Inputs ---
/** @type {Material} */
var textOccluder = script.textOccluder;
/** @type {Text} */
var hintTextComponent = script.hintTextComponent;

// --- Your hint catalog (fill in as needed) ---
const HINTS = {
    "tutorialInitialHint": "Jackpot! Two of the modules are already done!",
    "tutorialRotateHint": "Hover your hand over the arrow on the right.",
    "tutorialManualHint": "Great job! Let's refer to the manual to solve.",
    "tutorialSerialNumber": "Hmm, that can't be right. Did you check the manual?",
};

// --- Internal state ---
var self = {};
global.hintSystem = self;

var queue = [];               // FIFO of hintIds waiting to be shown
var currentId = null;         // currently displayed hintId (or null)
var state = "idle";           // "idle" | "typingIn" | "holding" | "typingOut"
var alphaTweenEvt = null;     // current UpdateEvent for alpha tween
var typewriterEvt = null;     // current UpdateEvent for typewriter tween

// --- Utils ---
function clamp01(v){ return Math.max(0, Math.min(1, v)); }
function lerp(a,b,t){ return a + (b - a) * t; }

function getOccluderAlpha() {
    // baseColor is vec4(r,g,b,a)
    var c = textOccluder.mainPass.baseColor;
    return c ? c.w : 0.0;
}
function setOccluderAlpha(a) {
    a = clamp01(a);
    // We keep RGB at 1 so it’s a white occluder; adjust if you prefer another color.
    textOccluder.mainPass.baseColor = new vec4(1, 1, 1, a);
}

function cancelEvt(evt) {
    if (evt && evt.enabled !== undefined) { evt.enabled = false; }
}

function runOverDuration(duration, onStep, onDone) {
    duration = Math.max(0.0001, duration);
    var start = getTime();
    var evt = script.createEvent("UpdateEvent");
    evt.bind(function() {
        var t = (getTime() - start) / duration;
        if (t >= 1.0) {
            onStep(1.0);
            evt.enabled = false;
            if (onDone) onDone();
            return;
        }
        onStep(t);
    });
    return evt;
}

function fadeOccluder(toAlpha, duration, onDone) {
    cancelEvt(alphaTweenEvt);
    var from = getOccluderAlpha();
    alphaTweenEvt = runOverDuration(duration, function(t){
        setOccluderAlpha(lerp(from, toAlpha, t));
    }, onDone);
}

function typewriterIn(text, duration, onDone) {
    cancelEvt(typewriterEvt);
    // start empty
    hintTextComponent.text = "";
    var len = text.length;
    typewriterEvt = runOverDuration(duration, function(t){
        var count = Math.floor(lerp(0, len, t));
        hintTextComponent.text = text.substr(0, count);
    }, function(){
        hintTextComponent.text = text;
        if (onDone) onDone();
    });
}

function typewriterOut(duration, onDone) {
    cancelEvt(typewriterEvt);
    var startText = hintTextComponent.text || "";
    var len = startText.length;
    typewriterEvt = runOverDuration(duration, function(t){
        var remaining = Math.max(0, len - Math.floor(len * t));
        hintTextComponent.text = startText.substr(0, remaining);
    }, function(){
        hintTextComponent.text = "";
        if (onDone) onDone();
    });
}

// --- Flow control ---
function processNext() {
    if (state !== "idle") return;
    if (queue.length === 0) {
        // Ensure fully hidden when idle
        fadeOccluder(0.0, script.typewriterDuration, function(){});
        if (hintTextComponent.text && hintTextComponent.text.length > 0) {
            typewriterOut(script.typewriterDuration, function(){});
        }
        return;
    }
    var nextId = queue.shift();
    showOne(nextId);
}

function showOne(hintId) {
    currentId = hintId;
    state = "typingIn";

    var text = HINTS[hintId];
    if (text === undefined) {
        // Fallback if hintId missing in catalog
        text = "[" + hintId + "]";
    }

    // Fade occluder in while typing in
    fadeOccluder(script.occluderShowAlpha, script.typewriterDuration, null);
    typewriterIn(text, script.typewriterDuration, function(){
        // Hold
        state = "holding";
        global.utils.delay(script.hintDisplayTime, function(){
            // Fade out + type out
            state = "typingOut";
            // Start both together
            fadeOccluder(0.0, script.typewriterDuration, null);
            typewriterOut(script.typewriterDuration, function(){
                // Fully hidden; move to next
                currentId = null;
                state = "idle";
                processNext();
            });
        });
    });
}

// --- Public API ---
self.showHint = function(hintId) {
    print("Showing hint: " + hintId);

    // If same as what's currently playing, ignore to avoid spam
    if (currentId === hintId && state !== "idle") {
        return;
    }

    if (state === "idle") {
        // Nothing showing: play immediately
        showOne(hintId);
    } else {
        // Different hint while something is playing: queue it
        queue.push(hintId);
    }
};

// Optionally expose helpers
self.clearQueue = function() { queue.length = 0; };
self.isBusy = function() { return state !== "idle"; };
self.currentHintId = function() { return currentId; };

// --- Initialize to "hidden" state on load ---
setOccluderAlpha(0.0);
hintTextComponent.text = "";
state = "idle";
currentId = null;
queue.length = 0;
