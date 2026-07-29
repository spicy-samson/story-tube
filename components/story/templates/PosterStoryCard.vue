<template>
  <article
    class="flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[var(--story-bg-alt)] px-7 py-8 text-[var(--story-fg)]"
    :style="storyPaletteStyle(palette)"
  >
    <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">● &nbsp; Watch now</p>

<h2 class="mt-7 whitespace-normal break-words font-serif text-[clamp(1.05rem,4.8vw,1.55rem)] font-black italic leading-[1.08] [overflow-wrap:anywhere]">
  {{ title }}
</h2>

    <p class="mt-5 line-clamp-2 font-serif text-sm font-bold italic text-white/80">{{ channel }}</p>

    <div class="mt-7 aspect-video overflow-hidden border-4 border-white bg-[var(--story-bg)] shadow-[7px_8px_0_var(--story-bg)]">
      <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
      <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
    </div>

    <footer class="mt-auto flex items-end justify-between border-t border-white/20 pt-6">
      <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Tap to watch</span>
      <StoryYoutubeBrand class="text-lg" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
import type { StoryPalette } from '~/shared/types/story-template'
const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string; palette: StoryPalette }>()
const { title, channel } = useStoryCardContent(props)
</script>
