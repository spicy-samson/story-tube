<template>
  <div class="inline-flex items-center gap-2 font-black" :class="toneClass">
    <span
      class="grid h-[1.2em] w-[1.78em] place-items-center rounded-[0.26em]"
      :class="markClass"
      aria-hidden="true"
    >
      <span
        class="h-[0.58em] w-[0.58em] [clip-path:polygon(24%_12%,24%_88%,88%_50%)]"
        :class="playClass"
      />
    </span>
    <span
      v-if="showLabel"
      class="inline-block origin-left scale-x-[0.84] scale-y-[1.12] font-['Arial_Narrow','HelveticaNeue-CondensedBlack','HelveticaNeue-CondensedBold','Arial',sans-serif] text-[1.03em] font-black leading-none"
    >YouTube</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'light' | 'dark'
  showLabel?: boolean
}>(), {
  tone: 'light',
  showLabel: true
})

const toneClass = computed(() => props.tone === 'light' ? 'text-white' : 'text-[#151515]')
const markClass = computed(() => props.tone === 'light' ? 'bg-white' : 'bg-[#151515]')
const playClass = computed(() => props.tone === 'light' ? 'bg-[#111]' : 'bg-white')
</script>
