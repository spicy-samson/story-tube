# M3 Plan - Story Preview

## Summary

Turn the current metadata preview into the first genuinely postable 9:16 story card.

M3 is not about export yet. The goal is that after a user pastes a YouTube link and metadata loads, the browser preview itself looks good enough to screenshot and share manually. M4 will turn that preview into a downloadable 1080x1920 PNG.

## Implementation Status

Status: implemented.

Post-M3 note: the original single-template preview was expanded into the seven-template Tailwind system documented in [m5-plan.md](./m5-plan.md). The sections below preserve the scope and decisions used to complete M3.

M3 builds on M2:

```txt
YouTube URL
  -> /api/youtube/metadata
  -> normalized title, channel, thumbnail, canonical URL
  -> polished story preview
```

## Key Changes

- [x] Create a dedicated story preview component.
- [x] Create a first template component: `Minimal`.
- [x] Keep the story surface fixed at 9:16.
- [x] Use the fetched YouTube thumbnail as the visual anchor.
- [x] Add blurred/dimmed thumbnail background treatment.
- [x] Add readable title and channel typography.
- [x] Add clear source attribution: `Watch on YouTube`.
- [x] Add canonical video link display or subtle watch cue.
- [x] Add empty state before metadata is loaded.
- [x] Add loading state while metadata is being fetched.
- [x] Add error-safe preview state when metadata fetch fails.
- [x] Keep export disabled until M4.
- [x] Establish the template picker placeholder that M5 later expanded.

## Component Shape

Proposed component structure:

```txt
components/
  story/
    StoryPreview.vue
    templates/
      CenteredStoryCard.vue
```

Shared type:

```ts
import type { YoutubeMetadata } from '~/shared/types/youtube-metadata'
```

`StoryPreview.vue` owns the frame and state routing:

```txt
empty metadata
  -> empty preview

loading
  -> stable preview skeleton

error
  -> neutral placeholder preview

metadata loaded
  -> CenteredStoryCard
```

`CenteredStoryCard.vue` owns the first visual template.

## Visual Direction

The first card should feel:

- Clean.
- Mobile-native.
- Not like a landing-page hero.
- More editorial than dashboard.
- Strong enough to screenshot before export exists.

Required visual ingredients:

- 9:16 card surface.
- Large thumbnail or thumbnail-derived background.
- High-contrast title.
- Channel name.
- `Watch on YouTube` badge/source cue.
- Enough spacing to survive long titles.
- No overlapping text on mobile.

## Design References

The attached reference screenshots show seven useful formats. Treat them as inspiration, not exact copies.

| Reference | Template Direction | Notes |
|---|---|---|
| Image 1 | Centered media card | Blurred dark background, rounded media/info card centered vertically, YouTube mark at bottom |
| Image 2 | Full-bleed editorial dark | Huge dimmed background image, uppercase title, small duration/play controls, bottom YouTube mark |
| Image 3 | Blue editorial poster | Solid color background, serif headline, framed thumbnail, footer attribution |
| Image 4 | Full-bleed progress card | Background thumbnail with dark overlay, title near lower third, progress bar, YouTube mark |
| Image 5 | Clean text poster | Light background, bold black typography, metadata list, footer line and YouTube mark |
| Image 6 | Top-title full-bleed | Full image background, title at top, YouTube mark bottom, simple watch badge |
| Image 7 | Floating glass media card | Blurred dark background, centered translucent card with thumbnail/title/channel |

M3 should implement the first real template as:

```txt
Minimal / Centered Media Card
```

M5 can add the remaining directions:

```txt
Full-Bleed Editorial
Blue Poster
Progress Card
Clean Text Poster
Top-Title Full-Bleed
Floating Glass Card
```

M3 design target:

- Use Image 1 and Image 7 as the closest first reference.
- Keep the YouTube source mark visible near the bottom of the 9:16 card.
- Keep the video thumbnail in a rounded framed block.
- Put title and channel in a readable lower info panel.
- Use the thumbnail colors as the background via blur/dim treatment.
- Avoid hardcoding duration because M2 oEmbed does not provide it yet.

## Frontend Behavior

- User pastes a valid YouTube URL.
- User taps Generate.
- M2 metadata loads.
- M3 preview updates into a polished story card.
- At M3 completion, the selected template remained `Centered`.
- M5 later enabled the full seven-template picker.
- Export button remains disabled until M4.

## Acceptance Criteria

M3 is done when:

- A valid YouTube link produces a polished 9:16 browser preview.
- The preview uses real title, channel, thumbnail, and source attribution.
- The card still looks good with a long video title.
- The card has no incoherent text/image overlap on mobile.
- The empty/loading/error preview states look intentional.
- `npm run build` passes.
- Mobile and desktop screenshots show no horizontal overflow.

## Test Plan

Manual data cases:

- Short music title.
- Long official-video title.
- Tutorial/lecture-style title.
- Shorts URL metadata.
- Invalid URL error state.

Visual checks:

- Mobile viewport around `390x844`.
- Desktop viewport around `1440x1000`.
- Long title wraps without escaping the card.
- Thumbnail renders and does not block text readability.
- Empty/loading/error states preserve the 9:16 frame.

Build checks:

- Run `npm run build`.
- Run local dev server.
- Verify M2 endpoint still works.
- Verify Cloudflare Pages output still includes the API route.

## Known Non-Goals

- No PNG export yet.
- No downloadable output yet.
- No animated MP4.
- At M3 completion there was no real template switching; M5 has since implemented it.
- No auth, persistence, payments, or saved projects.

## Assumptions

- M3 keeps all rendering client-side.
- M3 does not change the M2 metadata API contract.
- M3 can refactor `app.vue` into components if it improves clarity.
- M3 prioritizes one excellent card over three unfinished templates.
- The first template follows the centered media card family from the attached references.
