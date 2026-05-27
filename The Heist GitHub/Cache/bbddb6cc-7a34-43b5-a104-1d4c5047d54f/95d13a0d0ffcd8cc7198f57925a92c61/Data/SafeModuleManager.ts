import {SafeModuleConfig} from "./SafeModuleConfig"
import {SafeContext, SafeRuntimeContext, SafeType} from "./SafeTypes"

const MODULE_COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]

export type ModuleSetupFn = (
  safeContext: SafeContext,
  safeComponent: ScriptComponent,
  slotId: number
) => void

export class SafeModuleManager {
  private modules: SafeModuleConfig[]
  private moduleSlots: SceneObject[]
  private moduleDisplayImages: Image[]
  private moduleObjects: SceneObject[] = []
  private moduleIds: string[] = []
  private solved: boolean[] = []
  private onAllSolved: () => void
  private onModuleSolved: (slotId: number) => void

  constructor(
    modules: SafeModuleConfig[],
    moduleSlots: SceneObject[],
    moduleDisplayImages: Image[],
    onAllSolved: () => void,
    onModuleSolved: (slotId: number) => void
  ) {
    this.modules = modules || []
    this.moduleSlots = moduleSlots || []
    this.moduleDisplayImages = moduleDisplayImages || []
    this.onAllSolved = onAllSolved
    this.onModuleSolved = onModuleSolved
  }

  getRuntimeContext(): SafeRuntimeContext {
    return {
      serialNumber: "",
      moduleIds: [...this.moduleIds],
      solved: [...this.solved]
    }
  }

  getModuleIds(): string[] {
    return [...this.moduleIds]
  }

  configureModules(safeType: SafeType, safeContext: SafeContext, safeComponent: ScriptComponent): void {
    this.clearModules()

    const count = this.moduleSlots.length
    this.solved = new Array(count).fill(false)
    this.moduleIds = new Array(count).fill("")

    if (safeType === "tutorial") {
      this.spawnFixedModules(safeContext, safeComponent)
    } else {
      this.spawnRandomModules(safeContext, safeComponent)
    }
  }

  completeModule(slotId: number): boolean {
    if (slotId < 0 || slotId >= this.solved.length) {
      return false
    }
    if (this.solved[slotId]) {
      return false
    }

    this.solved[slotId] = true
    this.onModuleSolved(slotId)

    if (this.solved.every((s) => s)) {
      this.onAllSolved()
    }
    return true
  }

  private clearModules(): void {
    for (const obj of this.moduleObjects) {
      if (obj) {
        obj.destroy()
      }
    }
    this.moduleObjects = []
    this.moduleIds = []
    this.solved = []
  }

  private spawnFixedModules(safeContext: SafeContext, safeComponent: ScriptComponent): void {
    const tutorialIds = ["wire-fusebox", "symbol-order"]
    for (let i = 0; i < this.moduleSlots.length && i < tutorialIds.length; i++) {
      const config = this.findModuleConfig(tutorialIds[i])
      if (config) {
        this.spawnModuleAtSlot(i, config, safeContext, safeComponent)
      }
    }
  }

  private spawnRandomModules(safeContext: SafeContext, safeComponent: ScriptComponent): void {
    const available = [...this.modules]
    for (let i = 0; i < this.moduleSlots.length; i++) {
      if (available.length === 0) {
        break
      }
      const idx = Math.floor(Math.random() * available.length)
      const config = available.splice(idx, 1)[0]
      this.spawnModuleAtSlot(i, config, safeContext, safeComponent)
    }
  }

  private findModuleConfig(moduleId: string): SafeModuleConfig | null {
    for (const m of this.modules) {
      if (m && m.moduleId === moduleId) {
        return m
      }
    }
    return null
  }

  private spawnModuleAtSlot(
    slotId: number,
    config: SafeModuleConfig,
    safeContext: SafeContext,
    safeComponent: ScriptComponent
  ): void {
    const slot = this.moduleSlots[slotId]
    if (!slot || !config.prefab) {
      return
    }

    const instance = config.prefab.instantiate(slot)
    this.moduleObjects.push(instance)
    this.moduleIds[slotId] = config.moduleId

    this.setModuleDisplayColor(slotId, slotId)

    const scriptComp = instance.getComponent("Component.ScriptComponent") as ScriptComponent
    if (scriptComp) {
      const setup = (scriptComp as any).setupModule as ModuleSetupFn | undefined
      if (typeof setup === "function") {
        setup(safeContext, safeComponent, slotId)
      }
    }
  }

  private setModuleDisplayColor(slotId: number, colorIndex: number): void {
    const color = MODULE_COLORS[colorIndex % MODULE_COLORS.length]
    const hex = color.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255
    const tint = new vec4(r, g, b, 1)

    const displayImage = this.moduleDisplayImages[slotId]
    if (displayImage) {
      displayImage.mainPass.baseColor = tint
      return
    }

    const slot = this.moduleSlots[slotId]
    if (!slot) {
      return
    }
    const child = slot.getChild(0)
    if (!child) {
      return
    }
    const img = child.getComponent("Component.Image") as Image
    if (img) {
      img.mainPass.baseColor = tint
    }
  }
}
