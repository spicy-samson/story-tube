# Milestones

This file is the build map for the PWA-first version.

## Milestone Summary

| Milestone | Name | Outcome |
|---|---|---|
| M0 | Planning | Repo has proposal, product scope, milestones, and architecture notes |
| M1 | PWA Scaffold | App shell runs locally with mobile-first layout and manifest |
| M2 | Metadata Pipeline | YouTube URLs parse and resolve into usable metadata |
| M3 | Story Preview | One high-quality 9:16 template renders in the browser |
| M4 | PNG Export | User can download a 1080x1920 image |
| M5 | Template Set | Ten screenshot-inspired templates and a live picker are polished |
| M6 | Story Link Sharing | Routed creation and sharing workspaces produce clean or QR stories with the canonical YouTube link ready |
| M7 | Mobile QA | Works on phone-sized viewports and PWA install path is verified |
| M8 | Demo Ship | Deployed version and short demo are ready |

## M0 - Planning

Deliverables:

- [x] Root `README.md`
- [x] Project proposal
- [x] Milestone plan
- [x] Product scope
- [x] Architecture notes
- [x] Decision log folder

Done when:

- The next coding session can start without re-deciding the product shape.

## M1 - PWA Scaffold

Deliverables:

- [x] App framework scaffolded
- [x] Mobile-first home/workspace screen
- [x] PWA manifest
- [x] App icons placeholder strategy
- [x] Basic styling system

Done when:

- The app runs locally.
- A phone-sized viewport shows the main workspace, not a marketing page.
- Browser installability basics are in place.

## M2 - Metadata Pipeline

Detailed plan: [m2-plan.md](./m2-plan.md)

Deliverables:

- [x] YouTube URL parser
- [x] Support for `youtube.com/watch`, `youtu.be`, and Shorts URLs
- [x] Metadata fetch layer
- [x] Loading, invalid URL, and failed fetch states
- [x] Parser manual checks

Done when:

- Pasting a valid link fills the preview data.
- Invalid links fail clearly without crashing.

## M3 - Story Preview

Detailed plan: [m3-plan.md](./m3-plan.md)

Deliverables:

- [x] 9:16 preview surface
- [x] First polished template
- [x] Thumbnail background treatment
- [x] Title and channel typography
- [x] "Watch on YouTube" or source attribution

Done when:

- One card looks good enough to post as a story screenshot even before export exists.

## M4 - PNG Export

Detailed plan: [m4-plan.md](./m4-plan.md)

Deliverables:

- [x] 1080x1920 export pipeline
- [x] Download button
- [x] Export loading state
- [x] Fallback behavior for unsupported browsers
- [ ] Cross-browser and mobile export QA
- [x] Link-sharing scope moved to [M6](./m6-plan.md)

Done when:

- Exported PNG matches the preview and opens correctly on desktop and phone.

## M5 - Template Set

Detailed plan: [m5-plan.md](./m5-plan.md)

Deliverables:

- [x] Centered media template
- [x] Full-bleed editorial template
- [x] Blue poster template
- [x] Progress template
- [x] Clean text poster template
- [x] Image-forward full-bleed template
- [x] Floating glass template
- [x] Thumbnail-matched chromatic template
- [x] Split image and type template
- [x] Liquid glass template
- [x] Live template picker
- [x] Tailwind styling migration
- [ ] Template-specific accent controls if simple

Done when:

- The user can make ten meaningfully different story cards from the same link.

## M6 - Story Link Sharing

Detailed plan: [m6-plan.md](./m6-plan.md)

Deliverables:

- [x] Creation workspace at `/`
- [x] Refreshable sharing workspace at `/share/:videoId`
- [x] URL-restored template, variant, and QR position
- [x] Back to Edit Story flow with restored video and template
- [x] Clean and QR story variants
- [x] Canonical YouTube URL copy action
- [x] Selectable URL fallback
- [x] Four-position QR sticker
- [x] Native file sharing where supported
- [x] PNG download fallback
- [ ] Deployed mobile share-sheet QA

Done when:

- A creator can refresh or directly open the share workspace without losing the selected output settings.
- A creator can share or download the story and paste the copied YouTube URL into Instagram's Link Sticker.

## M7 - Mobile QA

Detailed plan: [m7-plan.md](./m7-plan.md)

Deliverables:

- [x] Mobile generated-story carousel
- [x] Swipe, arrow, keyboard, and direct template controls
- [x] Desktop-only visual template grid
- [x] Auto-scroll to generated mobile result
- [ ] Desktop viewport QA
- [ ] Mobile viewport QA
- [ ] Touch interaction QA
- [ ] PWA install check
- [ ] Download flow check
- [ ] Native share-sheet check
- [ ] Clipboard and Link Sticker handoff check
- [ ] QR scan check

Done when:

- The app feels designed for a phone browser.

## M8 - Demo Ship

Detailed plan: [m8-plan.md](./m8-plan.md)

Deliverables:

- [x] Edge caching for successful YouTube metadata responses
- [x] Metadata endpoint production hardening
- [ ] Cloudflare Web Analytics enabled in the Pages dashboard
- [x] Production deployment at https://story-tube.pages.dev
- [ ] Updated root README
- [x] Demo link: https://story-tube.pages.dev
- [ ] Short demo script or clip checklist

Done when:

- Someone can open the deployed app and make a postable story card without explanation.
