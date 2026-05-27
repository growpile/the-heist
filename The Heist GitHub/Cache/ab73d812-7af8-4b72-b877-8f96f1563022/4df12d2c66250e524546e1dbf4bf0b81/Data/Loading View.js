// @input string loadingViewId = "loadingView"
//@input Asset.Material progressMaterial
var progressMaterial = script.progressMaterial;
script.loadingProgress = 0;
script.currentLoadingConfig = {
    delayAfterCompletion: 0,
    onCompleteViewId: null,
    onCompleteCallback: null
}

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {
    if(script.loadingProgress >= 1) {
        loadingEvent.enabled = false;
        script.hideLoadingView();
    }
})
loadingEvent.enabled = false;

function setupConfig(delayAfterCompletionValue, onCompleteViewId, onCompleteCallback) {
    script.currentLoadingConfig.delayAfterCompletion = delayAfterCompletionValue;
    script.currentLoadingConfig.onCompleteViewId = onCompleteViewId;
    script.currentLoadingConfig.onCompleteViewId = onCompleteCallback;
}

script.showLoadingView = function(currentViewId, delayAfterCompletionValue = 0, onCompleteViewId = null, onCompleteCallback = null) {
    script.currentLoadingConfig.delayAfterCompletion = delayAfterCompletionValue;
    script.currentLoadingConfig.onCompleteViewId = onCompleteViewId;
    script.currentLoadingConfig.onCompleteViewId = onCompleteCallback;

    if(typeof currentViewId == String) {
        global.uiKitDirector.transition(currentViewId, script.loadingViewId, 0.2, function() {

        });
    }

    script.loadingProgress = 0;
    loadingEvent.enabled = true;
}

script.hideLoadingView = function() {
    global.utils.delay(delayAfterCompletion, function() {
        // transition off
    })
}

script.progress = function(amount) {
    lastProgressValue = script.loadingProgress;
    script.loadingProgress = (script.loadingProgress + amount) % 1;
    progressMaterial.mainPass.progress = global.utils.lerp(lastProgressValue, script.loadingProgress);
}
