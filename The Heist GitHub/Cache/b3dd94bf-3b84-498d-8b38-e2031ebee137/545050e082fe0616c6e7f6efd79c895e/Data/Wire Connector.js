// @input SceneObject wireHead
// @input SceneObject wireHandle
// @input float followLerpSpeed = 10.0 "Follow Lerp Speed"
// @input Component.Text debugText
// @input SceneObject wireStartOrigin
// @input float wireLength = 15.0 "Max Wire Length (cm)"
// @input float connectThreshold = 1.0 "Connect Threshold (cm)"
// @input SceneObject wireEndSocket
// @input Asset.Material pipeMaterial
// @input int pipeFaceCount = 8 {"widget":"slider","min":3,"max":24}
// @input float pipeRadius = 0.5

var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
var handleManipulation = null;
var originTransform = script.wireStartOrigin ? script.wireStartOrigin.getTransform() : null;
var pipeRMV = null;
var pipeBuilder = null;
var pipeTransform = script.getSceneObject().getTransform();

var planeTransform = script.getSceneObject().getTransform();
var baseLocalPos = headTransform ? headTransform.getLocalPosition() : null;
var following = false;
var returning = false;
var startHeadPos = headTransform ? headTransform.getWorldPosition() : null;
var startHandlePos = handleTransform ? handleTransform.getWorldPosition() : null;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function lerpVec3(a, b, t) {
    return new vec3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
    );
}

function invertQuat(q) {
    if (!q) { return null; }
    var lenSq = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
    if (lenSq < 1e-6) { return null; }
    return new quat(-q.x / lenSq, -q.y / lenSq, -q.z / lenSq, q.w / lenSq);
}

function worldToPipeLocal(worldPos) {
    if (!pipeTransform) { return worldPos; }
    var pipePos = pipeTransform.getWorldPosition();
    var pipeRot = pipeTransform.getWorldRotation();
    var invRot = invertQuat(pipeRot);
    var offset = worldPos.sub(pipePos);
    return invRot ? invRot.multiplyVec3(offset) : offset;
}

function getPlaneNormal(rot) {
    return rot.multiplyVec3(vec3.forward()).normalize();
}

function getBaseOffset(rot) {
    if (!baseLocalPos) {
        return vec3.zero();
    }
    return rot.multiplyVec3(new vec3(0, 0, baseLocalPos.z));
}

function onHandleTriggerStart() {
    following = true;
    returning = false;
    print("a")
}

function onHandleTriggerEnd() {
    following = false;
    if (!handleTransform || !headTransform) {
        return;
    }

    var snapped = false;
    if (script.wireEndSocket) {
        var socketPos = script.wireEndSocket.getTransform().getWorldPosition();
        var headPos = headTransform.getWorldPosition();
        if (headPos.distance(socketPos) <= script.connectThreshold) {
            headTransform.setWorldPosition(socketPos);
            handleTransform.setWorldPosition(socketPos);
            snapped = true;
        }
    }

    if (!snapped) {
        returning = true;
    }
}

function onHandleManipulationUpdate() {
    if (!headTransform || !handleTransform || !planeTransform) {
        return;
    }
    var planePos = planeTransform.getWorldPosition();
    var planeRot = planeTransform.getWorldRotation();
    var normal = getPlaneNormal(planeRot);
    var headPos = headTransform.getWorldPosition();

    // Snap handle to head's local XY plane (align along plane normal)
    var toHead = headPos.sub(planePos);
    var distance = toHead.dot(normal);
    var projectedHead = headPos.sub(normal.uniformScale(distance));
    handleTransform.setWorldPosition(projectedHead.add(getBaseOffset(planeRot)));
}

function updateFollow() {
    if (returning) {
        updateReturn();
        return;
    }
    if (!following || !headTransform || !handleTransform || !planeTransform) {
        return;
    }
    var planePos = planeTransform.getWorldPosition();
    var planeRot = planeTransform.getWorldRotation();
    var normal = getPlaneNormal(planeRot);
    var handlePos = handleTransform.getWorldPosition();

    // Project handle onto plane XY (plane normal), then add base local Z offset.
    var toHandle = handlePos.sub(planePos);
    var distance = toHandle.dot(normal);
    var projected = handlePos.sub(normal.uniformScale(distance));
    var targetWorld = projected.add(getBaseOffset(planeRot));

    var current = headTransform.getWorldPosition();
    var lerpT = clamp(getDeltaTime() * script.followLerpSpeed, 0, 1);
    var next = lerpVec3(current, targetWorld, lerpT);
    headTransform.setWorldPosition(next);

    // Clamp wire length
    if (originTransform) {
        var headPos = headTransform.getWorldPosition();
        var originPos = originTransform.getWorldPosition();
        var dist = headPos.distance(originPos);
        if (dist > script.wireLength) {
            var dir = headPos.sub(originPos).normalize();
            var clampedPos = originPos.add(dir.uniformScale(script.wireLength));
            headTransform.setWorldPosition(clampedPos);
        }
    }

    // Snap to end socket if close enough
    if (script.wireEndSocket) {
        var socketPos = script.wireEndSocket.getTransform().getWorldPosition();
        var headPos2 = headTransform.getWorldPosition();
        var d2 = headPos2.distance(socketPos);
        if (d2 <= script.connectThreshold) {
            headTransform.setWorldPosition(socketPos);
        }
    }

    if (originTransform && script.debugText) {
        var distDisplay = headTransform.getWorldPosition().distance(originTransform.getWorldPosition());
        script.debugText.text = distDisplay.toFixed(2);
        print("Wire distance: " + distDisplay.toFixed(2));
    }

    updatePipe();
}

