// @input Component.ScriptComponent realtimeManager
// @input Component.ScriptComponent cameraAccessHandler
// @input Component.ScriptComponent loadingView
// @input Component.ScriptComponent rotationManager
// @input Component.ScriptComponent volumeSlider
// @input Component.ScriptComponent glovesToggle
// @input Component.Text roomCodeTextComponent
// @input Component.Text solvedSeconds
// @input Asset.ObjectPrefab safePrefab
// @input Asset.ObjectPrefab cardboardPrefab
// @input SceneObject safeOrigin
// @input SceneObject tweens
// @input SceneObject anchorManager
// @input Asset.Material tableGridMaterial
// @input SceneObject gloves
// @input Component.ScriptComponent networkManager
/** @type {ScriptComponent} */
var networkManager = script.networkManager;
var tableGridMaterial = script.tableGridMaterial;

// @input Component.ScriptComponent interactionHintController

const InteractionHintModule = require("Spectacles3DHandHints.lspkg/Scripts/InteractionHintController")
const { HandAnimationClipInfo, HandAnimationsLibrary, HandMode, InteractionHintController } = InteractionHintModule

// @input Component.VFXComponent tableImpactVFX
/** @type {VFXComponent} */
var tableImpactVFX = script.tableImpactVFX;
// @input Component.VFXComponent boomVfx
/** @type {VFXComponent} */
var boomVfx = script.boomVfx;

// @ui {"widget":"group_start", "label":"Main Menu Elements"}
// @input SceneObject menuParent
// @input SceneObject[] menuElements
// @ui {"widget":"group_end"}

var safePrefab = script.safePrefab;
var safeOrigin = script.safeOrigin;
var anchorManager = script.anchorManager;

var tweens = script.tweens;
var roomCodeTextComponent = script.roomCodeTextComponent;
var cameraAccessHandler = script.cameraAccessHandler;
var realtimeManager = script.realtimeManager;
var sendToRealtime = false;
var activeSafeComponent = null;
var currentGameState = 0;
var solvedSecondsLatest = null;

function sendGameState(state, solvedSeconds) {
    currentGameState = state;
    if (solvedSeconds !== undefined && solvedSeconds !== null) {
        solvedSecondsLatest = solvedSeconds;
    }
    if (realtimeManager && typeof realtimeManager.sendCustomMessageWithMeta === "function") {
        var meta = { gameState: state };
        if (solvedSeconds !== undefined && solvedSeconds !== null) {
            meta.solvedSeconds = solvedSeconds;
        }
        realtimeManager.sendCustomMessageWithMeta("", "gameState", meta);
    }
}

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;

var introSkipped = false;
var introCompleted = false;
var skipTweenPlayed = false;
var airPinchCount = 0;

function stopNetworkStreaming() {
    global.utils.delay(3, function() {
        sendToRealtime = false;
        if (cameraAccessHandler && typeof cameraAccessHandler.stopStreaming === "function") {
            cameraAccessHandler.stopStreaming();
        }
        if (realtimeManager && typeof realtimeManager.deleteCurrentRoom === "function") {
            realtimeManager.deleteCurrentRoom();
        }
        if (realtimeManager && typeof realtimeManager.disconnectFromRoom === "function") {
            realtimeManager.disconnectFromRoom();
        }
    });
}

function formatTimerSeconds(totalSeconds) {
    var secs = Math.max(0, Math.floor(totalSeconds || 0));
    var mins = Math.floor(secs / 60);
    var rem = secs % 60;
    var mm = mins < 10 ? "0" + mins : "" + mins;
    var ss = rem < 10 ? "0" + rem : "" + rem;
    return mm + ":" + ss;
}

function getCurrentTimerString() {
    if (activeSafeComponent && typeof activeSafeComponent.getRemainingSeconds === "function") {
        return formatTimerSeconds(activeSafeComponent.getRemainingSeconds());
    }
    return null;
}

function getCurrentTimerSeconds() {
    if (activeSafeComponent && typeof activeSafeComponent.getRemainingSeconds === "function") {
        return activeSafeComponent.getRemainingSeconds();
    }
    return null;
}

