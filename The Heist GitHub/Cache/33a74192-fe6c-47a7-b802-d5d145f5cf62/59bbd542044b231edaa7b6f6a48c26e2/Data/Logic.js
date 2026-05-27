// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraManager
// @input Component.ScriptComponent loadingView
// @input Component.Text roomCodeTextComponent
// @input Asset.ObjectPrefab safePrefab
// @input SceneObject safeOrigin
// @input SceneObject tweens
// @input SceneObject anchorManager

// @ui {"widget":"group_start", "label":"Main Menu Elements"}
// @input SceneObject menuParent
// @input SceneObject[] menuElements
// @ui {"widget":"group_end"}

var safePrefab = script.safePrefab;
var safeOrigin = script.safeOrigin;
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
    if(global.appState.inTransition) return;
    print("Starting Solo Play...");
    hideMenu(function() {
        spawnSafe();
    });
}

script.startTeam = function() {
    if(global.appState.inTransition) return;
    print("Starting Team Play...");
}

script.openSettings = function() {
    if(global.appState.inTransition) return;
    print("Opening Settings...");
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

script.playareaPositioned = function() {
    print("Play Area Positioned.");
    showMenu(function() {
        print("Menu animations complete");
    });
}

function showMenu(callback) {
    if (global.appState && global.appState.inTransition) {
        return;
    }

    script.menuParent.enabled = true;
    if (global.appState) {
        global.appState.inTransition = true;
    }

    var menuElements = script.menuElements || [];
    var index = 0;

    function animateNext() {
        if (index >= menuElements.length) {
            if (global.appState) {
                global.appState.inTransition = false;
                global.appState.currentState = "mainMenu";
            }
            if (callback) { callback(); }
            return;
        }
        var element = menuElements[index];
        index++;
        if (!element) {
            animateNext();
            return;
        }
        global.utils.animateScale(element, false, new vec3(1, 1, 1), 0.1, function() {
            animateNext();
        });
    }

    animateNext();
}

function hideMenu(callback) {
    if (global.appState && global.appState.inTransition) {
        return;
    }

    if (global.appState) {
        global.appState.inTransition = true;
    }

    var menuElements = script.menuElements || [];
    var index = 0;

    function animateNext() {
        if (index >= menuElements.length) {
            script.menuParent.enabled = false;
            if (global.appState) {
                global.appState.inTransition = false;
            }
            if (callback) { callback(); }
            return;
        }
        var element = menuElements[index];
        index++;
        if (!element) {
            animateNext();
            return;
        }
        global.utils.animateScale(element, false, new vec3(0, 0, 0), 0.1, function() {
            animateNext();
        });
    }

    animateNext();
}

function spawnSafe() {
    var safeObject = safePrefab.instantiate(safeOrigin);
    var safeComponent = safeObject.getComponent('Component.ScriptComponent');
    safeComponent.init();
}

function startEvent() {
    introLogoSequence();
}
script.createEvent("OnStartEvent").bind(startEvent);
