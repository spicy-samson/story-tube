<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#e4e5e1] px-7 py-8 text-[#171717]"
    :style="storyPaletteStyle(palette)"
  >
    <header class="text-center">
      <p class="text-[9px] font-bold uppercase tracking-[0.18em]">Selected video</p>
    </header>

    <div class="mx-auto mt-16 w-[88%] translate-x-3 border border-black/15 bg-[#d2d3cf] p-1">
      <div class="aspect-video overflow-hidden">
        <img
          v-if="metadata"
          :src="metadata.thumbnailUrl"
          :alt="`${metadata.title} thumbnail`"
          class="h-full w-full object-cover"
        >
        <div v-else class="grid h-full place-items-center bg-[#252525]"><StoryPlayButton /></div>
      </div>
    </div>

    <section class="mx-auto mt-10 grid w-[88%] grid-cols-[5px_minmax(0,1fr)] gap-5">
      <span class="bg-[var(--story-accent)]" aria-hidden="true" />
      <div class="py-1">
        <h2 class="line-clamp-5 whitespace-normal break-words text-[clamp(1.25rem,5.4vw,1.8rem)] font-bold leading-[1.07] [overflow-wrap:anywhere]">
          {{ title }}
        </h2>
        <p class="mt-4 line-clamp-2 text-sm font-medium text-black/55">{{ channel }}</p>
      </div>
    </section>

    <StoryYoutubeBrand tone="dark" class="mt-auto justify-center text-lg" />
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
