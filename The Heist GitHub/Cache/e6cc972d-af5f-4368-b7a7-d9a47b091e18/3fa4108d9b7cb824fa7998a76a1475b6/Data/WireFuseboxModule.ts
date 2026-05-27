import {SafeContext, SerialNumberInfo} from "../Safe/SafeTypes"
import {WireConnectorScript} from "../WireConnector"

const MODULE_PENALTY_SEC = 20

type ColorLetter = "R" | "G" | "B" | "Y"

type RequiredConnection = {
  socketIndex: number
  colorLetter: ColorLetter
}

type OccupancyEntry = {
  socket: SceneObject
  wire: ScriptComponent
}

type AnimPassMaterial = Material & {
  __propAnim?: Record<string, {startTime: number; updateEvent: UpdateEvent}>
}

type PushButtonScript = ScriptComponent & {
  disable?: () => void
}

export type WireFuseboxManager = ScriptComponent & {
  registerSockets: (sockets: SceneObject[]) => void
  unregisterSockets: (sockets: SceneObject[]) => void
  isSocketOccupied: (socket: SceneObject) => boolean
  occupySocket: (socket: SceneObject, wire: ScriptComponent) => void
  releaseSocket: (wire: ScriptComponent) => void
  getOccupancy: () => OccupancyEntry[]
  getSockets: () => SceneObject[]
}

/**
 * Wire puzzle manager — socket registry, color assignment, and connection validation.
 * Disable legacy Wire Fusebox Module.js on the same object.
 */
@component
export class WireFuseboxModule extends BaseScriptComponent {
  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Check Button</span>')

  @input
  @allowUndefined
  @hint("PushButton that calls checkConnections (external callback).")
  buttonComponent: ScriptComponent

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Wire Reels</span>')

