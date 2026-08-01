# Chromatic Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Chromatic's playful tilted poster with the approved Gallery layout and a thumbnail-derived soft-focus background wash.

**Architecture:** Keep the existing `ChromaticStoryCard` props and palette data flow unchanged. Render the proxied thumbnail twice: once as a deterministic blurred full-canvas atmosphere layer and once as crisp framed artwork, with a dark palette-aware veil protecting editorial text.

**Tech Stack:** Nuxt, Vue 3, TypeScript, Tailwind CSS, Node test runner, html-to-image

## Global Constraints

- Preserve the existing `ChromaticStoryCard` public props.
- Use `metadata.thumbnailUrl` for both image layers.
- Keep all content inside the existing Instagram-safe story canvas.
- Do not add user controls, dependencies, or route state.
- Do not modify Frame, Headline, Spotlight, Split, or Liquid.
- Keep title text wrapped without a line clamp.

---

### Task 1: Build the Chromatic Gallery

**Files:**
- Create: `tests/chromatic-story-card.test.mjs`
- Modify: `components/story/templates/ChromaticStoryCard.vue`
- Modify: `shared/config/story-templates.ts`
- Modify: `docs/milestones/m9-plan.md`

**Interfaces:**
- Consumes: existing `metadata`, `isLoading`, `errorMessage`, and `palette` props
- Produces: the same `ChromaticStoryCard` component contract with a new internal layout

- [x] **Step 1: Write the failing source-contract test**

Assert that Chromatic contains a full-canvas thumbnail with `blur-[24px]`, a straight framed thumbnail, a dark veil, wrapped unclamped title text, and no rotation or decorative geometry classes.

- [x] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/chromatic-story-card.test.mjs`

Expected: FAIL because the current component uses rotations and does not render the soft-focus background layer.

- [x] **Step 3: Implement the approved Gallery composition**

Use this layer order:

```vue
<img class="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] scale-110 object-cover opacity-40 blur-[24px] saturate-[0.9]" ...>
<div class="absolute inset-0 bg-[var(--story-bg)] opacity-55" />
<div class="relative z-10 ...">...</div>
```

Inside the content layer, render a compact header, straight framed 16:9 artwork, channel, naturally wrapping title, sampled-accent rule, and bottom YouTube attribution.

- [x] **Step 4: Update M9 documentation**

Describe Chromatic as the mature Gallery layout with a soft-focus thumbnail color wash and mark the redesign complete.

- [x] **Step 5: Run focused and full verification**

Run:

```bash
node --test tests/chromatic-story-card.test.mjs
npm test
npm run typecheck
npm run build
```

Expected: all tests pass, typecheck exits `0`, and the Cloudflare Pages build exits `0`.
