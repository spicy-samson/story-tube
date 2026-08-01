# Original Template Family Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace seven reference-led templates with five original Story Tube templates while retaining three newer templates and preserving old route URLs.

**Architecture:** Canonical template state contains eight IDs only. A pure JavaScript route-boundary helper converts legacy query values into canonical IDs, while Vue components consume only canonical `StoryTemplateId` values. The existing metadata, palette, QR, sharing, and export contracts remain unchanged.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Node test runner, Cloudflare Pages

## Global Constraints

- Canonical templates are exactly `frame`, `headline`, `spotlight`, `bulletin`, `caption`, `chromatic`, `split`, and `liquid`.
- `frame` is the default.
- Existing URLs using all seven retired IDs continue working through aliases.
- The five new templates use neutral surfaces, native sans-serif typography, consistent safe margins, and one restrained thumbnail-derived accent.
- `Chromatic`, `Split`, and `Liquid` keep their current behavior.
- Metadata, QR, share, and `1080x1920` export interfaces do not change.
- No new dependency is added.

---

### Task 1: Canonical Catalog and Legacy Route Aliases

**Files:**
- Create: `shared/utils/story-template-route.js`
- Create: `tests/story-template-route.test.mjs`
- Modify: `shared/types/story-template.ts`
- Modify: `shared/config/story-templates.ts`
- Modify: `shared/utils/story-route.ts`

**Interfaces:**
- Produces: `resolveStoryTemplateRouteValue(value, canonicalIds, fallback): string`
- Produces: canonical `StoryTemplateId` union with eight IDs
- Preserves: `parseStoryTemplate(value): StoryTemplateId`

- [ ] **Step 1: Write failing route resolution tests**

```js
test('keeps canonical template IDs', () => {
  for (const id of canonicalIds) {
    assert.equal(resolveStoryTemplateRouteValue(id, canonicalIds, 'frame'), id)
  }
})

test('maps all retired IDs to canonical replacements', () => {
  assert.equal(resolveStoryTemplateRouteValue('centered', canonicalIds, 'frame'), 'frame')
  assert.equal(resolveStoryTemplateRouteValue('glass', canonicalIds, 'frame'), 'frame')
  assert.equal(resolveStoryTemplateRouteValue('editorial', canonicalIds, 'frame'), 'headline')
  assert.equal(resolveStoryTemplateRouteValue('progress', canonicalIds, 'frame'), 'spotlight')
  assert.equal(resolveStoryTemplateRouteValue('full-bleed', canonicalIds, 'frame'), 'spotlight')
  assert.equal(resolveStoryTemplateRouteValue('clean-poster', canonicalIds, 'frame'), 'bulletin')
  assert.equal(resolveStoryTemplateRouteValue('poster', canonicalIds, 'frame'), 'caption')
})
```

- [ ] **Step 2: Run the test and verify it fails because the helper is missing**

Run: `npm test`

Expected: FAIL with module-not-found for `shared/utils/story-template-route.js`.

- [ ] **Step 3: Implement the pure route helper**

```js
export const LEGACY_STORY_TEMPLATE_ALIASES = Object.freeze({
  centered: 'frame',
  glass: 'frame',
  editorial: 'headline',
  progress: 'spotlight',
  'full-bleed': 'spotlight',
  'clean-poster': 'bulletin',
  poster: 'caption'
})

export function resolveStoryTemplateRouteValue(value, canonicalIds, fallback = 'frame') {
  const candidate = Array.isArray(value) ? value[0] : value
  if (typeof candidate !== 'string') return fallback
  if (canonicalIds.includes(candidate)) return candidate
  return LEGACY_STORY_TEMPLATE_ALIASES[candidate] ?? fallback
}
```

- [ ] **Step 4: Replace the catalog and connect `parseStoryTemplate` to the helper**

Update the TypeScript union and catalog to the eight canonical IDs. Build a canonical ID array from `STORY_TEMPLATES`, pass it to `resolveStoryTemplateRouteValue`, and cast the validated result to `StoryTemplateId` at the route boundary.

- [ ] **Step 5: Run tests and type checking**

Run: `npm test`

Expected: all route, theme, and cache tests pass.

Run: `npm run typecheck`

Expected: PASS with no retired ID used as canonical state.

- [ ] **Step 6: Commit**

```bash
git add shared/types/story-template.ts shared/config/story-templates.ts shared/utils/story-route.ts shared/utils/story-template-route.js tests/story-template-route.test.mjs
git commit -m "refactor: canonicalize story template routes"
```

