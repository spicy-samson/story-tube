# Minimalist Light and Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persisted system-aware light/dark mode and simplify Story Tube's app chrome without changing story templates or PNG exports.

**Architecture:** A pure theme resolver chooses `light` or `dark`, a pre-hydration head script applies it before paint, and a small Vue composable owns runtime toggling and persistence. Semantic CSS variables theme Home and Share while their existing metadata, routing, carousel, QR, and export behavior remains intact.

**Tech Stack:** Nuxt 4, Vue 3, Tailwind CSS, native `localStorage`, native `matchMedia`, Node test runner, Lucide Vue icons.

## Global Constraints

- Follow the operating-system color preference on the first visit.
- Persist only an explicit user choice.
- Use `data-theme="light"` or `data-theme="dark"` on the root HTML element.
- Add no color-mode dependency and no custom web font.
- Use neutral surfaces and one blue accent.
- Remove decorative gradients, backdrop blur, oversized typography, and extra-black weights from app chrome.
- Do not recolor story templates or exported PNGs.
- Keep creation, route restoration, carousel, QR, sharing, and download behavior unchanged.

---

### Task 1: Tested Theme Resolution

**Files:**
- Create: `shared/utils/theme.js`
- Create: `tests/theme.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `isTheme(value: unknown): value is 'light' | 'dark'`
- Produces: `resolveTheme(storedTheme: unknown, prefersDark: boolean): 'light' | 'dark'`

- [ ] **Step 1: Add the failing resolver tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { isTheme, resolveTheme } from '../shared/utils/theme.js'

test('accepts only supported themes', () => {
  assert.equal(isTheme('light'), true)
  assert.equal(isTheme('dark'), true)
  assert.equal(isTheme('system'), false)
  assert.equal(isTheme(null), false)
})

test('stored theme overrides the system preference', () => {
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
})

test('system preference is used without a valid stored theme', () => {
  assert.equal(resolveTheme(null, true), 'dark')
  assert.equal(resolveTheme('invalid', false), 'light')
})
```

- [ ] **Step 2: Add the test command and verify RED**

Add:

```json
"test": "node --test tests/*.test.mjs"
```

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `shared/utils/theme.js`.

- [ ] **Step 3: Add the minimal resolver**

```js
// @ts-check

/** @typedef {'light' | 'dark'} Theme */

/** @param {unknown} value */
export function isTheme(value) {
  return value === 'light' || value === 'dark'
}

/**
 * @param {unknown} storedTheme
 * @param {boolean} prefersDark
 * @returns {Theme}
 */
export function resolveTheme(storedTheme, prefersDark) {
  if (isTheme(storedTheme)) return storedTheme
  return prefersDark ? 'dark' : 'light'
}
```

- [ ] **Step 4: Verify GREEN**

Run: `npm test`

Expected: 3 passing tests and 0 failures.

- [ ] **Step 5: Commit**

```bash
git add package.json shared/utils/theme.js tests/theme.test.mjs
git commit -m "feat: add tested theme resolution"
```

### Task 2: No-Flash Theme Runtime

**Files:**
- Create: `composables/useTheme.ts`
- Create: `components/app/AppThemeToggle.vue`
- Modify: `nuxt.config.ts`
- Modify: `app.vue`

**Interfaces:**
- Consumes: `isTheme()` and `resolveTheme()` from Task 1.
- Produces: `useTheme(): { theme: Ref<'light' | 'dark'>, toggleTheme(): void }`
- Produces: one app-level accessible theme toggle.

- [ ] **Step 1: Add pre-hydration theme initialization**

Add this inline head script in `nuxt.config.ts`:

```js
const themeScript = `(() => {
  try {
    const stored = localStorage.getItem('story-tube-theme')
    const theme = stored === 'light' || stored === 'dark'
      ? stored
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  } catch {
    const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }
})()`
```

Add `{ innerHTML: themeScript, tagPosition: "head" }` to `app.head.script`. Change the default theme-color metadata to `{ id: "theme-color", name: "theme-color", content: "#f6f7f8" }`.

- [ ] **Step 2: Add the runtime composable**

Implement the composable with this state flow:

