import { STORY_TEMPLATES } from '../config/story-templates'
import type { QrPosition, StoryShareVariant } from '../types/story-share'
import type { StoryTemplateId } from '../types/story-template'
import { resolveStoryTemplateRouteValue } from './story-template-route.js'

const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/
const STORY_TEMPLATE_IDS = STORY_TEMPLATES.map(template => template.id)
const STORY_SHARE_VARIANTS = new Set<StoryShareVariant>(['clean', 'qr'])
const QR_POSITIONS = new Set<QrPosition>([
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
])

export function firstRouteValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined
  }

  return typeof value === 'string' ? value : undefined
}

export function isYoutubeVideoId(value: unknown): value is string {
  return typeof value === 'string' && YOUTUBE_VIDEO_ID_PATTERN.test(value)
}

export function parseRouteVideoId(value: unknown): string | null {
  const candidate = firstRouteValue(value)
  return isYoutubeVideoId(candidate) ? candidate : null
}

export function parseStoryTemplate(value: unknown): StoryTemplateId {
  return resolveStoryTemplateRouteValue(value, STORY_TEMPLATE_IDS) as StoryTemplateId
}

export function parseStoryShareVariant(value: unknown): StoryShareVariant {
  const candidate = firstRouteValue(value)

  return candidate && STORY_SHARE_VARIANTS.has(candidate as StoryShareVariant)
    ? candidate as StoryShareVariant
    : 'clean'
}

export function parseQrPosition(value: unknown): QrPosition {
  const candidate = firstRouteValue(value)

  return candidate && QR_POSITIONS.has(candidate as QrPosition)
    ? candidate as QrPosition
    : 'bottom-left'
}

export function makeCanonicalYoutubeUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`
}
