import {LSTween} from "LSTween.lspkg/LSTween"

type ProgressTarget = {
  material: Material
  startValue: number
}

const activeTweens: {stop: () => void}[] = []

function getProgress(material: Material): number | null {
  if (!material) {
    return null
  }
  if (material.mainPass && material.mainPass.progress !== undefined) {
    return material.mainPass.progress as number
  }
  if ((material as any).progress !== undefined) {
    return (material as any).progress as number
  }
  return null
}

function setProgress(material: Material, value: number): void {
  if (!material) {
    return
  }
  if (material.mainPass && material.mainPass.progress !== undefined) {
    material.mainPass.progress = value
  } else if ((material as any).progress !== undefined) {
    ;(material as any).progress = value
  }
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
    .onUpdate((t: number) => {
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
