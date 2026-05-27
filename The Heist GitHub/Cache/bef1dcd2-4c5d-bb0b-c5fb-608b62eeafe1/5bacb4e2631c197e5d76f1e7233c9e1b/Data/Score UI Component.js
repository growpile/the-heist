// @ui {"widget":"group_start", "label":"<font color='white'>Behaviour Settings</font>"}
// @input int scoreType = 0 {"widget":"combobox", "values":[{"label":"Int", "value":0}, {"label":"Float", "value":1}]}
// @input int initialScoreInt = 0 {"label":"Initial Score", "showIf":"scoreType", "showIfValue":"0"}
// @input float initialScoreFloat = 0.0 {"label":"Initial Score",  "showIf":"scoreType", "showIfValue":"1"}
// @input int decimals = 2 {"showIf":"scoreType", "showIfValue":"1"}
// @input bool persistentScore = true
// @input bool allowPersonalBest = true {"showIf":"persistentScore"}
// @input int updatePersonalBest = 1 {"showIf":"persistentScore", "label":"Update PB On", "widget":"combobox", "values":[{"label":"Score Increased", "value":0}, {"label":"Game Ended", "value":1}]}
// @ui {"widget":"group_end"}
// @ui {"widget": "separator"}
// @ui {"widget":"group_start", "label":"<font color='white'>Display Settings</font>"}
// @input int scoreDisplay = 0 {"widget":"combobox", "values":[{"label":"User Head", "value":0}, {"label":"On 2D Layer", "value":1}]}
// @input int headAttachmentPoint = 0 {"label":"Head Attachment", "showIf":"scoreDisplay", "showIfValue":"0", "widget":"combobox", "values":[{"label":"Forehead", "value":0}, {"label":"HeadCenter", "value":1}, {"label":"CandideCenter", "value":2}, {"label":"Chin", "value":3}, {"label":"LeftCheek", "value":4}, {"label":"RightCheek", "value":5}, {"label":"LeftForehead", "value":6}, {"label":"RightForehead", "value":7}, {"label":"MouthCenter", "value":8}, {"label":"LeftEyeballCenter", "value":9}, {"label":"RightEyeballCenter", "value":10}, {"label":"TriangleBarycentric", "value":11}]}
// @input bool scoreAnimation = true
// @input bool newBestVFX = true {"label":"Particles On PB", "showIf":"allowPersonalBest"}
// @ui {"widget":"group_start", "label":"<font color='white'>PB Score Particles</font>", "showIf":"newBestVFX"}
// @input float vfxDuration = 0.35 {"widget":"slider", "min":0.1, "max":1.5, "step":0.01, "label":"PB Explosion Duration", "showIf":"newBestVFX"}
// @input int particleTextureType = 0 {"widget":"combobox", "values":[{"label":"Star", "value":0}, {"label":"Use Custom Texture", "value":1}]}
// @input Asset.Texture customParticleTexture {"showIf":"particleTextureType", "showIfValue":"1"}
// @input bool scoreBackplate = true
// @input Asset.Texture customScoreBackplate {"showIf":"scoreBackplate"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"<font color='white'>Font Settings</font>"}
// @input int scoreFontType = 0 {"widget":"combobox", "values":[{"label":"Use Font Preset", "value":0}, {"label":"Use Custom Font", "value":1}]}
// @input int scoreFontPreset = 0 {"showIf":"scoreFontType", "showIfValue":"0", "widget":"combobox", "values":[{"label":"Default", "value":0}, {"label":"Modern", "value":1}, {"label":"Retro", "value":2}, {"label":"Sci-Fi", "value":3}, {"label":"Scary", "value":4}]}
// @input Asset.Font scoreCustomFont {"showIf":"scoreFontType", "showIfValue":"1"}
// @input vec4 scoreColor = {1,1,1,1} {"widget":"color"}
// @input float letterSpacing {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input bool scoreOutline 
// @input vec4 outlineColor = {1,1,1,0} {"showIf":"scoreOutline", "widget":"color"}
// @input float outlineSize = 0.25 {"showIf":"scoreOutline", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input int scoreSize = 0 {"widget":"combobox", "values":[{"label":"Default", "value":0}, {"label":"Custom Size", "value":1}]}
// @input float customScoreSize = 100 {"label": "Score 2D Size", "showIf":"scoreSize", "showIfValue":"1"}
// @input float customScoreSize3d = 200 {"label": "Score 3D Size", "showIf":"scoreSize", "showIfValue":"1"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"<font color='white'>View Settings</font>"}
// @input Asset.ObjectPrefab scoreView
// @input Asset.ObjectPrefab headScoreView
// @input Asset.ObjectPrefab gameEndView {"label": "End View"}
// @input int endAnimation = 0 {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Slide Up", "value":1}, {"label":"Slide Down", "value":2}]}
// @input bool customEndText
// @ui {"showIf":"customEndText", "widget":"group_start", "label":"Custom End Labels"}
// @input string finalScoreText = "FINAL SCORE"
// @input string finalNewBestText = "NEW BEST" {"label": "Final NEW PB Text", "showIf":"allowPersonalBest"}
// @input string personalBestText = "Personal Best:" {"showIf":"allowPersonalBest"}
// @input string restartText = "TAP TO RESTART"
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_end"}
// @input bool advancedSettings
// @ui {"widget":"group_start", "label":"<font color='white'>Advanced Settings</font>", "showIf":"advancedSettings"}
// @input bool useSpecificCameras
// @input Component.Camera orthographicCamera {"showIf":"useSpecificCameras"}
// @input Component.Camera worldCamera {"showIf":"useSpecificCameras"}
// @input Component.Camera vfxCamera {"showIf":"useSpecificCameras"}
// @ui {"widget":"group_end"}

