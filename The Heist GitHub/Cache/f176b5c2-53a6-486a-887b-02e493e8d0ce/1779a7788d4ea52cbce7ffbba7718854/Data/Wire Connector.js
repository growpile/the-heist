// @input Asset.Material wireMaterial
// @input int wireFaceCount = 8 {"widget":"slider","min":3,"max":24}
// @input float wireRadius = 0.25
// @input int wireSegments = 5 {"widget":"slider","min":1,"max":30}
// @input SceneObject wireHead
// @input SceneObject wireEnd
// @input SceneObject wireHandle
// @input float followSpeed = 10.0 "Follow Lerp Speed"
// @input Component.Text debugText
// @input float maxWireLength = 15.0 "Max Wire Length (cm)"
// @input float snapDistance = 0.5 "Snap Distance (cm)"
// @input SceneObject[] wireSockets
// @input vec3 raiseDirection = "{0,1,0}"
// @input float raiseOffset = 0.2

var baseTransform = script.getSceneObject().getTransform();
var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var endTransform = script.wireEnd ? script.wireEnd.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
var handleScript = null;
var pipeObj = null;
var pipeRMV = null;
var pipeBuilder = null;
var socketsList = [];
var currentSocket = null;
var isFollowing = false;
var occupancyListKey = "wireSocketRegistry";
var startLocalY = null;
var isReturning = false;
var startHeadPos = null;
var startHandlePos = null;
var wireRegistryKey = "wireLineRegistry";

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

function ensureWireRegistry() {
    if (!global[wireRegistryKey]) {
        global[wireRegistryKey] = [];
    }
}

function registerWire(startPos, endPos, segments) {
    ensureWireRegistry();
    var list = global[wireRegistryKey];
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].wire === script) {
            list.splice(i, 1);
        }
    }
    list.push({
        wire: script,
        start: startPos,
        end: endPos,
        segments: segments,
        length: startPos.distance(endPos)
    });
}

function unregisterWire() {
    ensureWireRegistry();
    var list = global[wireRegistryKey];
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].wire === script) {
            list.splice(i, 1);
        }
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

function applyConstraints(pos) {
    return clampToMaxLength(pos);
}

