// -----JS CODE-----
// @ui {"widget":"group_start", "label":"Settings"}
// @input boolean multipleSfxInstances {"label":"‎<font color='white'>MAI: Multiple <br> Audio Instances</font>"}
// @input boolean backgroundAudio
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Setup"}
// @input Asset.AudioTrackAsset[] backgroundSounds {"showIf":"backgroundAudio"}
// @input float backgroundVolume = 1.0 {"showIf":"backgroundAudio", "widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input Asset.AudioTrackAsset[] sounds
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}

// @ui {"widget":"group_start", "label":"How to use?"}
// @ui {"widget":"label", "label":"‎<font color='white'>global.playSfx(soundArrayId, timesPlayed, volume, optionalId);</font>"}
// @ui {"widget":"label", "label":"‎<font color='white'>global.stopSfx(optionalId);</font>"}
// @ui {"widget":"label", "label":"‎<font color='white'>global.crossfadeBgm(bgmSoundArrayId, volume, crossfadeDuration);</font>"}
// @ui {"widget":"group_end"}

// add custom type for background sounds where the user can blend sounds together and either play combined or one by one

var initializedTracks = [];
var bgm = null;
var sfxById = {};

script.createAudioTrack = function() {
    var newTrack = global.scene.createSceneObject("Audio Track");
    newTrack.setParent(script.getSceneObject());
    newTrack.createComponent("Component.AudioComponent");
    audioComponent = newTrack.getComponent("Component.AudioComponent");
    return audioComponent;
}

script.setupBgm = function(id, volume, fadeInDuration) {
    var audioComponent = script.createAudioTrack();
    audioComponent.audioTrack = script.backgroundSounds[id];
    audioComponent.volume = (fadeInDuration > 0) ? 0 : volume;
    audioComponent.play(999);
    bgm = audioComponent;

    if (fadeInDuration > 0) {
        var fadeInTime = 0;
        var fadeInEvent = script.createEvent("UpdateEvent");
        fadeInEvent.bind(function() {
            fadeInTime += getDeltaTime();
            var progress = fadeInTime / fadeInDuration;
            audioComponent.volume = Math.min(volume, volume * progress);

            if (progress >= 1.0) {
                fadeInEvent.enabled = false;
            }
        });
    }
}

// Enable background audio
if(script.backgroundAudio == true && script.backgroundSounds != null){
    script.setupBgm(0, script.backgroundVolume);
}

// Init function
function stopSfxById(soundId) {
    if (!soundId) { return; }
    var active = sfxById[soundId];
    if (!active) { return; }
    if (active.stop) {
        active.stop(true);
    } else if (active.pause) {
        active.pause();
    }
    var so = active.getSceneObject ? active.getSceneObject() : null;
    if (so) {
        so.destroy();
    }
    delete sfxById[soundId];
}

global.stopSfx = function(soundId) {
    stopSfxById(soundId);
}

global.playSfx = function(id, times, volume, soundId)
{
    // Script variables
    i = id;
    if(script.sounds[i] == null) return;
    t = times;
    v = volume;

    if (soundId) {
        stopSfxById(soundId);
        var taggedTrack = script.createAudioTrack();
        taggedTrack.audioTrack = script.sounds[i];
        taggedTrack.volume = v;
        taggedTrack.play(t);
        sfxById[soundId] = taggedTrack;
        taggedTrack.setOnFinish(function(ac){
            if (sfxById[soundId] === ac) {
                delete sfxById[soundId];
            }
            ac.getSceneObject().destroy();
        });
        return;
    }
    
    if(script.multipleSfxInstances == false){
        // MAI Enabled
        if(initializedTracks[i] == null)
        {
            // Initializing track
            var newTrack = global.scene.createSceneObject("Audio Track");
            newTrack.setParent(script.getSceneObject());
            newTrack.createComponent("Component.AudioComponent");
            
            audioComponent = newTrack.getComponent("Component.AudioComponent");
            audioComponent.playbackMode = Audio.PlaybackMode.LowLatency;
            audioComponent.audioTrack = script.sounds[i];
            initializedTracks[i] = audioComponent;
        
            audioComponent.volume = v;
            audioComponent.play(t);
        } else {
            // Track already initialized
            initializedTracks[i].volume = v;
            initializedTracks[i].play(t);
        }
    } else {
        // MAI Disabled
        var newTrack = global.scene.createSceneObject("Audio Track");
        newTrack.setParent(script.getSceneObject());
        newTrack.createComponent("Component.AudioComponent");
        
        audioComponent = newTrack.getComponent("Component.AudioComponent");
        audioComponent.audioTrack = script.sounds[i];
        audioComponent.volume = v;
        audioComponent.play(t);
        
        // Destroy prefab on audio finished
        audioComponent.setOnFinish(function(ac){
            ac.getSceneObject().destroy();
        });
    }
}

global.crossfadeBgm = function(id, volume, crossfadeDuration)
{
    if (!bgm) {
        script.setupBgm(id, volume, crossfadeDuration);
        return;
    }

    var currentBgm = bgm;
    var startVolume = currentBgm.volume;
    var fadeOutTime = 0;

    var fadeOutEvent = script.createEvent("UpdateEvent");
    fadeOutEvent.bind(function() {
        fadeOutTime += getDeltaTime();
        var progress = fadeOutTime / crossfadeDuration;
        currentBgm.volume = Math.max(0, startVolume * (1 - progress));

        if (progress >= 1.0) {
            fadeOutEvent.enabled = false;
            currentBgm.getSceneObject().destroy();
        }
    });

    script.setupBgm(id, volume, crossfadeDuration);
}

global.bgmVolume = function(volume, fadeDuration)
{
    if (!bgm) { return; }
    var target = Math.max(0, Math.min(1, volume !== undefined ? volume : bgm.volume));
    var duration = fadeDuration !== undefined ? fadeDuration : 0;
    if (duration <= 0) {
        bgm.volume = target;
        return;
    }

    var startVolume = bgm.volume;
    var fadeTime = 0;
    var fadeEvent = script.createEvent("UpdateEvent");
    fadeEvent.bind(function() {
        fadeTime += getDeltaTime();
        var t = Math.min(fadeTime / duration, 1);
        var smoothT = t * t * (3 - 2 * t);
        bgm.volume = startVolume + (target - startVolume) * smoothT;
        if (t >= 1) {
            fadeEvent.enabled = false;
        }
    });
}