```ts
import { isTheme, resolveTheme } from '~/shared/utils/theme.js'

type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.querySelector<HTMLMetaElement>('#theme-color')
    ?.setAttribute('content', theme === 'dark' ? '#111315' : '#f6f7f8')
}

export function useTheme() {
  const theme = useState<Theme>('app-theme', () => 'light')
  let mediaQuery: MediaQueryList | null = null

  function readStoredTheme() {
    try {
      return localStorage.getItem('story-tube-theme')
    } catch {
      return null
    }
  }

  function setTheme(nextTheme: Theme, persist = true) {
    theme.value = nextTheme
    applyTheme(nextTheme)
    if (!persist) return

    try {
      localStorage.setItem('story-tube-theme', nextTheme)
    } catch {
      // The root theme still updates when storage is unavailable.
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function handleSystemTheme(event: MediaQueryListEvent) {
    if (isTheme(readStoredTheme())) return
    setTheme(event.matches ? 'dark' : 'light', false)
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const rootTheme = document.documentElement.dataset.theme
    setTheme(resolveTheme(rootTheme, mediaQuery.matches), false)
    mediaQuery.addEventListener('change', handleSystemTheme)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleSystemTheme)
  })

  return { theme: readonly(theme), toggleTheme }
}
```

- [ ] **Step 3: Add the accessible toggle**

Create:

```vue
<template>
  <button
    type="button"
    class="fixed right-3 top-3 z-[100] grid size-11 place-items-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] transition hover:bg-[var(--app-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
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
```

- [ ] **Step 4: Render the toggle once**

Update `app.vue`:

```vue
<template>
  <AppThemeToggle />
  <NuxtPage />
</template>
```

- [ ] **Step 5: Verify runtime types**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add app.vue components/app/AppThemeToggle.vue composables/useTheme.ts nuxt.config.ts
git commit -m "feat: add persistent light and dark mode"
```

### Task 3: Semantic Theme Tokens

**Files:**
- Modify: `assets/css/main.css`

**Interfaces:**
- Produces: `--app-canvas`, `--app-surface`, `--app-surface-raised`, `--app-text`, `--app-muted`, `--app-border`, `--app-accent`, `--app-accent-hover`, `--app-accent-text`, `--app-success`, and `--app-error`.

- [ ] **Step 1: Add light and dark variables**

```css
:root,
:root[data-theme='light'] {
  --app-canvas: #f6f7f8;
  --app-surface: #ffffff;
  --app-surface-raised: #f0f2f4;
  --app-text: #17191c;
  --app-muted: #676d75;
  --app-border: #dfe2e6;
  --app-accent: #2563eb;
  --app-accent-hover: #1d4ed8;
  --app-accent-text: #ffffff;
  --app-success: #177245;
  --app-error: #b42318;
}

:root[data-theme='dark'] {
  --app-canvas: #111315;
  --app-surface: #191c1f;
  --app-surface-raised: #22262a;
  --app-text: #f3f4f5;
  --app-muted: #a7adb5;
  --app-border: #343a40;
  --app-accent: #60a5fa;
  --app-accent-hover: #93c5fd;
  --app-accent-text: #0b1220;
  --app-success: #55c58a;
  --app-error: #ff8a80;
}
```

- [ ] **Step 2: Simplify the base surface**

Replace hard-coded dark body colors with:

```css
html {
  background: var(--app-canvas);
}

body {
  background: var(--app-canvas);
  color: var(--app-text);
}
```

Add a short background/color transition and preserve font smoothing, disabled cursors, and minimum heights.

- [ ] **Step 3: Verify Tailwind processing**

Run: `npm run typecheck`

Expected: exit 0 with the stylesheet loaded.

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.css
git commit -m "style: add semantic app theme tokens"
```

### Task 4: Minimalist Home Workspace

**Files:**
- Modify: `pages/index.vue`
- Modify: `components/story/StoryTemplateCarousel.vue`

**Interfaces:**
- Consumes: semantic CSS variables from Task 3.
- Preserves: metadata loading, `selectedTemplate`, mobile carousel, route synchronization, and Share Story navigation.

- [ ] **Step 1: Restyle the page structure**

Replace the gradient canvas, translucent panels, blur, and heavy shadows with:

- Canvas: `bg-[var(--app-canvas)] text-[var(--app-text)]`
- Panels: `border border-[var(--app-border)] bg-[var(--app-surface)]`
- Preview area: `bg-[var(--app-surface-raised)]`
- Radius: `rounded-lg`
- Shadow: none on controls, one subtle preview shadow only.

