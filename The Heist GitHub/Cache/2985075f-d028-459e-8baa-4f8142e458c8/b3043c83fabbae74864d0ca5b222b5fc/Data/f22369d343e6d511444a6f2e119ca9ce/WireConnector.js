"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WireConnector = void 0;
var __selfType = requireType("./WireConnector");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const OCCUPANCY_LIST_KEY = "wireSocketRegistry";
const WIRE_REGISTRY_KEY = "wireLineRegistry";
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
function rotateVec3ByQuat(q, v) {
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;
    const vx = v.x;
    const vy = v.y;
    const vz = v.z;
    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);
    return new vec3(vx + qw * tx + (qy * tz - qz * ty), vy + qw * ty + (qz * tx - qx * tz), vz + qw * tz + (qx * ty - qy * tx));
}
function inverseRotateVec3(q, v) {
    const invQ = new quat(-q.x, -q.y, -q.z, q.w);
    return rotateVec3ByQuat(invQ, v);
}
function worldToLocalPoint(transform, worldPoint) {
    if (!transform) {
        return worldPoint;
    }
    const basePos = transform.getWorldPosition();
    const baseRot = transform.getWorldRotation();
    const delta = worldPoint.sub(basePos);
    return inverseRotateVec3(baseRot, delta);
}
function localToWorldPoint(transform, localPoint) {
    if (!transform) {
        return localPoint;
    }
    const basePos = transform.getWorldPosition();
    const baseRot = transform.getWorldRotation();
    return basePos.add(rotateVec3ByQuat(baseRot, localPoint));
}
function lerpVec3(a, b, t) {
    return new vec3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
}
function cubicBezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return p0
        .uniformScale(uuu)
        .add(p1.uniformScale(3 * uu * t))
        .add(p2.uniformScale(3 * u * tt))
        .add(p3.uniformScale(ttt));
}
function closestSegmentParams(a0, a1, b0, b1) {
    const d1 = a1.sub(a0);
    const d2 = b1.sub(b0);
    const r = a0.sub(b0);
    const a = d1.dot(d1);
    const e = d2.dot(d2);
    const f = d2.dot(r);
    let s = 0;
    let t = 0;
    if (a <= 1e-6 && e <= 1e-6) {
        return { t: 0, u: 0, dist: a0.distance(b0) };
    }
    if (a <= 1e-6) {
        s = 0;
        t = clamp(f / e, 0, 1);
    }
    else {
        const c = d1.dot(r);
        if (e <= 1e-6) {
            t = 0;
            s = clamp(-c / a, 0, 1);
        }
        else {
            const b = d1.dot(d2);
            const denom = a * e - b * b;
            if (denom !== 0) {
                s = clamp((b * f - c * e) / denom, 0, 1);
            }
            else {
                s = 0;
            }
            t = (b * s + f) / e;
            if (t < 0) {
                t = 0;
                s = clamp(-c / a, 0, 1);
            }
            else if (t > 1) {
                t = 1;
                s = clamp((b - c) / a, 0, 1);
            }
        }
    }
    const cp1 = a0.add(d1.uniformScale(s));
    const cp2 = b0.add(d2.uniformScale(t));
    return { t: s, u: t, dist: cp1.distance(cp2) };
}
function getGlobalOccupancy() {
    const g = global;
    if (!g[OCCUPANCY_LIST_KEY]) {
        g[OCCUPANCY_LIST_KEY] = { sockets: [], occupancy: [] };
    }
    return g[OCCUPANCY_LIST_KEY];
}
function getGlobalWireRegistry() {
    const g = global;
    if (!g[WIRE_REGISTRY_KEY]) {
        g[WIRE_REGISTRY_KEY] = { list: [], nextOrder: 0 };
    }
    return g[WIRE_REGISTRY_KEY];
}
/**
 * Draggable wire with procedural tube mesh, socket snap, and overlap raise.
 * Disable legacy Wire Connector.js on the same object.
 */
