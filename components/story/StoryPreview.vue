<template>
  <div
    ref="exportElement"
    class="relative aspect-[9/16] w-full max-w-96 min-w-0 overflow-hidden rounded-[1.8rem] bg-[#050506] shadow-[0_32px_70px_rgba(0,0,0,0.42)] ring-[0.5rem] ring-[#050506]"
    data-story-preview
  >
    <div class="relative h-full w-full overflow-hidden">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="scale-[0.985] opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <component
          :is="activeComponent"
          :key="templateId"
          :metadata="metadata"
          :is-loading="isLoading"
          :error-message="errorMessage"
          :palette="palette"
          :spotlight-x="templateId === 'spotlight' ? spotlightX : undefined"
        />
      </Transition>
      <StoryQrSticker
        v-if="shareVariant === 'qr' && qrCodeDataUrl"
        :data-url="qrCodeDataUrl"
        :position="qrPosition"
      />
    </div>
    <SpotlightDragHandle
      v-if="templateId === 'spotlight' && metadata"
      :model-value="spotlightX"
      @update:model-value="emit('update:spotlightX', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { QrPosition, StoryShareVariant } from '~/shared/types/story-share'
import type { StoryTemplateId } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
import { DEFAULT_SPOTLIGHT_X, clampSpotlightX } from '~/shared/utils/spotlight-crop.js'
import SpotlightDragHandle from './SpotlightDragHandle.vue'
import BulletinStoryCard from './templates/BulletinStoryCard.vue'
import CaptionStoryCard from './templates/CaptionStoryCard.vue'
import ChromaticStoryCard from './templates/ChromaticStoryCard.vue'
import FrameStoryCard from './templates/FrameStoryCard.vue'
import HeadlineStoryCard from './templates/HeadlineStoryCard.vue'
import LiquidStoryCard from './templates/LiquidStoryCard.vue'
import SpotlightStoryCard from './templates/SpotlightStoryCard.vue'
import SplitStoryCard from './templates/SplitStoryCard.vue'

const props = defineProps<{
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
  templateId: StoryTemplateId
  shareVariant?: StoryShareVariant
  qrPosition?: QrPosition
  qrCodeDataUrl?: string
  spotlightX?: number
}>()

const emit = defineEmits<{
  'update:spotlightX': [value: number]
}>()

const shareVariant = computed(() => props.shareVariant ?? 'clean')
const qrPosition = computed(() => props.qrPosition ?? 'bottom-left')
const qrCodeDataUrl = computed(() => props.qrCodeDataUrl ?? '')
const spotlightX = computed(() => clampSpotlightX(props.spotlightX ?? DEFAULT_SPOTLIGHT_X))

const templateComponents: Record<StoryTemplateId, Component> = {
  frame: FrameStoryCard,
  headline: HeadlineStoryCard,
  spotlight: SpotlightStoryCard,
  bulletin: BulletinStoryCard,
  caption: CaptionStoryCard,
  chromatic: ChromaticStoryCard,
  split: SplitStoryCard,
  liquid: LiquidStoryCard
}

const activeComponent = computed(() => templateComponents[props.templateId])
const thumbnailUrl = computed(() => props.metadata?.thumbnailUrl ?? null)
const { isSampling, palette } = useThumbnailPalette(thumbnailUrl)
const exportElement = useTemplateRef<HTMLElement>('exportElement')

async function waitForPalette() {
  if (isSampling.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(isSampling, (sampling) => {
        if (sampling) return
        stop()
        resolve()
      })
    })
  }

  await nextTick()
}

defineExpose({
  getExportElement: () => exportElement.value,
  waitForPalette
})
</script>
