script.getSceneObject().getComponent("Component.Script").onDragStart.add(function () {
    print("Drag Started");
});

script.getSceneObject().getComponent("Component.Script").onDragUpdate.add(function () {
    print("Drag Updated");
});

script.getSceneObject().getComponent("Component.Script").onDragEnd.add(function () {
    print("Drag Ended");
});