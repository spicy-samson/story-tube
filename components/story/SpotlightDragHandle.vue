<template>
  <button
    type="button"
    class="absolute right-3 top-3 z-[60] grid size-11 cursor-ew-resize touch-none select-none place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-sm backdrop-blur-xl transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white active:scale-95"
    :aria-label="`Reposition Spotlight image horizontally. Current position ${modelValue} percent.`"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    aria-valuemax="100"
    role="slider"
    title="Reposition image"
    @pointerdown.stop.prevent="startDrag"
    @pointermove.stop.prevent="moveDrag"
    @pointerup.stop.prevent="finishDrag"
    @pointercancel.stop.prevent="finishDrag"
    @lostpointercapture="cancelDrag"
    @keydown.left.stop.prevent="nudge(-5)"
    @keydown.right.stop.prevent="nudge(5)"
  >
    <MoveHorizontal :size="18" :stroke-width="2" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { MoveHorizontal } from '@lucide/vue'
import { clampSpotlightX } from '~/shared/utils/spotlight-crop.js'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

let dragState: {
  pointerId: number
  pointerX: number
  previewWidth: number
  spotlightX: number
} | null = null

function startDrag(event: PointerEvent) {
  if (!event.isPrimary) return

  const handle = event.currentTarget as HTMLButtonElement
  const previewWidth = handle.parentElement?.getBoundingClientRect().width ?? 0
  if (previewWidth <= 0) return

  handle.setPointerCapture(event.pointerId)
  dragState = {
    pointerId: event.pointerId,
    pointerX: event.clientX,
    previewWidth,
    spotlightX: props.modelValue
  }
}

function moveDrag(event: PointerEvent) {
  if (!dragState || dragState.pointerId !== event.pointerId) return

  const pointerDelta = event.clientX - dragState.pointerX
  const positionDelta = (pointerDelta / dragState.previewWidth) * 100
  emit('update:modelValue', clampSpotlightX(dragState.spotlightX - positionDelta))
}

function finishDrag(event: PointerEvent) {
  if (!dragState || dragState.pointerId !== event.pointerId) return

  const handle = event.currentTarget as HTMLButtonElement
  if (handle.hasPointerCapture(event.pointerId)) {
    handle.releasePointerCapture(event.pointerId)
  }
  dragState = null
}

function cancelDrag() {
  dragState = null
}

function nudge(amount: number) {
  emit('update:modelValue', clampSpotlightX(props.modelValue + amount))
}
</script>
