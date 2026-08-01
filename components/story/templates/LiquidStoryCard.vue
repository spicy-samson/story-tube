<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[var(--story-bg)] p-5 text-[var(--story-fg)]"
    :style="storyPaletteStyle(palette)"
  >
    <img
      v-if="metadata"
      :src="metadata.thumbnailUrl"
      :alt="`${metadata.title} thumbnail background`"
      class="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl"
    >
    <div class="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04)_38%,rgba(0,0,0,0.56)_100%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(120%_70%_at_20%_0%,rgba(255,255,255,0.30),transparent_58%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.46)_76%)]" />
    <div class="absolute -left-24 top-20 h-56 w-[130%] -rotate-12 rounded-[3rem] bg-[var(--story-accent)] opacity-25 blur-2xl" />
    <div class="absolute -right-28 bottom-20 h-72 w-[125%] rotate-12 rounded-[4rem] bg-[var(--story-bg-alt)] opacity-70 blur-2xl" />

    <div class="relative z-10 mt-20 overflow-hidden rounded-[2rem] border border-white/35 bg-white/12 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.38)] backdrop-blur-xl">
      <div class="aspect-video">
        <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full rounded-[1.45rem] object-cover">
        <div v-else class="grid h-full place-items-center rounded-[1.45rem] bg-white/10"><StoryPlayButton /></div>
      </div>
      <div class="pointer-events-none absolute inset-x-8 top-3 h-px bg-white/70 opacity-80" />
    </div>

    <div class="relative z-10 mt-7 rounded-[2rem] border border-white/30 bg-white/16 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.36)] backdrop-blur-xl">
      <p class="mb-4 line-clamp-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/70">{{ channel }}</p>
      <h2 class="line-clamp-6 break-words text-[clamp(1.3rem,5.8vw,1.95rem)] font-black leading-[1.02] text-white [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div class="h-full w-2/5 rounded-full bg-[var(--story-accent)] shadow-[0_0_24px_var(--story-accent)]" />
      </div>
    </div>

    <footer class="relative z-10 mt-auto flex items-end justify-end">

      <div class="rounded-full border border-white/25 bg-white/14 px-4 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md">
        <StoryYoutubeBrand class="text-lg" />
      </div>
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