  @input
  @hint("Reel mesh visuals — materials applied in color order.")
  wireReels: RenderMeshVisual[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Wire Connectors</span>')

  @input
  @hint("WireConnector script on each draggable wire.")
  wireConnectors: ScriptComponent[] = []

  @ui.separator
  @ui.label('<span style="color: #60A5FA;">Wire Materials</span>')

  @input
  @hint("Red, green, blue, yellow materials (index 0–3).")
  wireColorMaterials: Material[] = []

  private safeComponent: ScriptComponent | null = null
  private slotId = 0

  private readonly socketRegistry: SceneObject[] = []
  private readonly occupancyList: OccupancyEntry[] = []
  private wireColors: (ColorLetter | undefined)[] = []
  private requiredConnections: RequiredConnection[] = []
  private skipSockets = false
  private skipRed = false
  private buttonMaterial: Material | null = null
  private isSolved = false

  registerSockets(sockets: SceneObject[]): void {
    if (!sockets) {
      return
    }
    for (const socket of sockets) {
      if (!socket || this.socketRegistry.indexOf(socket) >= 0) {
        continue
      }
      this.socketRegistry.push(socket)
    }
  }

  unregisterSockets(sockets: SceneObject[]): void {
    if (!sockets) {
      return
    }
    for (let i = this.socketRegistry.length - 1; i >= 0; i--) {
      if (sockets.indexOf(this.socketRegistry[i]) >= 0) {
        this.socketRegistry.splice(i, 1)
      }
    }
  }

  isSocketOccupied(socket: SceneObject): boolean {
    return this.occupancyList.some((entry) => entry.socket === socket)
  }

  occupySocket(socket: SceneObject, wire: ScriptComponent): void {
    this.releaseSocket(wire)
    this.occupancyList.push({socket, wire})
  }

  releaseSocket(wire: ScriptComponent): void {
    for (let i = this.occupancyList.length - 1; i >= 0; i--) {
      if (this.occupancyList[i].wire === wire) {
        this.occupancyList.splice(i, 1)
      }
    }
  }

  getOccupancy(): OccupancyEntry[] {
    return this.occupancyList.map((entry) => ({socket: entry.socket, wire: entry.wire}))
  }

  getSockets(): SceneObject[] {
    return this.socketRegistry.slice(0)
  }

  setupModule(safeContext: SafeContext, safeComponent: ScriptComponent, slotId: number): void {
    this.safeComponent = safeComponent
    this.slotId = slotId

    const serialInfo = this.getSerialInfo(safeContext.serialNumber)
    const fuseColor = safeContext.dynamiteFuseColor || ""

    this.isSolved = false
    this.initButtonMaterial()
    this.applyWireMaterials()

    for (const wireScript of this.wireConnectors) {
      if (!wireScript) {
        continue
      }
      const wire = wireScript as WireConnectorScript
      if (wire.setManager) {
        wire.setManager(this)
      } else {
        wire.wireManager = this
      }
    }

    this.requiredConnections = this.buildRequiredConnections(serialInfo, fuseColor)
    const solutionParts = this.requiredConnections.map(
      (c) => c.socketIndex + c.colorLetter
    )
    print("Wire Module Solution: " + solutionParts.join(" "))
  }

  animationFinished(): void {
    if (this.isSolved) {
      return
    }
    for (const wireScript of this.wireConnectors) {
      if (!wireScript) {
        continue
      }
      const wire = wireScript as WireConnectorScript
      if (typeof wire.init === "function") {
        wire.init()
      }
    }
  }

  checkConnections(): void {
    if (this.isSolved) {
      return
    }

    const connected = this.getConnectedByColor()
    const requiredByColor: Partial<Record<ColorLetter, number>> = {}
    for (const req of this.requiredConnections) {
      requiredByColor[req.colorLetter] = req.socketIndex
    }
    const forbiddenSockets: Record<number, boolean> = this.skipSockets ? {1: true, 3: true} : {}

    for (const entry of this.occupancyList) {
      if (!entry?.wire || !entry.socket) {
        continue
      }
      const wireIndex = this.wireConnectors.indexOf(entry.wire)
      if (wireIndex < 0) {
        continue
      }
      const colorLetter = this.wireColors[wireIndex]
      if (!colorLetter) {
        continue
      }
      const socketIndex = this.socketRegistry.indexOf(entry.socket)
      if (socketIndex < 0) {
        continue
      }

      if (this.skipRed && colorLetter === "R") {
        this.failConnections()
        return
      }
      if (this.skipSockets && forbiddenSockets[socketIndex]) {
        this.failConnections()
        return
      }
      if (requiredByColor[colorLetter] === undefined) {
        this.failConnections()
        return
      }
      if (requiredByColor[colorLetter] !== socketIndex) {
        global.playSfx(17, 1, global.appState.checkStorage("masterVolume") * 0.7)
        this.failConnections()
        return
      }
    }

    let solved = true
    for (const req of this.requiredConnections) {
      if (connected[req.colorLetter] !== req.socketIndex) {
        solved = false
        break
      }
    }

    if (solved) {
      print("Wire Fusebox Module solved")
      this.isSolved = true
      this.playSolvedAnimation()
      this.disableCheckButton()
      this.disableAllWires()
      this.moduleCompleted()
      return
    }

    print("Wire Fusebox Module incorrect connections")
    global.playSfx(17, 1, global.appState.checkStorage("masterVolume") * 0.7)
    this.modulePenalty()
    this.disconnectAllWires()
  }

  tutorialInstaComplete(): void {
    print("Wire Fusebox Module solved")
    this.isSolved = true
    this.playSolvedAnimation()
    this.disableCheckButton()
    this.disableAllWires()
    this.moduleCompleted()
  }

  private failConnections(): void {
    print("Wire Fusebox Module incorrect connections")
    this.modulePenalty()
    this.disconnectAllWires()
  }

  private disconnectAllWires(): void {
    for (const wireScript of this.wireConnectors) {
      if (!wireScript) {
        continue
      }
      const wire = wireScript as WireConnectorScript
      if (typeof wire.disconnect === "function") {
        wire.disconnect.call(wireScript)
      }
    }
  }

  private disableAllWires(): void {
    for (const wireScript of this.wireConnectors) {
      if (!wireScript) {
        continue
      }
      const wire = wireScript as WireConnectorScript
      if (typeof wire.disable === "function") {
        wire.disable.call(wireScript)
      }
    }
  }

  private disableCheckButton(): void {
    const button = this.buttonComponent as PushButtonScript
    if (button && typeof button.disable === "function") {
      button.disable.call(this.buttonComponent)
    }
  }

  private initButtonMaterial(): void {
    this.buttonMaterial = null
    if (!this.buttonComponent) {
      return
    }
    const buttonObject = this.buttonComponent.getSceneObject()
    if (!buttonObject || buttonObject.getChildrenCount() < 1) {
      return
    }
    const firstChild = buttonObject.getChild(0)
    if (!firstChild || firstChild.getChildrenCount() < 1) {
      return
    }
    const visualObject = firstChild.getChild(0)
    if (!visualObject) {
      return
    }
    const visual = visualObject.getComponent("Component.RenderMeshVisual") as RenderMeshVisual
    if (!visual?.mainMaterial) {
      return
    }
    this.buttonMaterial = visual.mainMaterial.clone()
    visual.mainMaterial = this.buttonMaterial
  }

  private animateMaterialProperty(
    material: Material,
    propName: string,
    targetValue: number,
    duration: number,
    callback?: () => void
  ): void {
    const mat = material as AnimPassMaterial
    if (!mat.mainPass || mat.mainPass[propName] === undefined) {
      callback?.()
      return
    }

    if (!mat.__propAnim) {
      mat.__propAnim = {}
    }
    if (mat.__propAnim[propName]?.updateEvent) {
      mat.__propAnim[propName].updateEvent.enabled = false
      mat.__propAnim[propName].updateEvent = null
    }

    const startValue = mat.mainPass[propName] as number
    const animData = {
      startTime: getTime(),
      updateEvent: this.createEvent("UpdateEvent")
    }
    mat.__propAnim[propName] = animData

    animData.updateEvent.bind(() => {
      const elapsed = getTime() - animData.startTime
      const t = Math.min(elapsed / duration, 1)
      const smoothT = t * t * (3 - 2 * t)
      mat.mainPass![propName] = startValue + (targetValue - startValue) * smoothT
      if (t >= 1) {
        mat.mainPass![propName] = targetValue
        animData.updateEvent.enabled = false
        animData.updateEvent = null
        callback?.()
      }
    })
  }

  private playSolvedAnimation(): void {
    if (!this.buttonMaterial) {
      return
    }
    this.animateMaterialProperty(this.buttonMaterial, "state", 1, 0.25)
    this.animateMaterialProperty(this.buttonMaterial, "glowAmount", 1, 0.25)
  }

  private applyWireMaterials(): void {
    if (!this.wireColorMaterials || this.wireColorMaterials.length === 0) {
      return
    }

    const materials = this.wireColorMaterials.slice(0, 4)
    const colorLetters: ColorLetter[] = ["R", "G", "B", "Y"]

    for (let m = materials.length - 1; m > 0; m--) {
      const swapIndex =
        global.utils && global.utils.rng
          ? global.utils.rng(0, m)
          : Math.floor(Math.random() * (m + 1))
      const tempMat = materials[m]
      materials[m] = materials[swapIndex]
      materials[swapIndex] = tempMat
      const tmpLetter = colorLetters[m]
      colorLetters[m] = colorLetters[swapIndex]
      colorLetters[swapIndex] = tmpLetter
    }

    this.wireColors = []

    for (let r = 0; r < this.wireReels.length; r++) {
      const reel = this.wireReels[r]
      if (!reel) {
        continue
      }
      const matIndex = r % materials.length
      const cloned = materials[matIndex].clone()
      reel.clearMaterials()
      reel.mainMaterial = cloned
    }

    for (let w = 0; w < this.wireConnectors.length; w++) {
      const wireScript = this.wireConnectors[w]
      if (!wireScript) {
        continue
      }
      const wireMatIndex = w % materials.length
      const wire = wireScript as WireConnectorScript
      wire.wireMaterial = materials[wireMatIndex]
      this.wireColors[w] = colorLetters[wireMatIndex]
    }
  }

  private getSerialInfo(serialNumber: SerialNumberInfo | string | undefined): {
    containsWord: boolean
    letterCount: number
    numberCount: number
  } {
    let serialString = ""
    let containsWord = false
    let letterCount = 0
    let numberCount = 0
    let hasCounts = false

    if (serialNumber) {
      if (typeof serialNumber === "string") {
        serialString = serialNumber
      } else {
        serialString = serialNumber.string || ""
        if (typeof serialNumber.containsWord === "boolean") {
          containsWord = serialNumber.containsWord
        }
        if (typeof serialNumber.letterCount === "number") {
          letterCount = serialNumber.letterCount
          hasCounts = true
        }
        if (typeof serialNumber.numberCount === "number") {
          numberCount = serialNumber.numberCount
          hasCounts = true
        }
      }
    }

    if (serialString && !hasCounts) {
      for (let i = 0; i < serialString.length; i++) {
        const ch = serialString.charAt(i)
        if (ch >= "0" && ch <= "9") {
          numberCount++
        } else if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
          letterCount++
        }
      }
    }

    return {containsWord, letterCount, numberCount}
  }

