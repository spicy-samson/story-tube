# PR: M10 MVP Launch Refactor

## Merge

From: `m10-mvp-launch-refactor`

Into: `main`

## Summary

This PR readies the app for a public MVP launch under the new product name:
**Posterize**.

The app stays tool-first. There is no separate marketing landing page; `/`
opens the creation workspace immediately, with cleaner branding, launch copy,
PWA metadata, social preview assets, and a small trust footer around the core
YouTube-to-story workflow.

## What Changed

- Renamed public-facing product copy from Story Tube / WatchPoster to
  Posterize.
- Updated app metadata, PWA manifest, icons, theme labels, and social preview
  surfaces.
- Added the compact global app header with the theme toggle.
- Reworked homepage copy around the MVP promise:
  `Turn a video link into a story worth sharing.`
- Kept the generator flow focused on the usable workspace instead of adding a
  separate landing page.
- Added `og-posterize` social preview assets.
- Simplified the footer with privacy and YouTube affiliation notes.
- Added a small Posterize export signature/watermark to generated stories.
- Polished native typography, template presentation, and YouTube branding.
- Preserved the routed share/export flow at `/share/:videoId`.
- Kept Cloudflare project/deployment identifiers as `story-tube` so the
  existing Pages setup does not need to be recreated.
- Updated M10 product and milestone documentation.

## Milestone Coverage

### M10 - Posterize MVP Launch

- Public product name is now Posterize.
- The homepage is still the app, not a marketing page.
- Browser metadata, PWA labels, social sharing, and docs point to Posterize.
- Launch docs keep the deployment path practical for Cloudflare Pages.
- The existing story generation, template picker, QR/link sharing, and PNG
  export workflows remain intact.

## Public UI Changes

- `/` opens the Posterize creation workspace.
- `/share/:videoId` opens the refreshable share/export workspace.
- The global header now carries the Posterize identity and theme toggle.
- The story export includes a subtle Posterize signature.
- The footer is reduced to simple product, privacy, and affiliation context.

## Non-Goals

- No auth, accounts, saved projects, payments, or analytics dashboard is added.
- No database, KV store, Turnstile gate, or new Worker route is added.
- No automatic Instagram posting is added.
- No external Cloudflare project rename is required.
- No separate marketing landing page is introduced.

## Testing

Completed locally during this branch:

- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Local Pages preview checks for `/`, `/manifest.webmanifest`,
  `/og-posterize.png`, and a direct `/share/:videoId` route.
- Repeated metadata request check confirmed `X-Posterize-Cache: HIT`.

Still worth checking before merge:

- Production homepage loads over HTTPS.
- Direct `/share/:videoId` URLs survive refresh on Cloudflare Pages.
- Watch, `youtu.be`, and Shorts URLs load metadata.
- Clean and QR PNG exports are exactly `1080x1920`.
- Download and native sharing work on a physical iPhone.
- Cloudflare Web Analytics records visits.
- Pages Functions metrics show no recurring runtime errors.

## Notes For Review

- This PR intentionally keeps the external Cloudflare project name unchanged.
  The public product is Posterize; infrastructure can stay `story-tube`.
- The tool-first homepage is deliberate for MVP. The fastest demo path is paste
  link, pick template, share.
- Some local workspace files are intentionally not part of this PR scope:
  - `.env.example`
  - `notes.md`

## Suggested PR Title

```txt
Prepare Posterize for MVP launch
```

## Suggested PR Description

```md
## Summary

- rename public product surfaces to Posterize
- keep the homepage as the usable story generator, not a separate landing page
- add MVP launch polish: metadata, PWA labels, social preview, footer, and export signature

## Testing

- npm test
- npm run typecheck
- npm run build
- git diff --check
- local Pages preview smoke checks
```
