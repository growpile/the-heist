"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaterialPropertyPath = getMaterialPropertyPath;
exports.getMaterialScalar = getMaterialScalar;
exports.setMaterialScalar = setMaterialScalar;
exports.animateMaterialScalar = animateMaterialScalar;
function getMaterialPropertyPath(material, key) {
    if (material.mainPass && material.mainPass[key] !== undefined) {
        return "mainPass." + key;
    }
    if (material[key] !== undefined) {
        return key;
    }
    return null;
}
function getMaterialScalar(material, key) {
    if (!material) {
        return null;
    }
    const path = getMaterialPropertyPath(material, key);
    if (!path) {
        return null;
    }
    let root = material;
    const parts = path.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
        root = root[parts[i]];
    }
    const value = root?.[parts[parts.length - 1]];
    return typeof value === "number" ? value : null;
}
function setMaterialScalar(material, key, value) {
    if (!material) {
        return;
    }
    const path = getMaterialPropertyPath(material, key);
    if (!path) {
        return;
    }
    let root = material;
    const parts = path.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
        root = root[parts[i]];
    }
    if (root) {
        root[parts[parts.length - 1]] = value;
    }
}
function animateMaterialScalar(material, key, targetValue, duration, callback) {
    if (!material || !global.utils?.animateMaterialProperty) {
        callback?.();
        return;
    }
    const path = getMaterialPropertyPath(material, key);
    if (!path) {
        callback?.();
        return;
    }
    global.utils.animateMaterialProperty(material, path, targetValue, duration, callback);
}
//# sourceMappingURL=MaterialPropertyHelpers.js.map