### Task 2: Five Original Template Components

**Files:**
- Create: `components/story/templates/FrameStoryCard.vue`
- Create: `components/story/templates/HeadlineStoryCard.vue`
- Create: `components/story/templates/SpotlightStoryCard.vue`
- Create: `components/story/templates/BulletinStoryCard.vue`
- Create: `components/story/templates/CaptionStoryCard.vue`
- Modify: `components/story/StoryPreview.vue`
- Delete: `components/story/templates/CenteredStoryCard.vue`
- Delete: `components/story/templates/EditorialStoryCard.vue`
- Delete: `components/story/templates/PosterStoryCard.vue`
- Delete: `components/story/templates/ProgressStoryCard.vue`
- Delete: `components/story/templates/CleanPosterStoryCard.vue`
- Delete: `components/story/templates/FullBleedStoryCard.vue`
- Delete: `components/story/templates/GlassStoryCard.vue`

**Interfaces:**
- Consumes: `{ metadata, isLoading, errorMessage, palette }`
- Consumes: `useStoryCardContent(props)` and `storyPaletteStyle(palette)`
- Produces: five Vue story-card components compatible with `StoryPreview`

- [ ] **Step 1: Add the five components using the approved content hierarchy**

Each component must use a full-size `<article>`, `storyPaletteStyle(palette)`, `useStoryCardContent`, wrapped titles with `[overflow-wrap:anywhere]`, and a footer-safe `StoryYoutubeBrand`.

Use `var(--story-accent)` only for Frame’s offset edge, Headline’s rule, Spotlight’s label detail, Bulletin’s index, and Caption’s marker.

- [ ] **Step 2: Update the preview registry**

```ts
const templateComponents: Record<StoryTemplateId, Component> = {
  frame: FrameStoryCard,
  headline: HeadlineStoryCard,
  spotlight: SpotlightStoryCard,
  bulletin: BulletinStoryCard,
  caption: CaptionStoryCard,
  chromatic: ChromaticStoryCard,
  split: SplitStoryCard,
  liquid: LiquidStoryCard
}
```

- [ ] **Step 3: Run type checking before deleting retired components**

Run: `npm run typecheck`

Expected: PASS and `Record<StoryTemplateId, Component>` proves all canonical IDs render.

- [ ] **Step 4: Delete the seven retired components and scan for stale imports**

Run: `rg -n "CenteredStoryCard|EditorialStoryCard|PosterStoryCard|ProgressStoryCard|CleanPosterStoryCard|FullBleedStoryCard|GlassStoryCard" . --glob '!node_modules/**' --glob '!.nuxt/**'`

Expected: no source-code matches.

- [ ] **Step 5: Commit**

```bash
git add components/story/StoryPreview.vue components/story/templates
git commit -m "feat: add original story template family"
```

### Task 3: Picker, Milestone Documentation, and Full Verification

**Files:**
- Modify: `components/story/StoryTemplateCarousel.vue`
- Modify: `docs/milestones/README.md`
- Modify: `docs/milestones/m5-plan.md`
- Modify: `docs/milestones/m7-plan.md`
- Modify: `docs/milestones/m9-plan.md`

**Interfaces:**
- Consumes: `STORY_TEMPLATES.length === 8`
- Preserves: carousel arrows, swipe, keyboard selection, route synchronization, Share navigation, and export

- [ ] **Step 1: Make the indicator grid derive eight equal tracks**

Replace the fixed `grid-cols-10` class with `grid-cols-8`. The navigation calculations already derive their bounds from `STORY_TEMPLATES.length`.

- [ ] **Step 2: Update milestone documentation**

Add M9 to the milestone summary, document eight canonical templates, mark completed implementation items, and update M5/M7 historical notes without rewriting their original milestone scope.

- [ ] **Step 3: Run automated verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run typecheck`

Expected: PASS.

Run: `npm run build`

Expected: Cloudflare Pages build completes and includes the metadata server route.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Run browser smoke checks**

Verify Home displays eight picker options, mobile controls report `1 / 8` through `8 / 8`, legacy query IDs render their mapped replacements, and Share restores canonical IDs after refresh.

Export one clean and one QR story and confirm both remain `1080x1920` with no title, image, brand, or QR overlap.

- [ ] **Step 5: Commit**

```bash
git add components/story/StoryTemplateCarousel.vue docs/milestones
git commit -m "docs: complete original template milestone"
```