function enforceHeadLocalY() {
    if (!headTransform || startLocalY === null) {
        return;
    }
    var local = headTransform.getLocalPosition();
    if (local.y !== startLocalY) {
        headTransform.setLocalPosition(new vec3(local.x, startLocalY, local.z));
    }
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
    var snapInDistance = (script.snapDistance || 0) * 1.5;
    var best = null;
    var bestDist = Number.POSITIVE_INFINITY;
    for (var i = 0; i < regSockets.length; i++) {
        var sock = regSockets[i];
        if (!sock) { continue; }
        if (isSocketOccupied(sock) && currentSocket !== sock) { continue; }
        var pos = sock.getTransform().getWorldPosition();
        var d = headPos.distance(pos);
        if (d <= snapInDistance && d < bestDist) {
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

    if (!currentSocket) {
        enforceHeadLocalY();
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

    enforceHeadLocalY();
}

function getReturnOffset() {
    if (!baseTransform) {
        return vec3.zero();
    }
    var baseRot = baseTransform.getWorldRotation();
    return baseRot.multiplyVec3(vec3.up()).uniformScale(-1.25);
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
    if (!pipeRMV || !baseTransform) {
        return;
    }
    ensurePipeBuilder();
    var builder = pipeBuilder;
    clearMesh(builder);

    var startPos = baseTransform.getWorldPosition();
    var endPos = endTransform ? endTransform.getWorldPosition() :
        (headTransform ? headTransform.getWorldPosition() : startPos);
    var faceCount = Math.max(3, script.wireFaceCount || 8);
    var radius = script.wireRadius || 0.25;
    var segments = Math.max(1, script.wireSegments || 1);
    var raiseOffset = script.raiseOffset || 0;

    registerWire(startPos, endPos, segments);

    var tube = new SegmentedTubeGenerator(builder, faceCount, radius);
    var points = [];
    for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        points.push(vec3.lerp(startPos, endPos, t));
    }

    if (raiseOffset > 0) {
        var raiseIndices = getRaisePointIndices(startPos, endPos, segments);
        if (raiseIndices.length > 0) {
            var raiseDir = script.raiseDirection || vec3.zero();
            var raiseDirLen = raiseDir.length;
            if (raiseDirLen > 1e-5) {
                var baseRot = baseTransform.getWorldRotation();
                var worldRaise = baseRot.multiplyVec3(raiseDir.uniformScale(1 / raiseDirLen));
                var offset = worldRaise.uniformScale(raiseOffset);
                for (var r = 0; r < raiseIndices.length; r++) {
                    var idx = raiseIndices[r];
                    points[idx] = points[idx].add(offset);
                }
            }
        }
    }

    for (var j = 0; j < segments; j++) {
        tube.addSegment(points[j], points[j + 1]);
    }

    if (builder.isValid()) {
        builder.updateMesh();
    }
}

function getRaisePointIndices(startPos, endPos, segments) {
    ensureWireRegistry();
    var list = global[wireRegistryKey];
    var selfLen = startPos.distance(endPos);
    var best = null;
    var bestDist = Number.POSITIVE_INFINITY;
    for (var i = 0; i < list.length; i++) {
        var entry = list[i];
        if (!entry || entry.wire === script) { continue; }
        if (entry.length <= selfLen) { continue; }
        var res = closestSegmentParams(startPos, endPos, entry.start, entry.end);
        if (res.dist < bestDist) {
            bestDist = res.dist;
            best = res;
        }
    }
    if (!best) {
        return [];
    }
    var s = Math.floor(clamp(best.t, 0, 1) * segments);
    if (s >= segments) { s = segments - 1; }
    var indices = {};
    indices[s] = true;
    indices[s + 1] = true;
    indices[s + 2] = true;
    var out = [];
    for (var k in indices) {
        var idx = parseInt(k, 10);
        if (idx >= 0 && idx <= segments) {
            out.push(idx);
        }
    }
    return out;
}

function closestSegmentParams(a0, a1, b0, b1) {
    var d1 = a1.sub(a0);
    var d2 = b1.sub(b0);
    var r = a0.sub(b0);
    var a = d1.dot(d1);
    var e = d2.dot(d2);
    var f = d2.dot(r);
    var s = 0;
    var t = 0;
    if (a <= 1e-6 && e <= 1e-6) {
        return { t: 0, u: 0, dist: a0.distance(b0) };
    }
    if (a <= 1e-6) {
        s = 0;
        t = clamp(f / e, 0, 1);
    } else {
        var c = d1.dot(r);
        if (e <= 1e-6) {
            t = 0;
            s = clamp(-c / a, 0, 1);
        } else {
            var b = d1.dot(d2);
            var denom = a * e - b * b;
            if (denom !== 0) {
                s = clamp((b * f - c * e) / denom, 0, 1);
            } else {
                s = 0;
            }
            t = (b * s + f) / e;
            if (t < 0) {
                t = 0;
                s = clamp(-c / a, 0, 1);
            } else if (t > 1) {
                t = 1;
                s = clamp((b - c) / a, 0, 1);
            }
        }
    }
    var cp1 = a0.add(d1.uniformScale(s));
    var cp2 = b0.add(d2.uniformScale(t));
    return { t: s, u: t, dist: cp1.distance(cp2) };
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
        startLocalY = headTransform.getLocalPosition().y;
        startHeadPos = headTransform.getWorldPosition();
    }
    if (handleTransform) {
        startHandlePos = handleTransform.getWorldPosition();
    }
    var returnOffset = getReturnOffset();
    if (headTransform) {
        headTransform.setWorldPosition(headTransform.getWorldPosition().add(returnOffset));
    }
    if (handleTransform) {
        handleTransform.setWorldPosition(handleTransform.getWorldPosition().add(returnOffset));
    }
    if (startHeadPos) {
        startHeadPos = startHeadPos.add(returnOffset);
    }
    if (startHandlePos) {
        startHandlePos = startHandlePos.add(returnOffset);
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
    unregisterWire();
});