script.textureEncoded = function(encodedString) {
    if(sendToRealtime) {
        var timerStr = getCurrentTimerString();
        var timerSeconds = getCurrentTimerSeconds();
        var meta = {};
        var hasMeta = false;
        if (timerStr || timerSeconds !== null) {
            meta.timer = timerStr;
            meta.timerSeconds = timerSeconds;
            hasMeta = true;
        }
        if (currentGameState !== null && currentGameState !== undefined) {
            meta.gameState = currentGameState;
            hasMeta = true;
            if (currentGameState === 3 && solvedSecondsLatest !== null) {
                meta.solvedSeconds = solvedSecondsLatest;
            }
        }
        if (hasMeta) {
            script.realtimeManager.sendCustomMessageWithMeta(encodedString, "defuserTexture", meta);
        } else {
            script.realtimeManager.sendCustomMessage(encodedString, "defuserTexture");
        }
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

global.trySignIn = async function() {
    if (!script.realtimeManager || !script.realtimeManager.trySignIn) {
        return false;
    }
    return await script.realtimeManager.trySignIn();
};

// script.createEvent("OnStartEvent").bind(function() {
//     script.loadingView.show("", 1, "createRoomView", function() {
//         print("Loading completed!");
//     })
// })

// main menu

function safeIntro(safeType) {
    var safeObject = safePrefab.instantiate(safeOrigin);
    safeObject.getTransform().setLocalScale(new vec3(0, 0, 0));
    var safeComponent = safeObject.getComponent('Component.ScriptComponent');
    activeSafeComponent = safeComponent;
    safeComponent.init(safeType);
    var finalScale = new vec3(1, 1, 1);
    var overshootScale = new vec3(1.2, 1.2, 1.2);

    // animates table grid
    global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 1, 0.25);
    global.utils.delay(1, function() {
        global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 1, 0.25);

        global.utils.animateScale(safeObject, true, overshootScale, 0.2, function() {
            global.utils.animateScale(safeObject, true, finalScale, 0.05, function() {
                activeSafeComponent.animationFinished();
                global.playSfx(4, 1, global.appState.checkStorage("masterVolume") * 0.7);
                global.playSfx(5, 1, global.appState.checkStorage("masterVolume") * 0.7);
                global.playSfx(6, 1, global.appState.checkStorage("masterVolume") * 0.7);
                global.playSfx(7, 1, global.appState.checkStorage("masterVolume") * 0.7);
                global.playSfx(8, 1, global.appState.checkStorage("masterVolume") * 0.7);
                playSafeLandingVFX()
                script.rotationManager.setCanRotate(true);
                activeSafeComponent.beginSolve();
            });
        });
    });
}

global.safeComplete = function(safeType, solvedInSeconds) {
    print(safeType);
    switch(safeType) {
        case "tutorial":
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 0, 0.25);
            global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9);
            global.utils.animateScale(global.appState.safe.object, true, new vec3(0, 0, 0), 0.25, function() {
                global.uiKitDirector.toggleUIComposite("tutorialSolvedWindow", true);
                global.uiKitDirector.newWorldScale("tutorialSolvedWindow", new vec3(1,1,1), 0.5, function() {
                    global.appState.currentState = "tutorialWinPostGame";
                });
                global.appState.safe.object.destroy();
            });
            break;
        case "solo":
            script.solvedSeconds.text = solvedInSeconds.toFixed(0).toString();
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 0, 0.25);
            global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9);
            global.utils.animateScale(global.appState.safe.object, true, new vec3(0, 0, 0), 0.25, function() {
                global.uiKitDirector.toggleUIComposite("solvedWindow", true);
                global.uiKitDirector.newWorldScale("solvedWindow", new vec3(1,1,1), 0.5, function() {
                    global.appState.currentState = "winPostGame";
                });
                global.appState.safe.object.destroy();
            });
            break;
        case "coop":
            script.solvedSeconds.text = solvedInSeconds.toFixed(0).toString();
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
            global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 0, 0.25);
            global.playSfx(global.utils.rng(22, 25), 1, global.appState.checkStorage("masterVolume") * 0.9);
            global.utils.animateScale(global.appState.safe.object, true, new vec3(0, 0, 0), 0.25, function() {
                global.uiKitDirector.toggleUIComposite("solvedWindow", true);
                global.uiKitDirector.newWorldScale("solvedWindow", new vec3(1,1,1), 0.5, function() {
                    global.appState.currentState = "winPostGame";
                    sendGameState(3, solvedInSeconds);
                    stopNetworkStreaming();
                });
                global.appState.safe.object.destroy();
            });
            break;
    }
}

global.safeFailed = function() {
    global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.opacityMultiplier", 0, 0.25);
    global.utils.animateMaterialProperty(tableGridMaterial, "mainPass.size", 0, 0.25);
    global.utils.delay(0.1, function() {
        playBoomVfx();
    })
    global.utils.animateScale(global.appState.safe.object, true, new vec3(0, 0, 0), 0.25, function() {
        global.uiKitDirector.toggleUIComposite("timedWindow", true);
        global.uiKitDirector.newWorldScale("timedWindow", new vec3(1,1,1), 0.5, function() {
            global.appState.currentState = "losePostGame";
            sendGameState(2);
            stopNetworkStreaming();
        });
        global.appState.safe.object.destroy();
    });
}