function updateReturn() {
    if (!headTransform || !handleTransform) {
        returning = false;
        return;
    }
    var targetPos = originTransform
        ? originTransform.getWorldPosition()
        : (startHeadPos || headTransform.getWorldPosition());
    var lerpT = clamp(getDeltaTime() * script.followLerpSpeed, 0, 1);

    var headNext = lerpVec3(headTransform.getWorldPosition(), targetPos, lerpT);
    var handleNext = lerpVec3(handleTransform.getWorldPosition(), targetPos, lerpT);
    headTransform.setWorldPosition(headNext);
    handleTransform.setWorldPosition(handleNext);

    var headClose = headNext.distance(targetPos) < 0.01;
    var handleClose = handleNext.distance(targetPos) < 0.01;
    if (headClose && handleClose) {
        headTransform.setWorldPosition(targetPos);
        handleTransform.setWorldPosition(targetPos);
        returning = false;
    }

    updatePipe();
}

function init() {
    if (script.wireHandle) {
        handleManipulation = script.wireHandle.getComponent("Component.ScriptComponent");
        if (handleManipulation) {
            if (handleManipulation.onTranslationStart) {
                handleManipulation.onTranslationStart.add(onHandleTriggerStart);
            }
            if (handleManipulation.onTranslationEnd) {
                handleManipulation.onTranslationEnd.add(onHandleTriggerEnd);
            }
            // if (handleManipulation.onManipulationUpdate) {
            //     handleManipulation.onManipulationUpdate.add(onHandleManipulationUpdate);
            // }
        }
    }

    // Setup pipe mesh
    pipeRMV = script.getSceneObject().getComponent("Component.RenderMeshVisual");
    if (!pipeRMV) {
        pipeRMV = script.getSceneObject().createComponent("Component.RenderMeshVisual");
    }
    if (pipeRMV && script.pipeMaterial) {
        pipeRMV.clearMaterials();
        pipeRMV.mainMaterial = script.pipeMaterial;
    }
    pipeBuilder = null;
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(updateFollow);

script.createEvent("OnStartEvent").bind(init);

function ensurePipeBuilder() {
    if (!pipeBuilder) {
        pipeBuilder = new MeshBuilder([
            { name: "position", components: 3 },
            { name: "texture0", components: 2 },
            { name: "normal", components: 3, normalized: true },
        ]);
        pipeBuilder.topology = MeshTopology.TriangleStrip;
        pipeBuilder.indexType = MeshIndexType.UInt16;
    }
    if (pipeRMV && pipeBuilder && pipeRMV.mesh !== pipeBuilder.getMesh()) {
        pipeRMV.mesh = pipeBuilder.getMesh();
    }
}

function clearMesh(builder) {
    var vCount = builder.getVerticesCount();
    var iCount = builder.getIndicesCount();
    if (vCount > 0) {
        builder.eraseVertices(0, vCount);
    }
    if (iCount > 0) {
        builder.eraseIndices(0, iCount);
    }
}

function updatePipe() {
    if (!pipeRMV || !headTransform || !originTransform) {
        return;
    }
    ensurePipeBuilder();
    var builder = pipeBuilder;
    clearMesh(builder);

    var startPos = worldToPipeLocal(originTransform.getWorldPosition());
    var endPos = worldToPipeLocal(headTransform.getWorldPosition());
    var faceCount = Math.max(3, script.pipeFaceCount || 8);
    var radius = script.pipeRadius || 0.5;

    var tube = new SegmentedTubeGenerator(builder, faceCount, radius);
    tube.addSegment(startPos, endPos, false);

    if (builder.isValid()) {
        builder.updateMesh();
    }
}

function SegmentedTubeGenerator(builder, faceCount, radius) {
    this.addSegment = function (start, end, joinWithPrev) {
        var dir = start.sub(end).normalize();
        var startCircle = getCircle(start, dir);
        var endCircle = getCircle(end, dir);
        addFaces(start, startCircle, endCircle, joinWithPrev);
    };

    function getCircle(pos, dir) {
        var anglePer = (2 * Math.PI) / faceCount;
        var result = [];
        var dotUp = dir.dot(vec3.up());
        var dotFwd = dir.dot(vec3.forward());
        var perp = Math.abs(dotUp) < Math.abs(dotFwd) ? vec3.up() : vec3.forward();
        var around = dir.cross(perp).uniformScale(radius);
        for (var i = 0; i < faceCount; i++) {
            var rot = quat.angleAxis(i * anglePer, dir);
            var v = rot.multiplyVec3(around).add(pos);
            result.push(v);
        }
        return result;
    }

    function addFaces(startCenter, startCircle, endCircle, join) {
        var crossCount = startCircle.length;
        var uvStep = 1 / crossCount;
        for (var i = 0; i < crossCount; i++) {
            var a = startCircle[i];
            var b = endCircle[i];
            var normal = startCircle[i].sub(startCenter).normalize();
            builder.appendVertices([
                [a.x, a.y, a.z],
                [0, i * uvStep],
                [normal.x, normal.y, normal.z],
            ]);
            builder.appendVertices([
                [b.x, b.y, b.z],
                [1, i * uvStep],
                [normal.x, normal.y, normal.z],
            ]);
        }
        var vertsPerSegment = 2 * faceCount;
        var startIndex = builder.getVerticesCount() - vertsPerSegment;
        for (var i = 0; i < faceCount; i++) {
            var i0 = startIndex + i * 2;
            var i1 = i0 + 1;
            var i2 = startIndex + ((i + 1) % faceCount) * 2;
            var i3 = i2 + 1;
            builder.appendIndices([i0, i1, i2]);
            builder.appendIndices([i1, i3, i2]);
            if (i === 0 && join) {
                // no-op for single segment use case
            }
        }
    }
}
