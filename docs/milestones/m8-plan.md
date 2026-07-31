# M8 Plan - Cloud Deployment and Production Hardening

## Summary

Deploy Story Tube to Cloudflare Pages and prepare the metadata pipeline for a
small public launch.

The first release should stay simple:

- Keep the Nuxt application and Nitro server routes together on Cloudflare
  Pages.
- Cache successful YouTube metadata responses at the edge.
- Keep PNG rendering in the browser.
- Add basic request protection and production checks.
- Introduce Cloudflare KV only if real traffic shows that edge-local caching is
  not enough.

This is enough for the App Builders Philippines showcase without adding a
database, authentication, or a separate Worker.

## Deployment Target

Cloudflare Pages remains the production target.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Nuxt preset | `cloudflare_pages` |
| Wrangler project | `story-tube` |
| Node.js | `22` or newer |

The existing Nuxt server routes are compiled into the Pages Function output.
The metadata pipeline therefore remains part of the same deployment rather
than becoming a separate API service.

## Caching Plan

### First Release

Add edge caching to `/api/youtube/metadata` using the normalized YouTube video
ID as the cache key.

- Cache only successful normalized metadata responses.
- Never use the originally pasted URL as the cache key.
- Ignore tracking parameters such as `si`, `t`, and `list`.
- Suggested browser TTL: 5 minutes.
- Suggested shared edge TTL: 24 hours.
- Do not cache `400` responses.
- Cache unavailable-video responses for no more than 10 minutes if negative
  caching is added.
- Preserve the existing direct oEmbed request as the fallback after a cache
  miss.

The thumbnail proxy can retain its longer cache policy because YouTube
thumbnail files change less often than metadata.

### Later, Only If Needed

Add an optional `YOUTUBE_METADATA_CACHE` KV binding when metrics show frequent
cache misses across regions or repeated upstream failures.

KV is not required for the first public version. It adds configuration,
eventual-consistency behavior, and another storage dependency. The metadata
route must continue to work when the binding is absent.

## Request and Failure Handling

The metadata endpoint must continue to return a small, predictable contract:

- `400` for missing or invalid YouTube URLs.
- `404` for unavailable or unknown videos.
- `502` when YouTube oEmbed or the network fails.
- `429` with a friendly message if application-level rate limiting is added.

Only the server route may call YouTube oEmbed. This keeps provider behavior in
one place and prevents every browser from calling YouTube independently.

## Risks and Mitigations

### YouTube oEmbed throttling or downtime

Repeated requests may fail, become slow, or be rejected by YouTube.

Mitigation:

- Cache successful responses by video ID.
- Keep a short timeout around the upstream request.
- Return a friendly retryable error instead of leaking provider details.
- Never retry repeatedly inside a single request.

### Random video-ID request spam

An attacker can generate many valid-looking IDs and force cache misses.

Mitigation:

- Keep strict video-ID and domain validation.
- Add a Cloudflare rate-limiting rule for `/api/youtube/metadata` if the
  account plan supports it.
- Use a short negative cache for unavailable videos.
- Add Turnstile only if abuse appears; it is not part of the first release.

### Cloudflare Function usage

Static assets are served by Pages, but API requests execute the generated
Function and make upstream subrequests.

Mitigation:

- Keep API responses small.
- Cache repeat metadata and thumbnail requests.
- Monitor Function logs and request metrics after launch.
- Avoid server-side image generation in this milestone.

### Browser-specific sharing and export behavior

Clipboard, Web Share, image download, and client-side rendering vary across
browsers.

Mitigation:

- Test the deployed HTTPS site on iPhone Safari and Android Chrome.
- Preserve the selectable URL and PNG download fallbacks.
- Confirm native-share cancellation remains a neutral state.
- Confirm every exported image is exactly `1080x1920`.

### Direct dynamic route requests

Users may open or refresh `/share/:videoId` directly.

Mitigation:

- Verify direct share-route requests in the Pages preview and production
  deployment.
- Confirm invalid video IDs show the friendly Start Over state.
- Confirm template, variant, and QR query values restore after refresh.

## Security Checklist

- [x] No API keys or secrets are exposed through `runtimeConfig.public`.
- [x] `.env` remains ignored and `.env.example` contains placeholders only.
- [x] Metadata input is parsed with the shared YouTube URL validator.
- [x] Thumbnail input accepts only a valid 11-character video ID.
- [x] Upstream provider errors do not expose internal stack traces.
- [x] Metadata responses include intentional cache headers.
- [ ] A rate-limiting rule is evaluated for the metadata path.
- [ ] Cloudflare logs are checked after the public showcase.

## Deployment Checklist

### Before Cloudflare

- [ ] Run `npm install`.
- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run the built app with Wrangler Pages preview.
- [ ] Test `/` and a direct `/share/:videoId` route.
- [ ] Test valid, invalid, and unavailable YouTube URLs.