// hidden inputs
// @input Asset.Font[] fontPresetFontFiles
// @input Asset.ObjectPrefab personalBestVFX
// @input Asset.Texture starParticleTexture

// auto start
// @input bool autoStart = true

// modules
var objectHelpersModule = require("./Scene Object Helpers Module");
var storageModule = require("./Persistent Storage Module");
var createViewController = require("./View Module");
var createVfxController = require("./VFX Module");
var createCameraResolver = require("./Camera Utils Module");

// state and helpers
var state = storageModule.createStorage();
var storageCtx = null;
var view = createViewController(script, objectHelpersModule);
var vfxCtrl = createVfxController(script, view.getPointer);
var cameraResolver = createCameraResolver(script, objectHelpersModule);
var existingCameras = cameraResolver.existingCameras;
var attachmentPointOptions = [
    "Forehead",
    "HeadCenter",
    "CandideCenter",
    "Chin",
    "LeftCheek",
    "RightCheek",
    "LeftForehead",
    "RightForehead",
    "MouthCenter",
    "LeftEyeballCenter",
    "RightEyeballCenter",
    "TriangleBarycentric"
];

script.liveScoreView;
script.gameEndView;
script.pbVfx;
script.canScore = false;
script.achievedPB = false;
script.initialScore = script.scoreType == 0 ? script.initialScoreInt : script.initialScoreFloat;

// callbacks
var eventsModule = require("./Event Module");
script.onPersonalBest = new eventsModule.EventWrapper();
script.onScoreChanged = new eventsModule.EventWrapper();
script.getScore = function() { return state.score; };

// instantiate under a parent SO & use parent's layer
function instantiateUnder(pfb, parentSO) {
    pfb = pfb.instantiate(parentSO);
    pfb.layer = parentSO.layer;
    // ensure all children inherit the parent layer for consistent rendering
    function applyLayerRecursive(sceneObject, layer) {
        sceneObject.layer = layer;
        var childCount = sceneObject.getChildrenCount();
        for (var i = 0; i < childCount; i++) {
            applyLayerRecursive(sceneObject.getChild(i), layer);
        }
    }
    applyLayerRecursive(pfb, parentSO.layer);
    return pfb;
}

