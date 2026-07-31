# M9 Plan - Original Template Family

## Summary

M9 replaces the first seven screenshot-inspired story templates with five original Story Tube layouts. `Chromatic`, `Split`, and `Liquid` remain, producing a focused catalog of eight templates.

The five new templates share one restrained visual system: neutral surfaces, native sans-serif typography, consistent safe margins, and one accent sampled from the YouTube thumbnail.

Detailed design: [Original Story Template Family Design](../superpowers/specs/2026-07-31-original-template-family-design.md)

## Canonical Templates

| Template | Purpose |
|---|---|
| Frame | Balanced thumbnail, title, and channel default |
| Headline | Typography-first story for strong titles |
| Spotlight | Full-bleed monochrome image with quiet lower metadata |
| Bulletin | Structured upload announcement |
| Caption | Asymmetric image with compact editorial caption |
| Chromatic | Existing thumbnail-matched poster |
| Split | Existing image and type composition |
| Liquid | Existing glass color-flow composition |

## Implementation

- [x] Replace the canonical template IDs with the eight-template catalog.
- [x] Add route aliases for all seven retired IDs.
- [x] Make `Frame` the default template.
- [x] Build `Frame`, `Headline`, `Spotlight`, `Bulletin`, and `Caption` components.
- [x] Keep thumbnail-derived accents restrained and consistent.
- [x] Update `StoryPreview` to render exactly eight canonical components.
- [x] Remove the seven retired components after replacements are wired.
- [x] Update the desktop picker and mobile carousel for eight templates.
- [x] Preserve Home-to-Share and Share-to-Home template restoration.
- [x] Preserve clean PNG, QR PNG, and native share behavior.
- [x] Give Spotlight a full-canvas monochrome thumbnail with a left-biased focal crop.

## Legacy URL Mapping

| Old template | Replacement |
|---|---|
| `centered` | `frame` |
| `glass` | `frame` |
| `editorial` | `headline` |
| `progress` | `spotlight` |
| `full-bleed` | `spotlight` |
| `clean-poster` | `bulletin` |
| `poster` | `caption` |

Unknown or missing template values fall back to `frame`. New URL updates always use canonical IDs.

## Test Plan

- [x] Automated tests cover canonical IDs, legacy aliases, arrays, and fallback behavior.
- [x] Type checking passes.
- [x] Cloudflare Pages production build passes.
- [x] Desktop picker exposes eight templates.
- [ ] Mobile arrows, swipe, keyboard, and indicators cycle through eight templates.
- [ ] Short and long titles remain contained in every template.
- [x] Old Home and Share URLs restore the expected replacement.
- [ ] Clean and QR exports remain exactly `1080x1920`.
- [ ] QR positions do not cover essential content.

## Done When

- Story Tube has five new original core designs and three retained designs.
- Old links still open a sensible replacement.
- The full creation, routing, sharing, and export workflow works with all eight templates.
