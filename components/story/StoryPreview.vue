<template>
  <div
    ref="exportElement"
    class="aspect-[9/16] w-full max-w-96 min-w-0 overflow-hidden rounded-[1.8rem] bg-[#050506] shadow-[0_32px_70px_rgba(0,0,0,0.42)] ring-[0.5rem] ring-[#050506]"
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
        />
      </Transition>
      <StoryQrSticker
        v-if="shareVariant === 'qr' && qrCodeDataUrl"
        :data-url="qrCodeDataUrl"
        :position="qrPosition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { QrPosition, StoryShareVariant } from '~/shared/types/story-share'
import type { StoryTemplateId } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
import ChromaticStoryCard from './templates/ChromaticStoryCard.vue'
import PosterStoryCard from './templates/PosterStoryCard.vue'
import CleanPosterStoryCard from './templates/CleanPosterStoryCard.vue'
import EditorialStoryCard from './templates/EditorialStoryCard.vue'
import FullBleedStoryCard from './templates/FullBleedStoryCard.vue'
import GlassStoryCard from './templates/GlassStoryCard.vue'
import CenteredStoryCard from './templates/CenteredStoryCard.vue'
import ProgressStoryCard from './templates/ProgressStoryCard.vue'
import SignalStoryCard from './templates/LiquidStoryCard.vue'
import SplitStoryCard from './templates/SplitStoryCard.vue'

const props = defineProps<{
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
  templateId: StoryTemplateId
  shareVariant?: StoryShareVariant
  qrPosition?: QrPosition
  qrCodeDataUrl?: string
}>()

const shareVariant = computed(() => props.shareVariant ?? 'clean')
const qrPosition = computed(() => props.qrPosition ?? 'bottom-left')
const qrCodeDataUrl = computed(() => props.qrCodeDataUrl ?? '')

const templateComponents: Record<StoryTemplateId, Component> = {
  centered: CenteredStoryCard,
  editorial: EditorialStoryCard,
  'poster': PosterStoryCard,
  progress: ProgressStoryCard,
  'clean-poster': CleanPosterStoryCard,
  'full-bleed': FullBleedStoryCard,
  glass: GlassStoryCard,
  chromatic: ChromaticStoryCard,
  split: SplitStoryCard,
  liquid: SignalStoryCard
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
