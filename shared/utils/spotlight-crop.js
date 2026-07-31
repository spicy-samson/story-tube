export const DEFAULT_SPOTLIGHT_X = 16

export function clampSpotlightX(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_SPOTLIGHT_X
  }

  return Math.min(100, Math.max(0, Math.round(value)))
}

export function parseSpotlightX(value) {
  const candidate = Array.isArray(value) ? value[0] : value

  if (
    (typeof candidate !== 'string' && typeof candidate !== 'number')
    || candidate === ''
  ) {
    return DEFAULT_SPOTLIGHT_X
  }

  const parsed = Number(candidate)
  return Number.isFinite(parsed) ? clampSpotlightX(parsed) : DEFAULT_SPOTLIGHT_X
}
