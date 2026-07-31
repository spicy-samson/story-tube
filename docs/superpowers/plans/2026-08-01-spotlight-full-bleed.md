# Spotlight Full-Bleed Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Spotlight's thumbnail visibly fill the complete story canvas with a distinctive monochrome, left-focused crop.

**Architecture:** Keep the existing Spotlight composition and QR-safe content positions. Change only the thumbnail's presentation classes, then verify the source contract and production build.

**Tech Stack:** Nuxt, Vue, Tailwind CSS, Node test runner

## Global Constraints

- Preserve Spotlight's existing typography, overlays, branding, and QR-safe layout.
- Use `object-fit: cover`, `object-position: 16% 50%`, full grayscale, and restrained contrast.
- Do not add a transition because image export requires deterministic rendering.

---

### Task 1: Spotlight artwork treatment

**Files:**
- Modify: `components/story/templates/SpotlightStoryCard.vue`
- Modify: `docs/milestones/m9-plan.md`
- Test: `tests/spotlight-story-card.test.mjs`

**Interfaces:**
- Consumes: existing `YoutubeMetadata.thumbnailUrl`
- Produces: unchanged `SpotlightStoryCard` props and full-canvas thumbnail presentation

- [ ] **Step 1: Write a failing source-contract test**

Assert that Spotlight contains the full-size image classes, left-biased object position, grayscale filter, and contrast treatment.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/spotlight-story-card.test.mjs`

Expected: failure because Spotlight does not yet define the focal position or monochrome treatment.

- [ ] **Step 3: Implement the minimal presentation change**

Add `object-[16%_50%]`, `grayscale`, and `contrast-[1.1]` to the existing full-size thumbnail. Keep all surrounding layout unchanged.

- [ ] **Step 4: Verify behavior and regression safety**

Run: `npm test && npm run typecheck && npm run build`

Expected: all tests, Nuxt type checking, and the Cloudflare Pages production build pass.

- [ ] **Step 5: Complete the milestone checklist**

Mark the Spotlight treatment complete in `docs/milestones/m9-plan.md` after verification.
