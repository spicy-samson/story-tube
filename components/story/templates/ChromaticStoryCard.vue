<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[var(--story-bg)] px-6 py-7 text-[var(--story-fg)]"
    :style="storyPaletteStyle(palette)"
  >
    <div class="absolute -right-28 -top-20 h-80 w-56 rotate-12 bg-[var(--story-accent)] opacity-25" />
    <div class="absolute -bottom-24 -left-20 h-72 w-64 -rotate-12 bg-[var(--story-bg-alt)] opacity-75" />

    <header class="relative z-10 flex items-center justify-between border-b border-white/25 pb-4">
      <span class="text-[9px] font-black uppercase tracking-[0.32em]">New on YouTube</span>
      <span class="h-3 w-3 rounded-full bg-[var(--story-accent)]" />
    </header>

    <div class="relative z-10 mt-6">
      <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--story-muted)]">{{ channel }}</p>
      <h2 class="line-clamp-6 break-words text-[clamp(1.35rem,5.8vw,1.95rem)] font-black leading-[1.02] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
    </div>

    <div class="relative z-10 mt-7 rotate-[-2deg] border-4 border-[var(--story-fg)] bg-[var(--story-bg-alt)] p-2 shadow-[10px_12px_0_var(--story-accent)]">
      <div class="aspect-video overflow-hidden">
        <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
        <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
      </div>
    </div>

    <footer class="relative z-10 mt-auto flex items-end justify-end">

      <StoryYoutubeBrand class="text-xl position" />
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
