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
var view = 0; // -1 left, 0 center, 1 right

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
  var targetPos = script.getTransform().getWorldPosition();
  var rightTracked = rightHand.isTracked();
  var leftTracked = leftHand.isTracked();

  if (rightTracked && leftTracked) {
    var rightDist = rightHand.getPalmCenter().distance(targetPos);
    var leftDist = leftHand.getPalmCenter().distance(targetPos);
    return rightDist <= leftDist ? rightHand : leftHand;
  }
  if (rightTracked) return rightHand;
  if (leftTracked) return leftHand;
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
    if (!orbitActive && faceDown && distance < script.minDistance && yDist < 4 ) {
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
          view = view === -1 ? 0 : 1;
          print("right");
          stopOrbit();
        } else if (delta < -script.swipeMinXDistance) {
          // swipe left: move toward -snapAngle
          view = view === 1 ? 0 : -1;
          print("left");
          stopOrbit();
        }
      }
    }
  } else {
    // hand not tracked; clear orbit if active but allow rotation to finish
    if (orbitActive) {
      stopOrbit();
    }
  }

}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);
