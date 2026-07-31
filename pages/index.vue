<template>
  <main class="min-h-screen bg-[var(--app-canvas)] px-3 pb-5 pt-16 text-[var(--app-text)] transition-colors sm:px-6 lg:grid lg:place-items-center lg:py-8">
    <section
      class="mx-auto grid w-full max-w-[1240px] min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]"
      aria-labelledby="workspace-title"
    >
      <div class="flex min-w-0 flex-col gap-5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4 sm:p-6">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-[var(--app-accent)]">Story Tube</p>
          <h1 id="workspace-title" class="max-w-[16ch] break-words text-3xl font-bold leading-tight sm:text-4xl">
            Make a YouTube link beautiful.
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            Paste a video, choose a look, and build a story-native 9:16 card.
          </p>
        </div>

        <form class="grid gap-2" aria-label="YouTube story maker input" @submit.prevent="fetchMetadata">
          <label for="video-url" class="text-sm font-semibold">YouTube link</label>
          <div class="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id="video-url"
              v-model="videoUrl"
              type="url"
              inputmode="url"
              placeholder="Paste YouTube URL here..."
              autocomplete="off"
              class="min-h-13 min-w-0 rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] px-4 text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
              :aria-invalid="Boolean(errorMessage)"
              aria-describedby="metadata-status"
            >
            <button
              type="submit"
              class="min-h-13 rounded-lg bg-[var(--app-accent)] px-5 font-semibold text-[var(--app-accent-text)] transition hover:bg-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] disabled:opacity-50"
              :disabled="isGenerateDisabled"
            >
              {{ pending ? 'Loading...' : 'Generate' }}
            </button>
          </div>
          <p
            id="metadata-status"
            class="text-xs leading-5"
            :class="errorMessage ? 'text-[var(--app-error)]' : metadata ? 'text-[var(--app-success)]' : 'text-[var(--app-muted)]'"
            role="status"
            aria-live="polite"
          >
            {{ statusMessage }}
          </p>
        </form>

        <div class="hidden gap-3 lg:grid" aria-label="Story template picker">
          <div class="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold">Choose a template</h2>
              <p class="mt-1 text-xs text-[var(--app-muted)]">Eight live designs, including thumbnail-matched colorways</p>
            </div>
            <span class="text-xs font-semibold text-[var(--app-accent)]">{{ selectedTemplateName }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            <button
              v-for="template in STORY_TEMPLATES"
              :key="template.id"
              type="button"
              class="group min-w-0 rounded-lg border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
              :class="selectedTemplate === template.id
                ? 'border-[var(--app-accent)] bg-[var(--app-surface-raised)]'
                : 'border-[var(--app-border)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-raised)]'"
              :aria-pressed="selectedTemplate === template.id"
              @click="selectedTemplate = template.id"
            >
              <span
                class="mb-2 block aspect-[16/9] rounded-md border border-[var(--app-border)]"
                :style="{ background: template.swatchBackground }"
                aria-hidden="true"
              />
              <span class="block truncate text-xs font-semibold">{{ template.name }}</span>
              <span class="mt-0.5 block truncate text-[10px] text-[var(--app-muted)]">{{ template.description }}</span>
            </button>
          </div>
        </div>

        <div class="mt-auto hidden gap-2 lg:grid" aria-label="Story sharing actions">
          <button
            type="button"
            class="min-h-13 rounded-lg bg-[var(--app-accent)] px-5 font-semibold text-[var(--app-accent-text)] transition hover:bg-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] disabled:opacity-45"
            :disabled="!metadata || pending"
            @click="openSharePage"
          >
            Share Story
          </button>
          <p class="text-xs leading-5 text-[var(--app-muted)]">
            Get a clean or QR story, then paste the copied link into Instagram's Link Sticker.
          </p>
        </div>
      </div>

      <div
        ref="mobileResultSection"
        class="grid min-h-[34rem] min-w-0 content-center gap-5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-raised)] p-3 shadow-sm sm:p-4"
      >
        <StoryTemplateCarousel
          v-model="selectedTemplate"
          v-model:spotlight-x="spotlightX"
          :metadata="previewMetadata"
          :is-loading="pending"
          :error-message="errorMessage"
        />

        <div
          v-if="metadata"
          class="grid gap-2 lg:hidden"
          aria-label="Story sharing actions"
        >
          <button
            type="button"
            class="min-h-13 rounded-lg bg-[var(--app-accent)] px-5 font-semibold text-[var(--app-accent-text)] transition hover:bg-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] disabled:opacity-45"
            :disabled="pending"
            @click="openSharePage"
          >
            Share Story
          </button>
          <p class="text-center text-xs leading-5 text-[var(--app-muted)]">
            {{ selectedTemplateName }} is ready to share.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { STORY_TEMPLATES } from '~/shared/config/story-templates'
import type { StoryTemplateId } from '~/shared/types/story-template'
import { parseSpotlightX } from '~/shared/utils/spotlight-crop.js'
import {
  makeCanonicalYoutubeUrl,
  parseRouteVideoId,
  parseStoryTemplate
} from '~/shared/utils/story-route'

const route = useRoute()
const router = useRouter()
const mobileResultSection = useTemplateRef<HTMLElement>('mobileResultSection')
const restoredVideoId = parseRouteVideoId(route.query.video)
const videoUrl = ref(restoredVideoId ? makeCanonicalYoutubeUrl(restoredVideoId) : '')
const selectedTemplate = ref<StoryTemplateId>(parseStoryTemplate(route.query.template))
const spotlightX = ref(parseSpotlightX(route.query.spotlightX))
const trimmedVideoUrl = computed(() => videoUrl.value.trim())
const {
  errorMessage,
  load,
  metadata,
  pending,
  previewMetadata
} = useYoutubeMetadata(trimmedVideoUrl)
const selectedTemplateName = computed(() =>
  STORY_TEMPLATES.find(template => template.id === selectedTemplate.value)?.name ?? 'Frame'
)
const isGenerateDisabled = computed(() => pending.value || !trimmedVideoUrl.value)
const statusMessage = computed(() => {
  if (pending.value) return 'Fetching YouTube metadata...'
  if (errorMessage.value) return errorMessage.value
  if (metadata.value) return `Loaded: ${metadata.value.channelName}`
  return 'Load a video to create and share an HD story.'
})

async function syncEditRoute() {
  if (!metadata.value) return

  await router.replace({
    query: {
      video: metadata.value.videoId,
      template: selectedTemplate.value,
      spotlightX: spotlightX.value
    }
  })
}

async function fetchMetadata() {
  const loadedMetadata = await load()
  if (!loadedMetadata) return

  await syncEditRoute()
  await scrollToStoryOnMobile()
}

async function scrollToStoryOnMobile() {
  if (!import.meta.client || !window.matchMedia('(max-width: 1023px)').matches) return

  await nextTick()
  mobileResultSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

async function openSharePage() {
  if (!metadata.value) return

  try {
    await navigator.clipboard.writeText(metadata.value.canonicalUrl)
  } catch (error) {
    console.info('Clipboard copy was unavailable before navigation:', error)
  }

  await navigateTo({
    path: `/share/${metadata.value.videoId}`,
    query: {
      template: selectedTemplate.value,
      variant: 'clean',
      qr: 'bottom-left',
      spotlightX: spotlightX.value
    }
  })
}

watch([selectedTemplate, spotlightX], () => {
  if (metadata.value) void syncEditRoute()
})

watch(() => [route.query.video, route.query.template, route.query.spotlightX], async () => {
  selectedTemplate.value = parseStoryTemplate(route.query.template)
  spotlightX.value = parseSpotlightX(route.query.spotlightX)

  const nextVideoId = parseRouteVideoId(route.query.video)
  if (!nextVideoId || nextVideoId === metadata.value?.videoId) return

  videoUrl.value = makeCanonicalYoutubeUrl(nextVideoId)
  await load()
})

if (restoredVideoId) {
  const restoredMetadata = await load()
  if (restoredMetadata) void scrollToStoryOnMobile()
}
</script>
