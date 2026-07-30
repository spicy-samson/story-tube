# PR: M6 Story Link Sharing

## Merge

From: `m6-story-linking`

Into: `main`

## Summary

This PR completes M6 by turning the story export flow into a routed, refreshable sharing workspace.

The main user-facing change is that after a creator generates a YouTube story, `Share Story` now opens a dedicated `/share/:videoId` route where they can copy the canonical YouTube URL, choose a clean or QR version, share the PNG through the native share sheet when supported, or download the PNG as a fallback.

## What Changed

- Reduced `app.vue` to the Nuxt app shell with `<NuxtPage />`.
- Moved the creation workspace into `pages/index.vue`.
- Added a full sharing/export workspace at `pages/share/[videoId].vue`.
- Added route-restored share settings:
  - selected template
  - clean or QR variant
  - QR corner position
- Added shared route parsing and validation helpers in `shared/utils/story-route.ts`.
- Added shared template catalog data in `shared/config/story-templates.ts`.
- Added `StoryShareWorkspace` for the creator-facing share page.
- Added `StoryQrSticker` and browser-side QR generation through the `qrcode` package.
- Updated `StoryPreview` so clean and QR variants render through the same preview/export surface.
- Refactored `useStoryExport` so PNG rendering returns reusable assets for download or native sharing.
- Added reusable YouTube metadata loading through `useYoutubeMetadata`.
- Preserved canonical YouTube URL usage for Instagram Link Sticker handoff.
- Updated M4, M5, M6, milestone index, and proposal docs.

## Milestone Coverage

### M6 - Story Link Sharing

- Creation workspace lives at `/`.
- Sharing workspace lives at `/share/:videoId`.
- Share route can be refreshed or opened directly.
- Invalid video IDs show a friendly recovery state.
- Invalid optional query values fall back to defaults.
- Back to Edit Story restores the video and selected template on `/`.
- Clean Story and QR Story variants are both available.
- QR code is generated client-side with no new backend route.
- QR sticker supports four safe corner positions.
- Canonical YouTube URL can be copied for Instagram's Link Sticker.
- Native file sharing is used where supported.
- PNG download remains available as the fallback.

## Public Route Contract

```txt
/

/share/:videoId?template=<template>&variant=<clean|qr>&qr=<position>
```

Example:

```txt
/share/HiEz8agZmnM?template=split&variant=clean&qr=bottom-left
```

The `/share/:videoId` route is a creator preparation/export page. It is not the viewer-facing story link. Instagram viewers should still receive the canonical YouTube URL through Instagram's Link Sticker.

## Non-Goals

- No Instagram auto-publishing is included.
- No clickable link is embedded in the PNG, because the PNG is only an image.
- No redirect endpoint, analytics, URL shortener, database, auth, saved projects, or additional Cloudflare Worker is added.
- Deployed phone-specific sharing QA remains part of M7.

## Testing

Completed locally:

- `npm run typecheck`
- `npm run build`
- Direct `/` route smoke test
- Direct valid `/share/:videoId` route smoke test
- Invalid video ID smoke test
- Invalid share query fallback smoke test
- Back to Edit Story restoration check
- Verified template swatches render with direct background values

Still planned for M7:

- Deployed HTTPS clipboard fallback test
- Native iOS and Android share-sheet checks
- Physical QR scanning across all four positions
- Full mobile viewport QA across all templates

## Notes For Review

- `metadata.canonicalUrl` is always used for copy/share handoff instead of the originally pasted URL, so tracking parameters are not carried forward.
- The share route stores output settings in the URL rather than local storage or a global store.
- QR remains a secondary fallback. The preferred Instagram workflow is still exporting the image, then adding Instagram's Link Sticker with the copied YouTube URL.
- The export pipeline waits for preview readiness so thumbnail-derived palette colors match the downloaded PNG.
- A minimal `tailwind.config.ts` is kept because Nuxt/Tailwind generated files expect the config path during dev.

## Suggested PR Title

```txt
Implement M6 story link sharing
```

## Suggested PR Description

```md
## Summary

- split the app into creation and share/export routes
- add clean and QR story variants with canonical YouTube link handoff
- support native PNG sharing with download fallback and refresh-restored settings

## Testing

- npm run typecheck
- npm run build
- local route/share/export smoke tests
```
