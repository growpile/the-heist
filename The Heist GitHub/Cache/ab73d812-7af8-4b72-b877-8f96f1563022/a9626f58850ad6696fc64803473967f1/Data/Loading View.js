// @input string loadingViewId = "loadingView"
script.loadingProgress = 0;

var loadingEvent = script.createEvent("UpdateEvent");
loadingEvent.bind(function() {
    if(script.loadingProgress == 1) {
        
        loadingEvent.enabled = false;
    }
})
loadingEvent.enabled = false;

script.showLoadingView = function(currentViewId, delayAfterCompletion) {
    script.loadingProgress = 0;
    loadingEvent.enabled = true;
}

script.progress = function(amount) {
    script.loadingProgress += amount;
}