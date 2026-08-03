# WatchPoster MVP Launch Design

**Status:** Approved for planning

## Goal

Ship the existing YouTube story generator as a clear, public portfolio MVP under
the working product name **WatchPoster**.

The product promise is:

> Turn a video link into a story worth sharing.

The release remains a single-purpose tool. It does not add accounts, saved
projects, payments, a database, or automatic Instagram publishing.

## Brand Direction

WatchPoster is clear and utilitarian: the input is a video link and the output
is a share-ready visual poster.

Update public-facing branding in:

- Page titles and social metadata.
- Visible application labels.
- PWA manifest names.
- App icons and social preview artwork.
- User-facing documentation.

Keep internal deployment identifiers unchanged where renaming would create
unnecessary risk. In particular, the existing Cloudflare Pages project and
Wrangler project may remain `story-tube`.

The name is a working launch name. A preliminary web search found no obvious
exact product collision, but this is not trademark clearance.

## Homepage

Do not add a separate marketing route. `/` remains the usable creation
workspace so visitors can paste a link immediately.

Refine the existing page rather than replacing it:

1. Compact header with the WatchPoster wordmark and existing theme toggle.
2. Headline: `Turn a video link into a story worth sharing.`
3. YouTube URL input and Generate action in the first viewport.
4. Existing live story preview beside the input on desktop and directly below
   it on mobile.
5. Existing template carousel after metadata loads.
6. A restrained examples strip below the workspace using three real template
   previews.
7. Small footer with the repository link, a privacy statement, and a YouTube
   affiliation disclaimer.

The examples strip is supporting proof, not a second template picker. It must
not delay or obscure the primary paste-and-generate workflow.

## Existing Product Flow

The core flow remains unchanged:

```text
Paste YouTube URL
  -> load normalized metadata through the Nuxt server route
  -> choose a template
  -> open the routed share workspace
  -> export or share a 1080x1920 clean or QR PNG
```

No new backend service is introduced. Nuxt/Nitro server routes continue to run
inside the Cloudflare Pages Function output.

## Cloudflare Launch Readiness

The production deployment keeps the existing settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output | `dist` |
| Deployment platform | Cloudflare Pages |

Before announcing the MVP:

- Confirm the production homepage loads over HTTPS.
- Confirm a direct `/share/:videoId` URL survives refresh.
- Generate metadata from watch, short-link, and Shorts URLs.
- Confirm repeated metadata requests produce an edge-cache hit.
- Verify thumbnail rendering and all six templates in production.
- Verify clean and QR exports are exactly 1080x1920.
- Verify download, clipboard fallback, and native sharing on a physical iPhone.
- Enable Cloudflare Web Analytics and confirm a real visit appears.
- Inspect Pages Functions metrics and logs for runtime errors.

Do not add KV, Turnstile, or application-level rate limiting for the initial
showcase. The existing normalized edge cache, request validation, and upstream
timeout are sufficient for the expected small launch. Evaluate Cloudflare's
single free rate-limiting rule only if production traffic shows repeated cache
miss abuse.

## Metadata and Social Sharing

Public metadata must use WatchPoster consistently and include:

- Descriptive page title and description.
- Open Graph title, description, and image.
- Twitter/X large-image card metadata.
- Canonical production URL when a stable custom domain is available.

The social preview image should show the real product output rather than a
generic logo-only graphic.

## Privacy and Trust

The footer should state the product behavior plainly:

- No account required.
- No uploaded video is stored.
- The pasted YouTube URL is used only to retrieve public metadata.
- WatchPoster is not affiliated with or endorsed by YouTube.

Cloudflare Web Analytics is the only launch analytics requirement. Do not add a
third-party analytics SDK or cookie banner unless later data collection makes
one necessary.

## Error Handling

Preserve the current friendly states for invalid URLs, unavailable videos,
provider failures, clipboard denial, unsupported native sharing, and invalid
share routes.

Production errors must not expose stack traces, provider response bodies, API
credentials, or internal deployment details.

## Acceptance Criteria

- Public UI, install metadata, and share metadata say WatchPoster.
- The homepage remains an immediately usable workspace.
- The core creation flow works on desktop and a physical iPhone.
- Direct share routes refresh correctly on Cloudflare Pages.
- Clean and QR PNG exports remain 1080x1920.
- Cloudflare Web Analytics records visits.
- Pages Functions metrics show metadata traffic without recurring unhandled
  errors.
- No database, account system, payment flow, or separate Worker is added.

