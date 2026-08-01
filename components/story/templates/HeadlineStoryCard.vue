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

    <div class="relative z-10 flex min-h-0 flex-1 items-center">
      <section class="mx-auto w-[78%] rounded-lg border border-white/15 bg-black/80 p-5 shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
        <div class="flex min-h-12 items-center">
          <h2
            class="whitespace-normal break-words font-bold [overflow-wrap:anywhere]"
            :class="headlineTitleClass"
          >
            {{ title }}
          </h2>
        </div>
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
      </section>
    </div>

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
const headlineTitleClass = computed(() => {
  const length = title.value.length

  if (length > 85) return 'text-[0.82rem] leading-[1.05]'
  if (length > 65) return 'text-[0.95rem] leading-[1.05]'
  if (length > 40) return 'text-[1.15rem] leading-[1.06]'
  return 'text-[1.5rem] leading-[1.06]'
})
</script>
