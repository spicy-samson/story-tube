<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#ecece7] px-7 py-8 text-[#171717]"
    :style="storyPaletteStyle(palette)"
  >
    <header class="flex items-center justify-center gap-4 border-b border-black/20 pb-4">
      <p class="text-[9px] font-bold uppercase tracking-[0.18em]">Video bulletin</p>
      <span class="text-[9px] font-bold text-[var(--story-accent)]">01</span>
    </header>

    <section class="mt-12">
      <h2 class="line-clamp-5 whitespace-normal break-words text-[clamp(1.35rem,5.8vw,1.95rem)] font-bold leading-[1.05] [overflow-wrap:anywhere]">
        {{ title }}
      </h2>
      <p class="mt-4 line-clamp-2 text-sm font-medium text-black/55">{{ channel }}</p>
    </section>

    <div class="mt-8 border border-black/15 bg-[#d8d8d2] p-1">
      <div class="aspect-video overflow-hidden">
        <img
          v-if="metadata"
          :src="metadata.thumbnailUrl"
          :alt="`${metadata.title} thumbnail`"
          class="h-full w-full object-cover"
        >
        <div v-else class="grid h-full place-items-center bg-[#252525]"><StoryPlayButton /></div>
      </div>
    </div>

    <div class="mt-7 text-xs text-black/55">
      <p class="border-t border-black/20 py-3"><strong class="mr-4 text-black">01</strong>New upload</p>
      <p class="border-y border-black/20 py-3"><strong class="mr-4 text-black">02</strong>Watch on YouTube</p>
    </div>

    <StoryYoutubeBrand tone="dark" class="mt-auto justify-center text-lg" />
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
