// @input Asset.Material wireMaterial
// @input int wireFaceCount = 8 {"widget":"slider","min":3,"max":24}
// @input float wireRadius = 0.25
// @input int wireSegments = 5 {"widget":"slider","min":1,"max":30}
// @input SceneObject wireHead
// @input SceneObject wireHandle
// @input float followSpeed = 10.0 "Follow Lerp Speed"
// @input Component.Text debugText
// @input float maxWireLength = 15.0 "Max Wire Length (cm)"
// @input float snapDistance = 0.5 "Snap Distance (cm)"
// @input SceneObject[] wireSockets

var baseTransform = script.getSceneObject().getTransform();
var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
var handleScript = null;
var pipeObj = null;
var pipeRMV = null;
var pipeBuilder = null;
var socketsList = [];
var currentSocket = null;
var isFollowing = false;
var occupancyListKey = "wireSocketRegistry";
var startLocalZ = null;
var isReturning = false;
var startHeadPos = null;
var startHandlePos = null;
var headParentTransform = null;

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

function ensureOccupancyList() {
    if (!global[occupancyListKey]) {
        global[occupancyListKey] = { sockets: [], occupancy: [] };
    }
}

function registerSockets() {
    ensureOccupancyList();
    var reg = global[occupancyListKey].sockets;
    for (var i = 0; i < socketsList.length; i++) {
        var s = socketsList[i];
        if (!s) { continue; }
        var exists = false;
        for (var j = 0; j < reg.length; j++) {
            if (reg[j] === s) { exists = true; break; }
        }
        if (!exists) {
            reg.push(s);
        }
    }
}

function unregisterSockets() {
    ensureOccupancyList();
    var reg = global[occupancyListKey].sockets;
    for (var i = reg.length - 1; i >= 0; i--) {
        if (socketsList.indexOf(reg[i]) !== -1) {
            reg.splice(i, 1);
        }
    }
}

function isSocketOccupied(socket) {
    ensureOccupancyList();
    var list = global[occupancyListKey].occupancy;
    for (var i = 0; i < list.length; i++) {
        if (list[i].socket === socket) {
            return true;
        }
    }
    return false;
}

function occupySocket(socket) {
    ensureOccupancyList();
    releaseSocket();
    global[occupancyListKey].occupancy.push({ socket: socket, wire: script });
    currentSocket = socket;
}

function releaseSocket() {
    ensureOccupancyList();
    var list = global[occupancyListKey].occupancy;
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].wire === script) {
            list.splice(i, 1);
        }
    }
    currentSocket = null;
}

function clampToMaxLength(pos) {
    if (!baseTransform) {
        return pos;
    }
    var basePos = baseTransform.getWorldPosition();
    var dist = pos.distance(basePos);
    var maxLen = script.maxWireLength || 0;
    if (maxLen > 0 && dist > maxLen) {
        var dir = pos.sub(basePos).normalize();
        return basePos.add(dir.uniformScale(maxLen));
    }
    return pos;
}

function clampToPlane(pos) {
    if (!headTransform) {
        return pos;
    }
    if (startLocalZ === null) {
        return pos;
    }
    if (!headParentTransform) {
        return new vec3(pos.x, pos.y, startLocalZ);
    }
    var parentPos = headParentTransform.getWorldPosition();
    var parentRot = headParentTransform.getWorldRotation();
    var parentRotInv = invertQuat(parentRot);
    if (!parentRotInv) {
        return pos;
    }
    var local = parentRotInv.multiplyVec3(pos.sub(parentPos));
    local.z = startLocalZ;
    return parentRot.multiplyVec3(local).add(parentPos);
}

function applyConstraints(pos) {
    return clampToMaxLength(pos);
}

function projectToStartLocalZ(pos) {
    return clampToPlane(pos);
}

function onHandleStart() {
    isFollowing = true;
    isReturning = false;
    releaseSocket();
}

function onHandleEnd() {
    isFollowing = false;
    var snapped = trySnapToAvailableSocket();
    if (!snapped) {
        releaseSocket();
        isReturning = true;
    }
}

function trySnapToAvailableSocket() {
    if (!headTransform) {
        return false;
    }
    ensureOccupancyList();
    registerSockets();
    var regSockets = global[occupancyListKey].sockets;
    if (!regSockets || regSockets.length === 0) {
        return false;
    }
    var headPos = headTransform.getWorldPosition();
    var best = null;
    var bestDist = Number.POSITIVE_INFINITY;
    for (var i = 0; i < regSockets.length; i++) {
        var sock = regSockets[i];
        if (!sock) { continue; }
        if (isSocketOccupied(sock) && currentSocket !== sock) { continue; }
        var pos = sock.getTransform().getWorldPosition();
        var d = headPos.distance(pos);
        if (d <= script.snapDistance && d < bestDist) {
            bestDist = d;
            best = sock;
        }
    }
    if (best) {
        var snapPos = best.getTransform().getWorldPosition();
        headTransform.setWorldPosition(snapPos);
        if (handleTransform) {
            handleTransform.setWorldPosition(snapPos);
        }
        occupySocket(best);
        return true;
    }
    return false;
}

