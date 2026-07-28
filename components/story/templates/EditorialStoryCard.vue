<template>
  <article class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#111] p-5 text-white">
    <img v-if="metadata" :src="metadata.thumbnailUrl" alt="" class="absolute inset-0 h-full w-full object-cover grayscale" aria-hidden="true">
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18)_0%,rgba(0,0,0,.2)_40%,rgba(0,0,0,.94)_88%)]" />
    <div class="absolute inset-0 bg-black/20" />

    <header class="relative z-10 flex items-start justify-between">
      <span class="border border-white/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em]">New video</span>
      <StoryPlayButton size="sm" />
    </header>

    <div class="relative z-10 mt-auto pb-8">
      <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-white/65">{{ channel }}</p>
      <span class="mb-5 block h-1 w-12 bg-white" />
      <h2 class="whitespace-normal break-words text-[clamp(1.15rem,5.2vw,1.75rem)] font-black uppercase leading-[1.05] [overflow-wrap:anywhere]">{{ title }}</h2>
    </div>

    <footer class="relative z-10 flex items-center justify-between border-t border-white/20 pt-5">
      <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-white/45">Watch now</span>
      <StoryYoutubeBrand class="text-lg" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string }>()
const { title, channel } = useStoryCardContent(props)
</script>
