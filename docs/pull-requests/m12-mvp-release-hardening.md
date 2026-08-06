# PR: M12 MVP Release Hardening

## Merge

From: `m12-mvp-release-hardening`

Into: `main`

## Summary

This PR prepares Posterize for its public MVP release with clearer product
messaging, a faster first-use path, safer production defaults, and more stable
story preview and export behavior.

The app remains tool-first: users can paste a public YouTube link immediately,
try a sample, choose a poster, and export an Instagram-ready story in HD.

## What Changed

- Updated the homepage headline and launch copy around the core promise:
  `Make YouTube links worth sharing.`
- Added a one-click sample video so first-time visitors can try the workflow
  without finding a URL.
- Added a simple `Paste`, `Pick`, `Share` workflow summary.
- Made homepage vertical spacing responsive across screen sizes.
- Updated canonical, Open Graph, Twitter, manifest, and README URLs to
  `posterize.pages.dev`.
- Added browser security headers for framing, MIME sniffing, referrers, and
  unused device permissions.
- Added a five-second timeout to upstream YouTube thumbnail requests.
- Kept Cloudflare rate limiting as a deployment rule for `/api/youtube/*`
  instead of adding more application infrastructure.
- Constrained the desktop share preview so the full story remains visible.
- Made export sizing use the story artboard's layout dimensions, preserving
  the intended `1080x1920` output when the browser preview is resized.
- Added release guidance and focused checks for production hardening.

## Cloudflare Setup

Create the following rate-limiting rule after deployment:

```txt
Path starts with: /api/youtube/
Limit: 10 requests per 10 seconds per IP
Action: Managed Challenge
```

No Turnstile, database, account system, or additional Worker service is added
for this release.

## Testing

Passed locally:

- `npm run typecheck`
- `git diff --check`

Needs resolution before merge:

- `npm test` currently reports two failures.
- `tests/browser-rendering.test.mjs` cannot import a TypeScript module under
  the local Node 20 test runner.
- `tests/share-workspace-layout.test.mjs` expects an older share-layout
  implementation and no longer matches the committed component.

Still worth checking on the deployed Cloudflare Pages preview:

- Generate metadata from watch, Shorts, and `youtu.be` links.
- Refresh a direct `/share/:videoId` URL.
- Export clean and QR stories at exactly `1080x1920`.
- Download from Safari and Chromium on desktop and mobile.
- Confirm the Cloudflare rate-limiting rule only challenges abusive traffic.

## Non-Goals

- No accounts, authentication, database, payments, or saved projects.
- No automatic Instagram publishing.
- No separate marketing landing page.
- No new client-side rate-limiting system.
- No new analytics product or dashboard.
