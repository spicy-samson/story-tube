# Original Story Template Family Design

## Goal

Replace the first seven screenshot-inspired story templates with five original Story Tube templates. Keep `Chromatic`, `Split`, and `Liquid`, resulting in eight templates total.

The new five should feel like one restrained product family rather than unrelated poster designs. They use simple layouts, neutral surfaces, consistent typography and spacing, and one accent sampled from the YouTube thumbnail.

## Template Set

The canonical template catalog becomes:

| ID | Name | Content role |
|---|---|---|
| `frame` | Frame | Balanced default with equal weight for thumbnail, title, and channel |
| `headline` | Headline | Typography-first layout for strong or urgent titles |
| `spotlight` | Spotlight | Full-bleed thumbnail with restrained metadata inside safe margins |
| `bulletin` | Bulletin | Structured upload announcement with simple modular rows |
| `caption` | Caption | Asymmetric image treatment with a compact editorial caption |
| `chromatic` | Chromatic | Existing thumbnail-matched poster |
| `split` | Split | Existing image and type composition |
| `liquid` | Liquid | Existing glass color-flow composition |

`Frame` is the default template.

## Shared Visual System

The five new templates share:

- The native sans-serif stack.
- A neutral black, white, and gray foundation.
- One accent color from the existing thumbnail palette sampler.
- Consistent Instagram-safe margins.
- A common title scale with template-specific limits.
- Zero negative letter spacing.
- Small, consistent channel and YouTube attribution.
- Straight edges or small radii rather than decorative pill shapes.
- No ornamental gradients, blur effects, fake playback controls, or copied visual motifs.

The sampled accent is used sparingly for a line, frame, index, or caption marker. It does not recolor every surface.

## Template Layouts

### Frame

- Small upload label at the top.
- Framed 16:9 thumbnail near the vertical center.
- Sampled accent appears as an offset edge or compact marker.
- Wrapped title and channel sit below the image.
- YouTube attribution is anchored to the footer safe area.

### Headline

- Title occupies the primary upper area.
- A short sampled-accent rule separates title and supporting content.
- A smaller thumbnail anchors the lower portion.
- Channel and YouTube attribution remain compact.
- Long titles wrap and reduce prominence before they can overlap the image.

### Spotlight

- Thumbnail fills the story surface.
- A neutral tonal overlay protects readability without changing the image palette.
- A small action label sits near the top safe margin.
- Title and channel are anchored to the lower safe area.
- No progress bar or simulated media-player chrome is used.

### Bulletin

- Compact header contains an upload label and sampled-accent index.
- Title appears above a modest thumbnail.
- Two simple information rows communicate new upload and YouTube destination.
- Thin rules provide structure.
- The layout remains sparse and functional.

### Caption

- An offset thumbnail creates asymmetry without using a half-and-half split.
- A narrow sampled-accent bar introduces the caption block.
- Title and channel form one compact text group.
- Negative space is intentional and remains usable for QR placement.

## Legacy Route Compatibility

Old share and edit URLs remain valid. The route parser maps legacy template IDs to canonical IDs:

| Legacy ID | Canonical ID |
|---|---|
| `centered` | `frame` |
| `glass` | `frame` |
| `editorial` | `headline` |
| `progress` | `spotlight` |
| `full-bleed` | `spotlight` |
| `clean-poster` | `bulletin` |
| `poster` | `caption` |

The parser returns only canonical `StoryTemplateId` values. New route updates write canonical IDs, so a legacy URL is normalized the next time template state changes. Unknown values continue to fall back to `frame`.

## Architecture

### Shared catalog

`shared/config/story-templates.ts` contains only the eight canonical picker options. It remains the source of truth for picker order, display names, descriptions, and swatches.

`shared/types/story-template.ts` defines canonical IDs only. A separate legacy-ID type or constant may live beside route parsing, because legacy IDs are accepted input rather than active application state.

### Route parsing

`shared/utils/story-route.ts` validates canonical IDs first, then resolves known legacy aliases. Home and Share continue using the same parser, preventing route behavior from drifting.

### Rendering

`StoryPreview.vue` maps the eight canonical IDs to eight components. The seven retired components are removed after their replacement components render successfully.

The current metadata, palette, QR overlay, transition, and export interfaces do not change.

### Picker behavior

Desktop renders eight swatches. Mobile carousel controls and position indicators derive their count from `STORY_TEMPLATES`, so they move from ten to eight without special-case values.

## Data Flow

```text
route template query
  -> parse canonical ID or legacy alias
  -> canonical StoryTemplateId
  -> picker and carousel state
  -> StoryPreview component lookup
  -> metadata and sampled palette render
  -> clean or QR export
```

Legacy values are accepted only at the route boundary and do not spread through component props or export logic.

## Error Handling

- Unknown template queries fall back to `frame`.
- Missing metadata keeps the existing placeholder content behavior.
- Palette sampling failures use the existing neutral fallback palette.
- Long titles wrap with `overflow-wrap: anywhere` and template-specific maximum regions.
- QR overlays remain inside safe margins and must not cover titles, thumbnails, or YouTube attribution.

## Testing

### Automated

- Every canonical template ID parses to itself.
- Every legacy ID maps to the specified canonical ID.
- Unknown and missing values fall back to `frame`.
- Picker and preview maps contain the same eight canonical IDs.
- Type checking passes.
- Cloudflare Pages production build passes.

### Browser and export

- Generate one short-title and one long-title video in all eight templates.
- Verify desktop picker and mobile carousel both expose eight templates.
- Open old Home and Share URLs for every legacy ID and confirm the expected replacement.
- Return from Share to Home and confirm the canonical template is restored.
- Export clean and QR variants of all eight templates at exactly `1080x1920`.
- Check all four QR positions against title, thumbnail, and branding safe areas.
- Confirm sampled accents match between preview and export.
- Verify light and dark app themes do not recolor exported story artwork.

## Documentation

- Add `docs/milestones/m9-plan.md` for implementation progress.
- Add M9 to the milestone index as Original Template Family.
- Update M5 and M7 notes to identify the eight-template canonical catalog.
- Record that the first seven reference-led components were retired in M9.

## Out of Scope

- Redesigning `Chromatic`, `Split`, or `Liquid`.
- User-editable fonts, colors, spacing, or arbitrary canvas positioning.
- Animation or video export.
- Saved projects or database persistence.
- Replacing YouTube attribution or the existing metadata pipeline.
- Making legal conclusions about third-party intellectual-property rights.

## Acceptance Criteria

- Story Tube exposes exactly eight canonical templates.
- The five new templates form one original, simple visual family.
- `Chromatic`, `Split`, and `Liquid` retain their current behavior.
- All seven legacy template IDs open a sensible replacement.
- Home, Share, QR, PNG export, mobile carousel, and route restoration continue working.
- Every exported story remains legible, overlap-free, and exactly `1080x1920`.
