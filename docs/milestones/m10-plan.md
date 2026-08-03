# M10 Plan - Posterize MVP Launch

## Summary

Rename the public product to **Posterize**, keep `/` as the immediately usable
creation workspace, and finish the smallest launch-readiness pass needed for a
public Cloudflare Pages MVP.

M10 does not add a separate landing page. The tool is the landing page.

## Product Changes

- Add a compact global Posterize header with the existing theme control.
- Use the headline `Turn a video link into a story worth sharing.`
- Keep the YouTube URL field, generated preview, template picker, routed share
  workspace, and export flow unchanged.
- Show three real template examples below the workspace after a video loads.
- Add a small footer with the repository, privacy summary, and YouTube
  affiliation disclaimer.
- Rename public metadata, PWA labels, icon titles, and sharing labels.
- Add a 1200x630 social preview image and large-image social metadata.

Internal Cloudflare identifiers remain `story-tube` so the existing Pages
project and deployment URL continue to work.

## Cloudflare Launch Checklist

- [ ] Production homepage loads over HTTPS.
- [ ] Direct `/share/:videoId` URLs survive refresh.
- [ ] Watch, `youtu.be`, and Shorts URLs load metadata.
- [ ] Repeated metadata requests return `X-Posterize-Cache: HIT`.
- [ ] All six templates render on production.
- [ ] Clean and QR exports are 1080x1920.
- [ ] Download and native sharing work on a physical iPhone.
- [ ] Cloudflare Web Analytics records a visit.
- [ ] Pages Functions metrics show no recurring runtime errors.

## Implementation Checklist

- [x] Posterize public branding and metadata.
- [x] Global header and tool-first homepage copy.
- [x] Generated examples strip and trust footer.
- [x] PWA icon labels and social preview asset.
- [x] Root and product documentation updated.
- [x] Shared Posterize export signature, native typography, and simplified footer.
- [x] Automated tests, typecheck, and Cloudflare Pages build pass.

## Local Verification

- [x] `npm test` passes 38 tests.
- [x] `npm run typecheck` exits successfully.
- [x] `npm run build` produces the Cloudflare Pages `dist` output.
- [x] Local Pages preview serves `/`, `/manifest.webmanifest`, and
  `/og-posterize.png` with `200` responses.
- [x] A direct valid `/share/:videoId` request returns the Posterize share
  workspace.
- [x] A repeated metadata request returns `X-Posterize-Cache: HIT`.

## Deferred

- Custom domain purchase.
- Trademark registration or legal clearance.
- KV, Turnstile, and application-level rate limiting.
- Accounts, persistence, payments, and automatic Instagram publishing.

## Done When

- A new visitor understands the product and can generate a story without first
  visiting a marketing page.
- Public browser, PWA, and share surfaces consistently say Posterize.
- The existing Cloudflare Pages deployment remains compatible.
- The production workflow passes the Cloudflare launch checklist.
