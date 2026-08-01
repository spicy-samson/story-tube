<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#f7f7f3] px-7 py-8 text-[#171717]"
    :style="storyPaletteStyle(palette)"
  >
    <header class="flex items-center gap-3">
      <span class="h-1.5 w-1.5 bg-[var(--story-accent)]" aria-hidden="true" />
      <p class="text-[9px] font-bold uppercase tracking-[0.18em]">New on YouTube</p>
    </header>

    <section class="mx-auto mt-24 w-[82%]">
      <div class="border border-black/20 bg-white p-1.5 shadow-[8px_8px_0_var(--story-accent)]">
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

      <div class="mt-10 grid grid-cols-[4px_minmax(0,1fr)] gap-5">
        <span class="bg-[var(--story-accent)]" aria-hidden="true" />
        <div class="py-1 text-left">
          <h2 class="whitespace-normal break-words text-[clamp(1.2rem,5.1vw,1.72rem)] font-bold leading-[1.07] [overflow-wrap:anywhere]">
            {{ title }}
          </h2>
          <p class="mt-4 line-clamp-2 text-sm font-medium text-black/55">{{ channel }}</p>
        </div>
      </div>
    </section>

    <footer class="mt-auto flex items-center justify-between border-t border-black/15 pt-5">
      <p class="text-[9px] font-bold uppercase tracking-[0.16em] text-black/45">Selected video</p>
      <StoryYoutubeBrand tone="dark" class="text-lg" />
    </footer>
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
