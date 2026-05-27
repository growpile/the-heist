// @input SceneObject wireHead
// @input SceneObject wireHandle
// @input float followSpeed = 10.0 "Follow Lerp Speed"
// @input Component.Text debugText
// @input SceneObject wireStartOrigin
// @input float wireLength = 15.0 "Max Wire Length (cm)"
// @input float snapToDistance = 1.0 "Connect Threshold (cm)"
// @input SceneObject wireEndSocket
// @input SceneObject[] wireEndSockets
// @input Asset.Material pipeMaterial
// @input int pipeFaceCount = 8 {"widget":"slider","min":3,"max":24}
// @input float pipeRadius = 0.5
// @input int pipeSegments = 6 {"widget":"slider","min":1,"max":30}
// @input float pipeStagger = 0.6 "Pipe Center Stagger 0-1"
//@input mat2 mymat2
/** @type {mat2} */
var mymat2 = script.mymat2;

var headTransform = script.wireHead ? script.wireHead.getTransform() : null;
var handleTransform = script.wireHandle ? script.wireHandle.getTransform() : null;
var handleManipulation = null;
var originTransform = script.wireStartOrigin ? script.wireStartOrigin.getTransform() : null;
var pipeRMV = null;
var pipeBuilder = null;
var pipeObj = null;
var pipeTransform = null;
var socketsList = [];
var currentSocket = null;

var planeTransform = script.getSceneObject().getTransform();
var baseLocalPos = headTransform ? headTransform.getLocalPosition() : null;
var following = false;
var returning = false;
var startHeadPos = headTransform ? headTransform.getWorldPosition() : null;
var startHandlePos = handleTransform ? handleTransform.getWorldPosition() : null;
var lastPipePoints = null;
var occupancyListKey = "wireSocketRegistry";

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
    // Pipe object is unparented; use world positions directly
    return worldPos;
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
}

function onHandleTriggerEnd() {
    following = false;
    if (!handleTransform || !headTransform) {
        return;
    }

    var snapped = trySnapToAvailableSocket();

    if (!snapped) {
        returning = true;
        releaseSocket();
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
    var lerpT = clamp(getDeltaTime() * script.followSpeed, 0, 1);
    var next = lerpVec3(current, targetWorld, lerpT);
    headTransform.setWorldPosition(next);

    // Clamp along origin's local Y so head cannot go above originY - 3 (in origin's space)
    if (originTransform) {
        var headPosClamp = headTransform.getWorldPosition();
        var originPos = originTransform.getWorldPosition();
        var originUp = originTransform.getWorldRotation().multiplyVec3(vec3.up()).normalize();
        var planePoint = originPos.add(originUp.uniformScale(-1)); // plane 3 units below along local Y
        var signedDist = headPosClamp.sub(planePoint).dot(originUp);
        if (signedDist > 0) {
            headPosClamp = headPosClamp.sub(originUp.uniformScale(signedDist));
            headTransform.setWorldPosition(headPosClamp);
        }
    }

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
        if (d2 <= script.snapToDistance) {
            headTransform.setWorldPosition(socketPos);
        }
    }

    if (originTransform && script.debugText) {
        var distDisplay = headTransform.getWorldPosition().distance(originTransform.getWorldPosition());
        script.debugText.text = distDisplay.toFixed(2);
    }

    // Log head local position while moving
    if (headTransform && following) {
        var lp = headTransform.getLocalPosition();
        print("[WireConnector] Head local pos: (" + lp.x.toFixed(3) + ", " + lp.y.toFixed(3) + ", " + lp.z.toFixed(3) + ")");
    }

    updatePipe();
}

function updateReturn() {
    if (!headTransform || !handleTransform) {
        returning = false;
        return;
    }
    var targetPos;
    if (originTransform) {
        var originPos = originTransform.getWorldPosition();
        var originUp = originTransform.getWorldRotation().multiplyVec3(vec3.up()).normalize();
        targetPos = originPos.add(originUp.uniformScale(-1)); // 1 unit below origin along local Y
    } else {
        targetPos = startHeadPos || headTransform.getWorldPosition();
    }
    var lerpT = clamp(getDeltaTime() * script.followSpeed, 0, 1);

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
        releaseSocket();
    }

    updatePipe();
}

function init() {
    socketsList = [];
    if (script.wireEndSockets && script.wireEndSockets.length > 0) {
        for (var i = 0; i < script.wireEndSockets.length; i++) {
            if (script.wireEndSockets[i]) {
                socketsList.push(script.wireEndSockets[i]);
            }
        }
    }
    if (script.wireEndSocket) {
        socketsList.push(script.wireEndSocket);
    }
    registerSockets();

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
    pipeObj = global.scene.createSceneObject("WirePipe");
    // leave unparented so world positions map directly to mesh data
    pipeTransform = pipeObj.getTransform();
    pipeTransform.setWorldPosition(vec3.zero());
    pipeTransform.setWorldRotation(quat.quatIdentity());
    pipeTransform.setWorldScale(vec3.one());

    pipeRMV = pipeObj.getComponent("Component.RenderMeshVisual");
    if (!pipeRMV) {
        pipeRMV = pipeObj.createComponent("Component.RenderMeshVisual");
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
script.createEvent("OnDestroyEvent").bind(function () {
    releaseSocket();
});

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

function trySnapToAvailableSocket() {
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
        if (d <= script.snapToDistance && d < bestDist) {
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

    var startPos = originTransform.getWorldPosition();
    var endPos = headTransform.getWorldPosition();
    var faceCount = Math.max(3, script.pipeFaceCount || 8);
    var radius = script.pipeRadius || 0.5;
    var segments = Math.max(1, script.pipeSegments || 1);

    var tube = new SegmentedTubeGenerator(builder, faceCount, radius);
    var points = [];
    for (var i = 0; i <= segments; i++) {
        var t = segments === 0 ? 0 : i / segments; // uniform spacing
        var p = vec3.lerp(startPos, endPos, t);
        points.push(p);
    }
    for (var j = 0; j < points.length - 1; j++) {
        tube.addSegment(points[j], points[j + 1], j !== 0);
    }

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
