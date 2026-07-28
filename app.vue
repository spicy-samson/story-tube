<template>
  <main class="app-shell">
    <section class="workspace" aria-labelledby="workspace-title">
      <div class="workspace__panel workspace__panel--controls">
        <p class="eyebrow">Metadata pipeline · M2</p>
        <h1 id="workspace-title">Make a YouTube link beautiful for your story.</h1>
        <p class="intro">
          Paste a video link and pull real title, channel, thumbnail, and source metadata into the story preview.
        </p>

        <form class="link-form" aria-label="YouTube story maker input" @submit.prevent="fetchMetadata">
          <label for="video-url">YouTube link</label>
          <div class="input-row">
            <input
              id="video-url"
              v-model="videoUrl"
              type="url"
              inputmode="url"
              placeholder="Paste YouTube URL here..."
              autocomplete="off"
              :aria-invalid="Boolean(errorMessage)"
              aria-describedby="metadata-status"
            >
            <button type="submit" :disabled="isGenerateDisabled">
              {{ pending ? 'Loading...' : 'Generate' }}
            </button>
          </div>
          <p
            id="metadata-status"
            class="field-note"
            :class="{ 'field-note--error': errorMessage, 'field-note--success': metadata }"
            role="status"
            aria-live="polite"
          >
            {{ statusMessage }}
          </p>
        </form>

        <div class="template-picker" aria-label="Template picker preview">
          <div class="section-label">
            <span>Templates</span>
            <small>Coming M3-M5</small>
          </div>
          <div class="template-grid">
            <button type="button" class="template-option template-option--active" disabled>
              <span>Minimal</span>
            </button>
            <button type="button" class="template-option" disabled>
              <span>Cinematic</span>
            </button>
            <button type="button" class="template-option" disabled>
              <span>Creator</span>
            </button>
          </div>
        </div>

        <div class="action-strip" aria-label="Export actions">
          <button type="button" class="primary-action" disabled>Export 1080x1920 PNG</button>
          <button type="button" class="secondary-action" disabled>Copy video link</button>
        </div>
      </div>

      <div class="workspace__panel workspace__panel--preview" aria-label="Story card preview">
        <div class="phone-frame">
          <article class="story-card">
            <div class="story-card__source">Watch on YouTube</div>
            <div class="story-card__thumbnail" :class="{ 'story-card__thumbnail--loaded': metadata }">
              <img
                v-if="metadata"
                :src="metadata.thumbnailUrl"
                :alt="`${metadata.title} thumbnail`"
              >
              <div v-else class="play-mark" aria-hidden="true"></div>
            </div>
            <div class="story-card__copy">
              <p class="story-card__label">Now watching</p>
              <h2>{{ metadata?.title ?? 'Paste a video link to build the first card.' }}</h2>
              <p>
                <template v-if="metadata">
                  {{ metadata.channelName }} · Metadata from {{ metadata.source }}
                </template>
                <template v-else>
                  Title, channel, thumbnail, and source metadata plug into this preview after you generate.
                </template>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>


<script setup lang="ts">
import type { YoutubeMetadata } from './shared/types/youtube-metadata'

const videoUrl = ref('')
const metadata = ref<YoutubeMetadata | null>(null)
const errorMessage = ref('')

const trimmedVideoUrl = computed(() => videoUrl.value.trim())
const isGenerateDisabled = computed(() => pending.value || !trimmedVideoUrl.value)
const statusMessage = computed(() => {
  if (pending.value) {
    return 'Fetching YouTube metadata...'
  }

  if (errorMessage.value) {
    return errorMessage.value
  }

  if (metadata.value) {
    return `Loaded: ${metadata.value.channelName}`
  }

  return 'M2 fetches metadata only. Templates and PNG export stay parked for M3/M4.'
})

const { pending, execute } = useLazyFetch<YoutubeMetadata>('/api/youtube/metadata', {
  query: computed(() => ({ url: trimmedVideoUrl.value })),
  immediate: false,
  watch: false,
  onResponse({ response }) {
    metadata.value = response._data
    errorMessage.value = ''
  },
  onResponseError({ response }) {
    metadata.value = null
    errorMessage.value = response._data?.statusMessage ?? 'Could not fetch metadata for this link.'
  },
  onRequestError({ error }) {
    metadata.value = null
    errorMessage.value = error.message || 'Could not reach the metadata endpoint.'
  }
})

async function fetchMetadata() {
  if (!trimmedVideoUrl.value || pending.value) {
    return
  }

  errorMessage.value = ''
  await execute()
}
</script>
