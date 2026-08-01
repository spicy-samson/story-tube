# Story Template Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved August 1 template and Share Story polish with the smallest component-local changes.

**Architecture:** Remove decorative markup directly from each template. Keep Headline fitting local to `HeadlineStoryCard.vue`, and keep Share loading local to `pages/index.vue`; existing metadata, route, and export flows remain unchanged.

**Tech Stack:** Nuxt, Vue 3, TypeScript, Tailwind CSS, Lucide Vue, Node test runner

## Global Constraints

- Preserve full titles without truncation.
- Add no dependencies or shared abstractions.
- Keep preview and PNG rendering deterministic.
- Preserve accessibility names and keyboard behavior.

---

### Task 1: Simplify Template Chrome

**Files:**
- Modify: `components/story/templates/FrameStoryCard.vue`
- Modify: `components/story/templates/HeadlineStoryCard.vue`
- Modify: `components/story/templates/SpotlightStoryCard.vue`
- Modify: `components/story/templates/ChromaticStoryCard.vue`
- Modify: `components/story/templates/LiquidStoryCard.vue`
- Create: `tests/story-template-polish.test.mjs`

- [x] Add failing source tests for removed labels, removed Liquid play control, Headline title tiers, and Frame's single subtle border.
- [x] Run the focused test and confirm failure.
- [x] Remove decorative markup and implement Headline's four local title-size tiers.
- [x] Run the focused test and confirm success.

### Task 2: Relocate Share Story

**Files:**
- Modify: `pages/index.vue`
- Extend: `tests/story-template-polish.test.mjs`

- [x] Add failing tests for one preview-side round Share button and its idle/loading icons.
- [x] Run the focused test and confirm failure.
- [x] Move the action below `StoryTemplateCarousel`, add `isOpeningShare`, and guard/reset navigation state.
- [x] Run the focused test and confirm success.

### Task 3: Verify

- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run `git diff --check` and confirm unrelated user files remain untouched.
