import {SafeContext, SafeType} from "./Safe/SafeTypes"

/** Public API surface for GameFlowController when referenced from Safe or globals. */
export interface GameFlowFacade {
  handleSafeComplete(safeType: SafeType, seconds: number): void
  handleSafeFailed(): void
  /** Show post-game UI (MenuController) after win animation + safe hide. */
  presentPostGameWin?(safeType: SafeType, solveDurationSeconds: number, bombTimerSeconds: number): void
  /** Show post-game UI (MenuController) after fail explosion + safe hide. */
  presentPostGameFail?(): void
  playFailExplosionAndScaleAway?(callback?: () => void): void
}

/** Duck-typed module script API (TS modules + legacy JS). */
export interface SafeModuleFacade {
  setupModule?(ctx: SafeContext, safe: ScriptComponent, slotId: number): void
  animationFinished?(): void
  tutorialInstaComplete?(): void
  disable?(): void
}

/** Resolves a ScriptComponent or AssignableType input to a typed facade. */
export function resolveScriptFacade<T>(
  input: ScriptComponent | T | null | undefined,
  typeName: string
): T | null {
  if (!input) {
    return null
  }
  const direct = input as T
  if (typeof (direct as any).getSceneObject !== "function") {
    return direct
  }
  const sceneObject = (input as ScriptComponent).getSceneObject?.()
  if (!sceneObject) {
    return null
  }
  const comp = (sceneObject as any).getComponent(typeName) as ScriptComponent | null
  return comp ? (comp as unknown as T) : null
}

export function asSafeModuleFacade(comp: ScriptComponent): SafeModuleFacade {
  return comp as unknown as SafeModuleFacade
}

export function asGameFlowFacade(comp: ScriptComponent | GameFlowFacade | null | undefined): GameFlowFacade | null {
  if (!comp) {
    return null
  }
  const direct = comp as GameFlowFacade
  if (typeof direct.handleSafeComplete === "function" || typeof direct.handleSafeFailed === "function") {
    return direct
  }
  const sceneObject = (comp as ScriptComponent).getSceneObject?.()
  if (!sceneObject) {
    return null
  }
  const scripts = sceneObject.getComponents("Component.ScriptComponent")
  for (const c of scripts) {
    const facade = c as unknown as GameFlowFacade
    if (typeof facade.handleSafeComplete === "function" || typeof facade.handleSafeFailed === "function") {
      return facade
    }
  }
  return null
}
