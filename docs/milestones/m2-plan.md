# M2 Plan - Metadata Pipeline

## Summary

Build the metadata pipeline around one backend endpoint:

```txt
GET /api/youtube/metadata?url=<youtube-url>
```

The frontend will call this endpoint after the user submits a link. The server will parse and validate the URL, fetch metadata, normalize the response, and return a stable shape for the app UI.

## Key Changes

- Add a shared URL parsing utility.
- Support `youtube.com/watch?v=...`, `youtu.be/...`, and `youtube.com/shorts/...`.
- Support common extra params like `?si=`, `&t=`, and `&list=`.
- Reject non-YouTube URLs and malformed video IDs.
- Add Nuxt backend endpoint at `server/api/youtube/metadata.get.ts`.
- Use YouTube oEmbed first because it does not require an API key.
- Add optional YouTube Data API support when `YOUTUBE_API_KEY` exists.
- Enable the M1 URL input and Generate button.
- Show loading, invalid URL, and failed fetch states.
- Populate the preview with returned title, channel, thumbnail, and canonical URL.
- Keep template/export functionality scoped to later milestones.

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

| Status | Case |
|---|---|
| `400` | Missing URL |
| `400` | Invalid YouTube URL |
| `404` | Private, deleted, unavailable, or unembeddable video |
| `502` | Metadata provider failure |

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

M2 must work without a YouTube API key. The key only improves metadata later.

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

- Normal watch URL.
- Short `youtu.be` URL.
- Shorts URL.
- URL with timestamp/tracking params.
- Invalid domain.
- Missing or malformed video ID.

Endpoint checks:

- Missing `url` returns `400`.
- Invalid URL returns `400`.
- Valid public video returns normalized metadata.
- Unavailable provider returns a clean error response.

App smoke test:

- Run `npm run build`.
- Run the dev server.
- Paste a valid YouTube URL.
- Confirm title, channel, thumbnail, and canonical URL populate the preview.
- Confirm invalid URL shows a friendly error.
- Confirm existing PWA shell still works.

## Assumptions

- M2 uses Nuxt server routes as the backend.
- M2 does not add a standalone Worker yet.
- M2 does not add persistence, auth, payments, templates, or PNG export.
- `duration` is optional because oEmbed does not provide it.
- The app must work locally and in Cloudflare Pages without a YouTube API key.
