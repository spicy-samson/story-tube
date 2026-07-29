<template>
  <article class="relative grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-[1.3rem] bg-[#080909] p-5 text-white">
    <img v-if="metadata" :src="metadata.thumbnailUrl" alt="" class="absolute -inset-12 h-[calc(100%+6rem)] w-[calc(100%+6rem)] scale-110 object-cover opacity-25 blur-3xl" aria-hidden="true">
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.18),rgba(0,0,0,.65))]" />

    <span class="relative z-10 w-fit rounded-full bg-white/10 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
      {{ eyebrow }}
    </span>

    <section class="relative z-10 self-center overflow-hidden rounded-3xl border border-white/20 bg-[#f7f6f2] shadow-2xl" :class="{ 'animate-pulse': isLoading }">
      <div class="grid aspect-video place-items-center overflow-hidden bg-[#202126]">
        <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
        <StoryPlayButton v-else size="md" />
      </div>
      <div class="space-y-2 p-5 text-[#151515]">
        <p class="text-[10px] font-black uppercase tracking-[0.16em] text-black/40">Now watching</p>
        <h2 class="line-clamp-4 break-words text-[clamp(1.15rem,5.4vw,1.55rem)] font-black leading-[1.08]">{{ title }}</h2>
        <p class="line-clamp-2 text-sm font-bold leading-5 text-black/50">{{ channel }}</p>
      </div>
    </section>

    <StoryYoutubeBrand class="relative z-10 justify-self-center text-xl" />
  </article>
</template>

<script setup lang="ts">
import type { StoryPalette } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string; palette: StoryPalette }>()
const { eyebrow, title, channel } = useStoryCardContent(props)
</script>