let WireConnector = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var WireConnector = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.wireMaterial = this.wireMaterial;
            this.wireFaceCount = this.wireFaceCount;
            this.wireRadius = this.wireRadius;
            this.wireSegments = this.wireSegments;
            this.wireHead = this.wireHead;
            this.wireEnd = this.wireEnd;
            this.wireHandle = this.wireHandle;
            this.followSpeed = this.followSpeed;
            this.maxWireLength = this.maxWireLength;
            this.snapDistance = this.snapDistance;
            this.wireSockets = this.wireSockets;
            this.raiseDirection = this.raiseDirection;
            this.raiseOffset = this.raiseOffset;
            this.wireManager = this.wireManager;
            this.baseTransform = null;
            this.headTransform = null;
            this.endTransform = null;
            this.handleTransform = null;
            this.handleScript = null;
            this.pipeObj = null;
            this.pipeRMV = null;
            this.pipeBuilder = null;
            this.socketsList = [];
            this.currentSocket = null;
            this.isFollowing = false;
            this.startLocalY = null;
            this.isReturning = false;
            this.startHeadPos = null;
            this.startHandlePos = null;
            this.startHeadLocal = null;
            this.startHandleLocal = null;
            this.meshCooldownFrames = 0;
            this.isDisabled = false;
            this.suppressDisconnectSfx = false;
        }
        __initialize() {
            super.__initialize();
            this.wireMaterial = this.wireMaterial;
            this.wireFaceCount = this.wireFaceCount;
            this.wireRadius = this.wireRadius;
            this.wireSegments = this.wireSegments;
            this.wireHead = this.wireHead;
            this.wireEnd = this.wireEnd;
            this.wireHandle = this.wireHandle;
            this.followSpeed = this.followSpeed;
            this.maxWireLength = this.maxWireLength;
            this.snapDistance = this.snapDistance;
            this.wireSockets = this.wireSockets;
            this.raiseDirection = this.raiseDirection;
            this.raiseOffset = this.raiseOffset;
            this.wireManager = this.wireManager;
            this.baseTransform = null;
            this.headTransform = null;
            this.endTransform = null;
            this.handleTransform = null;
            this.handleScript = null;
            this.pipeObj = null;
            this.pipeRMV = null;
            this.pipeBuilder = null;
            this.socketsList = [];
            this.currentSocket = null;
            this.isFollowing = false;
            this.startLocalY = null;
            this.isReturning = false;
            this.startHeadPos = null;
            this.startHandlePos = null;
            this.startHeadLocal = null;
            this.startHandleLocal = null;
            this.meshCooldownFrames = 0;
            this.isDisabled = false;
            this.suppressDisconnectSfx = false;
        }
        wireScriptRef() {
            return this;
        }
        onAwake() {
            this.baseTransform = this.getSceneObject().getTransform();
            this.headTransform = this.wireHead ? this.wireHead.getTransform() : null;
            this.endTransform = this.wireEnd ? this.wireEnd.getTransform() : null;
            this.handleTransform = this.wireHandle ? this.wireHandle.getTransform() : null;
            this.createEvent("UpdateEvent").bind(() => this.updateFollow());
            this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        }
        init() {
            if (this.headTransform) {
                this.startLocalY = this.headTransform.getLocalPosition().y;
                this.startHeadPos = this.headTransform.getWorldPosition();
                this.startHeadLocal = this.baseTransform
                    ? worldToLocalPoint(this.baseTransform, this.startHeadPos)
                    : this.headTransform.getLocalPosition();
            }
            if (this.handleTransform) {
                this.startHandlePos = this.handleTransform.getWorldPosition();
                this.startHandleLocal = this.baseTransform
                    ? worldToLocalPoint(this.baseTransform, this.startHandlePos)
                    : this.handleTransform.getLocalPosition();
            }
            const returnOffset = this.getReturnOffset();
            if (this.headTransform) {
                this.headTransform.setWorldPosition(this.headTransform.getWorldPosition().add(returnOffset));
            }
            if (this.handleTransform) {
                this.handleTransform.setWorldPosition(this.handleTransform.getWorldPosition().add(returnOffset));
            }
            if (this.startHeadPos) {
                this.startHeadPos = this.startHeadPos.add(returnOffset);
            }
            if (this.startHandlePos) {
                this.startHandlePos = this.startHandlePos.add(returnOffset);
            }
            if (this.startHeadLocal && this.baseTransform) {
                const basePos = this.baseTransform.getWorldPosition();
                const localOffset = worldToLocalPoint(this.baseTransform, basePos.add(returnOffset)).sub(worldToLocalPoint(this.baseTransform, basePos));
                this.startHeadLocal = this.startHeadLocal.add(localOffset);
            }
            if (this.startHandleLocal && this.baseTransform) {
                const basePos = this.baseTransform.getWorldPosition();
                const localOffset = worldToLocalPoint(this.baseTransform, basePos.add(returnOffset)).sub(worldToLocalPoint(this.baseTransform, basePos));
                this.startHandleLocal = this.startHandleLocal.add(localOffset);
            }
            this.socketsList = [];
            for (const socket of this.wireSockets) {
                if (socket) {
                    this.socketsList.push(socket);
                }
            }
            this.registerSockets();
            if (this.wireHandle) {
                this.handleScript = this.wireHandle.getComponent("Component.ScriptComponent");
                if (this.handleScript) {
                    this.handleScript.onTranslationStart?.add(() => this.onHandleStart());
                    this.handleScript.onTranslationEnd?.add(() => this.onHandleEnd());
                }
            }
            this.pipeObj = global.scene.createSceneObject("WirePipe");
            if (this.baseTransform) {
                this.pipeObj.setParent(this.baseTransform.getSceneObject());
            }
            const pipeTransform = this.pipeObj.getTransform();
            pipeTransform.setLocalPosition(vec3.zero());
            pipeTransform.setLocalRotation(quat.quatIdentity());
            pipeTransform.setLocalScale(vec3.one());
            this.pipeRMV = this.pipeObj.getComponent("Component.RenderMeshVisual");
            if (!this.pipeRMV) {
                this.pipeRMV = this.pipeObj.createComponent("Component.RenderMeshVisual");
            }
            if (this.pipeRMV && this.wireMaterial) {
                this.pipeRMV.clearMaterials();
                this.pipeRMV.mainMaterial = this.wireMaterial.clone();
            }
            this.setWireRimEnabled(false);
            this.pipeBuilder = null;
            this.updatePipe();
        }
        disconnect(silent) {
            this.suppressDisconnectSfx = !!silent;
            if (this.isDisabled) {
                return;
            }
            this.releaseSocket();
            this.isFollowing = false;
            this.isReturning = true;
        }
        returnConnections() {
            const manager = this.wireManager;
            if (manager?.getOccupancy) {
                return manager.getOccupancy();
            }
            const list = getGlobalOccupancy().occupancy || [];
            const result = [];
            for (const entry of list) {
                if (entry?.socket && entry.wire) {
                    result.push({ socket: entry.socket, wire: entry.wire });
                }
            }
            return result;
        }
        setManager(manager) {
            this.wireManager = manager;
        }
        disable() {
            if (this.isDisabled) {
                return;
            }
            this.isDisabled = true;
            this.isFollowing = false;
            this.isReturning = false;
            this.releaseSocket();
            // Tutorial insta-complete can run before animationFinished/init().
            if (!this.pipeObj) {
                return;
            }
            if (this.handleScript?.enabled !== undefined) {
                this.handleScript.enabled = false;
            }
            if (this.wireHandle) {
                this.wireHandle.enabled = false;
                this.wireHandle.destroy();
            }
        }
        onDestroy() {
            this.releaseSocket();
            this.unregisterSockets();
            this.unregisterWire();
        }
        getManager() {
            return this.wireManager ?? null;
        }
        registerSockets() {
            const manager = this.getManager();
            if (manager?.registerSockets) {
                manager.registerSockets(this.socketsList);
                return;
            }
            const reg = getGlobalOccupancy().sockets;
            for (const s of this.socketsList) {
                if (!s) {
                    continue;
                }
                if (reg.indexOf(s) < 0) {
                    reg.push(s);
                }
            }
        }
        unregisterSockets() {
            const manager = this.getManager();
            if (manager?.unregisterSockets) {
                manager.unregisterSockets(this.socketsList);
                return;
            }
            const reg = getGlobalOccupancy().sockets;
            for (let i = reg.length - 1; i >= 0; i--) {
                if (this.socketsList.indexOf(reg[i]) !== -1) {
                    reg.splice(i, 1);
                }
            }
        }
        isSocketOccupied(socket) {
            const manager = this.getManager();
            if (manager?.isSocketOccupied) {
                return manager.isSocketOccupied(socket);
            }
            const list = getGlobalOccupancy().occupancy;
            return list.some((entry) => entry.socket === socket);
        }
        occupySocket(socket) {
            if (this.currentSocket === socket) {
                return;
            }
            const manager = this.getManager();
            if (manager?.occupySocket) {
                manager.occupySocket(socket, this.wireScriptRef());
                this.currentSocket = socket;
                this.setWireRimEnabled(true);
                return;
            }
            this.releaseSocket();
            getGlobalOccupancy().occupancy.push({ socket, wire: this.wireScriptRef() });
            this.currentSocket = socket;
            this.setWireRimEnabled(true);
        }
        releaseSocket() {
            const manager = this.getManager();
            if (manager?.releaseSocket) {
                manager.releaseSocket(this.wireScriptRef());
                this.currentSocket = null;
                this.setWireRimEnabled(false);
                this.suppressDisconnectSfx = false;
                return;
            }
            const list = getGlobalOccupancy().occupancy;
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].wire === this.wireScriptRef()) {
                    list.splice(i, 1);
                }
            }
            this.currentSocket = null;
            this.setWireRimEnabled(false);
            this.suppressDisconnectSfx = false;
        }
        setWireRimEnabled(enabled) {
            if (!this.pipeRMV?.mainMaterial) {
                return;
            }
            const mat = this.pipeRMV.mainMaterial;
            if (mat.mainPass?.enableRim !== undefined) {
                mat.mainPass.enableRim = enabled;
            }
            else if (mat.enableRim !== undefined) {
                ;
                mat.enableRim = enabled;
            }
        }
        clampToMaxLength(pos) {
            if (!this.baseTransform) {
                return pos;
            }
            const basePos = this.baseTransform.getWorldPosition();
            const dist = pos.distance(basePos);
            const maxLen = this.maxWireLength || 0;
            if (maxLen > 0 && dist > maxLen) {
                const dir = pos.sub(basePos).normalize();
                return basePos.add(dir.uniformScale(maxLen));
            }
            return pos;
        }
        applyConstraints(pos) {
            return this.clampToMaxLength(pos);
        }
        enforceHeadLocalY() {
            if (!this.headTransform || this.startLocalY === null) {
                return;
            }
            const local = this.headTransform.getLocalPosition();
            if (local.y !== this.startLocalY) {
                this.headTransform.setLocalPosition(new vec3(local.x, this.startLocalY, local.z));
            }
        }
        onHandleStart() {
            if (this.isDisabled) {
                return;
            }
            this.isFollowing = true;
            this.isReturning = false;
            this.releaseSocket();
        }
        onHandleEnd() {
            if (this.isDisabled) {
                return;
            }
            this.isFollowing = false;
            const snapped = this.trySnapToAvailableSocket();
            if (snapped) {
                global.playSfx(16, 1, global.appState.checkStorage("masterVolume") * 0.8);
            }
            if (!snapped) {
                this.releaseSocket();
                this.isReturning = true;
            }
        }
        trySnapToAvailableSocket() {
            if (!this.headTransform) {
                return false;
            }
            this.registerSockets();
            let regSockets = null;
            const manager = this.getManager();
            if (manager?.getSockets) {
                regSockets = manager.getSockets();
            }
            else {
                regSockets = getGlobalOccupancy().sockets;
            }
            if (!regSockets || regSockets.length === 0) {
                return false;
            }
            const headPos = this.headTransform.getWorldPosition();
            const snapInDistance = (this.snapDistance || 0) * 1.5;
            let best = null;
            let bestDist = Number.POSITIVE_INFINITY;
            for (const sock of regSockets) {
                if (!sock) {
                    continue;
                }
                if (this.isSocketOccupied(sock) && this.currentSocket !== sock) {
                    continue;
                }
                const pos = sock.getTransform().getWorldPosition();
                const d = headPos.distance(pos);
                if (d <= snapInDistance && d < bestDist) {
                    bestDist = d;
                    best = sock;
                }
            }
            if (!best) {
                return false;
            }
            if (this.currentSocket === best) {
                const currentPos = best.getTransform().getWorldPosition();
                this.headTransform.setWorldPosition(currentPos);
                if (this.handleTransform) {
                    this.handleTransform.setWorldPosition(currentPos);
                }
                return true;
            }
            const snapPos = best.getTransform().getWorldPosition();
            this.headTransform.setWorldPosition(snapPos);
            if (this.handleTransform) {
                this.handleTransform.setWorldPosition(snapPos);
            }
            this.occupySocket(best);
            return true;
        }
        updateFollow() {
            if (this.isDisabled || !this.headTransform || !this.handleTransform) {
                return;
            }
            if (this.isReturning) {
                this.updateReturn();
            }
            else if (this.isFollowing) {
                if (this.currentSocket) {
                    const socketPosWhileDrag = this.currentSocket.getTransform().getWorldPosition();
                    const handleDist = this.handleTransform
                        .getWorldPosition()
                        .distance(socketPosWhileDrag);
                    const releaseDist = (this.snapDistance || 0) * 1.5;
                    if (handleDist > releaseDist) {
                        this.releaseSocket();
                    }
                }
                let target = this.handleTransform.getWorldPosition();
                target = this.applyConstraints(target);
                const current = this.headTransform.getWorldPosition();
                const lerpT = clamp(getDeltaTime() * this.followSpeed, 0, 1);
                const next = lerpVec3(current, target, lerpT);
                this.headTransform.setWorldPosition(next);
                this.trySnapToAvailableSocket();
            }
            else if (this.currentSocket) {
                const socketPos = this.currentSocket.getTransform().getWorldPosition();
                this.headTransform.setWorldPosition(socketPos);
                this.handleTransform.setWorldPosition(socketPos);
            }
            else {
                const clampedHead = this.applyConstraints(this.headTransform.getWorldPosition());
                this.headTransform.setWorldPosition(clampedHead);
            }
            if (!this.currentSocket) {
                this.enforceHeadLocalY();
            }
            const shouldUpdate = this.isFollowing ||
                this.isReturning ||
                !!this.currentSocket ||
                this.meshCooldownFrames > 0;
            if (shouldUpdate) {
                this.updatePipe();
                if (!this.isFollowing &&
                    !this.isReturning &&
                    !this.currentSocket &&
                    this.meshCooldownFrames > 0) {
                    this.meshCooldownFrames--;
                }
            }
        }
        updateReturn() {
            if (!this.headTransform || !this.handleTransform) {
                return;
            }
            let targetHead = this.startHeadPos || this.headTransform.getWorldPosition();
            let targetHandle = this.startHandlePos || this.handleTransform.getWorldPosition();
            if (this.startHeadLocal && this.baseTransform) {
                targetHead = localToWorldPoint(this.baseTransform, this.startHeadLocal);
            }
            if (this.startHandleLocal && this.baseTransform) {
                targetHandle = localToWorldPoint(this.baseTransform, this.startHandleLocal);
            }
            targetHead = this.applyConstraints(targetHead);
            targetHandle = this.applyConstraints(targetHandle);
            const lerpT = clamp(getDeltaTime() * this.followSpeed * 3, 0, 1);
            const headNext = lerpVec3(this.headTransform.getWorldPosition(), targetHead, lerpT);
            const handleNext = lerpVec3(this.handleTransform.getWorldPosition(), targetHandle, lerpT);
            this.headTransform.setWorldPosition(headNext);
            this.handleTransform.setWorldPosition(handleNext);
            const headClose = headNext.distance(targetHead) < 0.01;
            const handleClose = handleNext.distance(targetHandle) < 0.01;
            if (headClose && handleClose) {
                this.headTransform.setWorldPosition(targetHead);
                this.handleTransform.setWorldPosition(targetHandle);
                this.isReturning = false;
                this.meshCooldownFrames = 8;
            }
            this.enforceHeadLocalY();
        }
        getReturnOffset() {
            if (!this.baseTransform) {
                return vec3.zero();
            }
            const baseRot = this.baseTransform.getWorldRotation();
            return baseRot.multiplyVec3(vec3.up()).uniformScale(-1.25);
        }
        ensurePipeBuilder() {
            if (!this.pipeBuilder) {
                this.pipeBuilder = new MeshBuilder([
                    { name: "position", components: 3 },
                    { name: "texture0", components: 2 },
                    { name: "normal", components: 3, normalized: true }
                ]);
                this.pipeBuilder.topology = MeshTopology.Triangles;
                this.pipeBuilder.indexType = MeshIndexType.UInt16;
            }
            if (this.pipeRMV && this.pipeBuilder && this.pipeRMV.mesh !== this.pipeBuilder.getMesh()) {
                this.pipeRMV.mesh = this.pipeBuilder.getMesh();
            }
        }
        clearMesh(builder) {
            const vCount = builder.getVerticesCount();
            const iCount = builder.getIndicesCount();
            if (vCount > 0) {
                builder.eraseVertices(0, vCount);
            }
            if (iCount > 0) {
                builder.eraseIndices(0, iCount);
            }
        }
        updatePipe() {
            if (!this.pipeRMV || !this.baseTransform) {
                return;
            }
            this.ensurePipeBuilder();
            const builder = this.pipeBuilder;
            this.clearMesh(builder);
            const startPosWorld = this.baseTransform.getWorldPosition();
            const endPosWorld = this.endTransform
                ? this.endTransform.getWorldPosition()
                : this.headTransform
                    ? this.headTransform.getWorldPosition()
                    : startPosWorld;
            const faceCount = Math.max(3, this.wireFaceCount || 8);
            const radius = this.wireRadius || 0.25;
            const segments = Math.max(1, this.wireSegments || 1);
            const raiseOffset = this.raiseOffset || 0;
            this.registerWire(startPosWorld, endPosWorld, segments);
            const startPos = worldToLocalPoint(this.baseTransform, startPosWorld);
            const endPos = worldToLocalPoint(this.baseTransform, endPosWorld);
            let points = this.buildSmoothPath(startPos, endPos, segments, radius);
            if (raiseOffset > 0) {
                const raiseWeights = this.getRaisePointWeights(startPosWorld, endPosWorld, segments);
                const raiseKeys = Object.keys(raiseWeights);
                if (raiseKeys.length > 0) {
                    const raiseDir = this.raiseDirection || vec3.zero();
                    const raiseDirLen = raiseDir.length;
                    if (raiseDirLen > 1e-5) {
                        for (const key of raiseKeys) {
                            const idx = parseInt(key, 10);
                            const weight = raiseWeights[key];
                            const offset = raiseDir.uniformScale((raiseOffset * weight) / raiseDirLen);
                            points[idx] = points[idx].add(offset);
                        }
                    }
                }
            }
            this.buildTubeMesh(builder, points, faceCount, radius);
            if (builder.isValid()) {
                builder.updateMesh();
            }
        }
        buildSmoothPath(startPos, endPos, segments, radius) {
            const path = [];
            const dir = endPos.sub(startPos);
            const len = dir.length;
            if (len < 1e-5) {
                path.push(startPos);
                path.push(endPos);
                return path;
            }
            const normDir = dir.normalize();
            const elbowCurvature = 0.5;
            const controlA = startPos.add(normDir.uniformScale(radius * elbowCurvature));
            const controlB = endPos.sub(normDir.uniformScale(radius * elbowCurvature));
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                path.push(cubicBezier(startPos, controlA, controlB, endPos, t));
            }
            return path;
        }
        buildTubeMesh(builder, path, faceCount, radius) {
            if (!path || path.length < 2) {
                return;
            }
            const totalRings = path.length;
            const vertsPerRing = faceCount + 1;
            for (let i = 0; i < totalRings; i++) {
                const center = path[i];
                let forward;
                if (i === 0) {
                    forward = path[i + 1].sub(center);
                }
                else if (i === totalRings - 1) {
                    forward = center.sub(path[i - 1]);
                }
                else {
                    forward = path[i + 1].sub(path[i - 1]);
                }
                forward = forward.normalize();
                let globalUp = vec3.up();
                if (Math.abs(forward.dot(globalUp)) > 0.99) {
                    globalUp = vec3.right();
                }
                const right = forward.cross(globalUp).normalize();
                const up = right.cross(forward).normalize();
                for (let j = 0; j <= faceCount; j++) {
                    const angle = (j / faceCount) * Math.PI * 2;
                    const dir = right.uniformScale(Math.cos(angle)).add(up.uniformScale(Math.sin(angle)));
                    const pos = center.add(dir.uniformScale(radius));
                    const uv = [j / faceCount, i / (totalRings - 1)];
                    builder.appendVertices([
                        [pos.x, pos.y, pos.z],
                        [uv[0], uv[1]],
                        [dir.x, dir.y, dir.z]
                    ]);
                }
            }
            for (let r = 0; r < totalRings - 1; r++) {
                for (let c = 0; c < faceCount; c++) {
                    const i0 = r * vertsPerRing + c;
                    const i1 = (r + 1) * vertsPerRing + c;
                    const i2 = (r + 1) * vertsPerRing + c + 1;
                    const i3 = r * vertsPerRing + c + 1;
                    builder.appendIndices([i0, i1, i3]);
                    builder.appendIndices([i1, i2, i3]);
                }
            }
        }
        registerWire(startPos, endPos, segments) {
            const registry = getGlobalWireRegistry();
            const list = registry.list;
            const wire = this.wireScriptRef();
            for (const entry of list) {
                if (entry.wire === wire) {
                    entry.start = startPos;
                    entry.end = endPos;
                    entry.segments = segments;
                    entry.length = startPos.distance(endPos);
                    return;
                }
            }
            list.push({
                wire,
                start: startPos,
                end: endPos,
                segments,
                length: startPos.distance(endPos),
                order: registry.nextOrder++
            });
        }
        unregisterWire() {
            const list = getGlobalWireRegistry().list;
            const wire = this.wireScriptRef();
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].wire === wire) {
                    list.splice(i, 1);
                }
            }
        }
        getRaisePointWeights(startPos, endPos, segments) {
            const list = getGlobalWireRegistry().list;
            const wire = this.wireScriptRef();
            const selfLen = startPos.distance(endPos);
            let selfOrder = -1;
            for (const entry of list) {
                if (entry?.wire === wire) {
                    selfOrder = entry.order;
                    break;
                }
            }
            let best = null;
            let bestDist = Number.POSITIVE_INFINITY;
            for (const entry of list) {
                if (!entry || entry.wire === wire) {
                    continue;
                }
                if (entry.length < selfLen) {
                    continue;
                }
                if (entry.length === selfLen && selfOrder <= entry.order) {
                    continue;
                }
                const res = closestSegmentParams(startPos, endPos, entry.start, entry.end);
                if (res.dist < bestDist) {
                    bestDist = res.dist;
                    best = res;
                }
            }
            if (!best) {
                return {};
            }
            const overlapThreshold = (this.wireRadius || 0.25) * 2;
            if (best.dist > overlapThreshold) {
                return {};
            }
            let s = Math.floor(clamp(best.t, 0, 1) * segments);
            if (s >= segments) {
                s = segments - 1;
            }
            const weights = {};
            const main = [s, s + 1, s + 2];
            for (const idx of main) {
                if (idx >= 0 && idx <= segments && idx > 1 && idx < segments - 1) {
                    weights[idx] = 1;
                }
            }
            const falloff = [s - 2, s - 1, s + 3, s + 4];
            for (const fIdx of falloff) {
                if (fIdx >= 0 && fIdx <= segments && fIdx > 1 && fIdx < segments - 1) {
                    if (!weights[fIdx]) {
                        weights[fIdx] = 0.5;
                    }
                }
            }
            return weights;
        }
    };
    __setFunctionName(_classThis, "WireConnector");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WireConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WireConnector = _classThis;
})();
exports.WireConnector = WireConnector;
//# sourceMappingURL=WireConnector.js.map