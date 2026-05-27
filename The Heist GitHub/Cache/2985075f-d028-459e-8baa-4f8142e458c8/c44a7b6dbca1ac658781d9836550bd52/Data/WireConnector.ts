import {WireFuseboxManager} from "./Modules/WireFuseboxModule"

const OCCUPANCY_LIST_KEY = "wireSocketRegistry"
const WIRE_REGISTRY_KEY = "wireLineRegistry"

type OccupancyEntry = {socket: SceneObject; wire: ScriptComponent}

type WireRegistryEntry = {
  wire: ScriptComponent
  start: vec3
  end: vec3
  segments: number
  length: number
  order: number
}

type GlobalOccupancyRegistry = {
  sockets: SceneObject[]
  occupancy: OccupancyEntry[]
}

type GlobalWireRegistry = {
  list: WireRegistryEntry[]
  nextOrder: number
}

type HandleScript = ScriptComponent & {
  onTranslationStart?: {add: (fn: () => void) => void}
  onTranslationEnd?: {add: (fn: () => void) => void}
  enabled?: boolean
}

type SegmentClosest = {t: number; u: number; dist: number}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function rotateVec3ByQuat(q: quat, v: vec3): vec3 {
  const qx = q.x
  const qy = q.y
  const qz = q.z
  const qw = q.w
  const vx = v.x
  const vy = v.y
  const vz = v.z
  const tx = 2 * (qy * vz - qz * vy)
  const ty = 2 * (qz * vx - qx * vz)
  const tz = 2 * (qx * vy - qy * vx)
  return new vec3(
    vx + qw * tx + (qy * tz - qz * ty),
    vy + qw * ty + (qz * tx - qx * tz),
    vz + qw * tz + (qx * ty - qy * tx)
  )
}

function inverseRotateVec3(q: quat, v: vec3): vec3 {
  const invQ = new quat(-q.x, -q.y, -q.z, q.w)
  return rotateVec3ByQuat(invQ, v)
}

function worldToLocalPoint(transform: Transform, worldPoint: vec3): vec3 {
  if (!transform) {
    return worldPoint
  }
  const basePos = transform.getWorldPosition()
  const baseRot = transform.getWorldRotation()
  const delta = worldPoint.sub(basePos)
  return inverseRotateVec3(baseRot, delta)
}

function localToWorldPoint(transform: Transform, localPoint: vec3): vec3 {
  if (!transform) {
    return localPoint
  }
  const basePos = transform.getWorldPosition()
  const baseRot = transform.getWorldRotation()
  return basePos.add(rotateVec3ByQuat(baseRot, localPoint))
}

/** Project a world point into the wire base's local XY plane (reel → head). */
function toWirePlaneLocal(transform: Transform, worldPoint: vec3): vec3 {
  const local = worldToLocalPoint(transform, worldPoint)
  return new vec3(local.x, local.y, 0)
}

const RETURN_OFFSET_LOCAL = 1.25

function lerpVec3(a: vec3, b: vec3, t: number): vec3 {
  return new vec3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t)
}

function cubicBezier(p0: vec3, p1: vec3, p2: vec3, p3: vec3, t: number): vec3 {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t
  return p0
    .uniformScale(uuu)
    .add(p1.uniformScale(3 * uu * t))
    .add(p2.uniformScale(3 * u * tt))
    .add(p3.uniformScale(ttt))
}

