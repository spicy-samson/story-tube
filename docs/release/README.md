# Public Release

Posterize stays tool-first: paste, pick, and share. No separate landing page is
needed for the MVP.

## In The App

- Duplicate Generate clicks are blocked while a metadata request is running.
- Successful metadata and thumbnail responses are cached.
- YouTube hosts and video IDs are validated before upstream requests.
- YouTube requests time out after five seconds.
- App responses include basic browser security headers.

## Cloudflare Dashboard

After attaching the production domain, create one rate-limiting rule:

```txt
Path starts with: /api/youtube/
Limit: 10 requests per 10 seconds per IP
Action: Managed Challenge
```

Turnstile, accounts, storage, and a separate marketing site are deferred until
real usage proves they are needed.

## Launch Copy

**Headline:** Make YouTube links worth sharing.

**Hook:** Say goodbye to boring YouTube shares.

**Description:** Posterize turns any public YouTube video into a polished,
Instagram-ready story without an account or video upload.
