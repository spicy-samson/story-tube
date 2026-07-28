# Product

## Product Thesis

People already share YouTube videos socially. The missing piece is a beautiful story-native visual format.

The app should make a YouTube link look intentional, polished, and postable in under a minute.

## Positioning

```txt
Paste a YouTube link. Get a beautiful story card.
```

## Naming Notes

Avoid using `YouTube`, `YT`, or close variants in the final product name. The repo can keep its working name for now, but the shipped brand should be independent.

Candidate names:

| Name | Notes |
|---|---|
| StoryClip | Clear, but may imply video clipping |
| WatchCard | Strong fit for video sharing |
| ShareFrame | Broad and brandable |
| VidCard | Direct and short |
| LinkFrame | Useful if product expands beyond YouTube |
| ClipPoster | Good for creator/promo angle |

Current favorite: `WatchCard` or `ShareFrame`.

## MVP Requirements

Must have:

- User can paste a YouTube link.
- App extracts the video ID.
- App fetches title, channel, thumbnail, and original link.
- User can pick from three templates.
- User can export a 1080x1920 PNG.
- User can download the image.
- UI is mobile-first and PWA-installable.

Should have:

- Copy original video link.
- Subtle YouTube source attribution.
- Optional QR code or watch badge.
- Web Share API support where available.

Could have:

- Accent color customization.
- Creator handle field.
- Light/dark variants.
- Watermark toggle for later Pro planning.

## First Templates

| Template | Feel | Use Case |
|---|---|---|
| Minimal / Centered Media Card | Blurred dark background, centered rounded media card, clean title panel | General v1 default |
| Full-Bleed Editorial | Big dimmed thumbnail background, uppercase title, strong YouTube footer | Music, boxing, film, podcasts |
| Blue Poster | Solid editorial color, serif title, framed thumbnail | Music, commentary, curated recommendations |
| Clean Text Poster | Light background, bold text, metadata list | Tutorials, lectures, sermons, study videos |
| Progress Card | Full-bleed image, title lower third, progress bar | Music/video share vibe |
| Image-Forward Full Bleed | Full thumbnail background, top title, bottom attribution | Strong artwork and visual-first videos |
| Floating Glass Card | Blurred background with translucent card overlay | General creator-friendly shares |

## User Flow

```txt
Landing workspace
  -> paste link
  -> metadata preview loads
  -> choose template
  -> preview story card
  -> export PNG
  -> download
  -> post manually to story platform
```

## Monetization Later

Do not monetize v1. Prove the workflow first.

Possible later model:

| Plan | Features |
|---|---|
| Free | Basic templates, watermark, PNG export |
| Pro | No watermark, premium templates, brand kit, animated MP4, batch exports |

## Differentiation

StoryCard already existing proves demand. This project can compete by being:

- Faster.
- Simpler.
- Free or freemium.
- More tasteful for niche communities.
- PWA-first with no app store friction.
- Focused on "make this link beautiful" instead of becoming a content platform.
