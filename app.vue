<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-[var(--app-border)] bg-[var(--app-canvas)]/95 backdrop-blur">
    <div class="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between px-3 sm:px-6">
      <NuxtLink
        to="/"
        class="text-sm font-bold text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
        aria-label="Posterize home"
      >
        Posterize
      </NuxtLink>
      <AppThemeToggle />
    </div>
  </header>
  <NuxtPage />
</template>
