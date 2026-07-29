<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(247,78,80,0.18),transparent_28rem),linear-gradient(135deg,#111318_0%,#171719_46%,#101722_100%)] px-3 py-5 sm:px-6 lg:grid lg:place-items-center lg:py-8">
    <section
      class="mx-auto grid w-full max-w-[1240px] min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]"
      aria-labelledby="workspace-title"
    >
      <div class="flex min-w-0 flex-col gap-5 rounded-lg border border-white/10 bg-[#101218]/85 p-4 shadow-2xl backdrop-blur-2xl sm:p-6">
        <div class="space-y-3">
          <p class="text-xs font-extrabold uppercase text-[#ff6b4a]">Story studio</p>
          <h1 id="workspace-title" class="max-w-[12ch] break-words text-4xl font-black leading-[0.96] sm:text-6xl">
            Make a YouTube link beautiful.
          </h1>
          <p class="max-w-2xl text-base leading-7 text-[#c8c1b6]">
            Paste a video, choose a look, and build a story-native 9:16 card.
          </p>
        </div>

        <form class="grid gap-2" aria-label="YouTube story maker input" @submit.prevent="fetchMetadata">
          <label for="video-url" class="text-sm font-bold">YouTube link</label>
          <div class="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id="video-url"
              v-model="videoUrl"
              type="url"
              inputmode="url"
              placeholder="Paste YouTube URL here..."
              autocomplete="off"
              class="min-h-13 min-w-0 rounded-lg border border-white/15 bg-white/[0.07] px-4 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff6b4a] focus:ring-2 focus:ring-[#ff6b4a]/20"
              :aria-invalid="Boolean(errorMessage)"
              aria-describedby="metadata-status"
            >
            <button
              type="submit"
              class="min-h-13 rounded-lg bg-[#f04b32] px-5 font-extrabold text-white transition hover:bg-[#ff5b40] focus:outline-none focus:ring-2 focus:ring-[#ff8a72] disabled:opacity-50"
              :disabled="isGenerateDisabled"
            >
              {{ pending ? 'Loading...' : 'Generate' }}
            </button>
          </div>
          <p
            id="metadata-status"
            class="text-xs leading-5"
            :class="errorMessage ? 'text-[#ffb6a7]' : metadata ? 'text-[#b9f6cf]' : 'text-[#a9a096]'"
            role="status"
            aria-live="polite"
          >
            {{ statusMessage }}
          </p>
        </form>

        <div class="grid gap-3" aria-label="Story template picker">
          <div class="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 class="text-sm font-extrabold">Choose a template</h2>
              <p class="mt-1 text-xs text-[#a9a096]">Ten live designs, including thumbnail-matched colorways</p>
            </div>
            <span class="text-xs font-bold text-[#ff8067]">{{ selectedTemplateName }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            <button
              v-for="template in STORY_TEMPLATES"
              :key="template.id"
              type="button"
              class="group min-w-0 rounded-lg border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[#ff8067]"
              :class="selectedTemplate === template.id
                ? 'border-[#ff8067] bg-[#f04b32]/15'
                : 'border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]'"
              :aria-pressed="selectedTemplate === template.id"
              @click="selectedTemplate = template.id"
            >
              <span
                class="mb-2 block aspect-[16/9] rounded-md border border-white/10 shadow-inner"
                :style="{ background: template.swatchBackground }"
                aria-hidden="true"
              />
              <span class="block truncate text-xs font-extrabold">{{ template.name }}</span>
              <span class="mt-0.5 block truncate text-[10px] text-white/45">{{ template.description }}</span>
            </button>
          </div>
        </div>

        <div class="mt-auto grid gap-2" aria-label="Story sharing actions">
          <button
            type="button"
            class="min-h-13 rounded-lg bg-[#f04b32] px-5 font-extrabold text-white transition hover:bg-[#ff5b40] focus:outline-none focus:ring-2 focus:ring-[#ff8a72] disabled:opacity-45"
            :disabled="!metadata || pending"
            @click="openSharePage"
          >
            Share Story
          </button>
          <p class="text-xs leading-5 text-[#a9a096]">
            Get a clean or QR story, then paste the copied link into Instagram's Link Sticker.
          </p>
        </div>
      </div>

      <div class="grid min-h-[34rem] min-w-0 place-items-center rounded-lg border border-white/10 bg-[#101218]/85 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
        <StoryPreview
          :metadata="previewMetadata"
          :is-loading="pending"
          :error-message="errorMessage"
          :template-id="selectedTemplate"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { STORY_TEMPLATES } from '~/shared/config/story-templates'
import type { StoryTemplateId } from '~/shared/types/story-template'
import {
  makeCanonicalYoutubeUrl,
  parseRouteVideoId,
  parseStoryTemplate
} from '~/shared/utils/story-route'

const route = useRoute()
const router = useRouter()
const restoredVideoId = parseRouteVideoId(route.query.video)
const videoUrl = ref(restoredVideoId ? makeCanonicalYoutubeUrl(restoredVideoId) : '')
const selectedTemplate = ref<StoryTemplateId>(parseStoryTemplate(route.query.template))
const trimmedVideoUrl = computed(() => videoUrl.value.trim())
const {
  errorMessage,
  load,
  metadata,
  pending,
  previewMetadata
} = useYoutubeMetadata(trimmedVideoUrl)
const selectedTemplateName = computed(() =>
  STORY_TEMPLATES.find(template => template.id === selectedTemplate.value)?.name ?? 'Centered'
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
      template: selectedTemplate.value
    }
  })
}

async function fetchMetadata() {
  const loadedMetadata = await load()
  if (loadedMetadata) await syncEditRoute()
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
      qr: 'bottom-left'
    }
  })
}

watch(selectedTemplate, () => {
  if (metadata.value) void syncEditRoute()
})

watch(() => [route.query.video, route.query.template], async () => {
  selectedTemplate.value = parseStoryTemplate(route.query.template)

  const nextVideoId = parseRouteVideoId(route.query.video)
  if (!nextVideoId || nextVideoId === metadata.value?.videoId) return

  videoUrl.value = makeCanonicalYoutubeUrl(nextVideoId)
  await load()
})

if (restoredVideoId) await load()
</script>