function applyHeadAttachmentPoint() {
    if (script.scoreDisplay != 0) return;
    var headBinding = view.getPointer("headBinding");
    if (!headBinding) return;
    var headComp = headBinding.getComponent("Component.Head");
    if (!headComp || typeof AttachmentPointType === "undefined") return;
    var optionName = attachmentPointOptions[script.headAttachmentPoint] || "Forehead";
    if (AttachmentPointType[optionName] === undefined) return;
    headComp.setAttachmentPointType(AttachmentPointType[optionName]);
}

// initalizator
function init() {
    storageCtx = storageModule.initStorage(script);
    storageModule.setScore(state, script.initialScore);

    if(storageCtx.scoreStorage) {
        var storage = storageCtx.scoreStorage;
        var keys = storageCtx.storageKeys;
        var hasFloatPB = storage.getFloat(keys.float) != 0;
        var hasIntPB = storage.getInt(keys.int) != 0;
        if((script.scoreType == 0 && hasFloatPB) || (script.scoreType == 1 && hasIntPB)) {
            storage.putInt(keys.int, 0);
            storage.putFloat(keys.float, 0);
            print("Conflicting data. Both Float & Int scores are available, clearing stored data for this instance.");
        } else {
            if (script.scoreType == 0) {
                print("PB Int score for user: " + storage.getInt(keys.int));
            } else {
                print("PB Float score for user: " + storage.getFloat(keys.float));
            }
        }
    }

    createCameras(cameraResolver.checkEnoughCamerasAndReturnMissingTypes(script.scoreDisplay));
    cameraResolver.findAllCameras();
    
    // create needed hierarchy objects
    var orthoSO = null;
    var worldSO = null;
    var vfxSO = null;

    if (script.useSpecificCameras) {
        if (script.orthographicCamera) {
            orthoSO = script.orthographicCamera.getSceneObject();
        } else {
            print("Score Component: 'Use Specific Cameras' is enabled. Please assign Orthographic Camera.");
        }
        if (script.worldCamera) {
            worldSO = script.worldCamera.getSceneObject();
        } else if (script.scoreDisplay == 0) {
            print("Score Component: 'Use Specific Cameras' is enabled. Please assign World Camera for head score view.");
        }
        if (script.vfxCamera) {
            vfxSO = script.vfxCamera.getSceneObject();
        } else if (script.newBestVFX) {
            print("Score Component: 'Use Specific Cameras' is enabled. Please assign VFX Camera for PB particles.");
        }
    } else {
        if (existingCameras.orthographic.length > 0) orthoSO = existingCameras.orthographic[0].getSceneObject();
        if (existingCameras.perspective.length > 0) worldSO = existingCameras.perspective[0].getSceneObject();
        if (existingCameras.perspective.length > 0) vfxSO = existingCameras.perspective[0].getSceneObject();
        var hasAnyCamera = existingCameras.orthographic.length + existingCameras.perspective.length > 0;
        if (!orthoSO && !hasAnyCamera) {
            print("Score Component: No orthographic camera found for UI. One will be created if needed.");
        }
        if (!worldSO && script.scoreDisplay == 0 && !hasAnyCamera) {
            print("Score Component: No perspective camera found for head score view.");
        }
    }

    if(script.scoreDisplay == 0) {
        if (worldSO) {
            script.liveScoreView = createHeadScoreView(worldSO);
            if(script.newBestVFX && vfxSO) script.pbVfx = createPBVFX(vfxSO);
        }
        if (orthoSO) {
            var fullFrameParent = createOrthographicFullFrameRegion(orthoSO);
            script.gameEndView = createGameEndView(fullFrameParent);
            script.gameEndView.enabled = false;
        }
    } else if(script.scoreDisplay == 1) {
        if (vfxSO && script.newBestVFX) {
            script.pbVfx = createPBVFX(vfxSO);
        }
        if (orthoSO) {
            var fullFrameParent2 = createOrthographicFullFrameRegion(orthoSO);
            script.liveScoreView = createScoreView(fullFrameParent2);
            script.gameEndView = createGameEndView(fullFrameParent2);
            script.gameEndView.enabled = false;
        }
        // ensure VFX has a perspective parent if none existed and VFX is on
        if (script.newBestVFX && !vfxSO) {
            var needs = [false, true];
            createCameras(needs);
            cameraResolver.findAllCameras();
            if (existingCameras.perspective.length > 0) {
                vfxSO = existingCameras.perspective[0].getSceneObject();
                script.pbVfx = createPBVFX(vfxSO);
            }
        }
    }
    
    view.findScoreTextComponents();
    view.findScoreBackplates();
    view.applyBackplateTexture();
    view.refreshUI(state);
    if(script.newBestVFX) vfxCtrl.setupVfx();
    view.setBackplatesEnabled(script.liveScoreView ? script.liveScoreView.enabled : true);
    applyHeadAttachmentPoint();

    if(script.autoStart) {
        script.canScore = true;
    }
}

