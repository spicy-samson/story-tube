<template>
  <article
    class="grid h-full w-full grid-rows-[53%_47%] overflow-hidden rounded-[1.3rem] bg-[var(--story-bg)] text-[var(--story-fg)]"
    :style="storyPaletteStyle(palette)"
  >
    <section class="relative overflow-hidden bg-[var(--story-bg-alt)]">
      <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
      <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--story-bg)] to-transparent" />
      <span class="absolute left-6 top-6 border border-white/60 bg-black/25 px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] backdrop-blur">
        Watch now
      </span>
    </section>

    <section class="relative flex min-h-0 flex-col px-6 pb-7 pt-6">
      <span class="absolute right-6 top-0 h-2 w-20 -translate-y-1/2 bg-[var(--story-accent)]" />
      <p class="line-clamp-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--story-muted)]">{{ channel }}</p>
      <h2 class="mt-4 line-clamp-6 break-words text-[clamp(1.25rem,5.4vw,1.8rem)] font-black leading-[1.04] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <footer class="mt-auto flex items-end justify-between border-t border-white/20 pt-5">
        <span class="text-[9px] font-black uppercase tracking-[0.28em] text-[var(--story-muted)]">Play video</span>
        <StoryYoutubeBrand class="text-lg" />
      </footer>
    </section>
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
