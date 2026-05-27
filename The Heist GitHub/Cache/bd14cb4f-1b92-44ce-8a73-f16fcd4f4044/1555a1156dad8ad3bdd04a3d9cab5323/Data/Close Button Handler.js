//@input Component.ScriptComponent frameScript
/** @type {ScriptComponent} */
var frameScript = script.frameScript;

function bindCloseButton() {
    var frameComp = uiCompositeEntry.uiComposite;
    print(frameComp.getSceneObject().name);
    print(frameComp.innerSize);

    var closeButton = frameComp.closeButton;
    var func = uiCompositeEntry.closeScript && uiCompositeEntry.closeFunction ? uiCompositeEntry.closeScript[uiCompositeEntry.closeFunction] : null;
    closeButton.add(func);
}