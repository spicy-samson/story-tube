<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[var(--story-bg)] text-white"
    :style="storyPaletteStyle(palette)"
  >
    <img
      v-if="metadata"
      :src="metadata.thumbnailUrl"
      alt=""
      class="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] scale-110 object-cover opacity-40 blur-[24px] saturate-[0.9]"
      aria-hidden="true"
    >
    <div class="absolute inset-0 bg-[var(--story-bg)] opacity-55" aria-hidden="true" />
    <div class="absolute inset-0 bg-black/20" aria-hidden="true" />

    <header class="relative z-10 mx-7 mt-8 flex items-center justify-between border-b border-white/30 pb-4">
      <span class="text-[9px] font-bold uppercase tracking-[0.18em]">Chromatic study</span>
      <span class="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">04 / 06</span>
    </header>

    <section class="relative z-10 mx-7 mt-24">
      <div data-chromatic-artwork class="border border-white/60 bg-black/35 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <div class="aspect-video overflow-hidden">
          <img
            v-if="metadata"
            :src="metadata.thumbnailUrl"
            :alt="`${metadata.title} thumbnail`"
            class="h-full w-full object-cover"
          >
          <div v-else class="grid h-full place-items-center bg-black/30"><StoryPlayButton /></div>
        </div>
      </div>

      <div class="mt-8 max-w-[92%]">
        <p class="mb-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">{{ channel }}</p>
        <h2 class="whitespace-normal break-words text-[clamp(1.3rem,5.4vw,1.85rem)] font-bold leading-[1.06] [overflow-wrap:anywhere]">
          {{ title }}
        </h2>
        <span class="mt-6 block h-1 w-12 bg-[var(--story-accent)]" aria-hidden="true" />
      </div>
    </section>

    <footer class="relative z-10 mx-7 mb-8 mt-auto flex items-center justify-between border-t border-white/25 pt-5">
      <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">Watch now</span>
      <StoryYoutubeBrand class="text-lg" />
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
