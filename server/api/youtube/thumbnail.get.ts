import { createError, defineEventHandler, getQuery } from 'h3'

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export default defineEventHandler(async (event) => {
  const { videoId } = getQuery(event)

  if (typeof videoId !== 'string' || !VIDEO_ID_PATTERN.test(videoId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid YouTube video ID is required.'
    })
  }

  const candidates = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg']
  const signal = AbortSignal.timeout(5_000)
  let response: Response | null = null

  for (const filename of candidates) {
    try {
      const candidate = await fetch(`https://i.ytimg.com/vi/${videoId}/${filename}`, { signal })

      if (candidate.ok && candidate.body) {
        response = candidate
        break
      }
    } catch {
      // Try the next standard YouTube thumbnail size.
    }
  }

  if (!response?.body) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not load this YouTube thumbnail.'
    })
  }

  return new Response(response.body, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'Content-Type': response.headers.get('content-type') || 'image/jpeg'
    }
  })
})
