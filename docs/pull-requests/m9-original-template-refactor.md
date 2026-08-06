# PR: M9 Original Template Refactor

## Merge

From: `m9-original-template-refactor`

Into: `main`

## Summary

This PR completes M9 by replacing the screenshot-inspired template set with a smaller, more original Posterize family.

The catalog is now six focused templates: `Frame`, `Headline`, `Spotlight`, `Chromatic`, `Split`, and `Liquid`. The first three replace and consolidate the old borrowed-feeling layouts, while `Chromatic`, `Split`, and `Liquid` remain as the stronger custom designs.

## What Changed

- Replaced the old ten-template catalog with six canonical templates.
- Added `FrameStoryCard`, `HeadlineStoryCard`, and `SpotlightStoryCard`.
- Removed retired template components:
  - `CenteredStoryCard`
  - `EditorialStoryCard`
  - `PosterStoryCard`
  - `ProgressStoryCard`
  - `CleanPosterStoryCard`
  - `FullBleedStoryCard`
  - `GlassStoryCard`
- Consolidated `Bulletin` into `Headline`.
- Consolidated `Caption` into `Frame`.
- Kept legacy template URLs working through route aliases.
- Made `Frame` the default template.
- Updated `StoryPreview`, the desktop picker, and mobile carousel to use the six-template catalog.
- Redesigned `Chromatic` into a more mature soft-focus gallery style with thumbnail-driven atmosphere.
- Updated `Spotlight` to use a full-canvas monochrome image treatment.
- Added a minimalist x-axis crop control for `Spotlight`.
- Persisted `Spotlight` crop through home, share route, refresh, Back to Edit, and PNG export.
- Polished template typography, small labels, frame borders, and share button placement.
- Removed export-hostile backdrop blur from `Headline` so the downloaded PNG no longer gets the black middle band.
- Updated M5, M7, M9, and Superpowers planning/design docs.

## Milestone Coverage

### M9 - Original Template Family

- The first seven screenshot-inspired templates are no longer shipped as standalone designs.
- The app now presents a cleaner original template family.
- Old links still resolve to sensible replacements.
- Template route values are normalized to canonical IDs.
- The share/export workflow still supports clean PNG, QR PNG, and native sharing.
- Spotlight image positioning is adjustable without adding global drag behavior to every template.

## Canonical Templates

| Template | Role |
|---|---|
| `frame` | White editorial frame and compact caption layout |
| `headline` | Black glass headline and upload-detail layout |
| `spotlight` | Full-bleed monochrome image with quiet metadata |
| `chromatic` | Soft-focus thumbnail gallery with sampled color wash |
| `split` | Existing image/type split composition |
| `liquid` | Existing glass color-flow composition |

## Legacy URL Mapping

| Old template | Replacement |
|---|---|
| `centered` | `frame` |
| `glass` | `frame` |
| `editorial` | `headline` |
| `bulletin` | `headline` |
| `caption` | `frame` |
| `progress` | `spotlight` |
| `full-bleed` | `spotlight` |
| `clean-poster` | `headline` |
| `poster` | `frame` |

## Public UI Changes

- `/` still opens the creation workspace.
- `/share/:videoId` still opens the share/export workspace.
- The visible template picker now shows six templates.
- Spotlight exposes a small crop icon control in the story preview.
- The Share Story action now sits under the active story preview.

## Non-Goals

- No new backend route is added.
- No database, auth, analytics, saved projects, or Instagram automation is added.
- No permanent hosted story image page is added.
- No new dependency is added for the template refactor.

## Testing

Completed locally during this branch:

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Not rerun after the latest visual-only Headline polish because the request was to execute without tests.

Still worth checking before merge:

- Clean and QR exports are exactly `1080x1920` for all six templates.
- Long titles remain contained in every template.
- Mobile carousel arrows, swipe, keyboard, and indicators cycle through six templates.
- Spotlight crop position matches between browser preview and downloaded PNG.
- QR stickers do not cover essential content.

## Notes For Review

- The route alias layer keeps old shared URLs useful while new route updates write canonical template IDs.
- Spotlight crop is intentionally scoped to that one image-forward template.
- The Headline export issue was caused by CSS backdrop filtering during html-to-image rendering, so the panel now uses a solid translucent black instead.
- There are unrelated local files not included in the M9 scope:
  - `.env.example`
  - `notes.md`

## Suggested PR Title

```txt
Implement M9 original template refactor
```

## Suggested PR Description

```md
## Summary

- replace the screenshot-inspired template set with six original Posterize templates
- preserve legacy template URLs through aliases
- add Spotlight x-axis crop control and mature the Chromatic/Headline/Frame designs

## Testing

- npm test
- npm run typecheck
- npm run build
- git diff --check

Note: latest visual-only Headline export polish was not rerun through tests per request.
```
