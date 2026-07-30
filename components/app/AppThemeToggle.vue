<template>
  <button
    type="button"
    class="fixed right-3 top-3 z-[100] grid size-11 place-items-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm transition hover:bg-[var(--app-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
    @click="toggleTheme"
  >
    <Sun v-if="theme === 'dark'" :size="19" aria-hidden="true" />
    <Moon v-else :size="19" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

const { theme, toggleTheme } = useTheme()
</script>
