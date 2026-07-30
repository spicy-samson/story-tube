<template>
  <article
    class="grid h-full w-full grid-rows-[53%_47%] overflow-hidden rounded-[1.3rem] bg-[var(--story-bg)] text-[var(--story-fg)]"
    :style="storyPaletteStyle(palette)"
  >
    <section class="relative overflow-hidden bg-[var(--story-bg-alt)]">
      <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
      <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--story-bg)] to-transparent" />

    </section>

    <section class="relative flex min-h-0 flex-col px-6 pb-7 pt-6">

      <p class="line-clamp-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--story-muted)]">{{ channel }}</p>
<h2 class="mt-7 whitespace-normal break-words font-serif text-[clamp(1.05rem,4.8vw,1.55rem)] font-black italic leading-[1.08] [overflow-wrap:anywhere]">
  {{ title }}
</h2>
      <footer class="mt-auto flex items-end justify-end  border-t border-white/20 pt-5">

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
