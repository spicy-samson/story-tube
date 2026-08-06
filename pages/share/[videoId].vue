<template>
  <StoryShareWorkspace
    v-if="metadata && previewMetadata"
    ref="shareWorkspace"
    :asset="preparedAsset"
    :canonical-url="metadata.canonicalUrl"
    :copy-failed="copyFailed"
    :copy-message="copyMessage"
    :edit-to="editUrl"
    :is-busy="isPreparingAsset"
    :metadata="previewMetadata"
    :qr-code-data-url="qrCodeDataUrl"
    :qr-position="qrPosition"
    :status="shareStatus"
    :status-message="shareStatusMessage"
    :spotlight-x="spotlightX"
    :supports-native-share="supportsNativeShare"
    :template-id="selectedTemplate"
    :variant="shareVariant"
    @copy-link="copyCanonicalLink"
    @download="downloadPreparedStory"
    @share="sharePreparedStory"
    @update:qr-position="setQrPosition"
    @update:spotlight-x="setSpotlightX"
    @update:variant="setShareVariant"
  />

  <main
    v-else
    class="grid h-[100dvh] overflow-hidden bg-[var(--app-canvas)] px-4 pt-14 text-[var(--app-text)] transition-colors"
  >
    <section class="mx-auto my-5 w-full max-w-lg place-self-center overflow-auto rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-center sm:p-10">
      <p class="text-sm font-semibold text-[var(--app-accent)]">Posterize</p>
      <h1 class="mt-3 break-words text-2xl font-bold sm:text-3xl">
        {{ invalidVideoId ? 'This story link is not valid.' : errorMessage ? 'We could not load this video.' : 'Preparing your story...' }}
      </h1>
      <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--app-muted)]" role="status" aria-live="polite">
        {{ invalidVideoId
          ? 'The share URL needs a valid 11-character YouTube video ID.'
          : errorMessage || 'Loading the video metadata and story design.' }}
      </p>
      <NuxtLink
        v-if="invalidVideoId || errorMessage"
        to="/"
        class="mt-6 inline-grid min-h-12 place-items-center rounded-lg bg-[var(--app-accent)] px-6 font-semibold text-[var(--app-accent-text)] transition hover:bg-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
      >
        Start over
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { QrPosition, StoryExportAsset, StoryShareVariant } from '~/shared/types/story-share'
import type { StoryTemplateId } from '~/shared/types/story-template'
import { clampSpotlightX, parseSpotlightX } from '~/shared/utils/spotlight-crop.js'
import {
  makeCanonicalYoutubeUrl,
  parseQrPosition,
  parseRouteVideoId,
  parseStoryShareVariant,
  parseStoryTemplate
} from '~/shared/utils/story-route'

const route = useRoute()
const router = useRouter()
const videoId = parseRouteVideoId(route.params.videoId)
const invalidVideoId = !videoId
const sourceUrl = computed(() => videoId ? makeCanonicalYoutubeUrl(videoId) : '')
const selectedTemplate = ref<StoryTemplateId>(parseStoryTemplate(route.query.template))
const shareVariant = ref<StoryShareVariant>(parseStoryShareVariant(route.query.variant))
const qrPosition = ref<QrPosition>(parseQrPosition(route.query.qr))
const spotlightX = ref(parseSpotlightX(route.query.spotlightX))
const preparedAsset = ref<StoryExportAsset | null>(null)
const copyMessage = ref('')
const copyFailed = ref(false)
const supportsNativeShare = ref(false)
const shareWorkspace = useTemplateRef<{
  getExportElement: () => HTMLElement | null
  waitForPalette: () => Promise<void>
}>('shareWorkspace')
let preparationId = 0
let spotlightUpdateTimer: ReturnType<typeof setTimeout> | undefined

const {
  errorMessage,
  load,
  metadata,
  previewMetadata
} = useYoutubeMetadata(sourceUrl)
const {
  downloadAsset,
  isExporting,
  message: exportMessage,
  renderPng,
  resetExportStatus,
  shareAsset,
  status: exportStatus,
  supportsNativeFileShare
} = useStoryExport()
const {
  dataUrl: qrCodeDataUrl,
  error: qrCodeError,
  generate: generateQrCode,
  isGenerating: isGeneratingQrCode
} = useStoryQrCode()

