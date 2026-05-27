// @input SceneObject objectVisuals {"label":"Object Visuals","allowUndefined":true}
// @input int placementSettingMode = 0 {"label":"Placement Mode","widget":"combobox","values":[{"label":"Near Surface","value":0},{"label":"Horizontal","value":1},{"label":"Vertical","value":2}]}
// @input bool autoStart = true
// @input Component.Camera camera
// @input Component.ScriptComponent logic

var placementSettingsModule = require("./Scripts/PlacementSettings");
var PlacementSettings = placementSettingsModule.PlacementSettings;
var PlacementMode = placementSettingsModule.PlacementMode;
var SurfacePlacementController = require("./Scripts/SurfacePlacementController").SurfacePlacementController;

var surfacePlacement = SurfacePlacementController.getInstance();
var transform = null;

function onStart() {
  transform = script.getSceneObject().getTransform();

  if (script.objectVisuals) {
    script.objectVisuals.enabled = false;
  }

  if (script.autoStart) {
    startPlacement();
  }

  global.appState.anchorManager = script;
}

function startPlacement() {
  global.appState.currentState = "surfacePlacement";
  if (script.objectVisuals) {
    script.objectVisuals.enabled = false;
  }

  var placementSettings;
  switch (script.placementSettingMode) {
    case 0: // Near Surface
      placementSettings = new PlacementSettings(
        PlacementMode.NEAR_SURFACE,
        false, // use surface adjustment widget
        new vec3(10, 10, 0), // offset in cm of widget from surface center
        onSliderUpdated // callback from widget height changes
      );
      break;
    case 1: // Horizontal
      placementSettings = new PlacementSettings(PlacementMode.HORIZONTAL);
      break;
    case 2: // Vertical
      placementSettings = new PlacementSettings(PlacementMode.VERTICAL);
      break;
    default:
      placementSettings = new PlacementSettings(PlacementMode.NEAR_SURFACE);
  }

  surfacePlacement.startSurfacePlacement(placementSettings, function (pos, rot) {
    onSurfaceDetected(pos, rot);
  });
}

function resetPlacement() {
  surfacePlacement.stopSurfacePlacement();
  startPlacement();
}

function onSliderUpdated(pos) {
  if (transform) {
    transform.setWorldPosition(pos);
  }
}

function onSurfaceDetected(pos, rot) {
  global.appState.currentState = "mainMenu";
  script.logic.playareaPositioned();
  if (script.objectVisuals) {
    script.objectVisuals.enabled = true;
  }
  if (transform) {
    transform.setWorldPosition(pos);
    var finalRot = rot;
    // Face the camera on Y axis only (ignore camera rotation; use positions on XZ plane)
    if (script.camera) {
      var camTransform = script.camera.getSceneObject().getTransform();
      var camPos = camTransform.getWorldPosition();
      var dir = new vec2(pos.x - camPos.x, pos.z - camPos.z);
      if (dir.length > 0.001) {
        var yaw = Math.atan2(dir.x, dir.y); // yaw around Y to look at camera position
        var baseEuler = getQuatEuler(rot);
        finalRot = quat.fromEulerVec(new vec3(baseEuler.x, yaw, baseEuler.z));
      }
    }
    transform.setWorldRotation(finalRot);
  }
}

var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(onStart);

script.startPlacement = startPlacement;
script.resetPlacement = resetPlacement;

function getQuatEuler(q) {
  if (!q) {
    return new vec3(0, 0, 0);
  }
  if (q.toEulerAngles) {
    return q.toEulerAngles();
  }
  if (q.toEulerVec) {
    return q.toEulerVec();
  }
  return new vec3(0, 0, 0);
}