### Cloudflare Pages Setup

- [x] Create the `story-tube` Cloudflare Pages Direct Upload project.
- [x] Select `main` as the production branch.
- [x] Build with `npm run build` and deploy the `dist` directory.
- [x] Confirm the `m8-deployment` Pages preview deployment.
- [x] Confirm no Cloudflare bindings are required for this release.
- [ ] Add a custom domain only after the `pages.dev` deployment passes QA.

### Production Smoke Test

- [ ] Generate metadata from a normal watch URL.
- [ ] Generate metadata from a `youtu.be` URL.
- [ ] Generate metadata from a Shorts URL.
- [ ] Select and preview every story template.
- [ ] Refresh the share route and confirm state restoration.
- [ ] Download clean and QR PNG variants.
- [ ] Scan the QR code and confirm the canonical YouTube destination.
- [ ] Copy the canonical URL into Instagram's Link Sticker.
- [ ] Test the native share sheet on a physical phone.
- [ ] Review Pages Function logs for provider failures.
- [ ] Enable Cloudflare Web Analytics and confirm visits appear.

## Observability

For the first release, Cloudflare's built-in request metrics and Function logs
are enough.

### How to See How Many People Use the Site

Use two Cloudflare dashboards because they answer different questions:

1. **Web Analytics** shows people-facing traffic: unique visits, page views,
   popular paths, referrers, countries, devices, and Core Web Vitals.
2. **Functions Metrics and Pages Functions logs** show backend usage: Function
   requests, errors, execution status, metadata cache outcomes, and oEmbed
   failures. Pages logs are streamed in real time and are not persisted.

After the Pages project is deployed:

1. Open **Cloudflare Dashboard > Workers & Pages > Story Tube > Metrics**.
2. Select **Enable** under Web Analytics.
3. Redeploy the Pages project so Cloudflare can inject its analytics beacon.
4. Open **Cloudflare Dashboard > Web Analytics** and select Story Tube to see
   visits and page views.
5. Open **Workers & Pages > Story Tube > Functions Metrics** to see API request
   volume and runtime errors.
6. Open the deployment's **View details > Functions** log stream, or run
   `npx wrangler pages deployment tail --project-name story-tube`, and watch
   structured entries where `event = youtube_metadata` while testing.

Cloudflare Pages performs the Web Analytics integration automatically, so the
app does not contain an analytics token or third-party tracking SDK. This also
keeps the first release free of application-owned visitor profiles.

### Metadata Cache Signals

Successful metadata responses include:

```txt
Cache-Control: public, max-age=300, s-maxage=86400
X-Story-Tube-Cache: HIT | MISS | BYPASS
```

- `HIT`: metadata came from the local Cloudflare data-center cache.
- `MISS`: Cloudflare had no entry, so the route called YouTube and stored the
  successful result.
- `BYPASS`: the Cache API was unavailable or failed; the route still called
  YouTube normally.

Structured logs use `event: youtube_metadata` and outcomes such as
`cache_hit`, `cache_miss`, `provider_success`, and `provider_failed`. They do
not include pasted URLs, titles, channel names, or IP addresses.

Watch:

- Metadata endpoint request volume.
- Cache hits and repeated upstream oEmbed calls.
- `404`, `429`, and `502` rates.
- Slow upstream requests.
- Thumbnail proxy failures.

Cloudflare's Cache API is data-center-local, so the same video can produce one
miss in Manila and another miss in another region. That is expected. KV remains
unnecessary unless production metrics show that cross-region misses are a real
problem.

Do not add a third-party analytics or error-monitoring service until the first
public usage shows a concrete need.

## Done When

- The production Pages URL loads the creation workspace.
- Direct share routes survive refresh.
- Valid YouTube links produce metadata without exposing provider details.
- Repeat requests avoid unnecessary oEmbed calls.
- Clean and QR stories export correctly on desktop and mobile.
- The Instagram Link Sticker workflow succeeds on a physical phone.
- Cloudflare logs show no repeated unhandled errors during the showcase.

## Assumptions

- The first audience is a small public showcase group.
- Cloudflare Pages remains the deployment platform.
- YouTube oEmbed remains the metadata source.
- No `YOUTUBE_API_KEY` is required.
- No database, authentication, user accounts, or server-side PNG rendering is
  added.
- Edge caching is implemented before the public showcase.
- KV, Turnstile, and advanced rate limiting remain optional follow-up work.

## References

- [Cloudflare Pages Nuxt guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/)
- [Cloudflare Workers Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare rate-limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Enable Web Analytics for Pages](https://developers.cloudflare.com/pages/how-to/web-analytics/)
- [Cloudflare Pages Functions metrics](https://developers.cloudflare.com/pages/functions/metrics/)
