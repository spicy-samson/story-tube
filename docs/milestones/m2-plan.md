# M2 Plan - Metadata Pipeline

## Summary

Build the metadata pipeline around one backend endpoint:

```txt
GET /api/youtube/metadata?url=<youtube-url>
```

The frontend will call this endpoint after the user submits a link. The server will parse and validate the URL, fetch metadata, normalize the response, and return a stable shape for the app UI.

## Implementation Status

Status: implemented.

The backend lives in Nuxt's `server/` directory and is bundled into the Cloudflare Pages worker output by Nitro. M2 does not use a separate standalone Cloudflare Worker.

Implemented endpoint:

```txt
GET /api/youtube/metadata?url=<youtube-url>
```

Implemented shared files:

```txt
shared/utils/youtube-url.ts
shared/types/youtube-metadata.ts
```

## Key Changes

- [x] Add a shared URL parsing utility.
- [x] Support `youtube.com/watch?v=...`, `youtu.be/...`, and `youtube.com/shorts/...`.
- [x] Support common extra params like `?si=`, `&t=`, and `&list=`.
- [x] Reject non-YouTube URLs and malformed video IDs.
- [x] Add Nuxt backend endpoint at `server/api/youtube/metadata.get.ts`.
- [x] Use YouTube oEmbed first because it does not require an API key.
- [ ] Add optional YouTube Data API support when `YOUTUBE_API_KEY` exists.
- [x] Enable the M1 URL input and Generate button.
- [x] Show loading, invalid URL, and failed fetch states.
- [x] Populate the preview with returned title, channel, thumbnail, and canonical URL.
- [x] Keep template/export functionality scoped to later milestones.

## API Contract

Request:

```txt
GET /api/youtube/metadata?url=https://youtu.be/example
```

Successful response:

```ts
{
  videoId: string
  canonicalUrl: string
  title: string
  channelName: string
  thumbnailUrl: string
  provider: "youtube"
  source: "oembed" | "youtube-data-api"
  duration?: string
}
```

Error responses:

| Status | Case                                                 |
| ------ | ---------------------------------------------------- |
| `400`  | Missing URL                                          |
| `400`  | Invalid YouTube URL                                  |
| `404`  | Private, deleted, unavailable, or unembeddable video |
| `502`  | Metadata provider failure                            |

## Metadata Strategy

Default path:

```txt
YouTube URL
  -> parse video ID
  -> request YouTube oEmbed
  -> normalize title, channel, thumbnail
  -> return metadata
```

Optional richer path:

```txt
YOUTUBE_API_KEY exists
  -> request YouTube Data API videos.list
  -> use part=snippet,contentDetails
  -> include duration when available
```

M2 works without a YouTube API key. The key only improves metadata later and is not wired yet.

## Frontend Behavior

- User pastes a YouTube link.
- User taps Generate.
- App disables Generate while loading.
- App calls `/api/youtube/metadata`.
- Valid response fills the existing preview.
- Invalid URL shows a friendly inline error.
- Provider failure shows a friendly retryable error.
- Template picker and PNG export can remain disabled until M3/M4.

## Environment

Add `.env.example`:

```sh
YOUTUBE_API_KEY=
```

Cloudflare Pages secret name:

```txt
YOUTUBE_API_KEY
```

Cloudflare Pages settings remain:

```txt
Build command: npm run build
Build output directory: dist
```

## Test Plan

Parser tests:

- [x] Normal watch URL.
- [x] Short `youtu.be` URL.
- [x] Shorts URL.
- [x] URL with timestamp/tracking params.
- [x] Invalid domain.
- [x] Missing or malformed video ID.

Endpoint checks:

- [x] Missing `url` returns `400`.
- [x] Invalid URL returns `400`.
- [x] Valid public video returns normalized metadata.
- [x] Unavailable provider returns a clean error response.

App smoke test:

- [x] Run `npm run build`.
- [x] Run the dev server.
- [x] Paste a valid YouTube URL.
- [x] Confirm title, channel, thumbnail, and canonical URL populate the preview.
- [x] Confirm invalid URL shows a friendly error.
- [x] Confirm existing PWA shell still works.

## Known Limitations

- `duration` is absent until YouTube Data API support is wired.
- Template selection and PNG export remain disabled until M3/M4.
- The current implementation uses oEmbed metadata only.

## Assumptions

- M2 uses Nuxt server routes as the backend.
- M2 does not add a standalone Worker yet.
- M2 does not add persistence, auth, payments, templates, or PNG export.
- `duration` is optional because oEmbed does not provide it.
- The app must work locally and in Cloudflare Pages without a YouTube API key.
