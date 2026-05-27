// @input string loadingViewId = "loadingView"
//@input Asset.Material progressMaterial
var progressMaterial = script.progressMaterial;
var delayAfterCompletion;
script.loadingProgress = 0;

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {
    if(script.loadingProgress >= 1) {
        loadingEvent.enabled = false;
        script.hideLoadingView();
    }
})
loadingEvent.enabled = false;

script.showLoadingView = function(currentViewId, delayAfterCompletionValue, onCompleteView) {
    delayAfterCompletion = delayAfterCompletionValue;
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
