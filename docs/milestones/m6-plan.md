# M6 Plan - Story Link Sharing

## Goal

Turn the exported story into a practical Instagram handoff: prepare a post-ready image, keep the canonical YouTube URL ready to paste, and provide a QR fallback without requiring another backend service.

Status: implemented; deployed mobile sharing QA remains part of M7.

## Platform Boundary

A PNG contains pixels, not a clickable hyperlink. The viewer-facing click target must be added inside Instagram with its Link Sticker.

M6 prepares both parts of that workflow:

```txt
Loaded story
  -> Share Story
  -> canonical YouTube URL copied
  -> choose Clean Story or QR Story
  -> share PNG or download fallback
  -> add image in Instagram
  -> paste URL into Instagram Link Sticker
```

The native share sheet is progressive enhancement. Available targets depend on the device and browser, and the app does not attempt to publish directly to Instagram.

## Implemented Scope

- [x] Replace the workspace download action with a guided Share Story flow.
- [x] Add a responsive Ready to Share modal.
- [x] Keep dedicated Clean Story and QR Story outputs.
- [x] Copy `metadata.canonicalUrl`, excluding pasted tracking parameters.
- [x] Show a selectable URL when clipboard access is blocked.
- [x] Generate the QR code entirely in the browser.
- [x] Support top-left, top-right, bottom-left, and bottom-right QR placement.
- [x] Keep QR stickers inside story-safe top and bottom margins.
- [x] Render both variants through the existing `1080x1920` PNG pipeline.
- [x] Preserve distinct clean and QR filenames.
- [x] Share PNG files through the Web Share API where supported.
- [x] Download the PNG when native file sharing is unavailable.
- [x] Treat share-sheet cancellation as a neutral state.
- [x] Keep the implementation free of persistence, redirects, analytics, and new server routes.

## Export Contracts

```ts
type StoryShareVariant = 'clean' | 'qr'

type QrPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

interface StoryExportAsset {
  blob: Blob
  file: File
  filename: string
  height: 1920
  variant: StoryShareVariant
  width: 1080
}
```

The export composable owns three separate operations:

- `renderPng()` creates the reusable HD asset.
- `downloadAsset()` saves an already-rendered asset.
- `shareAsset()` sends the same file to the native share sheet.

Pre-rendering happens inside the modal so the later Share Image click can invoke `navigator.share()` directly from a fresh user action.

## File Naming

```txt
<video-title>-1080x1920.png
<video-title>-qr-1080x1920.png
```

## Validation

- [x] Project typecheck passes.
- [x] Cloudflare Pages production build passes.
- [ ] Confirm clean and QR files are exactly `1080x1920` in desktop browsers.
- [ ] Scan all four QR positions with a physical device.
- [ ] Confirm every QR resolves to the canonical YouTube URL.
- [ ] Check QR overlap across all ten templates.
- [ ] Check clipboard-denied fallback on a deployed HTTPS build.
- [ ] Check native PNG sharing on iOS Safari and Android Chrome.
- [ ] Confirm canceled native sharing remains non-error UI.

## Done When

- A user can create either a clean or QR story from the same loaded video.
- The canonical YouTube URL is ready for Instagram's Link Sticker.
- Supported phones can open their native share sheet with the PNG attached.
- Unsupported browsers retain a clear download path.

## Assumptions

- Instagram Link Sticker placement remains a manual Instagram step.
- QR is a secondary fallback for viewers with another device or a saved image.
- M6 does not add a URL shortener, redirect tracker, auth, persistence, or another Cloudflare Worker.
- Full phone and PWA verification belongs to M7.

## References

- [Instagram Link Sticker help](https://www.facebook.com/help/instagram/192168966243613)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
