"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveScriptFacade = resolveScriptFacade;
exports.asSafeModuleFacade = asSafeModuleFacade;
exports.asGameFlowFacade = asGameFlowFacade;
/** Resolves a ScriptComponent or AssignableType input to a typed facade. */
function resolveScriptFacade(input, typeName) {
    if (!input) {
        return null;
    }
    const direct = input;
    if (typeof direct.getSceneObject !== "function") {
        return direct;
    }
    const sceneObject = input.getSceneObject?.();
    if (!sceneObject) {
        return null;
    }
    const comp = sceneObject.getComponent(typeName);
    return comp ? comp : null;
}
function asSafeModuleFacade(comp) {
    return comp;
}
function asGameFlowFacade(comp) {
    if (!comp) {
        return null;
    }
    const direct = comp;
    if (typeof direct.handleSafeComplete === "function" || typeof direct.handleSafeFailed === "function") {
        return direct;
    }
    const sceneObject = comp.getSceneObject?.();
    if (!sceneObject) {
        return null;
    }
    const scripts = sceneObject.getComponents("Component.ScriptComponent");
    for (const c of scripts) {
        const facade = c;
        if (typeof facade.handleSafeComplete === "function" || typeof facade.handleSafeFailed === "function") {
            return facade;
        }
    }
    return null;
}
//# sourceMappingURL=HeistContracts.js.map