// @input string loadingViewId = "loadingView"
//@input Asset.Material progressMaterial
var progressMaterial = script.progressMaterial;
script.loadingProgress = 0;
var targetProgress = 0;
var displayedProgress = 0;
var lerpSpeed = 0.15; // smoothing factor per frame
script.currentLoadingConfig = {
    delayAfterCompletion: 0,
    onCompleteViewId: null,
    onCompleteCallback: null
}

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {
    // Smoothly interpolate displayed progress toward target
    displayedProgress = global.utils.lerp(displayedProgress, targetProgress, lerpSpeed);
    if (progressMaterial && progressMaterial.mainPass) {
        progressMaterial.mainPass.progress = displayedProgress;
    }

    // Stop when we've effectively reached completion
    if (targetProgress >= 1 && displayedProgress >= 0.995) {
        loadingEvent.enabled = false;
        script.hideLoadingView();
    }
});
loadingEvent.enabled = false;

function setupConfig(delayAfterCompletionValue, onCompleteViewId, onCompleteCallback) {
    script.currentLoadingConfig.delayAfterCompletion = delayAfterCompletionValue;
    script.currentLoadingConfig.onCompleteViewId = onCompleteViewId;
    script.currentLoadingConfig.onCompleteCallback = onCompleteCallback;
}

script.show = function(currentViewId, delayAfterCompletionValue = 0, onCompleteViewId = null, onCompleteCallback = null) {

    if(typeof currentViewId == "string" && currentViewId && currentViewId.length > 0) {
        global.uiKitDirector.transition(currentViewId, script.loadingViewId, 0.2, () => {
            setupConfig(delayAfterCompletionValue, onCompleteViewId, onCompleteCallback);
        });
    } else {
        global.uiKitDirector.toggleUIComposite(script.loadingViewId, true);
        global.uiKitDirector.newWorldScale(script.loadingViewId, new vec3(1, 1, 1), 0.2, () => {
            setupConfig(delayAfterCompletionValue, onCompleteViewId, onCompleteCallback);
        });
    }

    script.loadingProgress = 0;
    targetProgress = 0;
    displayedProgress = 0;
    loadingEvent.enabled = true;
}

script.hide= function() {
    global.utils.delay(delayAfterCompletion, function() {
        // transition off
    })
}

script.progress = function(amount) {
    if (typeof amount !== "number") { return; }
    script.loadingProgress = Math.min(1, script.loadingProgress + amount);
    targetProgress = script.loadingProgress;
}
