// @ts-check

export const METADATA_BROWSER_CACHE_CONTROL = 'public, max-age=300, s-maxage=86400'
export const METADATA_EDGE_CACHE_CONTROL = 'public, max-age=86400'

/**
 * @param {string} origin
 * @param {string} videoId
 */
export function createYoutubeMetadataCacheKey(origin, videoId) {
  return new URL(`/api/youtube/metadata-cache/${videoId}`, origin).toString()
}

/** @returns {Cache | null} */
export function getCloudflareDefaultCache() {
  const cacheStorage = globalThis.caches

  if (!cacheStorage || !('default' in cacheStorage)) {
    return null
  }

  return /** @type {CacheStorage & { default: Cache }} */ (cacheStorage).default
}

/**
 * @param {Pick<Cache, 'match'>} cache
 * @param {string} key
 */
export async function readYoutubeMetadataCache(cache, key) {
  const response = await cache.match(new Request(key))

  if (!response?.ok) {
    return null
  }

  return response.json()
}

/**
 * @param {Pick<Cache, 'put'>} cache
 * @param {string} key
 * @param {unknown} metadata
 */
export async function writeYoutubeMetadataCache(cache, key, metadata) {
  const response = Response.json(metadata, {
    headers: {
      'Cache-Control': METADATA_EDGE_CACHE_CONTROL
    }
  })

  await cache.put(new Request(key), response)
}

/**
 * @typedef {{
 *   videoId: string,
 *   canonicalUrl: string,
 *   title: string,
 *   channelName: string,
 *   thumbnailUrl: string,
 *   provider: 'youtube',
 *   source: 'oembed' | 'youtube-data-api',
 *   duration?: string
 * }} YoutubeMetadata
 */

/**
 * @param {{
 *   cache: Pick<Cache, 'match' | 'put'> | null,
 *   key: string,
 *   loadFresh: () => Promise<YoutubeMetadata>,
 *   onCacheError?: (operation: 'read' | 'write', error: unknown) => void,
 *   defer?: (promise: Promise<void>) => void
 * }} options
 * @returns {Promise<{ metadata: YoutubeMetadata, cacheStatus: 'HIT' | 'MISS' | 'BYPASS' }>}
 */
export async function resolveYoutubeMetadata({
  cache,
  key,
  loadFresh,
  onCacheError = () => {},
  defer
}) {
  if (cache) {
    try {
      const cachedMetadata = await readYoutubeMetadataCache(cache, key)

      if (isYoutubeMetadata(cachedMetadata)) {
        return { metadata: cachedMetadata, cacheStatus: 'HIT' }
      }
    } catch (error) {
      onCacheError('read', error)
      cache = null
    }
  }

  const metadata = await loadFresh()

  if (!cache) {
    return { metadata, cacheStatus: 'BYPASS' }
  }

  const cacheWrite = writeYoutubeMetadataCache(cache, key, metadata).catch((error) => {
    onCacheError('write', error)
  })

  if (defer) {
    defer(cacheWrite)
  } else {
    await cacheWrite
  }

  return { metadata, cacheStatus: 'MISS' }
}

/**
 * @param {unknown} value
 * @returns {value is YoutubeMetadata}
 */
function isYoutubeMetadata(value) {
  if (typeof value !== 'object' || value === null) return false

  const metadata = /** @type {Record<string, unknown>} */ (value)

  return (
    typeof metadata.videoId === 'string' &&
    typeof metadata.canonicalUrl === 'string' &&
    typeof metadata.title === 'string' &&
    typeof metadata.channelName === 'string' &&
    typeof metadata.thumbnailUrl === 'string' &&
    metadata.provider === 'youtube' &&
    (metadata.source === 'oembed' || metadata.source === 'youtube-data-api') &&
    (metadata.duration === undefined || typeof metadata.duration === 'string')
  )
}
