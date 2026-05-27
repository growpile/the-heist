// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraManager
// @input Component.ScriptComponent loadingView
// @input Component.ScriptComponent rotationManager
// @input Component.Text roomCodeTextComponent
// @input Asset.ObjectPrefab safePrefab
// @input Asset.ObjectPrefab cardboardPrefab
// @input SceneObject safeOrigin
// @input SceneObject tweens
// @input SceneObject anchorManager
// @input Asset.Material tableGridMaterial
var tableGridMaterial = script.tableGridMaterial;

// @input Component.VFXComponent tableImpactVFX
/** @type {VFXComponent} */
var tableImpactVFX = script.tableImpactVFX;

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
var activeSafeComponent = null;

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;

var introSkipped = false;
var introCompleted = false;
var skipTweenPlayed = false;
var airPinchCount = 0;

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
    global.playSfx(1, 1, 1);
    global.tweenManager.startTween(script.menuElements[1], "pinch-animation", function() {
        hideMenu("soloPlay", function() {
            safeIntro();
        });
    });
}

function safeIntro() {
    var safeObject = safePrefab.instantiate(safeOrigin);
    safeObject.getTransform().setLocalScale(new vec3(0, 0, 0));
    var safeComponent = safeObject.getComponent('Component.ScriptComponent');
    activeSafeComponent = safeComponent;
    safeComponent.init();
    var finalScale = new vec3(1, 1, 1);
    var overshootScale = new vec3(1.2, 1.2, 1.2);

    global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 1, 0.25, function() {
        print("faded in");
    })
    global.utils.delay(1, function() {
        global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 1, 0.25, function() {
            print("faded in");
        })

        global.utils.animateScale(safeObject, true, overshootScale, 0.2, function() {
            global.utils.animateScale(safeObject, true, finalScale, 0.05, function() {
                activeSafeComponent.animationFinished();
                global.playSfx(4, 1, 1);
                global.playSfx(5, 1, 1);
                global.playSfx(6, 1, 1);
                global.playSfx(7, 1, 1);
                global.playSfx(8, 1, 1);
                playSafeLandingVFX()
                script.rotationManager.setCanRotate(true);
            });
        });
    });
}

function playSafeLandingVFX() {
    var burstDur = 0.05 + getTime();
    tableImpactVFX.asset.properties["burstDuration"] = burstDur;
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
    if (introSkipped) { return; }
    global.tweenManager.startTween(tweens, "intro-label-fade-in");
    global.utils.delay(1, function() {
        if (introSkipped) { return; }
        global.tweenManager.startTween(tweens, "intro-logo-fade-in");
        global.utils.delay(3, function() {
            if (introSkipped) { return; }
            global.tweenManager.startTween(tweens, "intro-label-fade-out");
            global.tweenManager.startTween(tweens, "intro-logo-fade-out", function() {
                if (introSkipped) { return; }
                global.utils.delay(0.25, function() {
                    if (introSkipped) { return; }
                    global.tweenManager.startTween(tweens, "intro-table-hint-fade-in", function() {
                        if (introSkipped) { return; }
                        global.utils.delay(1, function() {
                            if (introSkipped) { return; }
                            global.tweenManager.startTween(tweens, "intro-scale-down", function() {
                                if (introSkipped) { return; }
                                introCompleted = true;
                                playareaSetup();
                            });
                        });
                    });
                });
            });
        });
    });
}

function skipIntro() {
    if (introSkipped || introCompleted) { return; }
    introSkipped = true;
    global.tweenManager.startTween(tweens, "intro-scale-down", function() {
        introCompleted = true;
        playareaSetup();
    });
}

function checkAirPinchSkip() {
    if (introSkipped || introCompleted) { return; }
    var interactorList = SIK.InteractionManager.getTargetingInteractors();
    if (!interactorList || interactorList.length === 0) { return; }
    for (var i = 0; i < interactorList.length; i++) {
        var interactor = interactorList[i];
        if (!interactor) { continue; }
        if (interactor.previousTrigger === InteractorTriggerType.None &&
            interactor.currentTrigger !== InteractorTriggerType.None) {
            var hitInfo = interactor.targetHitInfo;
            var hasTarget = hitInfo && hitInfo.hit && hitInfo.hit.collider;
            if (!hasTarget) {
                airPinchCount++;
                if (airPinchCount === 1 && !skipTweenPlayed) {
                    skipTweenPlayed = true;
                    global.tweenManager.startTween(tweens, "skip-intro-hint-in");
                } else if (airPinchCount >= 2) {
                    skipIntro();
                }
                return;
            }
        }
    }
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

    var menuElements = (script.menuElements || []).slice(0);
    for (var m = menuElements.length - 1; m > 0; m--) {
        var swapIndex = global.utils && global.utils.rng ? global.utils.rng(0, m) : Math.floor(Math.random() * (m + 1));
        var temp = menuElements[m];
        menuElements[m] = menuElements[swapIndex];
        menuElements[swapIndex] = temp;
    }
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
        animateWithOvershoot(element, new vec3(1.1, 1.1, 1.1), new vec3(1, 1, 1), function() {
            global.playSfx(0, 1, 0.6);
            animateNext();
        });
    }

    animateNext();
}

function hideMenu(newState, callback) {
    if (global.appState && global.appState.inTransition) {
        return;
    }

    if (global.appState) {
        global.appState.inTransition = true;
    }

    var menuElements = (script.menuElements || []).slice(0);
    for (var m = menuElements.length - 1; m > 0; m--) {
        var swapIndex = global.utils && global.utils.rng ? global.utils.rng(0, m) : Math.floor(Math.random() * (m + 1));
        var temp = menuElements[m];
        menuElements[m] = menuElements[swapIndex];
        menuElements[swapIndex] = temp;
    }
    var index = 0;

    function animateNext() {
        if (index >= menuElements.length) {
            script.menuParent.enabled = false;
            if (global.appState) {
                global.appState.inTransition = false;
                if (newState) {
                    global.appState.currentState = newState;
                }
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
        animateWithOvershoot(element, new vec3(1.1, 1.1, 1.1), new vec3(0, 0, 0), function() {
            global.playSfx(0, 1, 0.6);
            animateNext();
        });
    }

    animateNext();
}

function animateWithOvershoot(sceneObject, overshootScale, finalScale, callback) {
    global.utils.animateScale(sceneObject, false, overshootScale, 0.05, function() {
        global.utils.animateScale(sceneObject, false, finalScale, 0.08, callback);
    });
}

function startEvent() {
    introLogoSequence();
}
script.createEvent("OnStartEvent").bind(startEvent);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function() {
    checkAirPinchSkip();
});
