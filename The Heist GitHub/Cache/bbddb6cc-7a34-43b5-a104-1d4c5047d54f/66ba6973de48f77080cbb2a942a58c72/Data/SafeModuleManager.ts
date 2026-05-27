import {SafeModuleConfig} from "./SafeModuleConfig"
import {asSafeModuleFacade} from "../HeistContracts"
import {SafeContext, SafeRuntimeContext, SafeType, SerialNumberInfo} from "./SafeTypes"
import {animateProgress} from "./MaterialProgressAnimator"

export class SafeModuleManager {
  private modules: SafeModuleConfig[]
  private moduleSlots: SceneObject[]
  private moduleDisplayImages: Image[]
  private moduleObjects: SceneObject[] = []
  private moduleIds: string[] = []
  private solved: boolean[] = []
  private onAllSolved: () => void

  constructor(
    modules: SafeModuleConfig[],
    moduleSlots: SceneObject[],
    moduleDisplayImages: Image[],
    onAllSolved: () => void
  ) {
    this.modules = modules || []
    this.moduleSlots = moduleSlots || []
    this.moduleDisplayImages = moduleDisplayImages || []
    this.onAllSolved = onAllSolved
  }

  cloneModuleDisplayMaterials(): void {
    for (let m = 0; m < this.moduleSlots.length; m++) {
      const image = this.getModuleDisplayImage(m)
      if (!image || !image.mainMaterial) {
        continue
      }
      const newMaterial = image.mainMaterial.clone()
      image.clearMaterials()
      image.addMaterial(newMaterial)
    }
  }

  getRuntimeContext(serialNumber: SerialNumberInfo | null): SafeRuntimeContext {
    return {
      serialNumber: serialNumber ? serialNumber.string : "",
      moduleIds: [...this.moduleIds],
      solved: [...this.solved]
    }
  }

  configureModules(
    safeType: SafeType,
    safeContext: SafeContext,
    safeComponent: ScriptComponent
  ): {moduleList: string[]; moduleObjects: SceneObject[]} {
    this.moduleObjects = []
    this.moduleIds = []
    this.solved = new Array(this.moduleSlots.length).fill(false)

    const moduleList: string[] = []
    const usedIds: Record<string, boolean> = {}

    if (safeType !== "tutorial") {
      for (let i = 0; i < this.moduleSlots.length; i++) {
        const result = this.spawnRandomModule(i, usedIds)
        if (result) {
          moduleList.push(result.moduleId)
          this.moduleIds.push(result.moduleId)
          this.moduleObjects.push(result.moduleObject)
          usedIds[result.moduleId] = true
        }
      }
    } else {
      const tutorialModules = [
        {id: "wireFusebox", slot: 0},
        {id: "colorOrder", slot: 1},
        {id: "symbolOrder", slot: 2}
      ]
      for (const entry of tutorialModules) {
        const obj = this.spawnModule(entry.id, entry.slot)
        if (obj) {
          moduleList.push(entry.id)
          this.moduleIds.push(entry.id)
          this.moduleObjects.push(obj)
        }
      }
    }

    this.configureModuleScripts(safeContext, safeComponent)

    if (safeType === "tutorial") {
      this.runTutorialInstaComplete(0)
      this.runTutorialInstaComplete(2)
    }

    return {moduleList, moduleObjects: this.moduleObjects}
  }

  completeModule(slotId: number): boolean {
    if (slotId < 0 || slotId >= this.solved.length || this.solved[slotId]) {
      return false
    }

    this.solved[slotId] = true

    const image = this.getModuleDisplayImage(slotId)
    if (image && image.mainMaterial) {
      animateProgress(image.mainMaterial, 1, 0.25)
    }

    global.playSfx(20, 1, 1)

    if (this.solved.every((s) => s)) {
      this.onAllSolved()
    }
    return true
  }

  getModuleObjects(): SceneObject[] {
    return this.moduleObjects
  }

  disableAllModules(): void {
    for (const moduleObject of this.moduleObjects) {
      if (!moduleObject) {
        continue
      }
      const scriptComponents = moduleObject.getComponents("Component.ScriptComponent") as ScriptComponent[]
      for (const comp of scriptComponents) {
        const facade = asSafeModuleFacade(comp)
        if (typeof facade.disable === "function") {
          facade.disable.call(comp)
        }
      }
    }
  }

  notifyAnimationFinished(): void {
    for (const moduleObject of this.moduleObjects) {
      if (!moduleObject) {
        continue
      }
      const scriptComponents = moduleObject.getComponents("Component.ScriptComponent") as ScriptComponent[]
      for (const comp of scriptComponents) {
        const facade = asSafeModuleFacade(comp)
        if (typeof facade.animationFinished === "function") {
          facade.animationFinished.call(comp)
        }
      }
    }
  }

  private configureModuleScripts(safeContext: SafeContext, safeComponent: ScriptComponent): void {
    for (let i = 0; i < this.moduleObjects.length; i++) {
      const moduleObject = this.moduleObjects[i]
      if (!moduleObject) {
        continue
      }
      const scriptComponents = moduleObject.getComponents("Component.ScriptComponent") as ScriptComponent[]
      for (const comp of scriptComponents) {
        const facade = asSafeModuleFacade(comp)
        if (typeof facade.setupModule === "function") {
          facade.setupModule.call(comp, safeContext, safeComponent, i)
        }
      }
    }
  }

  private getModuleDisplayImage(slotIndex: number): Image | null {
    if (this.moduleDisplayImages[slotIndex]) {
      return this.moduleDisplayImages[slotIndex]
    }
    const slot = this.moduleSlots[slotIndex]
    if (!slot) {
      return null
    }
    const child0 = slot.getChild(0)
    if (!child0) {
      return null
    }
    const child1 = child0.getChild(0)
    if (!child1) {
      return null
    }
    const child2 = child1.getChild(0)
    if (!child2) {
      return null
    }
    return child2.getComponent("Component.Image") as Image
  }

  private spawnRandomModule(
    slotIndex: number,
    usedIds: Record<string, boolean>
  ): {moduleId: string; moduleObject: SceneObject} | null {
    const available: SafeModuleConfig[] = []
    for (const m of this.modules) {
      if (m && !usedIds[m.moduleId]) {
        available.push(m)
      }
    }
    const pool = available.length > 0 ? available : this.modules
    if (!pool.length) {
      return null
    }

    const index =
      global.utils && global.utils.rng
        ? global.utils.rng(0, pool.length - 1)
        : Math.floor(Math.random() * pool.length)
    const config = pool[index]
    const slot = this.moduleSlots[slotIndex]
    if (!config || !config.prefab || !slot) {
      return null
    }

    const moduleObject = config.prefab.instantiate(slot)
    return {moduleId: config.moduleId, moduleObject}
  }

  private spawnModule(moduleId: string, slotId: number): SceneObject | null {
    let moduleConfig: SafeModuleConfig | null = null
    for (const m of this.modules) {
      if (m && m.moduleId === moduleId) {
        moduleConfig = m
        break
      }
    }
    const slot = this.moduleSlots[slotId]
    if (!moduleConfig || !moduleConfig.prefab || !slot) {
      return null
    }
    return moduleConfig.prefab.instantiate(slot)
  }

  private runTutorialInstaComplete(index: number): void {
    const obj = this.moduleObjects[index]
    if (!obj) {
      return
    }
    const comp = obj.getComponent("Component.ScriptComponent") as ScriptComponent
    const facade = comp ? asSafeModuleFacade(comp) : null
    const fn = facade?.tutorialInstaComplete
    if (typeof fn === "function") {
      fn.call(comp)
    }
  }
}
