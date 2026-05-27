// -----JS CODE-----
// @input string smoothCopy = "pos" {"widget":"combobox", "values":[{"label":"Position", "value":"pos"}, {"label":"Rotation", "value":"rot"}, {"label":"Position + Rotation", "value":"posRot"}]}
// @input SceneObject target
// @input vec3 positionOffset
// @input float smoothSpeed = 0.05

var transform = script.getTransform();

if(script.target) {
    var targetTransform = script.target.getTransform();
}
else {
    print("SmoothFollow.js: Please assign the target");
}

function onUpdateEvent(eventData)
{
    if(script.target && script.smoothCopy == "pos") {
        var desiredPosition = targetTransform.getWorldPosition().add(script.positionOffset);
        var smoothedPosition = vec3.lerp(transform.getWorldPosition(),desiredPosition, script.smoothSpeed)
        transform.setWorldPosition(smoothedPosition);
    } else if(script.target && script.smoothCopy == "rot") {
        var desiredRotation = targetTransform.getWorldRotation();
        var smoothedRotation = quat.lerp(transform.getWorldRotation(),desiredRotation, script.smoothSpeed)
        transform.setWorldRotation(smoothedRotation);
    } else if(script.target && script.smoothCopy == "posRot") {
        var desiredPosition = targetTransform.getWorldPosition().add(script.positionOffset);
        var smoothedPosition = vec3.lerp(transform.getWorldPosition(),desiredPosition, script.smoothSpeed)
        var desiredRotation = targetTransform.getWorldRotation();
        var smoothedRotation = quat.lerp(transform.getWorldRotation(),desiredRotation, script.smoothSpeed)
        transform.setWorldPosition(smoothedPosition);
        transform.setWorldRotation(smoothedRotation);
    }
}
var event = script.createEvent("UpdateEvent");
event.bind(onUpdateEvent);