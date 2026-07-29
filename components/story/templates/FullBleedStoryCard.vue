<template>
  <article class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#0b0b0b] px-7 py-8 text-white">
    <img v-if="metadata" :src="metadata.thumbnailUrl" alt="" class="absolute inset-0 h-full w-full object-cover" aria-hidden="true">
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.76)_0%,rgba(0,0,0,.12)_35%,rgba(0,0,0,.18)_64%,rgba(0,0,0,.9)_100%)]" />

    <div class="relative z-10">
      <span class="inline-block rounded-md bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-black">Watch now</span>
      <h2 class="mt-5 line-clamp-5 break-words text-[clamp(1.45rem,6vw,2rem)] font-bold leading-[1.08]">{{ title }}</h2>
      <p class="mt-4 line-clamp-2 text-sm text-white/70">{{ channel }}</p>
    </div>

    <footer class="relative z-10 mt-auto flex justify-center">
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
