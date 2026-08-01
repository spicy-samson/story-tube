<template>
  <div class="grid w-full min-w-0 gap-4">
    <div
      class="grid touch-pan-y place-items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] lg:touch-auto"
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
        :spotlight-x="spotlightX"
        @update:spotlight-x="emit('update:spotlightX', $event)"
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
          class="grid size-12 place-items-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition hover:bg-[var(--app-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
          aria-label="Previous story template"
          title="Previous template"
          @click="showPreviousTemplate"
        >
          <ChevronLeft :size="22" :stroke-width="2.5" aria-hidden="true" />
        </button>

        <div class="min-w-0 text-center" aria-live="polite">
          <p class="truncate text-sm font-semibold text-[var(--app-text)]">{{ selectedTemplate.name }}</p>
          <p class="mt-0.5 text-xs text-[var(--app-muted)]">
            {{ selectedTemplateIndex + 1 }} / {{ STORY_TEMPLATES.length }}
          </p>
        </div>

        <button
          type="button"
          class="grid size-12 place-items-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition hover:bg-[var(--app-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
          aria-label="Next story template"
          title="Next template"
          @click="showNextTemplate"
        >
          <ChevronRight :size="22" :stroke-width="2.5" aria-hidden="true" />
        </button>
      </div>

      <div class="grid grid-cols-6 gap-1.5 px-1" aria-label="Choose a story template">
        <button
          v-for="(template, index) in STORY_TEMPLATES"
          :key="template.id"
          type="button"
          class="group grid min-h-8 place-items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
          :aria-label="`Choose ${template.name} template`"
          :aria-current="index === selectedTemplateIndex ? 'true' : undefined"
          @click="selectTemplate(index)"
        >
          <span
            class="h-1.5 w-full rounded-full transition"
            :class="index === selectedTemplateIndex
              ? 'bg-[var(--app-accent)]'
              : 'bg-[var(--app-border)] group-hover:bg-[var(--app-muted)]'"
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
  spotlightX: number
}>()

const emit = defineEmits<{
  'update:modelValue': [templateId: StoryTemplateId]
  'update:spotlightX': [value: number]
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