const editUrl = computed(() =>
  `/?video=${encodeURIComponent(videoId ?? '')}&template=${encodeURIComponent(selectedTemplate.value)}&spotlightX=${encodeURIComponent(spotlightX.value)}`
)
const isPreparingAsset = computed(() =>
  isExporting.value || isGeneratingQrCode.value || exportStatus.value === 'sharing'
)
const shareStatus = computed(() =>
  shareVariant.value === 'qr' && qrCodeError.value ? 'error' : exportStatus.value
)
const shareStatusMessage = computed(() =>
  shareVariant.value === 'qr' && qrCodeError.value ? qrCodeError.value : exportMessage.value
)

useSeoMeta({
  title: () => metadata.value ? `Share ${metadata.value.title} - Posterize` : 'Share Story - Posterize',
  description: 'Prepare and export a YouTube story image.'
})

async function normalizeRouteQuery() {
  await router.replace({
    query: {
      template: selectedTemplate.value,
      variant: shareVariant.value,
      qr: qrPosition.value,
      spotlightX: spotlightX.value
    }
  })
}

async function copyCanonicalLink() {
  if (!metadata.value) return

  try {
    await navigator.clipboard.writeText(metadata.value.canonicalUrl)
    copyFailed.value = false
    copyMessage.value = "YouTube link copied. Paste it into Instagram's Link Sticker."
  } catch (error) {
    console.error('Clipboard copy failed:', error)
    copyFailed.value = true
    copyMessage.value = 'Automatic copy was blocked. Select and copy the URL below.'
  }
}

async function prepareShareAsset() {
  if (!metadata.value) return

  const currentPreparation = ++preparationId
  console.info('[Posterize share] Preparing asset', {
    preparationId: currentPreparation,
    template: selectedTemplate.value,
    variant: shareVariant.value,
    videoId
  })
  preparedAsset.value = null
  resetExportStatus()

  if (shareVariant.value === 'qr' && !qrCodeDataUrl.value) {
    await generateQrCode(metadata.value.canonicalUrl)
    if (!qrCodeDataUrl.value) return
  }

  await nextTick()
  await shareWorkspace.value?.waitForPalette()
  if (currentPreparation !== preparationId) return

  const asset = await renderPng(
    shareWorkspace.value?.getExportElement() ?? null,
    metadata.value.title,
    shareVariant.value
  )

  if (currentPreparation === preparationId) {
    preparedAsset.value = asset
    console.info('[Posterize share] Preparation finished', {
      bytes: asset?.blob.size ?? 0,
      preparationId: currentPreparation,
      ready: Boolean(asset)
    })
  }
}

function setShareVariant(value: StoryShareVariant) {
  if (shareVariant.value === value) return

  shareVariant.value = value
  void normalizeRouteQuery()
  void prepareShareAsset()
}

function setQrPosition(value: QrPosition) {
  if (qrPosition.value === value) return

  qrPosition.value = value
  void normalizeRouteQuery()
  if (shareVariant.value === 'qr') void prepareShareAsset()
}

function setSpotlightX(value: number) {
  const nextValue = clampSpotlightX(value)
  if (spotlightX.value === nextValue) return

  spotlightX.value = nextValue
  preparedAsset.value = null
  resetExportStatus()
  clearTimeout(spotlightUpdateTimer)
  spotlightUpdateTimer = setTimeout(() => {
    void normalizeRouteQuery()
    void prepareShareAsset()
  }, 160)
}

function downloadPreparedStory() {
  console.info('[Posterize share] Download PNG clicked', {
    bytes: preparedAsset.value?.blob.size ?? 0,
    ready: Boolean(preparedAsset.value)
  })
  if (preparedAsset.value) downloadAsset(preparedAsset.value)
}

async function sharePreparedStory() {
  if (preparedAsset.value) await shareAsset(preparedAsset.value)
}

if (videoId) await load()

onMounted(async () => {
  supportsNativeShare.value = supportsNativeFileShare()
  await normalizeRouteQuery()
  if (metadata.value) await prepareShareAsset()
})

onBeforeUnmount(() => clearTimeout(spotlightUpdateTimer))
</script>
