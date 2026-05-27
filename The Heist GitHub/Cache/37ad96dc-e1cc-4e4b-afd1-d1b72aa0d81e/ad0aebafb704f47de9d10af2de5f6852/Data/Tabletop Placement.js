// @input SceneObject objectVisuals {"label":"Object Visuals","allowUndefined":true}
// @input int placementSettingMode = 0 {"label":"Placement Mode","widget":"combobox","values":[{"label":"Near Surface","value":0},{"label":"Horizontal","value":1},{"label":"Vertical","value":2}]}
// @input bool autoStart = true

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
  if (script.objectVisuals) {
    script.objectVisuals.enabled = true;
  }
  if (transform) {
    print("moved")
    transform.setWorldPosition(pos);
    transform.setWorldRotation(rot);
  }
}

var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(onStart);

script.startPlacement = startPlacement;
script.resetPlacement = resetPlacement;
