script.getSceneObject().getComponent("Component.Script").onDragStart.add(function (arg) {
    print("Drag Started");
    print("Drag Data: " + arg.dragVector);
});

script.getSceneObject().getComponent("Component.Script").onDragUpdate.add(function (arg) {
    // print("Drag Updated");
});

script.getSceneObject().getComponent("Component.Script").onDragEnd.add(function (arg) {
    print("Drag Ended");
    print("Drag Data: " + arg.dragVector);
});