- [ ] **Step 2: Simplify typography**

- Change the main title to `text-3xl font-bold leading-tight sm:text-4xl`.
- Change descriptive text to `text-sm` or `text-base` with `text-[var(--app-muted)]`.
- Change section headings and actions from extra-black to semibold/bold.
- Replace the uppercase `Story studio` eyebrow with a compact `Story Tube` label.

- [ ] **Step 3: Theme controls**

Use semantic variables for input, status text, template cards, selection state, Generate, Share Story, and carousel controls. Preserve minimum 44-pixel touch targets and visible focus rings.

- [ ] **Step 4: Remove the temporary debug log**

Delete:

```ts
console.log('triggered');
```

Do not alter `openSharePage()` behavior.

- [ ] **Step 5: Verify existing behavior**

Run:

```bash
npm test
npm run typecheck
```

Expected: all tests pass and typecheck exits 0.

- [ ] **Step 6: Commit**

```bash
git add pages/index.vue components/story/StoryTemplateCarousel.vue
git commit -m "style: simplify the home workspace"
```

### Task 5: Minimalist Share Workspace

**Files:**
- Modify: `components/story/StoryShareWorkspace.vue`
- Modify: `pages/share/[videoId].vue`

**Interfaces:**
- Consumes: semantic CSS variables from Task 3.
- Preserves: clean/QR variants, QR position, clipboard fallback, native share, download, invalid-video state, and export element boundaries.

- [ ] **Step 1: Theme the share layout**

Replace hard-coded light values with semantic canvas, surface, raised surface, text, muted, border, accent, success, and error variables.

- [ ] **Step 2: Simplify share typography and surfaces**

- Use `text-2xl font-bold` for the page title.
- Use semibold labels and actions.
- Remove extra-black weights.
- Replace the heavy outer shadow with a thin border and subtle preview separation.
- Keep the existing responsive two-column layout.

- [ ] **Step 3: Theme all interactive states**

Apply tokens to segmented controls, select, URL field, Copy Link, Back to Edit, Share Image, Download PNG, loading text, success text, and error text.

- [ ] **Step 4: Theme invalid/loading state**

Use the same app canvas and surface tokens in `pages/share/[videoId].vue`. Keep the current messages and Start Over behavior.

- [ ] **Step 5: Verify behavior and types**

Run:

```bash
npm test
npm run typecheck
```

Expected: all tests pass and typecheck exits 0.

- [ ] **Step 6: Commit**

```bash
git add components/story/StoryShareWorkspace.vue pages/share/'[videoId]'.vue
git commit -m "style: simplify the share workspace"
```

### Task 6: Production and Browser Verification

**Files:**
- Modify only if verification exposes a defect.

**Interfaces:**
- Validates the complete theme and workflow.

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Start a clean development server**

Run:

```bash
npx nuxi cleanup
npm run dev
```

Expected: Home responds on localhost without stale optimized-dependency errors.

- [ ] **Step 3: Verify theme behavior**

Check:

- First visit follows system light and dark preferences.
- Theme toggle changes Home and Share.
- Reload preserves an explicit choice.
- Root `data-theme`, CSS `color-scheme`, and `#theme-color` all match.
- No incorrect-theme flash is visible.

- [ ] **Step 4: Verify existing workflows**

Check:

- Generate metadata.
- Swipe or click through templates.
- Open Share Story.
- Switch clean and QR variants.
- Copy link.
- Download PNG.
- Return to Edit Story with the video and template restored.

- [ ] **Step 5: Inspect responsive layouts**

Check mobile and desktop for:

- No overlaps or clipped controls.
- Minimum 44-pixel touch targets.
- Legible contrast in both themes.
- Story templates visually unchanged.

- [ ] **Step 6: Final commit if verification required fixes**

Commit only the files changed by a verified defect:

```bash
git add assets/css/main.css app.vue components/app/AppThemeToggle.vue components/story/StoryShareWorkspace.vue components/story/StoryTemplateCarousel.vue composables/useTheme.ts nuxt.config.ts pages/index.vue pages/share/'[videoId]'.vue shared/utils/theme.js tests/theme.test.mjs
git commit -m "fix: polish minimalist theme behavior"
```
