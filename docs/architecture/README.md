# Architecture

## Direction

Build a mobile-first progressive web app first. Avoid native app complexity until the web workflow proves demand.

## Proposed System

```txt
Browser/PWA
  - URL input
  - Metadata preview
  - Template picker
  - Story renderer
  - PNG exporter

Optional API Worker
  - YouTube Data API calls
  - API key protection
  - Metadata caching
  - oEmbed fallback normalization
```

## V1 Data Flow

```txt
User pastes link
  -> parse video ID
  -> fetch metadata
  -> normalize metadata
  -> render selected template
  -> export 1080x1920 PNG
  -> download/share
```

## Stack Candidates

| Concern | Candidate | Notes |
|---|---|---|
| Framework | Nuxt | Better fit for an interactive PWA with future Cloudflare Pages server routes |
| Styling | Plain CSS for M1; Tailwind can be added later | Keeps scaffold light while template work is still forming |
| Export | `html-to-image`, canvas, or server screenshot | Validate on mobile before committing |
| API | Nuxt server routes on Cloudflare Pages first; standalone Worker/Hono only if needed | Keeps future metadata API close to the app |
| Metadata | YouTube oEmbed and/or YouTube Data API | oEmbed can simplify v1; Data API gives richer data |
| Deployment | Cloudflare Pages or Vercel | Keep hosting cheap and simple |

## Compliance Notes

- Do not download or reupload YouTube video content.
- Use metadata, thumbnails, links, and clear source attribution.
- Do not use YouTube/YT branding in the final product name.
- Show the video source clearly where YouTube content appears.

## Technical Risks

| Risk | Mitigation |
|---|---|
| Mobile export inconsistencies | Test export early on Safari/Chrome mobile viewports |
| API quota or key exposure | Prefer oEmbed first if enough; move Data API calls server-side |
| Template text overflow | Use constrained typography and test long titles |
| Download UX on iOS | Provide instructions-free fallback UI and verify behavior |
| Cross-origin thumbnail issues | Proxy/cache thumbnails if canvas export is tainted |

## Implementation Bias

Start with no custom backend if possible. Add Nuxt server routes or a Worker when a real constraint appears: API keys, cross-origin export issues, caching, or quota control.
