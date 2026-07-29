# YouTube Story Maker - Project Proposal

> Fill this out before writing production code. This document is intentionally opinionated so v1 does not drift into a bigger app too early.

## 1. One-Liner

A mobile-first progressive web app that turns a YouTube link into a beautiful 9:16 story card for sharing on Instagram, Facebook, TikTok, and other story formats.

## 2. Problem Statement

YouTube links usually look plain when shared to social stories: a bare thumbnail, a URL preview, or a manual screenshot. Spotify has a polished share-to-story visual format, but YouTube does not provide an equally beautiful, creator-friendly story card flow.

Users who feel this pain:

| User | Pain |
|---|---|
| Creators | Want to promote videos without designing a story manually |
| Learners | Want to share lectures, tutorials, talks, and clips in a cleaner format |
| Fans | Want to share music, boxing, anime, podcasts, sermons, or long-form videos with taste |
| Solo builders | Want a lightweight tool without app-store friction or paid subscriptions |

## 3. Goals vs. Non-Goals

| Goals for v1 | Non-Goals for v1 |
|---|---|
| Mobile-first web app installable as a PWA | Native iOS or Android app |
| Paste a YouTube URL and parse the video ID | Direct YouTube video downloading |
| Fetch title, channel, thumbnail, and link metadata | Reuploading or clipping YouTube video content |
| Render a 1080x1920 story card | Full social network, feed, comments, follows |
| Offer a small set of polished templates | AI-generated templates as the first feature |
| Export PNG for download | Animated MP4 export |
| Work without login | Auth, teams, billing, or subscriptions |
| Respect YouTube branding and attribution | Naming the final app with YouTube/YT branding |

Non-goals can return later. They are parked in the roadmap instead of sneaking into v1.

## 4. Target User & Core Use Case

Primary user: people who already share YouTube videos socially but hate how plain the share looks.

Core use case:

```txt
Open app on phone
Paste YouTube link
Choose a template
Preview the story card
Download PNG
Post it to Instagram Story manually
```

## 5. Tech Stack & Key Decisions

| Layer | Planned Choice | Why |
|---|---|---|
| App type | Progressive web app | App-like experience without app-store fees or review delays |
| Frontend | Next.js or Nuxt | Fast web build, good routing, easy deployment |
| Styling | Tailwind CSS | Quick iteration for visual templates |
| UI primitives | Custom components or shadcn-style primitives | Keeps the app light while allowing polished controls |
| Metadata API | YouTube Data API with oEmbed fallback | Reliable metadata first, simpler fallback when possible |
| Export | Client-side canvas or HTML-to-image first | Fast MVP, no backend rendering cost |
| Backend | Cloudflare Worker/Hono only if needed | Keep v1 simple; add server only for API keys, caching, or quota control |
| Storage | None for v1 | No accounts, no saved projects, less scope |
| Auth | None for v1 | The product should prove usefulness before accounts |
| Hosting | Cloudflare Pages, Vercel, or similar static/PWA hosting | Cheap and simple deployment |

Open architecture questions:

- [ ] Should metadata fetch happen directly from the browser using oEmbed first, then add a backend later for YouTube Data API keys?
- [ ] Which export path produces the most reliable 1080x1920 PNG on mobile browsers: canvas, `html-to-image`, or server screenshot?
- [ ] Should v1 include a watermark, and if yes, should it use the product name or a subtle footer?
- [ ] What final name avoids YouTube trademark issues while still making the tool obvious?

## 6. MVP Feature List

| Feature | Priority | Notes |
|---|---|---|
| YouTube URL input | Must | Support `youtube.com/watch`, `youtu.be`, and Shorts URLs |
| Video ID parser | Must | Pure utility with tests |
| Metadata fetch | Must | Title, channel, thumbnail, source URL |
| Story preview canvas | Must | 9:16 preview, responsive to phone screens |
| Three starter templates | Must | Minimal, cinematic, and creator card |
| 1080x1920 PNG export | Must | The core deliverable |
| Download button | Must | Reliable on desktop and mobile |
| Copy original video link | Should | Useful after downloading the story card |
| QR code or "Watch on YouTube" badge | Should | Helps viewers find the original |
| PWA manifest and installability | Should | App-like without stores |
| Template customization | Could | Accent color, text placement, background blur |
| Share sheet via Web Share API | Could | Progressive enhancement where supported |

## 7. Data Model Sketch

V1 can avoid persistent storage. Keep data in local app state.

```txt
VideoMetadata
  id
  url
  title
  channelName
  thumbnailUrl
  duration?

StoryTemplate
  id
  name
  category
  layout
  defaultTheme

StoryRenderState
  videoMetadata
  selectedTemplateId
  themeOverrides
  generatedAt
```

If accounts or saved cards are added later:

```txt
Project
  id
  user_id
  video_id
  template_id
  theme_json
  created_at

Export
  id
  project_id
  format
  width
  height
  created_at
```

## 8. Milestones & Timeline

| Milestone | Deliverable | Target |
|---|---|---|
| M0 - Planning | Proposal, milestone docs, product scope, architecture notes | Now |
| M1 - Scaffold | PWA app scaffold, styling setup, base layout, install manifest | Day 1 |
| M2 - Metadata | URL parser, metadata fetch, loading/error states | Day 2 |
| M3 - First Template | One polished 9:16 story card preview | Day 3 |
| M4 - Export | Generate and download 1080x1920 PNG | Day 4 |
| M5 - Template Set | Three templates, template picker, responsive polish | Day 5 |
| M6 - Story Link Sharing | Clean/QR outputs, canonical link copy, native share handoff | Day 6 |
| M7 - Mobile QA | Test phone viewport, installability, download/share flow | Day 7 |
| M8 - Demo Ship | Deploy, README update, record/post demo | Day 8 |

## 9. Future Roadmap

- Animated MP4 exports with moving background, progress bar, or subtle motion.
- Brand kits: creator handle, colors, fonts, watermark preferences.
- AI template suggestions based on video vibe.
- Premium template packs for niches like boxing, coding, music, anime, podcasts, sermons, and fitness.
- Batch generation for creators promoting several videos.
- Auth and saved projects.
- Payments for Pro features.
- Native app only after web demand is proven.

## 10. Risks & Open Questions

| Risk/Question | Impact if unresolved | Mitigation |
|---|---|---|
| YouTube branding compliance | Could force rename or UI changes | Avoid YouTube/YT in final app name; show source attribution |
| Metadata API quota | App may fail under usage spikes | Start with oEmbed where possible; add backend caching later |
| Mobile PNG export reliability | Core feature may feel broken on phones | Test early on mobile browsers; keep fallback download path |
| Competitor already exists | Need differentiation beyond "same thing" | Make v1 faster, simpler, cheaper/free, and niche-template friendly |
| Direct IG sharing limitation on web | User may expect one-tap story posting | Be explicit: v1 downloads image; direct share is progressive enhancement |

## 11. Success Criteria

V1 is done when:

- A user can paste a valid YouTube link.
- The app fetches the video title, channel, thumbnail, and original link.
- The user can choose from at least three templates.
- The preview looks like a polished story card on mobile.
- The user can export a 1080x1920 PNG.
- The exported image can be posted manually to Instagram Story.
- The app is deployable and installable as a PWA.

## 12. Session Log Tie-In

Suggested mode tags:

| Work Type | Mode |
|---|---|
| Scaffolding, styling setup, basic components | SHIP |
| URL parser, export reliability, metadata strategy | TRAIN |
| Template design and mobile polish | HYBRID |

Keep the first implementation boring in architecture and tasteful in presentation.
