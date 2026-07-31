<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#f3f3ef] px-7 py-8 text-[#171717]"
    :style="storyPaletteStyle(palette)"
  >
    <header class="flex items-center justify-center gap-3 text-center">
      <span class="h-1.5 w-1.5 bg-[var(--story-accent)]" aria-hidden="true" />
      <p class="text-[9px] font-bold uppercase tracking-[0.18em]">New on YouTube</p>
    </header>

    <section class="mt-28">
      <div class="border-4 border-white bg-[#d8d8d2] p-1 shadow-[8px_9px_0_var(--story-accent)]">
        <div class="aspect-video overflow-hidden">
          <img
            v-if="metadata"
            :src="metadata.thumbnailUrl"
            :alt="`${metadata.title} thumbnail`"
            class="h-full w-full object-cover"
          >
          <div v-else class="grid h-full place-items-center bg-[#252525]">
            <StoryPlayButton />
          </div>
        </div>
      </div>

      <div class="mx-auto mt-7 max-w-[92%] text-center">
        <h2 class="line-clamp-5 whitespace-normal break-words text-[clamp(1.2rem,5.2vw,1.75rem)] font-bold leading-[1.08] [overflow-wrap:anywhere]">
          {{ title }}
        </h2>
        <p class="mt-3 line-clamp-2 text-sm font-medium text-[#686864]">{{ channel }}</p>
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
