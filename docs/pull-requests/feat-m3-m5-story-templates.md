# PR: M3 + M5 Story Templates

## Merge

From: `feat/m3+m5/story-templates`

Into: `main`

## Summary

This PR completes the M3 story preview milestone and implements the M5 template system ahead of M4. The app now turns loaded YouTube metadata into a polished 9:16 story workspace with seven selectable visual templates inspired by the supplied reference cards.

The main user-facing change is that the first screen is no longer a single static preview. A user can paste a YouTube URL, load metadata through the existing M2 pipeline, then switch between multiple story-card designs instantly.

## What Changed

- Added Tailwind CSS support through `@nuxtjs/tailwindcss`.
- Refactored the app layout in `app.vue` to use Tailwind utility classes.
- Added a dedicated story preview system:
  - `components/story/StoryPreview.vue`
  - `components/story/StoryPlayButton.vue`
  - `components/story/StoryYoutubeBrand.vue`
- Added seven story templates:
  - Centered
  - Editorial
  - Blue Poster
  - Progress
  - Clean Poster
  - Full Bleed
  - Glass
- Added shared template typing in `shared/types/story-template.ts`.
- Added `useStoryCardContent` to centralize empty, loading, error, and loaded preview content.
- Reduced `assets/css/main.css` to Tailwind directives plus minimal global browser defaults.
- Added `npm run typecheck`.
- Updated milestone and product docs for M3 and M5.

## Milestone Coverage

### M3 - Story Preview

- Real 9:16 story-card surface.
- Real metadata rendering for title, channel, thumbnail, and YouTube attribution.
- Intentional empty, loading, and error states.
- Mobile and desktop layout checks.
- Export remains disabled for M4.

### M5 - Template Set

- Seven selectable templates are implemented.
- Template switching is client-side and instant.
- Long titles are contained through template-specific layout and line clamping.
- All templates share the same M2 metadata contract.

## Non-Goals

- PNG export is not included in this PR.
- Duration is not implemented because the current M2 oEmbed response does not provide duration.
- No auth, persistence, payments, saved projects, or template customization controls are included.
- No separate Cloudflare Worker is added; the app continues to use Nuxt/Nitro server routes.

## Testing

Completed locally:

- `npm run typecheck`
- `npm run build`
- Local Nuxt dev smoke test
- Valid YouTube URL metadata load
- All seven template picker buttons
- Desktop viewport layout check
- Mobile viewport layout check
- Confirmed no horizontal overflow
- Confirmed Cloudflare Pages build still bundles the M2 metadata route

Test URL used:

```txt
https://youtu.be/dQw4w9WgXcQ
```

## Notes For Review

- This branch intentionally keeps export disabled. M4 should handle PNG export and will likely need a thumbnail proxy or same-origin image strategy so browser canvas export does not hit CORS issues.
- `npm install` reported existing audit findings. This PR does not run `npm audit fix` because that could introduce unrelated dependency churn.
- `.env.example` may still need to be added separately if it should be part of the M2/M3 documentation trail.

## Suggested PR Title

```txt
Implement M3 story preview and M5 template system
```

## Suggested PR Description

```md
## Summary

- implement the 9:16 story preview surface for loaded YouTube metadata
- add seven selectable Tailwind-based story templates
- update M3/M5 milestone docs and keep export scoped to M4

## Testing

- npm run typecheck
- npm run build
- local desktop/mobile smoke test
```
