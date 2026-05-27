// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraManager
// @input Component.ScriptComponent loadingView
// @input Component.Text roomCodeTextComponent
// @input SceneObject tweens
// @input SceneObject anchorManager
var anchorManager = script.anchorManager;

var tweens = script.tweens;
var roomCodeTextComponent = script.roomCodeTextComponent;
var cameraManager = script.cameraManager;
var realtimeManager = script.realtimeManager;
var sendToRealtime = false;

script.textureEncoded = function(encodedString) {
    if(sendToRealtime) {
        script.realtimeManager.sendCustomMessage(encodedString, "defuserTexture");
    }
    // print(encodedString);
}

script.createRoomButton = async function() {
    var code = await script.realtimeManager.createNewRoom();
    roomCodeTextComponent.text = code ? code : "";
    // await script.realtimeManager.insertSimpleRow();
}

script.toggleTextureBroadcast = function(isOn) {
    sendToRealtime = isOn;
}

// script.createEvent("OnStartEvent").bind(function() {
//     script.loadingView.show("", 1, "createRoomView", function() {
//         print("Loading completed!");
//     })
// })

// main menu
script.startSolo = function() {
    print("Starting Solo Play.");
}

script.startTeam = function() {
    print("Starting Team Play.");
}

script.openSettings = function() {
    print("Opening Settings.");
}

script.rescanSurface = function() {
    if(global.appState.anchorManager) global.appState.anchorManager.resetPlacement();
}

function introLogoSequence() {
    global.utils.delay(1, function() {
        // label
        global.tweenManager.startTween(tweens, "intro-label-fade-in");
        global.utils.delay(1, function() {
            // logo
            global.tweenManager.startTween(tweens, "intro-logo-fade-in");
            global.utils.delay(3, function() {
                global.tweenManager.startTween(tweens, "intro-scale-down", function() {
                    playareaSetup();
                });
            })
        });
    });
}

function playareaSetup() {
    anchorManager.enabled = true;
}

function startEvent() {
    introLogoSequence();
}

script.createEvent("OnStartEvent").bind(startEvent);

script.printt = function() {
    print("done");
}