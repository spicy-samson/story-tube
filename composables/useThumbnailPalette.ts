import type { CSSProperties, Ref } from 'vue'
import type { StoryPalette } from '~/shared/types/story-template'

const DEFAULT_PALETTE: StoryPalette = {
  background: '#17202a',
  backgroundAlt: '#31506b',
  accent: '#ffcf5a',
  foreground: '#ffffff',
  muted: '#c3d0dc'
}

interface Rgb {
  red: number
  green: number
  blue: number
}

function rgbToHsl({ red, green, blue }: Rgb) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) return { hue: 0, saturation: 0, lightness }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  if (max === r) hue = 60 * (((g - b) / delta) % 6)
  if (max === g) hue = 60 * ((b - r) / delta + 2)
  if (max === b) hue = 60 * ((r - g) / delta + 4)

  return {
    hue: hue < 0 ? hue + 360 : hue,
    saturation,
    lightness
  }
}

function hsl(hue: number, saturation: number, lightness: number) {
  return `hsl(${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)`
}

function colorDistance(first: Rgb, second: Rgb) {
  return Math.hypot(
    first.red - second.red,
    first.green - second.green,
    first.blue - second.blue
  )
}

function createPalette(data: Uint8ClampedArray): StoryPalette {
  const buckets = new Map<string, { color: Rgb; count: number; vibrancy: number }>()

  for (let index = 0; index < data.length; index += 16) {
    if ((data[index + 3] ?? 0) < 220) continue

    const color: Rgb = {
      red: data[index] ?? 0,
      green: data[index + 1] ?? 0,
      blue: data[index + 2] ?? 0
    }
    const { saturation, lightness } = rgbToHsl(color)

    if (lightness < 0.035 || lightness > 0.965) continue

    const key = `${color.red >> 4}-${color.green >> 4}-${color.blue >> 4}`
    const bucket = buckets.get(key)

    if (bucket) {
      bucket.count += 1
      continue
    }

    buckets.set(key, {
      color,
      count: 1,
      vibrancy: saturation * (1 - Math.abs(lightness - 0.5))
    })
  }

  const ranked = [...buckets.values()].sort(
    (first, second) =>
      second.count * (0.55 + second.vibrancy) - first.count * (0.55 + first.vibrancy)
  )
  const dominant = ranked[0]?.color

  if (!dominant) return DEFAULT_PALETTE

  const accentColor = ranked.find(candidate =>
    colorDistance(candidate.color, dominant) > 92 && rgbToHsl(candidate.color).saturation > 0.28
  )?.color ?? dominant
  const dominantHsl = rgbToHsl(dominant)
  const accentHsl = rgbToHsl(accentColor)
  const baseSaturation = Math.max(dominantHsl.saturation, 0.3)
  const accentSaturation = Math.max(accentHsl.saturation, 0.62)

  return {
    background: hsl(dominantHsl.hue, baseSaturation * 0.78, 0.16),
    backgroundAlt: hsl(dominantHsl.hue, baseSaturation * 0.9, 0.31),
    accent: hsl(accentHsl.hue, accentSaturation, 0.62),
    foreground: '#ffffff',
    muted: hsl(dominantHsl.hue, Math.min(baseSaturation * 0.45, 0.34), 0.78)
  }
}

async function sampleThumbnail(source: string) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.decoding = 'async'
  image.src = source
  await image.decode()

  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 36
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) return DEFAULT_PALETTE

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return createPalette(context.getImageData(0, 0, canvas.width, canvas.height).data)
}

export function useThumbnailPalette(thumbnailUrl: Ref<string | null>) {
  const palette = ref<StoryPalette>({ ...DEFAULT_PALETTE })
  let requestId = 0

  watch(thumbnailUrl, async (source) => {
    const currentRequest = ++requestId

    if (!source || !import.meta.client) {
      palette.value = { ...DEFAULT_PALETTE }
      return
    }

    try {
      const sampledPalette = await sampleThumbnail(source)
      if (currentRequest === requestId) palette.value = sampledPalette
    } catch {
      if (currentRequest === requestId) palette.value = { ...DEFAULT_PALETTE }
    }
  }, { immediate: true })

  return { palette: readonly(palette) }
}

export function storyPaletteStyle(palette: StoryPalette): CSSProperties {
  return {
    '--story-bg': palette.background,
    '--story-bg-alt': palette.backgroundAlt,
    '--story-accent': palette.accent,
    '--story-fg': palette.foreground,
    '--story-muted': palette.muted
  } as CSSProperties
}
