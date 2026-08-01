<template>
  <article
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[1.3rem] bg-[#f7f7f3] px-7 py-8 text-[#171717]"
    :style="storyPaletteStyle(palette)"
  >
    <section class="mx-auto mt-20 w-[82%]">
      <div data-frame-artwork class="border border-black/15 bg-white p-1">
        <div class="aspect-video overflow-hidden">
          <img
            v-if="metadata"
            :src="metadata.thumbnailUrl"
            :alt="`${metadata.title} thumbnail`"
            class="h-full w-full object-cover"
          >
          <div v-else class="grid h-full place-items-center bg-[#252525]">
            <StoryPlayButton />
          </div>
        </div>
      </div>

      <div class="mt-10 text-left">
        <h2 class="whitespace-normal break-words text-[clamp(1.2rem,5.1vw,1.72rem)] font-bold leading-[1.07] [overflow-wrap:anywhere]">
          {{ title }}
        </h2>
        <p class="mt-4 line-clamp-2 text-sm font-medium text-black/55">{{ channel }}</p>
      </div>
    </section>

    <footer class="mt-auto flex justify-end">
      <StoryYoutubeBrand tone="dark" class="text-lg" />
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
