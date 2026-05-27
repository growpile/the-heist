export function getMaterialPropertyPath(material: Material, key: string): string | null {
  if (material.mainPass && (material.mainPass as any)[key] !== undefined) {
    return "mainPass." + key
  }
  if ((material as any)[key] !== undefined) {
    return key
  }
  return null
}

export function getMaterialScalar(material: Material | null | undefined, key: string): number | null {
  if (!material) {
    return null
  }
  const path = getMaterialPropertyPath(material, key)
  if (!path) {
    return null
  }
  let root: any = material
  const parts = path.split(".")
  for (let i = 0; i < parts.length - 1; i++) {
    root = root[parts[i]]
  }
  const value = root?.[parts[parts.length - 1]]
  return typeof value === "number" ? value : null
}

export function setMaterialScalar(material: Material | null | undefined, key: string, value: number): void {
  if (!material) {
    return
  }
  const path = getMaterialPropertyPath(material, key)
  if (!path) {
    return
  }
  let root: any = material
  const parts = path.split(".")
  for (let i = 0; i < parts.length - 1; i++) {
    root = root[parts[i]]
  }
  if (root) {
    root[parts[parts.length - 1]] = value
  }
}

export function animateMaterialScalar(
  material: Material | null | undefined,
  key: string,
  targetValue: number,
  duration: number,
  callback?: () => void
): void {
  if (!material || !global.utils?.animateMaterialProperty) {
    callback?.()
    return
  }
  const path = getMaterialPropertyPath(material, key)
  if (!path) {
    callback?.()
    return
  }
  global.utils.animateMaterialProperty(material, path, targetValue, duration, callback)
}
