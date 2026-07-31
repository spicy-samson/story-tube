<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#111212] px-7 py-8 text-white"
    :style="storyPaletteStyle(palette)"
  >
    <header class="text-center">
      <p class="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--story-accent)]">Watch next</p>
    </header>

    <section class="mt-16">
      <h2 class="line-clamp-6 whitespace-normal break-words text-[clamp(1.55rem,6.4vw,2.2rem)] font-bold leading-[1.02] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <span class="mt-6 block h-1 w-12 bg-[var(--story-accent)]" aria-hidden="true" />
      <p class="mt-4 line-clamp-2 text-sm font-medium text-white/60">{{ channel }}</p>
    </section>

    <div class="mt-auto border border-white/20 bg-[#242525] p-1">
      <div class="aspect-video overflow-hidden">
        <img
          v-if="metadata"
          :src="metadata.thumbnailUrl"
          :alt="`${metadata.title} thumbnail`"
          class="h-full w-full object-cover"
        >
        <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
      </div>
    </div>

    <StoryYoutubeBrand class="mt-6 justify-center text-lg" />
  </article>
</template>

<script setup lang="ts">
import type { StoryPalette } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

const props = defineProps<{
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
  palette: StoryPalette
}>()

const { title, channel } = useStoryCardContent(props)
</script>