  private getSocketForColor(colorLetter: ColorLetter, fuseColor: string): number | null {
    if (colorLetter === "B") {
      if (fuseColor === "red") return 1
      if (fuseColor === "green") return 2
      if (fuseColor === "blue") return 3
      if (fuseColor === "yellow") return 4
    } else if (colorLetter === "R") {
      if (fuseColor === "red") return 2
      if (fuseColor === "green") return 3
      if (fuseColor === "blue") return 4
      if (fuseColor === "yellow") return 1
    } else if (colorLetter === "G") {
      if (fuseColor === "red") return 3
      if (fuseColor === "green") return 4
      if (fuseColor === "blue") return 1
      if (fuseColor === "yellow") return 2
    } else if (colorLetter === "Y") {
      if (fuseColor === "red") return 4
      if (fuseColor === "green") return 1
      if (fuseColor === "blue") return 2
      if (fuseColor === "yellow") return 3
    }
    return null
  }

  private buildRequiredConnections(
    serialInfo: ReturnType<typeof this.getSerialInfo>,
    fuseColor: string
  ): RequiredConnection[] {
    this.skipSockets = serialInfo.containsWord
    this.skipRed = serialInfo.numberCount > 3

    const connections: RequiredConnection[] = []
    const colorOrder: ColorLetter[] = ["R", "G", "B", "Y"]

    for (const colorLetter of colorOrder) {
      if (this.skipRed && colorLetter === "R") {
        continue
      }
      const socketIndex = this.getSocketForColor(colorLetter, fuseColor)
      if (!socketIndex) {
        continue
      }
      if (this.skipSockets && (socketIndex === 2 || socketIndex === 4)) {
        continue
      }
      connections.push({socketIndex: socketIndex - 1, colorLetter})
    }
    return connections
  }

  private getConnectedByColor(): Partial<Record<ColorLetter, number>> {
    const connected: Partial<Record<ColorLetter, number>> = {}
    for (const entry of this.occupancyList) {
      if (!entry?.wire || !entry.socket) {
        continue
      }
      const wireIndex = this.wireConnectors.indexOf(entry.wire)
      if (wireIndex < 0) {
        continue
      }
      const colorLetter = this.wireColors[wireIndex]
      if (!colorLetter) {
        continue
      }
      const socketIndex = this.socketRegistry.indexOf(entry.socket)
      if (socketIndex < 0) {
        continue
      }
      connected[colorLetter] = socketIndex
    }
    return connected
  }

  private moduleCompleted(): void {
    const safe = this.safeComponent as {completeModule?: (slotId: number) => void}
    safe?.completeModule?.(this.slotId)
  }

  private modulePenalty(): void {
    const safe = this.safeComponent as {applyPenalty?: (seconds: number) => void}
    safe?.applyPenalty?.(MODULE_PENALTY_SEC)
  }
}
