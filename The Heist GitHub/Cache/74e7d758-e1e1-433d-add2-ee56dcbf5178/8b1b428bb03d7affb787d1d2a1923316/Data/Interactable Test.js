script.getSceneObject().getComponent("Component.Script").onTriggerStart.add(function (otherObject) {
    print("Trigger started with object: " + otherObject.name);
});