# YouTube Story Maker

Progressive web app for turning a YouTube link into a polished 9:16 story card that can be downloaded and shared to Instagram, Facebook, TikTok, or any story-based social format.

Working name only: avoid using YouTube in the final product name because platform branding rules can restrict app naming. Candidate names live in the product docs.

## Project Status

M1 scaffold is in progress/completed: Nuxt PWA shell, Cloudflare Pages build output, and install manifest are in place. Build direction remains PWA-first, web-first, mobile-first.

## Commands

```sh
npm run dev
npm run build
npm run preview
npm run deploy
```

Cloudflare Pages defaults:

```txt
Build command: npm run build
Build output directory: dist
```

## Core Flow

```txt
Paste YouTube link
Fetch video metadata
Pick a story template
Generate a 1080x1920 PNG
Download or share the image
```

## Docs

Each major folder owns its own `README.md` so context stays close to the work.

| Folder | Purpose |
|---|---|
| [docs](./docs/README.md) | Planning and project documentation index |
| [docs/proposal](./docs/proposal/README.md) | Project proposal and scope guardrails |
| [docs/milestones](./docs/milestones/README.md) | Build phases, deliverables, and done criteria |
| [docs/product](./docs/product/README.md) | Product requirements, users, flows, names, and roadmap |
| [docs/architecture](./docs/architecture/README.md) | PWA architecture, stack decisions, data flow, and technical risks |
| [docs/decisions](./docs/decisions/README.md) | Architecture decision records |

## V1 Principle

Do not build a social network, video downloader, native mobile app, login system, or payment system first.

Build the missing button:

> Make this YouTube link beautiful for my story.
