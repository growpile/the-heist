// @input float minDistance
// @input SceneObject targetObject
// @input vec2 yawLimits = {\"x\":45,\"y\":45}
// @input float maxDistance = 25.0
/** @type {number} */
var minDistance = script.minDistance;
/** @type {SceneObject} */
var targetObject = script.targetObject;
/** @type {vec2} */
var yawLimits = script.yawLimits || new vec2(45, 45);
/** @type {number} */
var maxDistance = script.maxDistance;

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
var DEG2RAD = Math.PI / 180;
var YAW_PER_CM = 1.5; // degrees per cm slide along camera right
var ROTATE_LERP_SPEED = 8;

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
var isOrbiting = false;
var activeHand = null;
var orbitStartHandPos = null;
var baseRotation = null;
var currentYaw = 0;
var desiredYaw = 0;
var targetTransform =
  targetObject != null ? targetObject.getTransform() : null;

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

function startOrbit(hand) {
  if (!targetTransform) {
    return;
  }
  isOrbiting = true;
  activeHand = hand;
  orbitStartHandPos = hand.getPalmCenter();
  baseRotation = targetTransform.getWorldRotation();
  desiredYaw = 0;
  currentYaw = 0;
}

function stopOrbit() {
  isOrbiting = false;
  activeHand = null;
  orbitStartHandPos = null;
  baseRotation = null;
  desiredYaw = 0;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function updateOrbit() {
  if (!isOrbiting || !activeHand || !targetTransform) {
    return;
  }
  if (!activeHand.isTracked()) {
    stopOrbit();
    return;
  }
  // project movement along camera right to measure horizontal slide
  var currentPos = activeHand.getPalmCenter();
  if (
    maxDistance &&
    Math.abs(currentPos.y - orbitStartHandPos.y) > maxDistance
  ) {
    stopOrbit();
    return;
  }
  var startDot = orbitStartHandPos.dot(cameraTransform.right);
  var currentDot = currentPos.dot(cameraTransform.right);
  var deltaCm = currentDot - startDot;
  var targetYawDeg = clamp(
    deltaCm * YAW_PER_CM,
    -yawLimits.x,
    yawLimits.y
  );
  desiredYaw = targetYawDeg;
  currentYaw = lerp(
    currentYaw,
    desiredYaw,
    getDeltaTime() * ROTATE_LERP_SPEED
  );
  var yawQuat = quat.fromEulerVec(new vec3(0, currentYaw * DEG2RAD, 0));
  targetTransform.setWorldRotation(baseRotation.multiply(yawQuat));
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
      startOrbit(hand);
    }
    return true;
  }
  return false;
}

function onUpdate() {
  leftWasClose = checkHand(leftHand, leftHistory, leftWasClose);
  rightWasClose = checkHand(rightHand, rightHistory, rightWasClose);
  updateOrbit();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
