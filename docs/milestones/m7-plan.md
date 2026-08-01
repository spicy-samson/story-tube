# M7 Plan - Mobile Story Carousel and QA

> Post-M9 note: the carousel now cycles through six canonical templates. Its navigation continues to derive bounds and labels from the shared template catalog.

## Summary

M7 makes the creation workflow feel designed for a phone. After a YouTube video loads, the generated 9:16 story becomes the mobile template picker: the user swipes the preview or uses previous and next controls to move through the ten designs.

Desktop keeps the existing visual template grid. Mobile renders one story at a time so the page stays focused and does not stack ten small template cards above the actual result.

## User Flow

1. Paste a YouTube URL.
2. Generate the story metadata.
3. Move automatically to the generated story on a phone-sized viewport.
4. Swipe the story left or right, use arrow controls, or select a position indicator.
5. Open Share Story with the currently selected template.
6. Return from the share route without losing the video or template.

## Implementation

- Add a reusable `StoryTemplateCarousel` around the existing `StoryPreview`.
- Keep `selectedTemplate` in `pages/index.vue` as the single source of truth.
- Render only one `StoryPreview`; template changes replace its active component.
- Use pointer events for touch swipe detection.
- Ignore mouse drags so desktop text selection and normal pointer behavior are unaffected.
- Require a 48-pixel horizontal movement that is larger than the vertical movement.
- Wrap navigation from the first template to the last and from the last to the first.
- Support previous and next arrow keys while the carousel is focused.
- Keep arrow buttons and direct position controls as accessible alternatives to swiping.
- Hide the template swatch grid below the `lg` breakpoint.
- Keep the full template picker and sharing controls on desktop.
- Scroll the generated result into view on mobile after successful metadata loading.
- Continue syncing the selected template to the current route with `router.replace()`.

## Test Plan

- [ ] Mobile template grid is replaced by one generated story and carousel controls.
- [ ] Desktop template grid remains available.
- [ ] Previous and next controls cycle through all ten templates.
- [ ] Position controls select a specific template.
- [ ] Swipe left selects the next template.
- [ ] Swipe right selects the previous template.
- [ ] Vertical scrolling does not accidentally change templates.
- [ ] Arrow keys change templates when the carousel is focused.
- [ ] Generate scrolls the result into view on mobile.
- [ ] Selected template continues into `/share/:videoId`.
- [ ] Test on physical iPhone Safari.
- [ ] Test on physical Android Chrome.
- [ ] Verify PWA installation and standalone display.
- [ ] Verify native share sheet, clipboard fallback, PNG download, and QR scanning.

## Done When

- A phone user can generate, compare, and share a story without scrolling through a large template grid.
- Touch, buttons, and keyboard controls all operate the same `selectedTemplate` state.
- Desktop behavior does not regress.
- The deployed PWA passes the remaining physical-device checks.

## Known Limits

- The carousel does not animate in the direction of the swipe; the existing preview transition handles template changes.
- Swipe behavior is intentionally small and local. A carousel library is unnecessary for one preview and ten IDs.
- Physical-device and installed-PWA checks still require the deployed HTTPS build.
