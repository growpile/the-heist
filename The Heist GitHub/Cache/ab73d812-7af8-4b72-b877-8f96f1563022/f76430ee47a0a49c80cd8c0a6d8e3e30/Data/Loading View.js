// @input string loadingViewId = "loadingView"
//@input Asset.Material progressMaterial
var progressMaterial = script.progressMaterial;
script.loadingProgress = 0;

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {
    if(script.loadingProgress >= 1) {
        loadingEvent.enabled = false;
    }
})
loadingEvent.enabled = false;

script.showLoadingView = function(currentViewId, delayAfterCompletion) {
    script.loadingProgress = 0;
    loadingEvent.enabled = true;
}

script.progress = function(amount) {
    lastProgressValue = script.loadingProgress;
    script.loadingProgress += amount;
    progressMaterial.mainPass.progress = global.utils.lerp()
}