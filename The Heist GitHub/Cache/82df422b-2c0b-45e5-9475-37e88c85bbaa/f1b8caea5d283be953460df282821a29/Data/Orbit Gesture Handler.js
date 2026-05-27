// @input float minDistance
// @input SceneObject targetObject
// @input vec2 yawLimits = {\"x\":45,\"y\":45}
// @input float maxDistance = 25.0
// @input float rotationStopSpeed = 40.0
// @input Component.Text debugText
/** @type {number} */
var minDistance = script.minDistance;
/** @type {SceneObject} */
var targetObject = script.targetObject;
/** @type {vec2} */
var yawLimits = script.yawLimits || new vec2(45, 45);
/** @type {number} */
var maxDistance = script.maxDistance;
/** @type {number} */
var rotationStopSpeed = script.rotationStopSpeed;
/** @type {Text} */
var debugText = script.debugText;

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
var HISTORY_LIMIT = 5; // shorter history for faster stability detection
var DEG2RAD = Math.PI / 180;
var YAW_PER_CM = 6; // degrees per cm slide along camera right (faster orbit)
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
var yawOriginHandPos = null;
var baseRotation = null;
var anchorRotation = targetTransform
  ? targetTransform.getWorldRotation()
  : null;
var currentYaw = 0;
var desiredYaw = 0;
var totalYaw = 0; // tracks yaw relative to anchorRotation across orbits
var orbitStartYaw = 0;
var lostTrackTimer = 0;
var LOST_TRACK_TIMEOUT = 1.0; // seconds before canceling orbit on lost tracking
var prevHandPositions = { left: null, right: null };
var targetTransform =
  targetObject != null ? targetObject.getTransform() : null;
var debugState = {
  left: {
    tracked: false,
    faceDown: false,
    distance: null,
    close: false,
    flat: false,
    still: false,
    yDistance: null,
    speed: 0,
  },
  right: {
    tracked: false,
    faceDown: false,
    distance: null,
    close: false,
    flat: false,
    still: false,
    yDistance: null,
    speed: 0,
  },
};

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
  if (history.length < 3) {
    return false;
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
  // Camera visibility check disabled for now; tracking state alone is used.
  return true;
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
  if (!anchorRotation) {
    anchorRotation = targetTransform.getWorldRotation();
  }
  isOrbiting = true;
  activeHand = hand;
  orbitStartHandPos = hand.getPalmCenter();
  yawOriginHandPos = orbitStartHandPos;
  orbitPrevHandPos = orbitStartHandPos;
  baseRotation = anchorRotation;
  orbitStartYaw = totalYaw;
  desiredYaw = totalYaw;
  currentYaw = totalYaw;
  lostTrackTimer = 0;
}

function stopOrbit() {
  isOrbiting = false;
  activeHand = null;
  orbitStartHandPos = null;
  yawOriginHandPos = null;
  orbitPrevHandPos = null;
  baseRotation = null;
  desiredYaw = 0;
  lostTrackTimer = 0;
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
    lostTrackTimer += getDeltaTime();
    if (lostTrackTimer >= LOST_TRACK_TIMEOUT) {
      stopOrbit();
    }
    return;
  } else {
    lostTrackTimer = 0;
  }
  // project movement along camera right to measure horizontal slide
  var currentPos = activeHand.getPalmCenter();
  var speed =
    orbitPrevHandPos && getDeltaTime() > 0
      ? currentPos.distance(orbitPrevHandPos) / getDeltaTime()
      : 0;
  orbitPrevHandPos = currentPos;
  if (rotationStopSpeed && speed > rotationStopSpeed) {
    // re-center orbit origin for yaw only without affecting Y limit baseline
    yawOriginHandPos = currentPos;
    orbitStartYaw = currentYaw;
    desiredYaw = currentYaw;
    orbitPrevHandPos = currentPos;
    return;
  }
  if (
    maxDistance &&
    Math.abs(currentPos.y - orbitStartHandPos.y) > maxDistance
  ) {
    stopOrbit();
    return;
  }
  var startDot = yawOriginHandPos.dot(cameraTransform.right);
  var currentDot = currentPos.dot(cameraTransform.right);
  var deltaCm = currentDot - startDot;
  var targetYawDeg = clamp(orbitStartYaw + deltaCm * YAW_PER_CM, -yawLimits.x, yawLimits.y);
  desiredYaw = targetYawDeg;
  currentYaw = clamp(
    lerp(currentYaw, desiredYaw, getDeltaTime() * ROTATE_LERP_SPEED),
    -yawLimits.x,
    yawLimits.y
  );
  var yawQuat = quat.fromEulerVec(new vec3(0, currentYaw * DEG2RAD, 0));
  targetTransform.setWorldRotation(baseRotation.multiply(yawQuat));
  totalYaw = currentYaw;
}

function checkHand(hand, history, wasClose) {
  var handKey = hand && hand.handType === "right" ? "right" : "left";
  var tracked = hand && hand.isTracked();
  var targetPos = script.getTransform().getWorldPosition();
  var canUse = canUseHand(hand);
  if (!orbitPrevHandPos && canUse) {
    orbitPrevHandPos = hand.getPalmCenter();
  }
  if (canUse) {
    addHistorySample(hand, history);
  } else {
    history.length = 0;
  }
  var speed = 0;
  var palmCenter = null;
  if (canUse) {
    palmCenter = hand.getPalmCenter();
    if (orbitPrevHandPos && getDeltaTime() > 0) {
      speed = palmCenter.distance(orbitPrevHandPos) / getDeltaTime();
    }
  }
  var flat = canUse && isHandFlat(hand);
  var still = canUse && !isHandMoving(history);
  var faceDown = canUse && isHandWithinAngleThreshold(hand) && flat && still;

  var distance = palmCenter ? palmCenter.distance(targetPos) : null;
  var yDistance = palmCenter ? Math.abs(palmCenter.y - targetPos.y) : null;
  var isClose = distance !== null ? distance < minDistance : false;
  debugState[handKey] = {
    tracked: tracked,
    faceDown: faceDown,
    distance: distance,
    close: isClose,
    flat: flat,
    still: still,
    yDistance: yDistance,
    speed: speed,
  };
  if (!faceDown) {
    return false;
  }
  if (isClose) {
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
  updateDebug();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

function updateDebug() {
  if (!debugText) {
    return;
  }
  var right = debugState.right;
  var lines = [];
  lines.push(
    "Orbit: " + (isOrbiting ? "true" : "false")
  );
  lines.push(
    "Distance: " + (right.distance != null ? right.distance.toFixed(1) : "-")
  );
  lines.push(
    "Y distance: " + (right.yDistance != null ? right.yDistance.toFixed(1) : "-")
  );
  lines.push(
    "Speed: " + (right.speed != null ? right.speed.toFixed(1) : "-")
  );
  lines.push("isFacedDown: " + (right.faceDown ? "true" : "false"));
  lines.push("isStill: " + (right.still ? "true" : "false"));
  lines.push("isFlat: " + (right.flat ? "true" : "false"));
  lines.push("isTracked: " + (right.tracked ? "true" : "false"));
  debugText.text = lines.join("\n");
}
