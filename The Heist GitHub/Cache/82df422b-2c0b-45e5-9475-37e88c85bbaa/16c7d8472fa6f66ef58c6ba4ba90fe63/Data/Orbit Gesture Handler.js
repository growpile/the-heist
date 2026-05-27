// @input float minDistance
/** @type {number} */
var minDistance = script.minDistance;

// Mirror the SurfacePlacement package hand logic using SIK hand data
var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;

var cameraProviderModule = require(
  "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
);
var WorldCameraFinderProvider =
  cameraProviderModule.default || cameraProviderModule;

var ANGLE_THRESHOLD = 0.25; // rad, how flat the hand is
var HEIGHT_THRESHOLD = 6; // cm, spread between finger heights
var MOVEMENT_THRESHOLD = 1.5; // cm, filter out moving hands
var HISTORY_LIMIT = 30;

var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var cameraTransform = WorldCameraFinderProvider.getInstance().getTransform();
var cameraComponent = cameraTransform
  ? cameraTransform.getSceneObject().getComponent("Camera")
  : null;

var leftHistory = [];
var rightHistory = [];
var leftWasClose = false;
var rightWasClose = false;

function getHandUpVector(hand) {
  var forward = hand.wrist.position.sub(hand.middleTip.position).normalize();
  var right = hand.thumbBaseJoint.position
    .sub(hand.pinkyKnuckle.position)
    .normalize();
  if (hand.handType === "right") {
    right = right.uniformScale(-1);
  }
  return forward.cross(right).normalize();
}

function isHandWithinAngleThreshold(hand) {
  return vec3.up().angleTo(getHandUpVector(hand)) < ANGLE_THRESHOLD;
}

function addHistorySample(hand, history) {
  history.push(hand.thumbTip.position);
  if (history.length > HISTORY_LIMIT) {
    history.shift();
  }
}

function isHandMoving(history) {
  if (history.length < 2) {
    return true;
  }
  var movement = history[0].distance(history[history.length - 1]);
  return movement > MOVEMENT_THRESHOLD;
}

function isHandFlat(hand) {
  var heights = [
    hand.thumbTip.position.y,
    hand.indexTip.position.y,
    hand.pinkyTip.position.y,
  ];
  var diff = Math.abs(Math.max.apply(null, heights) - Math.min.apply(null, heights));
  return diff < HEIGHT_THRESHOLD;
}

function canUseHand(hand) {
  if (!hand || !hand.isTracked()) {
    return false;
  }
  if (!cameraComponent) {
    return true;
  }
  return cameraComponent.isSphereVisible(hand.thumbTip.position, 2);
}

function isHandFaceDownAndStable(hand, history) {
  if (!canUseHand(hand)) {
    history.length = 0;
    return false;
  }

  addHistorySample(hand, history);

  var angleOk = isHandWithinAngleThreshold(hand);
  var flat = isHandFlat(hand);
  var stable = !isHandMoving(history);

  return angleOk && flat && stable;
}

function checkHand(hand, history, wasClose) {
  var targetPos = script.getTransform().getWorldPosition();
  var faceDown = isHandFaceDownAndStable(hand, history);

  if (!faceDown) {
    return false;
  }

  var palmCenter = hand.getPalmCenter();
  var distance = palmCenter.distance(targetPos);
  if (distance < minDistance) {
    if (!wasClose) {
      print("Close enough!");
    }
    return true;
  }
  return false;
}

function onUpdate() {
  leftWasClose = checkHand(leftHand, leftHistory, leftWasClose);
  rightWasClose = checkHand(rightHand, rightHistory, rightWasClose);
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
