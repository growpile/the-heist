script.getSceneObject().getComponent("Component.Script").onTriggerEndOutside.add(function () {
    print("not pushed");
});

script.getSceneObject().getComponent("Component.Script").onTriggerEnd.add(function () {
    print("not pushed");
});