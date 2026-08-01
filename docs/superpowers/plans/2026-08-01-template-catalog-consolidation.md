# Template Catalog Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate the overlapping original templates into a clearer six-template catalog while preserving existing shared URLs.

**Architecture:** `Frame` absorbs Caption's asymmetric editorial treatment, while `Headline` absorbs Bulletin's structured upload information. `bulletin` and `caption` become route-boundary aliases rather than application state. Spotlight keeps its isolated crop state and receives a smaller icon-only editing control outside the export canvas.

**Tech Stack:** Nuxt, Vue 3, TypeScript, Tailwind CSS, Node test runner

## Global Constraints

- Keep `frame` and `headline` as working catalog names until naming is revisited.
- Preserve all existing legacy Home and Share URLs.
- Do not change `Chromatic`, `Split`, or `Liquid`.
- Keep template editing controls outside the exported story element.
- Preserve exact `1080x1920` PNG output and the existing QR overlay contract.

---

## Task 1: Consolidate the canonical catalog

**Files:**
- Modify: `shared/types/story-template.ts`
- Modify: `shared/config/story-templates.ts`
- Modify: `shared/utils/story-template-route.js`
- Modify: `components/story/StoryPreview.vue`
- Modify: `components/story/StoryTemplateCarousel.vue`
- Modify: `pages/index.vue`
- Delete: `components/story/templates/BulletinStoryCard.vue`
- Delete: `components/story/templates/CaptionStoryCard.vue`
- Test: `tests/story-template-route.test.mjs`
- Test: `tests/story-template-catalog.test.mjs`

1. Add failing tests for exactly six canonical IDs.
2. Assert `bulletin` resolves to `headline` and `caption` resolves to `frame`.
3. Remove the retired IDs, components, and preview mappings.
4. Update picker count, labels, and indicators to six.
5. Run focused catalog tests.

## Task 2: Merge the visual roles

**Files:**
- Modify: `components/story/templates/HeadlineStoryCard.vue`
- Modify: `components/story/templates/FrameStoryCard.vue`
- Test: `tests/merged-template-design.test.mjs`

1. Add failing source-contract tests for the merged visual roles.
2. Give Headline a restrained black glass surface, structured release metadata, and type-first hierarchy.
3. Give Frame an off-white editorial surface, framed artwork, and an asymmetric caption block.
4. Keep long-title wrapping and QR-safe margins explicit.
5. Run the merged-template tests.

## Task 3: Simplify Spotlight's crop control

**Files:**
- Modify: `components/story/SpotlightDragHandle.vue`
- Test: `tests/spotlight-story-card.test.mjs`

1. Add failing assertions for an icon-only circular horizontal crop control.
2. Remove visible helper text while retaining the tooltip, accessible name, slider semantics, pointer capture, and keyboard nudging.
3. Run the Spotlight tests.

## Task 4: Verify the workflow

1. Run `npm test`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Smoke-check Home and legacy template query restoration against the local server.
5. Confirm user-owned uncommitted files remain untouched.