// hierarchy editor functions
function createHeadScoreView(parent) {
    if(parent == null || !script.headScoreView) {
        print("Score Component: Missing headScoreView prefab or parent.");
        return null;
    }
    return instantiateUnder(script.headScoreView, parent);
}
function createScoreView(parent) {
    if(parent == null || !script.scoreView) {
        print("Score Component: Missing scoreView prefab or parent.");
        return null;
    }
    return instantiateUnder(script.scoreView, parent);
}
function createGameEndView(parent) {
    if(parent == null || !script.gameEndView) {
        print("Score Component: Missing gameEndView prefab or parent.");
        return null;
    }
    return instantiateUnder(script.gameEndView, parent);
}
function createPBVFX(parent) {
    if(parent == null || !script.personalBestVFX) {
        print("Score Component: Missing personalBestVFX prefab or parent.");
        return null;
    }
    return instantiateUnder(script.personalBestVFX, parent);
}
function createCameras(missingTypes) {
    if (script.useSpecificCameras) {
        return;
    }
    if(missingTypes[0]) {
        var orthoCameraSO = global.scene.createSceneObject("Orthographic Camera");
        orthoCameraSO.getTransform().setWorldPosition(new vec3(120.0, 0.0, 40.0));
        var orthoCameraComponent = orthoCameraSO.createComponent("Component.Camera");
        orthoCameraComponent.type = 1;
        var orthoLayer = LayerSet.fromNumber(0);
        orthoCameraSO.layer = orthoLayer;
        orthoCameraComponent.renderLayer = orthoLayer;
        orthoCameraComponent.renderTarget = global.scene.liveTarget;
        orthoCameraComponent.renderOrder = 10;
    }
    if(missingTypes[1]) {
        var perspCameraSO = global.scene.createSceneObject("Perspective Camera");
        perspCameraSO.getTransform().setWorldPosition(new vec3(0.0, 0.0, 40.0));
        var perspCameraComponent = perspCameraSO.createComponent("Component.Camera");
        perspCameraComponent.type = 0;
        var perspLayer = LayerSet.fromNumber(0);
        perspCameraSO.layer = perspLayer;
        perspCameraComponent.renderLayer = perspLayer;
        perspCameraComponent.renderTarget = global.scene.liveTarget;
        perspCameraComponent.renderOrder = 10;
    }
}
function createOrthographicFullFrameRegion(parentSO) {
    if(parentSO == null) return null;

    var fullFrameRegionSO = global.scene.createSceneObject("Full Frame Region");
    objectHelpersModule.getOrAddComponent(fullFrameRegionSO, "ScreenTransform");
    fullFrameRegionSO.setParent(parentSO);
    fullFrameRegionSO.layer = fullFrameRegionSO.getParent().layer;
    var screenRegionComponent = objectHelpersModule.getOrAddComponent(fullFrameRegionSO, "ScreenRegionComponent");
    screenRegionComponent.region = ScreenRegionType.FullFrame;

    return fullFrameRegionSO;
}
function playNewBestVfx () {
    var updated = storageModule.updatePB(script, state, storageCtx, {
        playVfx: script.newBestVFX ? vfxCtrl.playVfx : null,
        onPersonalBest: script.onPersonalBest ? function(score) { script.onPersonalBest.trigger(score); } : null
    });
    if (updated) {
        script.achievedPB = true;
    }
}

