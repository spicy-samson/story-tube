# Chromatic Gallery Design

## Goal

Replace Chromatic's playful tilted-poster treatment with a mature Gallery composition that still responds visibly to each thumbnail's colors.

## Approved Direction

Chromatic uses the **Gallery + soft-focus color wash** direction selected in the visual companion.

- The thumbnail is repeated as a full-canvas background image.
- The background copy is enlarged, softly blurred, and partially transparent.
- A dark palette-aware veil keeps text and branding readable.
- The same thumbnail remains crisp inside a straight, lightly framed 16:9 artwork area.
- Thin rules, compact metadata, and one sampled accent create the editorial hierarchy.
- No rotations, oversized geometric decoration, chunky offset shadows, or negative letter spacing remain.

## Layout

1. A compact header shows `Chromatic study` and its catalog index.
2. The framed thumbnail occupies the upper-middle portion of the safe area.
3. Channel, wrapped title, and a short sampled-accent line sit below the artwork.
4. YouTube attribution stays in the bottom safe area.

The main composition remains centered enough to leave all four QR sticker positions usable.

## Rendering

`ChromaticStoryCard.vue` continues receiving the existing metadata and sampled `StoryPalette`; no interfaces change.

The background image uses the same proxied `metadata.thumbnailUrl` as the crisp artwork. Its blur, scale, opacity, and veil are fixed CSS values so the browser preview and `html-to-image` export produce the same frame. Missing metadata keeps the existing placeholder behavior and falls back to the sampled neutral palette.

## Typography

- Native sans-serif stack.
- Compact uppercase metadata with zero negative letter spacing.
- Wrapped title with `break-words` and `overflow-wrap: anywhere`.
- No title line clamp, so text wraps instead of truncating.
- Font sizing remains bounded for the fixed 9:16 canvas.

## Testing

- Source contract confirms the full-canvas soft-focus background image and dark veil.
- Source contract confirms rotations and decorative geometry are removed.
- Source contract confirms title wrapping and the straight framed thumbnail.
- Existing six-template catalog, route compatibility, palette, sharing, and export tests remain green.
- Nuxt typecheck and Cloudflare Pages build pass.
- Manual preview checks cover a dark thumbnail, a bright thumbnail, and a long title.

## Out of Scope

- User-adjustable blur or background opacity.
- A separate Chromatic crop control.
- Changes to Frame, Headline, Spotlight, Split, or Liquid.
- Changes to metadata, palette sampling, QR, routing, or export interfaces.
