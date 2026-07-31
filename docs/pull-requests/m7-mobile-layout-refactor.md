# PR: M7 Mobile Layout Refactor

## Merge

From: `m7-mobile-layout-refactor`

Into: `main`

## Summary

This PR completes the M7 mobile layout pass by making the story preview the main mobile template picker, then adds a small light/dark theme layer so the app feels cleaner and more like a focused software project.

The biggest workflow change is on phones: after a YouTube link is generated, the user sees one full story preview with carousel controls instead of a stacked grid of template cards. Desktop keeps the full template grid for faster comparison.

## What Changed

- Added `StoryTemplateCarousel` for the mobile creation flow.
- Kept desktop template selection as the existing grid.
- Rendered one active `StoryPreview` on mobile instead of many template cards.
- Added touch swipe, previous/next controls, position controls, and keyboard navigation.
- Auto-scrolls to the generated story on mobile after metadata loads.
- Keeps the selected template synced into the route and share flow.
- Added learning documentation for how the M7 carousel works.
- Added a persistent light/dark mode toggle.
- Added a small tested theme resolver in `shared/utils/theme.js`.
- Added semantic app theme tokens in `assets/css/main.css`.
- Simplified the home and share workspaces with quieter typography, colors, borders, and spacing.
- Added minimalist theme design and implementation notes under `docs/superpowers`.

## Milestone Coverage

### M7 - Mobile Story Carousel and QA

- Mobile users no longer need to scroll through ten template cards.
- The generated story becomes the mobile template picker.
- Desktop users still get the full template grid.
- Template changes continue to update the same `selectedTemplate` state.
- Share Story carries the selected template into `/share/:videoId`.
- Route restoration still works when returning to `/` with `video` and `template` query params.
- Theme preference persists across refreshes through `localStorage`.
- The app falls back to the system color scheme when no preference is saved.

## Public UI Changes

- `/` remains the story creation workspace.
- `/share/:videoId` remains the routed share/export workspace.
- A fixed theme toggle is available globally.
- Mobile creation uses carousel controls after generation.
- Desktop creation keeps the full template grid.

## Non-Goals

- No new backend endpoint is added.
- No database, auth, analytics, or saved project state is added.
- No Instagram automation is added.
- No change is made to the PNG export contract.
- Physical-device QA is still required before treating M7 as fully production-polished.

## Testing

Completed locally:

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Direct `/` route smoke check
- Invalid `/share/:videoId` route smoke check

Known verification gap:

- Browser screenshot verification was not completed because no browser session was available in the current tool environment.
- Physical iPhone/Android checks are still needed for the final M7 mobile QA pass.

## Notes For Review

- The carousel is intentionally simple: it changes the selected template ID and lets `StoryPreview` render the active template.
- It avoids rendering ten full 9:16 previews on mobile, which keeps the page lighter and makes the export target clearer.
- Theme state is handled outside story template rendering, so exported story designs are not accidentally changed by app light/dark mode.
- There are unrelated local changes not included in this PR scope:
  - `components/story/templates/SplitStoryCard.vue`
  - `.env.example`
  - `notes.md`

## Suggested PR Title

```txt
Implement M7 mobile layout refactor
```

## Suggested PR Description

```md
## Summary

- make the generated story preview the mobile template carousel
- keep the desktop template grid for fast comparison
- add persistent light/dark mode and simplify the app chrome

## Testing

- npm test
- npm run typecheck
- npm run build
- git diff --check
- local route smoke checks for `/` and invalid `/share/:videoId`
```
