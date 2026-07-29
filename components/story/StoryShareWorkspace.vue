<template>
  <main class="min-h-screen bg-[#ececea] px-3 py-4 text-[#171717] sm:px-6 sm:py-6">
    <section
      class="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-7xl overflow-hidden rounded-lg bg-[#f5f5f2] shadow-2xl sm:min-h-[calc(100dvh-3rem)] lg:grid-cols-[minmax(22rem,1fr)_minmax(22rem,0.72fr)]"
      aria-labelledby="share-page-title"
    >
      <div class="grid min-h-0 place-items-center border-b border-black/10 bg-white p-5 lg:border-b-0 lg:border-r lg:p-8">
        <StoryPreview
          ref="sharePreview"
          :metadata="metadata"
          :is-loading="false"
          error-message=""
          :template-id="templateId"
          :share-variant="variant"
          :qr-position="qrPosition"
          :qr-code-data-url="qrCodeDataUrl"
          class="max-h-[76dvh] max-w-[25rem]"
        />
      </div>

      <div class="flex min-w-0 flex-col p-5 sm:p-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase text-[#e3482e]">Story studio</p>
            <h1 id="share-page-title" class="mt-2 text-3xl font-black">Ready to share</h1>
            <p class="mt-1 text-sm text-black/55">High-resolution 1080 x 1920 PNG</p>
          </div>
          <NuxtLink
            :to="editTo"
            class="rounded-md px-2 py-1 text-sm font-black text-black/55 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-[#e3482e]"
          >
            Back to edit
          </NuxtLink>
        </div>

        <div class="mt-7 border-y border-black/10 py-5">
          <p class="text-xs font-black uppercase text-black/45">Choose your copy</p>
          <div class="mt-3 grid grid-cols-2 rounded-lg bg-black/[0.06] p-1">
            <button
              v-for="option in variantOptions"
              :key="option.value"
              type="button"
              class="min-h-11 rounded-md px-3 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-[#e3482e]"
              :class="variant === option.value ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black'"
              :aria-pressed="variant === option.value"
              @click="emit('update:variant', option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <label v-if="variant === 'qr'" for="qr-position" class="mt-4 block text-xs font-black uppercase text-black/45">
            QR position
          </label>
          <select
            v-if="variant === 'qr'"
            id="qr-position"
            :value="qrPosition"
            class="mt-2 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-bold outline-none focus:border-[#e3482e] focus:ring-2 focus:ring-[#e3482e]/20"
            @change="emitQrPosition"
          >
            <option v-for="position in qrPositions" :key="position.value" :value="position.value">
              {{ position.label }}
            </option>
          </select>
        </div>

        <div class="py-5">
          <div class="flex items-center justify-between gap-3">
            <label for="canonical-url" class="text-xs font-black uppercase text-black/45">YouTube link</label>
            <button
              type="button"
              class="text-sm font-black text-[#d83d26] hover:text-[#a92d1c] focus:outline-none focus:ring-2 focus:ring-[#e3482e]"
              @click="emit('copy-link')"
            >
              Copy link
            </button>
          </div>
          <input
            id="canonical-url"
            :value="canonicalUrl"
            readonly
            class="mt-2 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-black/65 outline-none focus:border-[#e3482e] focus:ring-2 focus:ring-[#e3482e]/20"
            @focus="selectInput"
          >
          <p v-if="copyMessage" class="mt-2 text-xs font-bold" :class="copyFailed ? 'text-[#b12e21]' : 'text-[#217246]'">
            {{ copyMessage }}
          </p>
        </div>

        <div class="border-t border-black/10 pt-5">
          <p class="text-xs font-black uppercase text-black/45">How to post</p>
          <ol class="mt-3 grid gap-2 text-sm leading-5 text-black/60">
            <li><strong class="text-black">1.</strong> Share or download your chosen story copy.</li>
            <li><strong class="text-black">2.</strong> Add the image to Instagram Stories.</li>
            <li><strong class="text-black">3.</strong> Add a Link Sticker and paste the copied YouTube URL.</li>
          </ol>
        </div>

        <div class="mt-auto grid gap-2 pt-7 sm:grid-cols-2">
          <button
            v-if="supportsNativeShare"
            type="button"
            class="min-h-13 rounded-lg bg-[#111] px-5 font-extrabold text-white transition hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-[#e3482e] disabled:opacity-45"
            :disabled="!assetReady || isBusy"
            @click="emit('share')"
          >
            {{ isBusy ? 'Preparing...' : 'Share image' }}
          </button>
          <button
            type="button"
            class="min-h-13 rounded-lg border border-black/20 bg-white px-5 font-extrabold text-black transition hover:bg-black/[0.04] focus:outline-none focus:ring-2 focus:ring-[#e3482e] disabled:opacity-45"
            :class="{ 'sm:col-span-2': !supportsNativeShare }"
            :disabled="!assetReady || isBusy"
            @click="emit('download')"
          >
            {{ isBusy ? 'Rendering HD PNG...' : 'Download PNG' }}
          </button>
        </div>

        <p
          class="min-h-5 pt-3 text-xs font-bold"
          :class="status === 'error' ? 'text-[#b12e21]' : 'text-[#217246]'"
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
  supportsNativeShare: boolean
  templateId: StoryTemplateId
  variant: StoryShareVariant
}>()

const emit = defineEmits<{
  'copy-link': []
  download: []
  share: []
  'update:qrPosition': [value: QrPosition]
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
