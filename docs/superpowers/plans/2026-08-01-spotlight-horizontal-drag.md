# Spotlight Horizontal Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users reposition only Spotlight's full-bleed thumbnail horizontally and preserve that crop through navigation and PNG export.

**Architecture:** Store a validated `0` through `100` horizontal focal value in route state and pass it through Carousel/Share Workspace into Story Preview. Story Preview owns the non-exported upper-right drag handle, while Spotlight only renders the supplied value as `object-position`.

**Tech Stack:** Nuxt, Vue, Tailwind CSS, Lucide Vue, Node test runner

## Global Constraints

- Spotlight is the only draggable template.
- Vertical object position remains fixed at `50%`.
- Default horizontal object position is `16`.
- Editing controls must not appear in PNG exports.
- Existing user edits to Spotlight overlays must be preserved.

---

### Task 1: Crop value contract

**Files:**
- Create: `shared/utils/spotlight-crop.js`
- Modify: `shared/utils/story-route.ts`
- Test: `tests/spotlight-crop.test.mjs`

- [ ] Add failing tests for default, clamp, route parsing, arrays, and malformed values.
- [ ] Implement `clampSpotlightX(value)` and `parseSpotlightX(value)`.
- [ ] Run the focused test and full test suite.

### Task 2: Spotlight presentation and handle

**Files:**
- Create: `components/story/SpotlightDragHandle.vue`
- Modify: `components/story/StoryPreview.vue`
- Modify: `components/story/templates/SpotlightStoryCard.vue`
- Test: `tests/spotlight-story-card.test.mjs`

- [ ] Add failing source-contract tests for reactive object position and export-excluded control placement.
- [ ] Pass `spotlightX` to Spotlight and emit clamped updates from Story Preview.
- [ ] Implement pointer capture and keyboard arrow behavior in the upper-right handle.
- [ ] Keep the handle outside Story Preview's first-child export canvas.

### Task 3: Home and Share persistence

**Files:**
- Modify: `components/story/StoryTemplateCarousel.vue`
- Modify: `components/story/StoryShareWorkspace.vue`
- Modify: `pages/index.vue`
- Modify: `pages/share/[videoId].vue`

- [ ] Restore `spotlightX` from route query on both pages.
- [ ] Keep Home route state synchronized and include crop during Share navigation.
- [ ] Preserve crop in Back-to-Edit and normalized Share URLs.
- [ ] Regenerate the prepared asset after crop updates on Share.

### Task 4: Verification and documentation

**Files:**
- Modify: `docs/milestones/m9-plan.md`
- Modify: `docs/superpowers/plans/2026-08-01-spotlight-horizontal-drag.md`

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Mark completed implementation and automated test items in M9.
