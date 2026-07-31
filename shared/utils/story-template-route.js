/** @type {Readonly<Record<string, string>>} */
export const LEGACY_STORY_TEMPLATE_ALIASES = Object.freeze({
  centered: 'frame',
  glass: 'frame',
  editorial: 'headline',
  progress: 'spotlight',
  'full-bleed': 'spotlight',
  'clean-poster': 'bulletin',
  poster: 'caption'
})

/**
 * @param {unknown} value
 * @param {readonly string[]} canonicalIds
 * @param {string} [fallback]
 */
export function resolveStoryTemplateRouteValue(
  value,
  canonicalIds,
  fallback = 'frame'
) {
  const candidate = Array.isArray(value) ? value[0] : value

  if (typeof candidate !== 'string') return fallback
  if (canonicalIds.includes(candidate)) return candidate

  return LEGACY_STORY_TEMPLATE_ALIASES[candidate] ?? fallback
}