function playBoomVfx() {
    var burstDur = 0.05 + getTime();
    boomVfx.asset.properties["burstDuration"] = burstDur;
}

function playSafeLandingVFX() {
    var burstDur = 0.05 + getTime();
    tableImpactVFX.asset.properties["burstDuration"] = burstDur;
}

script.backToMenu = function() {
    if(global.appState.currentState == "winPostGame" || global.appState.currentState == "losePostGame") {
        if(global.appState.currentState == "winPostGame") {
            global.uiKitDirector.newWorldScale("solvedWindow", new vec3(0,0,0), 0.5, function() {
                global.uiKitDirector.toggleUIComposite("solvedWindow", false);
            });
        } else {
            global.uiKitDirector.newWorldScale("timedWindow", new vec3(0,0,0), 0.5, function() {
                global.uiKitDirector.toggleUIComposite("timedWindow", false);
            });
        }

        showMenu(function() {
            print("reset!");
        });
    } else if(global.appState.currentState == "tutorialWinPostGame"){
        global.uiKitDirector.newWorldScale("tutorialSolvedWindow", new vec3(0,0,0), 0.5, function() {
            global.uiKitDirector.toggleUIComposite("tutorialSolvedWindow", false);
        });
        showMenu(function() {
            print("reset!");
        });
        return;
    }
}

// SOLO FLOW
script.startSolo = function() {
    if(global.appState.inTransition) return;
    print("Starting Solo Play...");
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
    global.tweenManager.startTween(script.menuElements[1], "pinch-animation");
    script.menuElements[1].getComponents("Component.ScriptComponent")[3].play3DParticles(function() {
        hideMenu("soloPlay", function() {
            if(global.appState.checkStorage("tutorialPlayed")) {
                showSoloReminder();
            } else {
                showTutorialReminder();
            }
        });
    });
}

function showSoloReminder() {
    global.appState.inTransition = true;
    global.uiKitDirector.toggleUIComposite("soloReminderWindow", true);
    global.uiKitDirector.newWorldScale("soloReminderWindow", new vec3(1,1,1), 0.5, function() {
        global.appState.currentState = "reminderWindow";
        global.appState.inTransition = false;
    });
}

script.beginSolveSolo = function() {
    if(global.appState.inTransition) return;

    global.uiKitDirector.newWorldScale("soloReminderWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("soloReminderWindow", false);
        safeIntro("solo");
    });
}

// keep here:
// showCoopReminder();

function showLoadingWindow() {
    global.uiKitDirector.toggleUIComposite("loadingWindow", true);
    global.uiKitDirector.newWorldScale("loadingWindow", new vec3(1,1,1), 0.5);
}

function hideLoadingWindow(callback) {
    global.uiKitDirector.newWorldScale("loadingWindow", new vec3(0,0,0), 0.25, function() {
        global.uiKitDirector.toggleUIComposite("loadingWindow", false);
        if (callback) { callback(); }
    });
}

function showRoomWindow() {
    global.uiKitDirector.toggleUIComposite("roomWindow", true);
    global.uiKitDirector.newWorldScale("roomWindow", new vec3(1,1,1), 0.5);
}

function backToMenu() {
    print("[Logic] Network flow failed; returning to menu");
    hideLoadingWindow(function() {
        showMenu();
    });
}

async function beginNetworkFlow() {
    print("[Logic] beginNetworkFlow()");
    showLoadingWindow();

    var ready = false;
    if (realtimeManager && typeof realtimeManager.ensureReady === "function") {
        print("[Logic] ensureReady()");
        ready = await realtimeManager.ensureReady();
    } else {
        if (!global.appState.signedInSnapCloud) {
            print("[Logic] trySignIn()");
            await global.trySignIn();
        }
        ready = !!global.appState.signedInSnapCloud;
    }

    print("[Logic] ready=" + ready);
    if (!ready) {
        backToMenu();
        return;
    }

    var code = null;
    try {
        print("[Logic] createNewRoom()");
        code = await realtimeManager.createNewRoom();
    } catch (e) {
        print("[Logic] createNewRoom exception: " + e);
        code = null;
    }

    print("[Logic] room code=" + code);
    if (!code) {
        backToMenu();
        return;
    }

    if (networkManager && typeof networkManager.setupRoomUI === "function") {
        networkManager.setupRoomUI(code);
    }

    if (cameraAccessHandler && typeof cameraAccessHandler.startStreaming === "function") {
        cameraAccessHandler.startStreaming({
            externalScript: script,
            functionName: "textureEncoded",
            output: 1,
            targetFps: 10,
            encodingType: 1,
            compressionQuality: 0,
            includeRenderedContent: true
        });
    }
    script.toggleTextureBroadcast(true);
    sendGameState(0);

    hideLoadingWindow(function() {
        showRoomWindow();
    });
}

