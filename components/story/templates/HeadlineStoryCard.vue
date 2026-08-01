<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#09090a] px-7 py-8 text-white"
    :style="storyPaletteStyle(palette)"
  >
    <img
      v-if="metadata"
      :src="metadata.thumbnailUrl"
      alt=""
      class="absolute inset-0 h-full w-full object-cover opacity-25 grayscale contrast-[1.1]"
      aria-hidden="true"
    >
    <div class="absolute inset-0 bg-black/55" aria-hidden="true" />

    <header class="relative z-10 mx-auto flex w-[66%] items-center justify-between border-b border-white/20 pb-4">
      <p class="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">New release</p>
      <span class="text-[10px] font-bold text-[var(--story-accent)]">01</span>
    </header>

    <section class="relative z-10 mx-auto mt-20 w-[78%] rounded-lg border border-white/15 bg-black/60 p-5 shadow-[0_16px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <h2 class="whitespace-normal break-words text-[clamp(1.2rem,5.1vw,1.72rem)] font-bold leading-[1.06] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <span class="mt-5 block h-1 w-10 bg-[var(--story-accent)]" aria-hidden="true" />
      <p class="mt-4 line-clamp-2 text-xs font-medium text-white/65">{{ channel }}</p>

      <div class="mt-6 border border-white/15 bg-black/35 p-1">
        <div class="aspect-video overflow-hidden">
          <img
            v-if="metadata"
            :src="metadata.thumbnailUrl"
            :alt="`${metadata.title} thumbnail`"
            class="h-full w-full object-cover"
          >
          <div v-else class="grid h-full place-items-center bg-[#202022]"><StoryPlayButton /></div>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-2 border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.12em] text-white/55">
        <p><strong class="mr-2 text-white">01</strong>New upload</p>
        <p class="text-right"><strong class="mr-2 text-white">02</strong>Watch on YouTube</p>
      </div>
    </section>

    <StoryYoutubeBrand class="relative z-10 mt-auto justify-center text-lg" />
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
