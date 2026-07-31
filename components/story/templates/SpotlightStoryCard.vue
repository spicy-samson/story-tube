<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#151515] px-7 py-8 text-white"
    :style="storyPaletteStyle(palette)"
  >
    <img
      v-if="metadata"
      :src="metadata.thumbnailUrl"
      :alt="`${metadata.title} thumbnail`"
      class="absolute inset-0 h-full w-full object-cover object-[16%_50%] grayscale contrast-[1.1]"
    >
    <div v-else class="absolute inset-0 grid place-items-center bg-[#252525]"><StoryPlayButton /></div>
    <div class="absolute inset-0 bg-black/35" />
    <div class="absolute inset-x-0 bottom-0 h-[48%] bg-black/80" />

    <header class="relative z-10 flex justify-center">
      <p class="bg-[#f3f3ef] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#171717]">
        Play video
      </p>
    </header>

    <section class="relative z-10 mb-[22%] mt-auto text-center">
      <h2 class="mx-auto line-clamp-5 max-w-[94%] whitespace-normal break-words text-[clamp(1.3rem,5.6vw,1.9rem)] font-bold leading-[1.06] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <span class="mx-auto mt-5 block h-1 w-10 bg-[var(--story-accent)]" aria-hidden="true" />
      <p class="mt-4 line-clamp-2 text-sm font-medium text-white/65">{{ channel }}</p>
    </section>

    <StoryYoutubeBrand class="relative z-10 justify-center text-lg" />
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
