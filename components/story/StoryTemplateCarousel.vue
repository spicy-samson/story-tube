<template>
  <div class="grid w-full min-w-0 gap-4">
    <div
      class="grid touch-pan-y place-items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#ff8067] lg:touch-auto"
      role="region"
      :aria-label="carouselLabel"
      tabindex="0"
      @keydown.left.prevent="showPreviousTemplate"
      @keydown.right.prevent="showNextTemplate"
      @pointerdown="startSwipe"
      @pointerup="finishSwipe"
      @pointercancel="cancelSwipe"
    >
      <StoryPreview
        :metadata="metadata"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :template-id="modelValue"
      />
    </div>

    <div
      v-if="metadata"
      class="grid gap-3 lg:hidden"
      aria-label="Mobile story template controls"
    >
      <div class="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3">
        <button
          type="button"
          class="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-white/35 hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#ff8067]"
          aria-label="Previous story template"
          title="Previous template"
          @click="showPreviousTemplate"
        >
          <ChevronLeft :size="22" :stroke-width="2.5" aria-hidden="true" />
        </button>

        <div class="min-w-0 text-center" aria-live="polite">
          <p class="truncate text-sm font-extrabold text-white">{{ selectedTemplate.name }}</p>
          <p class="mt-0.5 text-xs text-white/50">
            {{ selectedTemplateIndex + 1 }} / {{ STORY_TEMPLATES.length }}
          </p>
        </div>

        <button
          type="button"
          class="grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-white/35 hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#ff8067]"
          aria-label="Next story template"
          title="Next template"
          @click="showNextTemplate"
        >
          <ChevronRight :size="22" :stroke-width="2.5" aria-hidden="true" />
        </button>
      </div>

      <div class="grid grid-cols-10 gap-1.5 px-1" aria-label="Choose a story template">
        <button
          v-for="(template, index) in STORY_TEMPLATES"
          :key="template.id"
          type="button"
          class="group grid min-h-8 place-items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-[#ff8067]"
          :aria-label="`Choose ${template.name} template`"
          :aria-current="index === selectedTemplateIndex ? 'true' : undefined"
          @click="selectTemplate(index)"
        >
          <span
            class="h-1.5 w-full rounded-full transition"
            :class="index === selectedTemplateIndex
              ? 'bg-[#ff6b4a]'
              : 'bg-white/15 group-hover:bg-white/35'"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { STORY_TEMPLATES } from '~/shared/config/story-templates'
import type { StoryTemplateId } from '~/shared/types/story-template'
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'

const props = defineProps<{
  modelValue: StoryTemplateId
  metadata: YoutubeMetadata | null
  isLoading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  'update:modelValue': [templateId: StoryTemplateId]
}>()

const swipeStart = ref<{ x: number, y: number } | null>(null)
const selectedTemplateIndex = computed(() => {
  const index = STORY_TEMPLATES.findIndex(template => template.id === props.modelValue)
  return index >= 0 ? index : 0
})
const selectedTemplate = computed(() => STORY_TEMPLATES[selectedTemplateIndex.value]!)
const carouselLabel = computed(() => props.metadata
  ? `${selectedTemplate.value.name} story template, ${selectedTemplateIndex.value + 1} of ${STORY_TEMPLATES.length}`
  : 'YouTube story preview'
)

function selectTemplate(index: number) {
  const templateCount = STORY_TEMPLATES.length
  const wrappedIndex = (index + templateCount) % templateCount
  const template = STORY_TEMPLATES[wrappedIndex]

  if (template) emit('update:modelValue', template.id)
}

function showPreviousTemplate() {
  if (!props.metadata) return
  selectTemplate(selectedTemplateIndex.value - 1)
}

function showNextTemplate() {
  if (!props.metadata) return
  selectTemplate(selectedTemplateIndex.value + 1)
}

function startSwipe(event: PointerEvent) {
  if (!props.metadata || event.pointerType === 'mouse' || !event.isPrimary) return
  swipeStart.value = { x: event.clientX, y: event.clientY }
}

function finishSwipe(event: PointerEvent) {
  if (!swipeStart.value) return

  const horizontalDistance = event.clientX - swipeStart.value.x
  const verticalDistance = event.clientY - swipeStart.value.y
  swipeStart.value = null

  if (
    Math.abs(horizontalDistance) < 48
    || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
  ) return

  if (horizontalDistance < 0) showNextTemplate()
  else showPreviousTemplate()
}

function cancelSwipe() {
  swipeStart.value = null
}
</script>
