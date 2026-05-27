import {LSTween} from "LSTween.lspkg/LSTween"
import {
  animateMaterialScalar,
  getMaterialScalar,
  setMaterialScalar
} from "./MaterialPropertyHelpers"

const activeTweens: {stop: () => void}[] = []

function getProgress(material: Material): number | null {
  return getMaterialScalar(material, "progress")
}

function setProgress(material: Material, value: number): void {
  setMaterialScalar(material, "progress", value)
}

export function stopAllProgressTweens(): void {
  for (const tween of activeTweens) {
    tween?.stop?.()
  }
  activeTweens.length = 0
}

export function animateProgress(
  material: Material | null,
  targetValue: number,
  durationSec: number,
  onComplete?: () => void
): void {
  animateMaterialScalar(material, "progress", targetValue, durationSec, onComplete)
}

/** Module Screen Shader idle — progress full, state unsolved. */
export function initializeModuleScreenMaterial(material: Material | null): void {
  if (!material) {
    return
  }
  setMaterialScalar(material, "progress", 1)
  setMaterialScalar(material, "state", 0)
}

/** Module Screen Shader solve — lock in solved state and stop motion. */
export function animateModuleScreenSolved(
  material: Material | null,
  durationSec: number,
  onComplete?: () => void
): void {
  if (!material) {
    onComplete?.()
    return
  }

  let remaining = 0
  const finish = () => {
    remaining--
    if (remaining <= 0) {
      onComplete?.()
    }
  }

  const queue = (key: string, target: number) => {
    if (getMaterialScalar(material, key) === null) {
      return
    }
    remaining++
    animateMaterialScalar(material, key, target, durationSec, finish)
  }

  queue("state", 1)
  queue("speed", 0)

  if (remaining === 0) {
    onComplete?.()
  }
}

export function animateGlowAmount(
  material: Material | null,
  targetValue: number,
  durationSec: number,
  onComplete?: () => void
): void {
  animateMaterialScalar(material, "glowAmount", targetValue, durationSec, onComplete)
}
