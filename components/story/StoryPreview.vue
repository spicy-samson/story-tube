<template>
  <div class="aspect-[9/16] w-full max-w-96 min-w-0 overflow-hidden rounded-[1.8rem] border-[0.5rem] border-[#050506] bg-[#050506] shadow-[0_32px_70px_rgba(0,0,0,0.42)]">
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
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { StoryTemplateId } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
import BluePosterStoryCard from './templates/BluePosterStoryCard.vue'
import CleanPosterStoryCard from './templates/CleanPosterStoryCard.vue'
import EditorialStoryCard from './templates/EditorialStoryCard.vue'
import FullBleedStoryCard from './templates/FullBleedStoryCard.vue'
import GlassStoryCard from './templates/GlassStoryCard.vue'
import CenteredStoryCard from './templates/CenteredStoryCard.vue'
import ProgressStoryCard from './templates/ProgressStoryCard.vue'

const props = defineProps<{
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
  templateId: StoryTemplateId
}>()

const templateComponents: Record<StoryTemplateId, Component> = {
  centered: CenteredStoryCard,
  editorial: EditorialStoryCard,
  'blue-poster': BluePosterStoryCard,
  progress: ProgressStoryCard,
  'clean-poster': CleanPosterStoryCard,
  'full-bleed': FullBleedStoryCard,
  glass: GlassStoryCard
}

const activeComponent = computed(() => templateComponents[props.templateId])
</script>
