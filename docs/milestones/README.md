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
| M5 | Template Set | Three templates and a template picker are polished |
| M6 | Mobile QA | Works on phone-sized viewports and PWA install path is verified |
| M7 | Demo Ship | Deployed version and short demo are ready |

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

Deliverables:

- [ ] YouTube URL parser
- [ ] Support for `youtube.com/watch`, `youtu.be`, and Shorts URLs
- [ ] Metadata fetch layer
- [ ] Loading, invalid URL, and failed fetch states
- [ ] Parser tests

Done when:

- Pasting a valid link fills the preview data.
- Invalid links fail clearly without crashing.

## M3 - Story Preview

Deliverables:

- [ ] 9:16 preview surface
- [ ] First polished template
- [ ] Thumbnail background treatment
- [ ] Title and channel typography
- [ ] "Watch on YouTube" or source attribution

Done when:

- One card looks good enough to post as a story screenshot even before export exists.

## M4 - PNG Export

Deliverables:

- [ ] 1080x1920 export pipeline
- [ ] Download button
- [ ] Export loading state
- [ ] Fallback behavior for unsupported browsers

Done when:

- Exported PNG matches the preview and opens correctly on desktop and phone.

## M5 - Template Set

Deliverables:

- [ ] Minimal template
- [ ] Cinematic template
- [ ] Creator card template
- [ ] Template picker
- [ ] Template-specific accent controls if simple

Done when:

- The user can make three meaningfully different story cards from the same link.

## M6 - Mobile QA

Deliverables:

- [ ] Desktop viewport QA
- [ ] Mobile viewport QA
- [ ] Touch interaction QA
- [ ] PWA install check
- [ ] Download flow check

Done when:

- The app feels designed for a phone browser.

## M7 - Demo Ship

Deliverables:

- [ ] Production deployment
- [ ] Updated root README
- [ ] Demo link
- [ ] Short demo script or clip checklist

Done when:

- Someone can open the deployed app and make a postable story card without explanation.