// score logic
function increaseScore (amount) {
    if(!script.canScore) return;
    if(amount == null) { amount = 1; }
    storageModule.modifyScore(state, "add", amount);
    if (script.onScoreChanged) {
        script.onScoreChanged.trigger(state.score);
    }
    if(script.updatePersonalBest == 0) {
        playNewBestVfx();
    }
    view.refreshUI(state);
    if(script.scoreAnimation) view.animateScore("bump");
}
function decreaseScore (amount) {
    if(!script.canScore) return;
    if(amount == null) { amount = 1; }
    storageModule.modifyScore(state, "sub", amount);
    if (script.onScoreChanged) {
        script.onScoreChanged.trigger(state.score);
    }
    view.refreshUI(state);
    if(script.scoreAnimation) view.animateScore("shrink");
}
function clearScore() {
    storageModule.setScore(state, script.initialScore);
    view.refreshUI(state);
}
function resetSavedScore() {
    storageModule.resetSavedScore(storageCtx);
}
function endScoring(onComplete) {
    script.canScore = false;
    if(script.updatePersonalBest == 1 && script.allowPersonalBest) {
        playNewBestVfx();
    }

    if (script.liveScoreView) {
        script.liveScoreView.enabled = false;
    }

    if (script.gameEndView) {
        script.gameEndView.enabled = true;
        if(script.endAnimation != 0) view.animateView(script.endAnimation, true, function() {
            if (onComplete) { onComplete(); }
        });
    }
    // ensure any backplates tied to end view remain visible
    view.setBackplatesEnabled(true);

    var gameEndTitlePointer = view.getPointer("gameEndTitle");
    if(gameEndTitlePointer) {
        var gameEndTitleTextComp = gameEndTitlePointer.getComponent('Component.Text');
        if(gameEndTitleTextComp) gameEndTitleTextComp.text = script.achievedPB ? script.finalNewBestText : script.finalScoreText;
    }
    script.achievedPB = false;

    var pbScoreText = view.getPointer("pbScoreText");
    if(pbScoreText && !script.allowPersonalBest) pbScoreText.enabled = false;

    if (pbScoreText) {
        var pbScoreTextComp = pbScoreText.getComponent('Component.Text');
        if(pbScoreTextComp) pbScoreTextComp.text = script.personalBestText + " " + storageModule.getPBString(script, state, storageCtx);
    }

    var restartPointer = view.getPointer("restartText");
    if(restartPointer) {
        var restartTextComp = restartPointer.getComponent('Component.Text');
        if(restartTextComp) restartTextComp.text = script.restartText;
    }
}
function startScoring(onComplete) {
    clearScore();

    if(script.endAnimation != 0 && script.gameEndView) {
        view.animateView(script.endAnimation, false, function() {
            script.gameEndView.enabled = false;
            if (script.liveScoreView) {
                script.liveScoreView.enabled = true;
            }
            view.setBackplatesEnabled(true);
            script.canScore = true;
            if (onComplete) { onComplete(); }
        });
    } else {
        if (script.gameEndView) {
            script.gameEndView.enabled = false;
        }
        if (script.liveScoreView) {
            script.liveScoreView.enabled = true;
        }
        view.setBackplatesEnabled(true);
        script.canScore = true;
        if (onComplete) { onComplete(); }
    }

}

script.increaseScore = increaseScore;
script.decreaseScore = decreaseScore;

script.startScoring = startScoring;
script.endScoring = endScoring;

script.clearScore = clearScore;
script.resetSavedScore = resetSavedScore;

init();
