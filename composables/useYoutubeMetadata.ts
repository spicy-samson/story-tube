import type { MaybeRefOrGetter } from 'vue'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

export function useYoutubeMetadata(sourceUrl: MaybeRefOrGetter<string>) {
  const metadata = ref<YoutubeMetadata | null>(null)
  const errorMessage = ref('')
  const pending = ref(false)
  const requestUrl = computed(() => toValue(sourceUrl).trim())
  const previewMetadata = computed<YoutubeMetadata | null>(() => {
    if (!metadata.value) return null

    return {
      ...metadata.value,
      thumbnailUrl: `/api/youtube/thumbnail?videoId=${encodeURIComponent(metadata.value.videoId)}`
    }
  })
  const requestFetch = useRequestFetch()

  async function load() {
    if (!requestUrl.value || pending.value) return null

    pending.value = true
    errorMessage.value = ''

    try {
      metadata.value = await requestFetch<YoutubeMetadata>('/api/youtube/metadata', {
        query: { url: requestUrl.value }
      })
      return metadata.value
    } catch (error) {
      const fetchError = error as {
        data?: { statusMessage?: string }
        message?: string
        statusMessage?: string
      }

      metadata.value = null
      errorMessage.value = fetchError.data?.statusMessage
        ?? fetchError.statusMessage
        ?? fetchError.message
        ?? 'Could not fetch metadata for this link.'
      return null
    } finally {
      pending.value = false
    }
  }

  function reset() {
    metadata.value = null
    errorMessage.value = ''
  }

  return {
    errorMessage,
    load,
    metadata,
    pending,
    previewMetadata,
    reset
  }
}
