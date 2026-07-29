<template>
  <article class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#111] px-6 py-7 text-white">
    <img v-if="metadata" :src="metadata.thumbnailUrl" alt="" class="absolute inset-0 h-full w-full object-cover" aria-hidden="true">
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.1)_15%,rgba(0,0,0,.18)_45%,rgba(0,0,0,.96)_92%)]" />

    <div class="relative z-10 ml-auto text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">Full screen</div>

    <div class="relative z-10 mt-auto pb-9">
      <h2 class="line-clamp-4 break-words text-[clamp(1.35rem,5.8vw,1.85rem)] font-extrabold leading-[1.08]">{{ title }}</h2>
      <p class="mt-4 line-clamp-2 text-sm font-medium text-white/65">{{ channel }}</p>
      <div class="mt-6 h-1 overflow-hidden rounded-full bg-white/25">
        <div class="h-full w-1/3 rounded-full bg-[#f12b2f]" />
      </div>
    </div>

    <footer class="flex relative justify-end z-10 border-t border-white/10 pt-5">
      <StoryYoutubeBrand class="text-xl" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { StoryPalette } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string; palette: StoryPalette }>()
const { title, channel } = useStoryCardContent(props)
</script>
