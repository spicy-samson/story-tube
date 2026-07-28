<template>
  <article class="flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#f2f2ef] px-7 py-8 text-[#1b1b1b]">
    <header class="flex items-start justify-between gap-4">
      <p class="line-clamp-2 max-w-[70%] text-[10px] font-black uppercase tracking-[0.24em] text-black/55">{{ channel }}</p>
      <span class="shrink-0 bg-[#1b1b1b] px-3 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white">New</span>
    </header>

    <h2 class="mt-10 line-clamp-6 break-words text-[clamp(1.75rem,7.2vw,2.35rem)] font-black uppercase leading-[0.98]">
      {{ title }}
    </h2>
    <span class="mt-8 block h-1 w-14 bg-[#1b1b1b]" />

    <div class="mt-8 space-y-4 text-sm text-black/55">
      <p><strong class="mr-3 text-black">01</strong> New upload</p>
      <p><strong class="mr-3 text-black">02</strong> Watch on YouTube</p>
    </div>

    <footer class="mt-auto flex items-center justify-between border-t-2 border-[#1b1b1b] pt-7">
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-black/50">Link below</span>
      <StoryYoutubeBrand tone="dark" class="text-xl" />
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
const props = defineProps<{ metadata: YoutubeMetadata | null; isLoading: boolean; errorMessage: string }>()
const { title, channel } = useStoryCardContent(props)
</script>
