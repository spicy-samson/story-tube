<template>
  <div
    class="pointer-events-none absolute z-50 w-[13%] max-w-14 rounded-sm bg-white p-1 text-[#09090b] shadow-[0_6px_18px_rgba(0,0,0,0.24)]"
    :class="positionClass"
    aria-label="QR code linking to the YouTube video"
  >
    <img
      :src="dataUrl"
      alt=""
      class="aspect-square w-full"
    >
    <p class="mt-0.5 text-center text-[clamp(0.26rem,0.9vw,0.38rem)] font-black uppercase leading-none">
      Watch
    </p>
  </div>
</template>

<script setup lang="ts">
import type { QrPosition } from '~/shared/types/story-share'

const props = defineProps<{
  dataUrl: string
  position: QrPosition
}>()

const positionClass = computed(() => ({
  'top-left': 'left-[6%] top-[14%]',
  'top-right': 'right-[6%] top-[14%]',
  'bottom-left': 'bottom-[14%] left-[6%]',
  'bottom-right': 'bottom-[14%] right-[6%]'
})[props.position])
</script>
