global.appState = {
    currentState: null,
    anchorManager: null,
    inTransition: false,
    signedInSnapCloud: false,
    currentClientTime: null,
    safe: {},
}

script.createEvent("UpdateEvent").bind(function(eventData){
    print(global.appState.currentState);
});