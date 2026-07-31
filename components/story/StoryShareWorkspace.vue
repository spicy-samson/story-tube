<template>
  <main class="min-h-screen bg-[var(--app-canvas)] px-3 pb-4 pt-16 text-[var(--app-text)] transition-colors sm:px-6 sm:pb-6">
    <section
      class="mx-auto grid min-h-[calc(100dvh-5rem)] w-full max-w-7xl overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] sm:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[minmax(22rem,1fr)_minmax(22rem,0.72fr)]"
      aria-labelledby="share-page-title"
    >
      <div class="grid min-h-0 place-items-center border-b border-[var(--app-border)] bg-[var(--app-surface-raised)] p-5 lg:border-b-0 lg:border-r lg:p-8">
        <StoryPreview
          ref="sharePreview"
          :metadata="metadata"
          :is-loading="false"
          error-message=""
          :template-id="templateId"
          :share-variant="variant"
          :qr-position="qrPosition"
          :qr-code-data-url="qrCodeDataUrl"
          :spotlight-x="spotlightX"
          class="max-h-[76dvh] max-w-[25rem]"
          @update:spotlight-x="emit('update:spotlightX', $event)"
        />
      </div>

      <div class="flex min-w-0 flex-col p-5 sm:p-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-[var(--app-accent)]">Story Tube</p>
            <h1 id="share-page-title" class="mt-2 text-2xl font-bold">Ready to share</h1>
            <p class="mt-1 text-sm text-[var(--app-muted)]">High-resolution 1080 x 1920 PNG</p>
          </div>
          <NuxtLink
            :to="editTo"
            class="rounded-md px-2 py-1 text-sm font-semibold text-[var(--app-muted)] transition hover:text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
          >
            Back to edit
          </NuxtLink>
        </div>

        <div class="mt-7 border-y border-[var(--app-border)] py-5">
          <p class="text-xs font-semibold text-[var(--app-muted)]">Choose your copy</p>
          <div class="mt-3 grid grid-cols-2 rounded-lg bg-[var(--app-surface-raised)] p-1">
            <button
              v-for="option in variantOptions"
              :key="option.value"
              type="button"
              class="min-h-11 rounded-md px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
              :class="variant === option.value
                ? 'bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm'
                : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'"
              :aria-pressed="variant === option.value"
              @click="emit('update:variant', option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <label v-if="variant === 'qr'" for="qr-position" class="mt-4 block text-xs font-semibold text-[var(--app-muted)]">
            QR position
          </label>
          <select
            v-if="variant === 'qr'"
            id="qr-position"
            :value="qrPosition"
            class="mt-2 min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] px-3 text-sm font-medium text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
            @change="emitQrPosition"
          >
            <option v-for="position in qrPositions" :key="position.value" :value="position.value">
              {{ position.label }}
            </option>
          </select>
        </div>

        <div class="py-5">
          <div class="flex items-center justify-between gap-3">
            <label for="canonical-url" class="text-xs font-semibold text-[var(--app-muted)]">YouTube link</label>
            <button
              type="button"
              class="text-sm font-semibold text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
              @click="emit('copy-link')"
            >
              Copy link
            </button>
          </div>
          <input
            id="canonical-url"
            :value="canonicalUrl"
            readonly
            class="mt-2 min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] px-3 text-sm text-[var(--app-muted)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
            @focus="selectInput"
          >
          <p v-if="copyMessage" class="mt-2 text-xs font-semibold" :class="copyFailed ? 'text-[var(--app-error)]' : 'text-[var(--app-success)]'">
            {{ copyMessage }}
          </p>
        </div>

        <div class="border-t border-[var(--app-border)] pt-5">
          <p class="text-xs font-semibold text-[var(--app-muted)]">How to post</p>
          <ol class="mt-3 grid gap-2 text-sm leading-5 text-[var(--app-muted)]">
            <li><strong class="font-semibold text-[var(--app-text)]">1.</strong> Share or download your chosen story copy.</li>
            <li><strong class="font-semibold text-[var(--app-text)]">2.</strong> Add the image to Instagram Stories.</li>
            <li><strong class="font-semibold text-[var(--app-text)]">3.</strong> Add a Link Sticker and paste the copied YouTube URL.</li>
          </ol>
        </div>

        <div class="mt-auto grid gap-2 pt-7 sm:grid-cols-2">
          <button
            v-if="supportsNativeShare"
            type="button"
            class="min-h-13 rounded-lg bg-[var(--app-accent)] px-5 font-semibold text-[var(--app-accent-text)] transition hover:bg-[var(--app-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] disabled:opacity-45"
            :disabled="!assetReady || isBusy"
            @click="emit('share')"
          >
            {{ isBusy ? 'Preparing...' : 'Share image' }}
          </button>
          <button
            type="button"
            class="min-h-13 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-5 font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] disabled:opacity-45"
            :class="{ 'sm:col-span-2': !supportsNativeShare }"
            :disabled="!assetReady || isBusy"
            @click="emit('download')"
          >
            {{ isBusy ? 'Rendering HD PNG...' : 'Download PNG' }}
          </button>
        </div>

        <p
          class="min-h-5 pt-3 text-xs font-semibold"
          :class="status === 'error' ? 'text-[var(--app-error)]' : 'text-[var(--app-success)]'"
          role="status"
          aria-live="polite"
        >
          {{ statusMessage }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { StoryExportAsset, QrPosition, StoryShareVariant } from '~/shared/types/story-share'
import type { StoryTemplateId } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

const props = defineProps<{
  asset: StoryExportAsset | null
  canonicalUrl: string
  copyFailed: boolean
  copyMessage: string
  editTo: string
  isBusy: boolean
  metadata: YoutubeMetadata
  qrCodeDataUrl: string
  qrPosition: QrPosition
  status: string
  statusMessage: string
  spotlightX: number
  supportsNativeShare: boolean
  templateId: StoryTemplateId
  variant: StoryShareVariant
}>()

const emit = defineEmits<{
  'copy-link': []
  download: []
  share: []
  'update:qrPosition': [value: QrPosition]
  'update:spotlightX': [value: number]
  'update:variant': [value: StoryShareVariant]
}>()

const variantOptions: Array<{ label: string, value: StoryShareVariant }> = [
  { label: 'Clean Story', value: 'clean' },
  { label: 'QR Story', value: 'qr' }
]
const qrPositions: Array<{ label: string, value: QrPosition }> = [
  { label: 'Top left', value: 'top-left' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Bottom left', value: 'bottom-left' },
  { label: 'Bottom right', value: 'bottom-right' }
]
const sharePreview = useTemplateRef<{
  getExportElement: () => HTMLElement | null
  waitForPalette: () => Promise<void>
}>('sharePreview')
const assetReady = computed(() => props.asset?.variant === props.variant)

function emitQrPosition(event: Event) {
  emit('update:qrPosition', (event.target as HTMLSelectElement).value as QrPosition)
}

function selectInput(event: FocusEvent) {
  (event.target as HTMLInputElement).select()
}

defineExpose({
  getExportElement: () => sharePreview.value?.getExportElement() ?? null,
  waitForPalette: () => sharePreview.value?.waitForPalette() ?? Promise.resolve()
})
</script>