function closestSegmentParams(a0: vec3, a1: vec3, b0: vec3, b1: vec3): SegmentClosest {
  const d1 = a1.sub(a0)
  const d2 = b1.sub(b0)
  const r = a0.sub(b0)
  const a = d1.dot(d1)
  const e = d2.dot(d2)
  const f = d2.dot(r)
  let s = 0
  let t = 0

  if (a <= 1e-6 && e <= 1e-6) {
    return {t: 0, u: 0, dist: a0.distance(b0)}
  }
  if (a <= 1e-6) {
    s = 0
    t = clamp(f / e, 0, 1)
  } else {
    const c = d1.dot(r)
    if (e <= 1e-6) {
      t = 0
      s = clamp(-c / a, 0, 1)
    } else {
      const b = d1.dot(d2)
      const denom = a * e - b * b
      if (denom !== 0) {
        s = clamp((b * f - c * e) / denom, 0, 1)
      } else {
        s = 0
      }
      t = (b * s + f) / e
      if (t < 0) {
        t = 0
        s = clamp(-c / a, 0, 1)
      } else if (t > 1) {
        t = 1
        s = clamp((b - c) / a, 0, 1)
      }
    }
  }
  const cp1 = a0.add(d1.uniformScale(s))
  const cp2 = b0.add(d2.uniformScale(t))
  return {t: s, u: t, dist: cp1.distance(cp2)}
}

function getGlobalOccupancy(): GlobalOccupancyRegistry {
  const g = global as unknown as Record<string, GlobalOccupancyRegistry>
  if (!g[OCCUPANCY_LIST_KEY]) {
    g[OCCUPANCY_LIST_KEY] = {sockets: [], occupancy: []}
  }
  return g[OCCUPANCY_LIST_KEY]
}

function getGlobalWireRegistry(): GlobalWireRegistry {
  const g = global as unknown as Record<string, GlobalWireRegistry>
  if (!g[WIRE_REGISTRY_KEY]) {
    g[WIRE_REGISTRY_KEY] = {list: [], nextOrder: 0}
  }
  return g[WIRE_REGISTRY_KEY]
}

export type WireConnectorScript = ScriptComponent & {
  wireMaterial?: Material
  wireManager?: ScriptComponent
  setManager?: (manager: ScriptComponent) => void
  init?: () => void
  disconnect?: (silent?: boolean) => void
  disable?: () => void
  returnConnections?: () => OccupancyEntry[]
}

/**
 * Draggable wire with procedural tube mesh, socket snap, and overlap raise.
 * Disable legacy Wire Connector.js on the same object.
 */
