<template>
  <span
    class="grid aspect-square place-items-center rounded-full border border-white/20 bg-white/95 shadow-xl"
    :class="sizeClass"
    aria-hidden="true"
  >
    <span class="ml-[7%] h-[38%] w-[38%] bg-black [clip-path:polygon(15%_8%,15%_92%,90%_50%)]" />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

const sizeClass = computed(() => ({
  sm: 'w-8',
  md: 'w-12',
  lg: 'w-16'
})[props.size])
</script>
