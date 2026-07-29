# M4 - HD PNG Export

## Goal

Turn the selected 9:16 story preview into a downloadable, post-ready `1080x1920` PNG.

## Implemented Scope

- [x] Capture the active story template from the browser DOM.
- [x] Render at an exact `1080x1920` output size.
- [x] Preserve the selected template, title, channel, thumbnail, and source branding.
- [x] Download with a title-based filename.
- [x] Disable export until YouTube metadata has loaded.
- [x] Show rendering, success, and friendly failure states.
- [x] Open the image in a new tab when the browser does not support direct downloads.
- [x] Proxy YouTube thumbnails through the Nuxt server for reliable canvas export.

## Export Flow

```txt
Loaded story preview
  -> user selects a template
  -> Download 1080x1920 PNG
  -> wait for fonts and thumbnail
  -> render preview DOM to PNG
  -> trigger browser download
```

## Link Feature - Plan Only

A PNG cannot contain a clickable hyperlink. The exported artwork can show a URL or QR code, but story platforms will still treat it as pixels.

The next link-sharing increment should:

- Enable the existing `Copy link` button beside the download button.
- Copy `metadata.canonicalUrl`, not the originally pasted URL with tracking parameters.
- Show a short copied/error confirmation.
- Add Web Share API support on compatible phones so the PNG and canonical URL can be shared together.
- Consider an optional QR code inside templates only after the basic copy/share flow is polished.
- Keep visible URLs and QR codes opt-in so they do not clutter every design.

## Validation

- [ ] Export each of the seven templates with a real public YouTube video.
- [ ] Confirm every output is exactly `1080x1920`.
- [ ] Confirm remote thumbnails appear in the PNG.
- [ ] Confirm long titles wrap as expected.
- [ ] Check direct download in desktop Chrome, Safari, and a phone browser.
- [ ] Check fallback behavior where the `download` attribute is unavailable.

## Done When

- A loaded story can be downloaded as a valid `1080x1920` PNG.
- The exported image visually matches the selected preview.
- Failures are explained without breaking the workspace.
