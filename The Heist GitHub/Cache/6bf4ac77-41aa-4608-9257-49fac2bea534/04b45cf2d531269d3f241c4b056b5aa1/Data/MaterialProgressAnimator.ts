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
  if (!material) {
    onComplete?.()
    return
  }

  const startValue = getProgress(material)
  if (startValue === null || startValue === undefined) {
    onComplete?.()
    return
  }

  const tween = LSTween.rawTween(durationSec * 1000)
    .onUpdate((progress: {t: number}) => {
      const t = progress.t
      const smoothT = t * t * (3 - 2 * t)
      const value = startValue + (targetValue - startValue) * smoothT
      setProgress(material, value)
    })
    .onComplete(() => {
      setProgress(material, targetValue)
      onComplete?.()
    })

  activeTweens.push(tween)
  tween.start()
}
