// @input Component.ScriptComponent frameScript
/** @type {ScriptComponent} */
var frameScript = script.frameScript;
// @input Component.ScriptComponent externalScript
/** @type {ScriptComponent} */
var externalScript = script.externalScript;
// @input string externalFunction
/** @type {string} */
var externalFunction = script.externalFunction;

function bindCloseButton() {
    var frameComp = frameScript;
    print(frameComp.getSceneObject().name);
    print(frameComp.innerSize);

    var closeButton = frameComp.closeButton;
    var func = externalScript && externalFunction ? externalScript[externalFunction] : null;
    if (typeof func !== "function") {
        print("[CloseButton] externalFunction '" + externalFunction + "' is not a function");
        return;
    }
    closeButton.onTriggerUp.add(func);
}

script.createEvent("OnStartEvent").bind(function(eventData){
    bindCloseButton();
});