@component
export class WireConnector extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Wire Material</span>')

  @input
  @allowUndefined
  @hint("Assigned at runtime by WireFuseboxModule; may also set in Inspector.")
  wireMaterial: Material

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Mesh</span>')

  @input
  @widget(new SliderWidget(3, 24, 1))
  wireFaceCount = 8

  @input
  wireRadius = 0.25

  @input
  @widget(new SliderWidget(1, 30, 1))
  wireSegments = 5

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Transforms</span>')

  @input
  @allowUndefined
  wireHead: SceneObject

  @input
  @allowUndefined
  wireEnd: SceneObject

  @input
  @allowUndefined
  wireHandle: SceneObject

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Drag & Snap</span>')

  @input
  @hint("Follow lerp speed.")
  followSpeed = 10

  @input
  @hint("Max wire length (cm).")
  maxWireLength = 15

  @input
  @hint("Snap distance (cm).")
  snapDistance = 0.5

  @input
  wireSockets: SceneObject[] = []

  @input
  raiseDirection = new vec3(0, 1, 0)

  @input
  raiseOffset = 0.2

  @input
  @allowUndefined
  @hint("WireFuseboxModule; also set via setManager().")
  wireManager: ScriptComponent

  private baseTransform: Transform | null = null
  private headTransform: Transform | null = null
  private endTransform: Transform | null = null
  private handleTransform: Transform | null = null
  private handleScript: HandleScript | null = null
  private pipeObj: SceneObject | null = null
  private pipeRMV: RenderMeshVisual | null = null
  private pipeBuilder: MeshBuilder | null = null
  private socketsList: SceneObject[] = []
  private currentSocket: SceneObject | null = null
  private isFollowing = false
  private startLocalY: number | null = null
  private isReturning = false
  private startHeadPos: vec3 | null = null
  private startHandlePos: vec3 | null = null
  private startHeadLocal: vec3 | null = null
  private startHandleLocal: vec3 | null = null
  private meshCooldownFrames = 0
  private isDisabled = false
  private suppressDisconnectSfx = false
  private initialized = false

  private wireScriptRef(): WireConnectorScript {
    return this as unknown as WireConnectorScript
  }

  onAwake(): void {
    this.baseTransform = this.getSceneObject().getTransform()
    this.bindPublicApi()
    this.refreshTransformRefs()

    this.createEvent("UpdateEvent").bind(() => this.updateFollow())
    this.createEvent("OnDestroyEvent").bind(() => this.onDestroy())
  }

  /** Mirror legacy Wire Connector.js: expose methods on the script object for fusebox callbacks. */
  private bindPublicApi(): void {
    const api = this.wireScriptRef()
    api.init = () => this.initializeWire()
    api.disconnect = (silent?: boolean) => this.triggerDisconnect(silent)
    api.disable = () => this.shutdownWire()
    api.returnConnections = () => this.gatherConnections()
    api.setManager = (manager: ScriptComponent) => this.attachManager(manager)
  }

  /** Match legacy JS: transform refs resolved from @inputs when awake / init runs. */
  private refreshTransformRefs(): void {
    if (!this.baseTransform) {
      this.baseTransform = this.getSceneObject().getTransform()
    }
    this.headTransform = this.wireHead ? this.wireHead.getTransform() : null
    this.endTransform = this.wireEnd ? this.wireEnd.getTransform() : null
    this.handleTransform = this.wireHandle ? this.wireHandle.getTransform() : null
  }

  initializeWire(): void {
    if (this.initialized) {
      return
    }

    this.refreshTransformRefs()

    if (this.headTransform) {
      this.startLocalY = this.headTransform.getLocalPosition().y
      this.startHeadPos = this.headTransform.getWorldPosition()
      this.startHeadLocal = this.baseTransform
        ? worldToLocalPoint(this.baseTransform, this.startHeadPos)
        : this.headTransform.getLocalPosition()
    }
    if (this.handleTransform) {
      this.startHandlePos = this.handleTransform.getWorldPosition()
      this.startHandleLocal = this.baseTransform
        ? worldToLocalPoint(this.baseTransform, this.startHandlePos)
        : this.handleTransform.getLocalPosition()
    }

    const returnOffset = this.getReturnOffset()
    if (this.headTransform) {
      this.headTransform.setWorldPosition(
        this.headTransform.getWorldPosition().add(returnOffset)
      )
    }
    if (this.handleTransform) {
      this.handleTransform.setWorldPosition(
        this.handleTransform.getWorldPosition().add(returnOffset)
      )
    }
    if (this.startHeadPos) {
      this.startHeadPos = this.startHeadPos.add(returnOffset)
    }
    if (this.startHandlePos) {
      this.startHandlePos = this.startHandlePos.add(returnOffset)
    }
    if (this.startHeadLocal && this.baseTransform) {
      const basePos = this.baseTransform.getWorldPosition()
      const localOffset = worldToLocalPoint(
        this.baseTransform,
        basePos.add(returnOffset)
      ).sub(worldToLocalPoint(this.baseTransform, basePos))
      this.startHeadLocal = this.startHeadLocal.add(localOffset)
    }
    if (this.startHandleLocal && this.baseTransform) {
      const basePos = this.baseTransform.getWorldPosition()
      const localOffset = worldToLocalPoint(
        this.baseTransform,
        basePos.add(returnOffset)
      ).sub(worldToLocalPoint(this.baseTransform, basePos))
      this.startHandleLocal = this.startHandleLocal.add(localOffset)
    }

    this.socketsList = []
    for (const socket of this.wireSockets) {
      if (socket) {
        this.socketsList.push(socket)
      }
    }
    this.registerSockets()

    if (this.wireHandle) {
      this.handleScript = this.wireHandle.getComponent(
        "Component.ScriptComponent"
      ) as HandleScript
      if (this.handleScript) {
        this.handleScript.onTranslationStart?.add(() => this.onHandleStart())
        this.handleScript.onTranslationEnd?.add(() => this.onHandleEnd())
      }
    }

    this.pipeObj = global.scene.createSceneObject("WirePipe")
    if (this.baseTransform) {
      this.pipeObj.setParent(this.baseTransform.getSceneObject())
    }
    const pipeTransform = this.pipeObj.getTransform()
    pipeTransform.setLocalPosition(vec3.zero())
    pipeTransform.setLocalRotation(quat.quatIdentity())
    pipeTransform.setLocalScale(vec3.one())

    this.pipeRMV = this.pipeObj.getComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    if (!this.pipeRMV) {
      this.pipeRMV = this.pipeObj.createComponent(
        "Component.RenderMeshVisual"
      ) as RenderMeshVisual
    }
    if (this.pipeRMV && this.wireMaterial) {
      this.pipeRMV.clearMaterials()
      this.pipeRMV.mainMaterial = this.wireMaterial.clone()
    }
    this.setWireRimEnabled(false)
    this.pipeBuilder = null

    this.initialized = true
    this.updatePipe()
  }

  triggerDisconnect(silent?: boolean): void {
    this.suppressDisconnectSfx = !!silent
    if (this.isDisabled) {
      return
    }
    this.releaseSocket()
    this.isFollowing = false
    this.isReturning = true
  }

  gatherConnections(): OccupancyEntry[] {
    const manager = this.wireManager as WireFuseboxManager | null
    if (manager?.getOccupancy) {
      return manager.getOccupancy()
    }
    const list = getGlobalOccupancy().occupancy || []
    const result: OccupancyEntry[] = []
    for (const entry of list) {
      if (entry?.socket && entry.wire) {
        result.push({socket: entry.socket, wire: entry.wire})
      }
    }
    return result
  }

  attachManager(manager: ScriptComponent): void {
    this.wireManager = manager
  }

  shutdownWire(): void {
    if (this.isDisabled) {
      return
    }
    this.isDisabled = true
    this.isFollowing = false
    this.isReturning = false
    this.releaseSocket()

    if (this.handleScript?.enabled !== undefined) {
      this.handleScript.enabled = false
    }
    if (this.wireHandle) {
      this.wireHandle.enabled = false
      this.wireHandle.destroy()
    }
  }

  private onDestroy(): void {
    this.releaseSocket()
    this.unregisterSockets()
    this.unregisterWire()
  }

  private getManager(): WireFuseboxManager | null {
    return (this.wireManager as WireFuseboxManager | null) ?? null
  }

  private registerSockets(): void {
    const manager = this.getManager()
    if (manager?.registerSockets) {
      manager.registerSockets(this.socketsList)
      return
    }
    const reg = getGlobalOccupancy().sockets
    for (const s of this.socketsList) {
      if (!s) {
        continue
      }
      if (reg.indexOf(s) < 0) {
        reg.push(s)
      }
    }
  }

  private unregisterSockets(): void {
    const manager = this.getManager()
    if (manager?.unregisterSockets) {
      manager.unregisterSockets(this.socketsList)
      return
    }
    const reg = getGlobalOccupancy().sockets
    for (let i = reg.length - 1; i >= 0; i--) {
      if (this.socketsList.indexOf(reg[i]) !== -1) {
        reg.splice(i, 1)
      }
    }
  }

  private isSocketOccupied(socket: SceneObject): boolean {
    const manager = this.getManager()
    if (manager?.isSocketOccupied) {
      return manager.isSocketOccupied(socket)
    }
    const list = getGlobalOccupancy().occupancy
    return list.some((entry) => entry.socket === socket)
  }

  private occupySocket(socket: SceneObject): void {
    if (this.currentSocket === socket) {
      return
    }
    const manager = this.getManager()
    if (manager?.occupySocket) {
      manager.occupySocket(socket, this.wireScriptRef())
      this.currentSocket = socket
      this.setWireRimEnabled(true)
      return
    }
    this.releaseSocket()
    getGlobalOccupancy().occupancy.push({socket, wire: this.wireScriptRef()})
    this.currentSocket = socket
    this.setWireRimEnabled(true)
  }

  private releaseSocket(): void {
    const manager = this.getManager()
    if (manager?.releaseSocket) {
      manager.releaseSocket(this.wireScriptRef())
      this.currentSocket = null
      this.setWireRimEnabled(false)
      this.suppressDisconnectSfx = false
      return
    }
    const list = getGlobalOccupancy().occupancy
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].wire === this.wireScriptRef()) {
        list.splice(i, 1)
      }
    }
    this.currentSocket = null
    this.setWireRimEnabled(false)
    this.suppressDisconnectSfx = false
  }

  private setWireRimEnabled(enabled: boolean): void {
    if (!this.pipeRMV?.mainMaterial) {
      return
    }
    const mat = this.pipeRMV.mainMaterial
    if (mat.mainPass?.enableRim !== undefined) {
      mat.mainPass.enableRim = enabled
    } else if ((mat as Material & {enableRim?: boolean}).enableRim !== undefined) {
      ;(mat as Material & {enableRim?: boolean}).enableRim = enabled
    }
  }

  private clampToMaxLength(pos: vec3): vec3 {
    if (!this.baseTransform) {
      return pos
    }
    const basePos = this.baseTransform.getWorldPosition()
    const dist = pos.distance(basePos)
    const maxLen = this.maxWireLength || 0
    if (maxLen > 0 && dist > maxLen) {
      const dir = pos.sub(basePos).normalize()
      return basePos.add(dir.uniformScale(maxLen))
    }
    return pos
  }

  private applyConstraints(pos: vec3): vec3 {
    return this.clampToMaxLength(pos)
  }

  private enforceHeadLocalY(): void {
    if (!this.headTransform || this.startLocalY === null) {
      return
    }
    const local = this.headTransform.getLocalPosition()
    if (local.y !== this.startLocalY) {
      this.headTransform.setLocalPosition(new vec3(local.x, this.startLocalY, local.z))
    }
  }

  private onHandleStart(): void {
    if (this.isDisabled) {
      return
    }
    this.isFollowing = true
    this.isReturning = false
    this.releaseSocket()
  }

  private onHandleEnd(): void {
    if (this.isDisabled) {
      return
    }
    this.isFollowing = false
    const snapped = this.trySnapToAvailableSocket()
    if (snapped) {
      global.playSfx(16, 1, global.appState.checkStorage("masterVolume") * 0.8)
    }
    if (!snapped) {
      this.releaseSocket()
      this.isReturning = true
    }
  }

  private trySnapToAvailableSocket(): boolean {
    if (!this.headTransform) {
      return false
    }
    this.registerSockets()

    let regSockets: SceneObject[] | null = null
    const manager = this.getManager()
    if (manager?.getSockets) {
      regSockets = manager.getSockets()
    } else {
      regSockets = getGlobalOccupancy().sockets
    }
    if (!regSockets || regSockets.length === 0) {
      return false
    }

    const headPos = this.headTransform.getWorldPosition()
    const snapInDistance = (this.snapDistance || 0) * 1.5
    let best: SceneObject | null = null
    let bestDist = Number.POSITIVE_INFINITY

    for (const sock of regSockets) {
      if (!sock) {
        continue
      }
      if (this.isSocketOccupied(sock) && this.currentSocket !== sock) {
        continue
      }
      const pos = sock.getTransform().getWorldPosition()
      const d = headPos.distance(pos)
      if (d <= snapInDistance && d < bestDist) {
        bestDist = d
        best = sock
      }
    }

    if (!best) {
      return false
    }

    if (this.currentSocket === best) {
      const currentPos = best.getTransform().getWorldPosition()
      this.headTransform.setWorldPosition(currentPos)
      if (this.handleTransform) {
        this.handleTransform.setWorldPosition(currentPos)
      }
      return true
    }

    const snapPos = best.getTransform().getWorldPosition()
    this.headTransform.setWorldPosition(snapPos)
    if (this.handleTransform) {
      this.handleTransform.setWorldPosition(snapPos)
    }
    this.occupySocket(best)
    return true
  }

  private updateFollow(): void {
    if (this.isDisabled || !this.headTransform || !this.handleTransform) {
      return
    }

    if (this.isReturning) {
      this.updateReturn()
    } else if (this.isFollowing) {
      if (this.currentSocket) {
        const socketPosWhileDrag = this.currentSocket.getTransform().getWorldPosition()
        const handleDist = this.handleTransform
          .getWorldPosition()
          .distance(socketPosWhileDrag)
        const releaseDist = (this.snapDistance || 0) * 1.5
        if (handleDist > releaseDist) {
          this.releaseSocket()
        }
      }
      let target = this.handleTransform.getWorldPosition()
      target = this.applyConstraints(target)

      const current = this.headTransform.getWorldPosition()
      const lerpT = clamp(getDeltaTime() * this.followSpeed, 0, 1)
      const next = lerpVec3(current, target, lerpT)
      this.headTransform.setWorldPosition(next)

      this.trySnapToAvailableSocket()
    } else if (this.currentSocket) {
      const socketPos = this.currentSocket.getTransform().getWorldPosition()
      this.headTransform.setWorldPosition(socketPos)
      this.handleTransform.setWorldPosition(socketPos)
    } else {
      const clampedHead = this.applyConstraints(this.headTransform.getWorldPosition())
      this.headTransform.setWorldPosition(clampedHead)
    }

    if (!this.currentSocket) {
      this.enforceHeadLocalY()
    }

    const shouldUpdate =
      this.isFollowing ||
      this.isReturning ||
      !!this.currentSocket ||
      this.meshCooldownFrames > 0
    if (shouldUpdate) {
      this.updatePipe()
      if (
        !this.isFollowing &&
        !this.isReturning &&
        !this.currentSocket &&
        this.meshCooldownFrames > 0
      ) {
        this.meshCooldownFrames--
      }
    }
  }

  private updateReturn(): void {
    if (!this.headTransform || !this.handleTransform) {
      return
    }

    let targetHead = this.startHeadPos || this.headTransform.getWorldPosition()
    let targetHandle = this.startHandlePos || this.handleTransform.getWorldPosition()
    if (this.startHeadLocal && this.baseTransform) {
      targetHead = localToWorldPoint(this.baseTransform, this.startHeadLocal)
    }
    if (this.startHandleLocal && this.baseTransform) {
      targetHandle = localToWorldPoint(this.baseTransform, this.startHandleLocal)
    }
    targetHead = this.applyConstraints(targetHead)
    targetHandle = this.applyConstraints(targetHandle)

    const lerpT = clamp(getDeltaTime() * this.followSpeed * 3, 0, 1)
    const headNext = lerpVec3(this.headTransform.getWorldPosition(), targetHead, lerpT)
    const handleNext = lerpVec3(
      this.handleTransform.getWorldPosition(),
      targetHandle,
      lerpT
    )
    this.headTransform.setWorldPosition(headNext)
    this.handleTransform.setWorldPosition(handleNext)

    const headClose = headNext.distance(targetHead) < 0.01
    const handleClose = handleNext.distance(targetHandle) < 0.01
    if (headClose && handleClose) {
      this.headTransform.setWorldPosition(targetHead)
      this.handleTransform.setWorldPosition(targetHandle)
      this.isReturning = false
      this.meshCooldownFrames = 8
    }

    this.enforceHeadLocalY()
  }

  private getReturnOffset(): vec3 {
    if (!this.baseTransform) {
      return vec3.zero()
    }
    const baseRot = this.baseTransform.getWorldRotation()
    return baseRot.multiplyVec3(new vec3(-RETURN_OFFSET_LOCAL, 0, 0))
  }

  private ensurePipeBuilder(): void {
    if (!this.pipeBuilder) {
      this.pipeBuilder = new MeshBuilder([
        {name: "position", components: 3},
        {name: "texture0", components: 2},
        {name: "normal", components: 3, normalized: true}
      ])
      this.pipeBuilder.topology = MeshTopology.Triangles
      this.pipeBuilder.indexType = MeshIndexType.UInt16
    }
    if (this.pipeRMV && this.pipeBuilder && this.pipeRMV.mesh !== this.pipeBuilder.getMesh()) {
      this.pipeRMV.mesh = this.pipeBuilder.getMesh()
    }
  }

  private clearMesh(builder: MeshBuilder): void {
    const vCount = builder.getVerticesCount()
    const iCount = builder.getIndicesCount()
    if (vCount > 0) {
      builder.eraseVertices(0, vCount)
    }
    if (iCount > 0) {
      builder.eraseIndices(0, iCount)
    }
  }

  private updatePipe(): void {
    if (!this.pipeRMV || !this.baseTransform) {
      return
    }
    this.ensurePipeBuilder()
    const builder = this.pipeBuilder!
    this.clearMesh(builder)

    const startPosWorld = this.baseTransform.getWorldPosition()
    const endPosWorld = this.endTransform
      ? this.endTransform.getWorldPosition()
      : this.headTransform
        ? this.headTransform.getWorldPosition()
        : startPosWorld
    const meshEndWorld = this.headTransform
      ? this.headTransform.getWorldPosition()
      : endPosWorld
    const faceCount = Math.max(3, this.wireFaceCount || 8)
    const radius = this.wireRadius || 0.25
    const segments = Math.max(1, this.wireSegments || 1)
    const raiseOffset = this.raiseOffset || 0

    this.registerWire(startPosWorld, endPosWorld, segments)

    const startPos = vec3.zero()
    const endPos = toWirePlaneLocal(this.baseTransform, meshEndWorld)
    let points = this.buildSmoothPath(startPos, endPos, segments, radius)

    if (raiseOffset > 0) {
      const raiseWeights = this.getRaisePointWeights(startPosWorld, endPosWorld, segments)
      const raiseKeys = Object.keys(raiseWeights)
      if (raiseKeys.length > 0) {
        const raiseDir = this.raiseDirection || vec3.zero()
        const raiseDirLen = raiseDir.length
        if (raiseDirLen > 1e-5) {
          for (const key of raiseKeys) {
            const idx = parseInt(key, 10)
            const weight = raiseWeights[key]
            const offset = raiseDir.uniformScale((raiseOffset * weight) / raiseDirLen)
            points[idx] = points[idx].add(offset)
          }
        }
      }
    }

    this.buildTubeMesh(builder, points, faceCount, radius)

    if (builder.isValid()) {
      builder.updateMesh()
    }
  }

  private buildSmoothPath(startPos: vec3, endPos: vec3, segments: number, radius: number): vec3[] {
    const path: vec3[] = []
    const dir = endPos.sub(startPos)
    const len = dir.length
    if (len < 1e-5) {
      path.push(startPos)
      path.push(endPos)
      return path
    }
    const normDir = dir.normalize()
    const elbowCurvature = 0.5
    const controlA = startPos.add(normDir.uniformScale(radius * elbowCurvature))
    const controlB = endPos.sub(normDir.uniformScale(radius * elbowCurvature))
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      path.push(cubicBezier(startPos, controlA, controlB, endPos, t))
    }
    return path
  }

  private buildTubeMesh(builder: MeshBuilder, path: vec3[], faceCount: number, radius: number): void {
    if (!path || path.length < 2) {
      return
    }
    const totalRings = path.length
    const vertsPerRing = faceCount + 1

    for (let i = 0; i < totalRings; i++) {
      const center = path[i]
      let forward: vec3
      if (i === 0) {
        forward = path[i + 1].sub(center)
      } else if (i === totalRings - 1) {
        forward = center.sub(path[i - 1])
      } else {
        forward = path[i + 1].sub(path[i - 1])
      }
      forward = forward.normalize()

      let globalUp = vec3.forward()
      if (Math.abs(forward.dot(globalUp)) > 0.99) {
        globalUp = vec3.up()
      }
      const right = forward.cross(globalUp).normalize()
      const up = right.cross(forward).normalize()

      for (let j = 0; j <= faceCount; j++) {
        const angle = (j / faceCount) * Math.PI * 2
        const dir = right.uniformScale(Math.cos(angle)).add(up.uniformScale(Math.sin(angle)))
        const pos = center.add(dir.uniformScale(radius))
        const uv = [j / faceCount, i / (totalRings - 1)]
        builder.appendVertices([
          [pos.x, pos.y, pos.z],
          [uv[0], uv[1]],
          [dir.x, dir.y, dir.z]
        ])
      }
    }

    for (let r = 0; r < totalRings - 1; r++) {
      for (let c = 0; c < faceCount; c++) {
        const i0 = r * vertsPerRing + c
        const i1 = (r + 1) * vertsPerRing + c
        const i2 = (r + 1) * vertsPerRing + c + 1
        const i3 = r * vertsPerRing + c + 1
        builder.appendIndices([i0, i1, i3])
        builder.appendIndices([i1, i2, i3])
      }
    }
  }

  private registerWire(startPos: vec3, endPos: vec3, segments: number): void {
    const registry = getGlobalWireRegistry()
    const list = registry.list
    const wire = this.wireScriptRef()
    for (const entry of list) {
      if (entry.wire === wire) {
        entry.start = startPos
        entry.end = endPos
        entry.segments = segments
        entry.length = startPos.distance(endPos)
        return
      }
    }
    list.push({
      wire,
      start: startPos,
      end: endPos,
      segments,
      length: startPos.distance(endPos),
      order: registry.nextOrder++
    })
  }

  private unregisterWire(): void {
    const list = getGlobalWireRegistry().list
    const wire = this.wireScriptRef()
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].wire === wire) {
        list.splice(i, 1)
      }
    }
  }

  private getRaisePointWeights(
    startPos: vec3,
    endPos: vec3,
    segments: number
  ): Record<number, number> {
    const list = getGlobalWireRegistry().list
    const wire = this.wireScriptRef()
    const selfLen = startPos.distance(endPos)
    let selfOrder = -1
    for (const entry of list) {
      if (entry?.wire === wire) {
        selfOrder = entry.order
        break
      }
    }

    let best: SegmentClosest | null = null
    let bestDist = Number.POSITIVE_INFINITY
    for (const entry of list) {
      if (!entry || entry.wire === wire) {
        continue
      }
      if (entry.length < selfLen) {
        continue
      }
      if (entry.length === selfLen && selfOrder <= entry.order) {
        continue
      }
      const res = closestSegmentParams(startPos, endPos, entry.start, entry.end)
      if (res.dist < bestDist) {
        bestDist = res.dist
        best = res
      }
    }
    if (!best) {
      return {}
    }

    const overlapThreshold = (this.wireRadius || 0.25) * 2
    if (best.dist > overlapThreshold) {
      return {}
    }

    let s = Math.floor(clamp(best.t, 0, 1) * segments)
    if (s >= segments) {
      s = segments - 1
    }

    const weights: Record<number, number> = {}
    const main = [s, s + 1, s + 2]
    for (const idx of main) {
      if (idx >= 0 && idx <= segments && idx > 1 && idx < segments - 1) {
        weights[idx] = 1
      }
    }
    const falloff = [s - 2, s - 1, s + 3, s + 4]
    for (const fIdx of falloff) {
      if (fIdx >= 0 && fIdx <= segments && fIdx > 1 && fIdx < segments - 1) {
        if (!weights[fIdx]) {
          weights[fIdx] = 0.5
        }
      }
    }
    return weights
  }
}
