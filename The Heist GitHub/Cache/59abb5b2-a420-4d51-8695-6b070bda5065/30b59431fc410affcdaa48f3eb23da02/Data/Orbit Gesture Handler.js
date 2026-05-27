// @input float minDistance = 8.0
// @input float maxDistance = 25.0
// @input float swipeMinXDistance = 6.0
// @input float snapAngle = 80.0
// @input SceneObject targetObject
// @input float rotateLerpSpeed = 6.0
// @input Component.Text debugText
// @input Component.Camera camera
/** @type {Camera} */
var camera = script.camera;
var cameraTransform = camera.getSceneObject().getTransform();

// Lightweight orbit snapper: detect face-down, flat hand within range,
// wait for a left/right swipe, then snap yaw to -snapAngle/0/+snapAngle.
// One rotation per orbit event; stops early if Y distance exceeds maxDistance.

var sikModule = require("SpectaclesInteractionKit.lspkg/SIK");
var SIK = sikModule.SIK || sikModule.default || sikModule;
var ANGLE_THRESHOLD = 0.25; // rad
var HEIGHT_THRESHOLD = 6; // cm
var DEG2RAD = Math.PI / 180;

var rightHand = SIK.HandInputData.getHand("right");
var leftHand = SIK.HandInputData.getHand("left");

var targetTransform =
  script.targetObject != null ? script.targetObject.getTransform() : null;
var anchorRotation = targetTransform
  ? targetTransform.getWorldRotation()
  : null;

var histories = { left: [], right: [] };
var prevHandPositions = { left: null, right: null };
var orbitPrevPositions = { left: null, right: null };

var orbitActive = false;
var orbitStartDot = 0;
var orbitStartY = 0;
var snapState = 0; // -1,0,1
var currentYaw = 0;
var targetYaw = 0;
var rotating = false;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

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

function isFlat(hand) {
  var heights = [
    hand.thumbTip.position.y,
    hand.indexTip.position.y,
    hand.pinkyTip.position.y,
  ];
  var diff = Math.abs(Math.max.apply(null, heights) - Math.min.apply(null, heights));
  return diff < HEIGHT_THRESHOLD;
}

function chooseHand() {
  if (rightHand.isTracked()) return rightHand;
  if (leftHand.isTracked()) return leftHand;
  return null;
}

function startOrbit(hand) {
  if (!targetTransform) {
    return;
  }
  if (!anchorRotation) {
    anchorRotation = targetTransform.getWorldRotation();
  }
  var key = hand.handType === "right" ? "right" : "left";
  var pos = hand.getPalmCenter();
  prevHandPositions[key] = pos;
  orbitPrevPositions[key] = pos;
  orbitStartDot = pos.dot(cameraTransform.right);
  orbitStartY = pos.y;
  orbitActive = true;
}

function stopOrbit() {
  orbitActive = false;
  orbitPrevPositions = { left: null, right: null };
}

function startRotation(targetState) {
  snapState = clamp(targetState, -1, 1);
  targetYaw = snapState * script.snapAngle;
  rotating = true;
  stopOrbit();
}

function updateRotation() {
  if (!rotating || !targetTransform) {
    return;
  }
  currentYaw = lerp(
    currentYaw,
    targetYaw,
    getDeltaTime() * script.rotateLerpSpeed
  );
  var yawQuat = quat.fromEulerVec(new vec3(0, currentYaw * DEG2RAD, 0));
  targetTransform.setWorldRotation(anchorRotation.multiply(yawQuat));
  if (Math.abs(currentYaw - targetYaw) < 0.5) {
    currentYaw = targetYaw;
    rotating = false;
  }
}

function updateHandDebug(hand, key, faceDown, distance, yDist) {
  if (!script.debugText) return;
  if (!histories[key]) histories[key] = [];
  var lines = [];
  lines.push("Orbit: " + (orbitActive ? "true" : "false"));
  lines.push("Rotating: " + (rotating ? "true" : "false"));
  lines.push("Hand: " + key);
  lines.push(
    "Distance: " + (distance != null ? distance.toFixed(1) : "-")
  );
  lines.push("Y distance: " + (yDist != null ? yDist.toFixed(1) : "-"));
  lines.push("FaceDown: " + (faceDown ? "true" : "false"));
  lines.push("Flat: " + (hand ? isFlat(hand) : false));
  script.debugText.text = lines.join("\n");
}

function update() {
  var hand = chooseHand();
  var key = hand && hand.handType === "right" ? "right" : "left";
  if (hand && hand.isTracked()) {
    var pos = hand.getPalmCenter();
    prevHandPositions[key] = pos;
    var flat = isFlat(hand);
    var angleOk = vec3.up().angleTo(getHandUpVector(hand)) < ANGLE_THRESHOLD;
    var distance = pos.distance(script.getTransform().getWorldPosition());
    var yDist = Math.abs(pos.y - script.getTransform().getWorldPosition().y);
    var faceDown = flat && angleOk;

    // Trigger orbit
    if (!orbitActive && !rotating && faceDown && distance < script.minDistance) {
      startOrbit(hand);
    }

    // Handle orbit swipe
    if (orbitActive) {
      var yDelta = Math.abs(pos.y - orbitStartY);
      if (script.maxDistance && yDelta > script.maxDistance) {
        stopOrbit();
      } else {
        var delta = pos.dot(cameraTransform.right) - orbitStartDot;
        if (delta > script.swipeMinXDistance) {
          // swipe right: move toward +snapAngle
          var next = snapState === -1 ? 0 : 1;
          startRotation(next);
        } else if (delta < -script.swipeMinXDistance) {
          // swipe left: move toward -snapAngle
          var nextLeft = snapState === 1 ? 0 : -1;
          startRotation(nextLeft);
        }
      }
    }

    updateHandDebug(hand, key, faceDown, distance, yDist);
  } else {
    // hand not tracked; clear orbit if active but allow rotation to finish
    if (orbitActive) {
      stopOrbit();
    }
    updateHandDebug(null, "none", false, null, null);
  }

  updateRotation();
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
