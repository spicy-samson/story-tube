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
              v-for="template in templates"
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
                :class="template.swatchClass"
                aria-hidden="true"
              />
              <span class="block truncate text-xs font-extrabold">{{ template.name }}</span>
              <span class="mt-0.5 block truncate text-[10px] text-white/45">{{ template.description }}</span>
            </button>
          </div>
        </div>

        <div class="mt-auto grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]" aria-label="Export actions">
          <button
            type="button"
            class="min-h-13 rounded-lg bg-[#f04b32] px-5 font-extrabold text-white transition hover:bg-[#ff5b40] focus:outline-none focus:ring-2 focus:ring-[#ff8a72] disabled:opacity-45"
            :disabled="!metadata || pending || isExporting"
            @click="downloadStory"
          >
            {{ isExporting ? 'Rendering HD PNG...' : 'Download 1080x1920 PNG' }}
          </button>
          <button type="button" class="min-h-13 rounded-lg border border-white/15 bg-white/[0.06] px-5 font-extrabold text-white disabled:opacity-45" disabled>
            Copy link
          </button>
          <p
            v-if="exportMessage"
            class="text-xs leading-5 sm:col-span-2"
            :class="exportStatus === 'error' ? 'text-[#ffb6a7]' : 'text-[#b9f6cf]'"
            role="status"
            aria-live="polite"
          >
            {{ exportMessage }}
          </p>
        </div>
      </div>

      <div class="grid min-h-[34rem] min-w-0 place-items-center rounded-lg border border-white/10 bg-[#101218]/85 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
        <StoryPreview
          ref="storyPreview"
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
import type { StoryTemplateId, StoryTemplateOption } from './shared/types/story-template'
import type { YoutubeMetadata } from './shared/types/youtube-metadata'

const templates: StoryTemplateOption[] = [
  {
    id: 'centered',
    name: 'Centered',
    description: 'Media card',
    swatchClass: 'bg-[linear-gradient(135deg,#050505_0%,#201b1a_100%)]'
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Bold & dark',
    swatchClass: 'bg-[linear-gradient(135deg,#262626_0%,#050505_70%)]'
  },
  {
    id: 'poster',
    name: 'Poster',
    description: 'Serif editorial',
    swatchClass: 'bg-[#416f9f]'
  },
  {
    id: 'progress',
    name: 'Progress',
    description: 'Player inspired',
    swatchClass: 'bg-[linear-gradient(180deg,#40342f_0%,#080808_100%)]'
  },
  {
    id: 'clean-poster',
    name: 'Clean',
    description: 'Type first',
    swatchClass: 'bg-[#f2f2ef]'
  },
  {
    id: 'full-bleed',
    name: 'Full bleed',
    description: 'Image forward',
    swatchClass: 'bg-[linear-gradient(90deg,#030303_0%,#564238_100%)]'
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Floating card',
    swatchClass: 'bg-[linear-gradient(135deg,#080909_0%,#322927_100%)]'
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    description: 'Color-matched poster',
    swatchClass: 'bg-[linear-gradient(135deg,#19364b_0%,#dc7b67_100%)]'
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Image & type',
    swatchClass: 'bg-[linear-gradient(180deg,#b35d48_0%,#b35d48_50%,#17232c_50%,#17232c_100%)]'
  },
  {
    id: 'liquid',
    name: 'Liquid',
    description: 'Glass color flow',
    swatchClass: 'bg-[linear-gradient(135deg,#f8fafc_0%,#76a7c8_36%,#17232c_100%)]'
  }
]

const videoUrl = ref('')
const metadata = ref<YoutubeMetadata | null>(null)
const errorMessage = ref('')
const selectedTemplate = ref<StoryTemplateId>('centered')
const storyPreview = useTemplateRef<{
  getExportElement: () => HTMLElement | null
}>('storyPreview')
const {
  exportPng,
  isExporting,
  message: exportMessage,
  resetExportStatus,
  status: exportStatus
} = useStoryExport()

const selectedTemplateName = computed(() =>
  templates.find(template => template.id === selectedTemplate.value)?.name ?? 'Centered'
)
const trimmedVideoUrl = computed(() => videoUrl.value.trim())
const isGenerateDisabled = computed(() => pending.value || !trimmedVideoUrl.value)
const statusMessage = computed(() => {
  if (pending.value) return 'Fetching YouTube metadata...'
  if (errorMessage.value) return errorMessage.value
  if (metadata.value) return `Loaded: ${metadata.value.channelName}`
  return 'Load a video to create and download an HD story.'
})

const previewMetadata = computed<YoutubeMetadata | null>(() => {
  if (!metadata.value) return null

  return {
    ...metadata.value,
    thumbnailUrl: `/api/youtube/thumbnail?videoId=${encodeURIComponent(metadata.value.videoId)}`
  }
})

const { pending, execute } = useLazyFetch<YoutubeMetadata>('/api/youtube/metadata', {
  query: computed(() => ({ url: trimmedVideoUrl.value })),
  immediate: false,
  watch: false,
  onResponse({ response }) {
    metadata.value = response._data ?? null
    errorMessage.value = ''
  },
  onResponseError({ response }) {
    const responseData = response._data as unknown as { statusMessage?: string } | undefined

    metadata.value = null
    errorMessage.value = responseData?.statusMessage ?? 'Could not fetch metadata for this link.'
  },
  onRequestError({ error }) {
    metadata.value = null
    errorMessage.value = error.message || 'Could not reach the metadata endpoint.'
  }
})

async function fetchMetadata() {
  if (!trimmedVideoUrl.value || pending.value) return
  errorMessage.value = ''
  resetExportStatus()
  await execute()
}

async function downloadStory() {
  if (!metadata.value) return
  await exportPng(storyPreview.value?.getExportElement() ?? null, metadata.value.title)
}

watch(selectedTemplate, resetExportStatus)
</script>
