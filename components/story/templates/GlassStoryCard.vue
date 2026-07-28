<template>
  <article class="relative grid h-full w-full grid-rows-[1fr_auto] overflow-hidden rounded-[1.3rem] bg-[#070808] p-6 text-white">
    <img v-if="metadata" :src="metadata.thumbnailUrl" alt="" class="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] scale-110 object-cover opacity-25 blur-3xl" aria-hidden="true">
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.12),rgba(0,0,0,.65))]" />

    <section class="relative z-10 self-center overflow-hidden rounded-[1.8rem] border-2 border-white/25 bg-white/10 shadow-2xl backdrop-blur-xl">
      <div class="aspect-video overflow-hidden bg-black/30">
        <img v-if="metadata" :src="metadata.thumbnailUrl" :alt="`${metadata.title} thumbnail`" class="h-full w-full object-cover">
        <div v-else class="grid h-full place-items-center"><StoryPlayButton /></div>
      </div>
      <div class="space-y-3 bg-black/25 p-5">
        <h2 class="line-clamp-4 break-words text-[clamp(1.2rem,5.5vw,1.65rem)] font-extrabold leading-[1.1]">{{ title }}</h2>
        <p class="line-clamp-2 text-sm font-semibold text-white/55">{{ channel }}</p>
      </div>
    </section>

    <StoryYoutubeBrand class="relative z-10 justify-self-center text-xl" />
  </article>
</template>

<script setup lang="ts">
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string }>()
const { title, channel } = useStoryCardContent(props)
</script>
