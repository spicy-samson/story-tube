<template>
  <button
    type="button"
    class="absolute right-3 top-3 z-[60] inline-flex min-h-11 touch-none select-none items-center gap-2 rounded-md border border-white/25 bg-black/70 px-3 text-xs font-semibold text-white shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
    :aria-label="`Reposition Spotlight image horizontally. Current position ${modelValue} percent.`"
    :aria-valuenow="modelValue"
    aria-valuemin="0"
    aria-valuemax="100"
    role="slider"
    title="Drag image horizontally"
    @pointerdown.stop.prevent="startDrag"
    @pointermove.stop.prevent="moveDrag"
    @pointerup.stop.prevent="finishDrag"
    @pointercancel.stop.prevent="finishDrag"
    @lostpointercapture="cancelDrag"
    @keydown.left.stop.prevent="nudge(-5)"
    @keydown.right.stop.prevent="nudge(5)"
  >
    <MoveHorizontal :size="16" :stroke-width="2.25" aria-hidden="true" />
    <span>Drag</span>
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
