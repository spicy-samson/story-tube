<template>
  <div class="inline-flex items-center">
    <img
      :src="logoSrc"
      alt="YouTube"
      class="block h-[1.65em] w-auto max-w-none"
      draggable="false"
    >
  </div>
</template>

<script setup lang="ts">
import youtubeLogoAlmostBlack from '~/assets/youtube-logo/Digital/01 Full Color/yt_logo_fullcolor_almostblack_digital.png'
import youtubeLogoWhite from '~/assets/youtube-logo/Digital/01 Full Color/yt_logo_fullcolor_white_digital.png'

const props = withDefaults(defineProps<{
  tone?: 'light' | 'dark'
}>(), {
  tone: 'light'
})

const logoSrc = computed(() => props.tone === 'light' ? youtubeLogoWhite : youtubeLogoAlmostBlack)
</script>
