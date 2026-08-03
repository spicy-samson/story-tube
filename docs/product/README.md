# Product

## Product Thesis

People already share YouTube videos socially. The missing piece is a beautiful story-native visual format.

The app should make a YouTube link look intentional, polished, and postable in under a minute.

## Positioning

```txt
Paste a YouTube link. Get a beautiful story card.
```

## Product Name

The public MVP name is **Posterize**.

The name is clear and utilitarian: a viewer-ready video link becomes a polished visual poster. Internal repository and Cloudflare identifiers may remain `story-tube` to avoid breaking the existing deployment.

Posterize is a working launch name and has not received formal trademark clearance.

## MVP Requirements

Must have:

- User can paste a YouTube link.
- App extracts the video ID.
- App fetches title, channel, thumbnail, and original link.
- User can pick from six original templates.
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

## Template Family

| Template | Feel | Use Case |
|---|---|---|
| Frame | Balanced media and type | General default |
| Headline | Type-first dark editorial | Long or important titles |
| Spotlight | Full-bleed image with crop control | Strong visual thumbnails |
| Chromatic | Thumbnail-derived gallery color | Music and visual releases |
| Split | Image and type composition | Editorial recommendations |
| Liquid | Soft glass color flow | Atmospheric artwork |

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
