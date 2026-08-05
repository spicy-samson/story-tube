# Posterize

Progressive web app for turning a YouTube link into a polished 9:16 story card that can be downloaded and shared to Instagram, Facebook, TikTok, or any story-based social format.

> Make YouTube links worth sharing.

## Project Status

The MVP is deployed at [posterize.pages.dev](https://posterize.pages.dev). It includes YouTube metadata loading, six original story templates, 1080x1920 PNG export, clean and QR variants, native sharing where supported, and a mobile-first PWA interface.

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

The Cloudflare Pages and Wrangler project name remains `story-tube` as an internal deployment identifier.

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

Posterize builds the missing button:

> Make this YouTube link beautiful for my story.
