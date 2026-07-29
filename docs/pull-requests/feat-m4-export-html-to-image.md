# PR: M4 HD PNG Export

## Merge

From: `feat/m4/export-html-to-image`

Into: `main`

## Summary

This PR completes M4 by turning the selected 9:16 story template into a downloadable `1080x1920` PNG.

The main user-facing change is that once YouTube metadata has loaded, a user can choose any existing story template and download a story-ready image directly from the workspace. The export uses the rendered browser preview as the visual source, waits for fonts and thumbnails, and downloads the result with a title-based filename.

## What Changed

- Added `html-to-image` for browser-side PNG rendering.
- Added `useStoryExport` to manage export state, image/font readiness, PNG generation, download fallback behavior, and filename creation.
- Exposed the story preview export element from `components/story/StoryPreview.vue`.
- Wired the `Download 1080x1920 PNG` action in `app.vue`.
- Disabled export until metadata is loaded.
- Added rendering, success, and friendly failure messages.
- Kept `Copy link` disabled and documented as a follow-up.
- Added a Nuxt server thumbnail proxy at `/api/youtube/thumbnail`.
- Rewrote preview thumbnail URLs to same-origin proxied URLs before export.
- Updated M4 milestone docs and milestone status tracking.

## Milestone Coverage

### M4 - PNG Export

- Active story template can be captured.
- Exported image includes title, channel, thumbnail, and YouTube branding.
- Export downloads as a PNG with a title-based filename.
- Export uses same-origin thumbnail images to avoid canvas/CORS issues.
- Workspace prevents export while metadata is missing or while another export is rendering.
- Browser download fallback opens the PNG in a new tab where direct downloads are unavailable.

## Non-Goals

- No clickable links are embedded in the PNG, because PNG files cannot carry clickable story links.
- `Copy link`, Web Share API support, visible URLs, and QR codes remain planned follow-ups.
- No auth, persistence, payments, saved projects, or template customization controls are included.
- No separate Cloudflare Worker is added; the thumbnail proxy uses a Nuxt/Nitro server route.

## Testing

Completed locally:

- `npm run typecheck`
- `npm run build`
- Confirmed Cloudflare Pages build includes the Nuxt/Nitro server routes.
- Tested the metadata endpoint with a valid public YouTube URL.
- Tested the thumbnail proxy with a valid YouTube video ID.
- Tested the thumbnail proxy with an invalid ID and confirmed it returns a clean `400`.
- Performed local dev smoke testing for the export flow.

Test URL used:

```txt
https://youtu.be/dQw4w9WgXcQ
```

## Notes For Review

- The export is intentionally based on the live rendered template so M5 template changes automatically flow into downloads.
- The export captures the inner story card, not the outer preview phone frame, so downloaded PNGs do not include the black preview border.
- The current implementation renders the preview proportions at HD density for better visual fidelity.
- `npm install` reported existing audit findings. This PR does not run `npm audit fix` because that could introduce unrelated dependency churn.
- Node engine warnings may appear locally if using Node 20 with newer Nuxt dependencies, but the local typecheck and Cloudflare Pages build both pass.

## Suggested PR Title

```txt
Implement M4 HD PNG export
```

## Suggested PR Description

```md
## Summary

- add browser-side HD PNG export for the selected story template
- proxy YouTube thumbnails through Nuxt so canvas export works reliably
- update M4 milestone docs and keep link sharing scoped as a follow-up

## Testing

- npm run typecheck
- npm run build
- local export smoke test with a public YouTube URL
```
