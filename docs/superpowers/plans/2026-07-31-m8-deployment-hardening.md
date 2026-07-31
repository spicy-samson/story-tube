# M8 Deployment Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect the YouTube metadata endpoint from repeated upstream calls and make production usage visible in Cloudflare.

**Architecture:** A small server utility builds one cache key per YouTube video ID and safely adapts Cloudflare's edge-local `caches.default`, while the Nitro route remains responsible for validation and oEmbed error mapping. Cloudflare Workers Logs record cache outcomes and provider failures, and Cloudflare Web Analytics supplies privacy-friendly visit counts from the dashboard.

**Tech Stack:** Nuxt 4, Nitro/H3, Cloudflare Pages Functions, Workers Cache API, Node test runner, Wrangler.

## Global Constraints

- Keep Cloudflare Pages and the existing Nuxt server routes; do not add a standalone Worker.
- Cache only successful metadata responses.
- Normalize cache entries by the validated 11-character YouTube video ID.
- Local Nuxt development must work when `caches.default` is unavailable.
- Do not add KV, a database, authentication, Turnstile, or third-party analytics.
- Do not collect or log pasted URLs, IP addresses, titles, channel names, or other user content.

---

### Task 1: Edge Metadata Cache

**Files:**
- Create: `server/utils/youtube-metadata-cache.js`
- Create: `tests/youtube-metadata-cache.test.mjs`
- Modify: `server/api/youtube/metadata.get.ts`

**Interfaces:**
- Produces: `createYoutubeMetadataCacheKey(origin, videoId)`, `getCloudflareDefaultCache()`, `readYoutubeMetadataCache(cache, key)`, and `writeYoutubeMetadataCache(cache, key, metadata)`.
- The route returns its existing `YoutubeMetadata` contract and adds `Cache-Control` plus `X-Story-Tube-Cache` response headers.

- [x] Write tests proving tracked URLs collapse to a video-ID cache key, cache hits deserialize metadata, and writes receive a 24-hour edge TTL.
- [x] Run `npm test` and verify the new test fails because the utility is absent.
- [x] Implement the cache utility with a safe local-runtime fallback.
- [x] Run `npm test` and verify all tests pass.
- [x] Integrate the utility into the metadata route, caching only validated successful oEmbed responses.
- [x] Add structured cache outcome and provider failure logs without user-provided content.

### Task 2: Cloudflare Monitoring

**Files:**
- Modify: `docs/milestones/m8-plan.md`

**Interfaces:**
- Pages Functions Metrics track backend traffic and errors without Worker-only Wrangler settings.
- Real-time Pages logs expose privacy-safe custom cache events while a dashboard or Wrangler tail session is active.
- The deployment guide tells the owner where to find visits, page paths, Functions traffic, errors, and cache outcomes.

- [x] Keep `wrangler.toml` limited to configuration fields supported by Pages projects.
- [x] Document Cloudflare Web Analytics setup for Pages and explain that it measures visits/page views while Workers metrics measure API requests.
- [x] Document the `X-Story-Tube-Cache` header and real-time structured log fields used during production QA.

### Task 3: Verification

**Files:**
- Modify: `docs/milestones/README.md`

**Interfaces:**
- M8 deliverables reflect implemented code while deployment-only checks remain open.

- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Run `git diff --check`.
- [x] Confirm the Cloudflare output contains the metadata route and cache helper.
- [x] Mark only completed local M8 items as complete.
