import type { ParsedYoutubeUrl } from '../types/youtube-metadata'

const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be'
])

export function parseYoutubeUrl(input: string): ParsedYoutubeUrl | null {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return null
  }

  const url = toUrl(trimmedInput)

  if (!url || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
    return null
  }

  const videoId = extractVideoId(url)

  if (!videoId || !YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
    return null
  }

  return {
    videoId,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`
  }
}

function toUrl(input: string): URL | null {
  try {
    return new URL(input)
  } catch {
    try {
      return new URL(`https://${input}`)
    } catch {
      return null
    }
  }
}

function extractVideoId(url: URL): string | null {
  const hostname = url.hostname.toLowerCase()

  if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
    return firstPathSegment(url)
  }

  if (url.pathname === '/watch') {
    return url.searchParams.get('v')
  }

  if (url.pathname.startsWith('/shorts/')) {
    return pathSegmentAt(url, 1)
  }

  if (url.pathname.startsWith('/embed/')) {
    return pathSegmentAt(url, 1)
  }

  return null
}

function firstPathSegment(url: URL): string | null {
  return pathSegmentAt(url, 0)
}

function pathSegmentAt(url: URL, index: number): string | null {
  return url.pathname.split('/').filter(Boolean)[index] ?? null
}
