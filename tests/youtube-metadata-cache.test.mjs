import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createYoutubeMetadataCacheKey,
  readYoutubeMetadataCache,
  resolveYoutubeMetadata,
  writeYoutubeMetadataCache
} from '../server/utils/youtube-metadata-cache.js'

const metadata = {
  videoId: 'dQw4w9WgXcQ',
  canonicalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Example video',
  channelName: 'Example channel',
  thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  provider: 'youtube',
  source: 'oembed'
}

test('builds one metadata cache key per video ID', () => {
  assert.equal(
    createYoutubeMetadataCacheKey('https://story.example/?source=instagram', 'dQw4w9WgXcQ'),
    'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ'
  )
})

test('returns normalized metadata from a cache hit', async () => {
  const cache = {
    async match() {
      return Response.json(metadata)
    }
  }

  assert.deepEqual(
    await readYoutubeMetadataCache(
      cache,
      'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ'
    ),
    metadata
  )
})

test('stores successful metadata for 24 hours at the edge', async () => {
  let storedRequest
  let storedResponse
  const cache = {
    async put(request, response) {
      storedRequest = request
      storedResponse = response
    }
  }

  await writeYoutubeMetadataCache(
    cache,
    'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    metadata
  )

  assert.equal(storedRequest.method, 'GET')
  assert.equal(
    storedResponse.headers.get('Cache-Control'),
    'public, max-age=86400'
  )
  assert.deepEqual(await storedResponse.json(), metadata)
})

test('bypasses caching when the Cloudflare Cache API is unavailable', async () => {
  const result = await resolveYoutubeMetadata({
    cache: null,
    key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    loadFresh: async () => metadata
  })

  assert.deepEqual(result, { metadata, cacheStatus: 'BYPASS' })
})

test('returns a valid cache hit without calling the provider', async () => {
  const result = await resolveYoutubeMetadata({
    cache: {
      async match() {
        return Response.json(metadata)
      },
      async put() {
        assert.fail('cache hits must not be written again')
      }
    },
    key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    loadFresh: async () => assert.fail('cache hits must not call YouTube')
  })

  assert.deepEqual(result, { metadata, cacheStatus: 'HIT' })
})

test('treats malformed cached metadata as a miss', async () => {
  let writes = 0
  const result = await resolveYoutubeMetadata({
    cache: {
      async match() {
        return Response.json({ title: 'incomplete' })
      },
      async put() {
        writes += 1
      }
    },
    key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    loadFresh: async () => metadata
  })

  assert.equal(writes, 1)
  assert.deepEqual(result, { metadata, cacheStatus: 'MISS' })
})

test('bypasses a failed cache read and still loads metadata', async () => {
  const cacheErrors = []
  const result = await resolveYoutubeMetadata({
    cache: {
      async match() {
        throw new Error('cache unavailable')
      },
      async put() {
        assert.fail('a failed cache must be bypassed')
      }
    },
    key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    loadFresh: async () => metadata,
    onCacheError: (operation) => cacheErrors.push(operation)
  })

  assert.deepEqual(cacheErrors, ['read'])
  assert.deepEqual(result, { metadata, cacheStatus: 'BYPASS' })
})

test('returns fresh metadata when a cache write fails', async () => {
  const cacheErrors = []
  const result = await resolveYoutubeMetadata({
    cache: {
      async match() {
        return undefined
      },
      async put() {
        throw new Error('cache full')
      }
    },
    key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
    loadFresh: async () => metadata,
    onCacheError: (operation) => cacheErrors.push(operation)
  })

  assert.deepEqual(cacheErrors, ['write'])
  assert.deepEqual(result, { metadata, cacheStatus: 'MISS' })
})

test('does not cache provider failures', async () => {
  let writes = 0
  const providerError = new Error('provider failed')

  await assert.rejects(
    resolveYoutubeMetadata({
      cache: {
        async match() {
          return undefined
        },
        async put() {
          writes += 1
        }
      },
      key: 'https://story.example/api/youtube/metadata-cache/dQw4w9WgXcQ',
      loadFresh: async () => {
        throw providerError
      }
    }),
    providerError
  )

  assert.equal(writes, 0)
})
