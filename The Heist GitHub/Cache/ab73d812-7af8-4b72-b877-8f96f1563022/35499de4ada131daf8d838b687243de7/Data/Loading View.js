// @input string loadingViewId = "loadingView"
script.loadingProgress = 0;

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {

})
loadingEvent.enabled = false;

script.showLoadingView = function(currentViewId, delayAfterCompletion) {
    script.loadingProgress = 0;
}

script.progress = function(amount) {
    script.loadingProgress += amount;
}