// COOP FLOW
script.startTeam = function() {
    if(global.appState.inTransition) return;
    print("Starting Coop Play...");
    global.playSfx(1, 1, global.appState.checkStorage("masterVolume") * 1);
    global.tweenManager.startTween(script.menuElements[2], "pinch-animation");
    script.menuElements[2].getComponents("Component.ScriptComponent")[3].play3DParticles(function() {
        hideMenu("coopPlay", function() {
            beginNetworkFlow();
        });
    });
}

function showCoopReminder() {
    global.appState.inTransition = true;
    global.uiKitDirector.toggleUIComposite("coopReminderWindow", true);
    global.uiKitDirector.newWorldScale("coopReminderWindow", new vec3(1,1,1), 0.5, function() {
        global.appState.currentState = "reminderWindow";
        global.appState.inTransition = false;
    });
}

script.beginSolveCoop = function() {
    if(global.appState.inTransition) return;

    global.uiKitDirector.newWorldScale("coopReminderWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("coopReminderWindow", false);
        sendGameState(1);
        safeIntro("coop");
    });
}

script.playersReady = function() {
    if(global.appState.inTransition) return;
    global.uiKitDirector.newWorldScale("roomWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("roomWindow", false);
        showCoopReminder();
    });
}

// TUTORIAL FLOW
global.leftRotateHint = function() {
    script.interactionHintController.playHintAnimation(HandMode.Right, HandAnimationsLibrary.Right.PalmTouchSurface, 1, 0.3);
}

function showTutorialReminder() {
    global.appState.inTransition = true;
    global.uiKitDirector.toggleUIComposite("tutorialReminderWindow", true);
    global.uiKitDirector.newWorldScale("tutorialReminderWindow", new vec3(1,1,1), 0.5, function() {
        global.appState.currentState = "reminderWindow";
        global.appState.inTransition = false;
    });
}

script.beginSolveTutorial = function() {
    if(global.appState.inTransition) return;

    global.uiKitDirector.newWorldScale("tutorialReminderWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("tutorialReminderWindow", false);
        safeIntro("tutorial");
    });
}

// SETTINGS
script.openSettings = function() {
    if(global.appState.inTransition) return;
    print("Opening Settings...");
    hideMenu("settings", function() {
        script.volumeSlider.currentValue = global.appState.checkStorage("masterVolume");
        print("Storage Is: " + global.appState.checkStorage("enabledGloves"));
        script.glovesToggle.isOn = global.appState.checkStorage("enabledGloves");
        global.uiKitDirector.toggleUIComposite("settingsWindow", true);
        global.uiKitDirector.newWorldScale("settingsWindow", new vec3(1,1,1), 0.5);
    });
}

script.setMasterVolume = function(value) {
    var volumeMultiplier = value.toFixed(2);
    global.appState.setStorage("masterVolume", volumeMultiplier);
    global.setBgmVolume(volumeMultiplier * 0.1);
}

script.setGlovesEnabled = function(value) {
    boolValue = value ? true : false;
    global.appState.setStorage("enabledGloves", boolValue);
    if(value) {
        script.gloves.enabled = true;
    } else {
        script.gloves.enabled = false;
    }
}

script.replayTutorial = function() {
    if(global.appState.inTransition) return;
    global.uiKitDirector.newWorldScale("settingsWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("settingsWindow", false);
        showTutorialReminder();
    });
}

script.exitSettings = function(callback) {
    if(global.appState.inTransition) return;
    global.uiKitDirector.newWorldScale("settingsWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("settingsWindow", false);
        showMenu(function() {
            if(callback) callback();
        });
    });
}

script.rescanSurface = function() {
    if(global.appState.inTransition) return;
    global.uiKitDirector.newWorldScale("settingsWindow", new vec3(0,0,0), 0.5, function() {
        global.uiKitDirector.toggleUIComposite("settingsWindow", false);
        if(global.appState.anchorManager) global.appState.anchorManager.resetPlacement();
    });
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
            global.playSfx(0, 1, global.appState.checkStorage("masterVolume") * 0.7);
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
            global.playSfx(0, 1, global.appState.checkStorage("masterVolume") * 0.7);
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
    global.setBgmVolume(0.1 * global.appState.checkStorage("masterVolume"));
    script.gloves.enabled = global.appState.checkStorage("enabledGloves");
    // cameraAccessHandler.captureCameraFrameSession(function() {
    //     print("Camera Session Captured...");
    // }, true);
}
script.createEvent("OnStartEvent").bind(startEvent);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function() {
    checkAirPinchSkip();
});