function updateFollow() {
    if (!headTransform || !handleTransform) {
        return;
    }

    if (isReturning) {
        updateReturn();
    } else if (isFollowing) {
        if (currentSocket) {
            var socketPosWhileDrag = currentSocket.getTransform().getWorldPosition();
            var handleDist = handleTransform.getWorldPosition().distance(socketPosWhileDrag);
            if (handleDist > script.snapDistance) {
                releaseSocket();
            }
        }
        var target = handleTransform.getWorldPosition();
        target = projectToStartLocalZ(target);
        target = applyConstraints(target);

        var current = headTransform.getWorldPosition();
        var lerpT = clamp(getDeltaTime() * script.followSpeed, 0, 1);
        var next = lerpVec3(current, target, lerpT);
        headTransform.setWorldPosition(next);

        trySnapToAvailableSocket();
    } else if (currentSocket) {
        var socketPos = currentSocket.getTransform().getWorldPosition();
        headTransform.setWorldPosition(socketPos);
        handleTransform.setWorldPosition(socketPos);
    } else {
        var clampedHead = applyConstraints(headTransform.getWorldPosition());
        headTransform.setWorldPosition(clampedHead);
    }

    if (script.debugText && baseTransform) {
        var distDisplay = headTransform.getWorldPosition().distance(baseTransform.getWorldPosition());
        script.debugText.text = distDisplay.toFixed(2);
    }

    updatePipe();
}

function updateReturn() {
    var targetHead = startHeadPos || headTransform.getWorldPosition();
    var targetHandle = startHandlePos || handleTransform.getWorldPosition();
    targetHead = applyConstraints(targetHead);
    targetHandle = applyConstraints(targetHandle);

    var lerpT = clamp(getDeltaTime() * script.followSpeed * 3, 0, 1);
    var headNext = lerpVec3(headTransform.getWorldPosition(), targetHead, lerpT);
    var handleNext = lerpVec3(handleTransform.getWorldPosition(), targetHandle, lerpT);
    headTransform.setWorldPosition(headNext);
    handleTransform.setWorldPosition(handleNext);

    var headClose = headNext.distance(targetHead) < 0.01;
    var handleClose = handleNext.distance(targetHandle) < 0.01;
    if (headClose && handleClose) {
        headTransform.setWorldPosition(targetHead);
        handleTransform.setWorldPosition(targetHandle);
        isReturning = false;
    }
}

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
    if (!pipeRMV || !headTransform || !baseTransform) {
        return;
    }
    ensurePipeBuilder();
    var builder = pipeBuilder;
    clearMesh(builder);

    var startPos = baseTransform.getWorldPosition();
    var endPos = headTransform.getWorldPosition();
    var faceCount = Math.max(3, script.wireFaceCount || 8);
    var radius = script.wireRadius || 0.25;
    var segments = Math.max(1, script.wireSegments || 1);

    var tube = new SegmentedTubeGenerator(builder, faceCount, radius);
    for (var i = 0; i < segments; i++) {
        var t0 = i / segments;
        var t1 = (i + 1) / segments;
        var p0 = vec3.lerp(startPos, endPos, t0);
        var p1 = vec3.lerp(startPos, endPos, t1);
        tube.addSegment(p0, p1);
    }

    if (builder.isValid()) {
        builder.updateMesh();
    }
}

function SegmentedTubeGenerator(builder, faceCount, radius) {
    this.addSegment = function (start, end) {
        var dir = start.sub(end).normalize();
        var startCircle = getCircle(start, dir);
        var endCircle = getCircle(end, dir);
        addFaces(start, startCircle, endCircle);
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

    function addFaces(startCenter, startCircle, endCircle) {
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
        }
    }
}

function init() {
    if (headTransform) {
        headParentTransform = headTransform.getParent();
        startLocalZ = headTransform.getLocalPosition().z;
    }
    if (headTransform) {
        startHeadPos = headTransform.getWorldPosition();
    }
    if (handleTransform) {
        startHandlePos = handleTransform.getWorldPosition();
    }
    socketsList = [];
    if (script.wireSockets && script.wireSockets.length > 0) {
        for (var i = 0; i < script.wireSockets.length; i++) {
            if (script.wireSockets[i]) {
                socketsList.push(script.wireSockets[i]);
            }
        }
    }
    registerSockets();

    if (script.wireHandle) {
        handleScript = script.wireHandle.getComponent("Component.ScriptComponent");
        if (handleScript) {
            if (handleScript.onTranslationStart) {
                handleScript.onTranslationStart.add(onHandleStart);
            }
            if (handleScript.onTranslationEnd) {
                handleScript.onTranslationEnd.add(onHandleEnd);
            }
        }
    }

    pipeObj = global.scene.createSceneObject("WirePipe");
    var pipeTransform = pipeObj.getTransform();
    pipeTransform.setWorldPosition(vec3.zero());
    pipeTransform.setWorldRotation(quat.quatIdentity());
    pipeTransform.setWorldScale(vec3.one());

    pipeRMV = pipeObj.getComponent("Component.RenderMeshVisual");
    if (!pipeRMV) {
        pipeRMV = pipeObj.createComponent("Component.RenderMeshVisual");
    }
    if (pipeRMV && script.wireMaterial) {
        pipeRMV.clearMaterials();
        pipeRMV.mainMaterial = script.wireMaterial;
    }
    pipeBuilder = null;

    updatePipe();
}

script.createEvent("UpdateEvent").bind(updateFollow);
script.createEvent("OnStartEvent").bind(init);
script.createEvent("OnDestroyEvent").bind(function () {
    releaseSocket();
    unregisterSockets();
});
