# Story Template Polish Design

## Goal

Simplify exported template chrome, stabilize long Headline titles, calm Frame's borders, and move sharing below the preview.

## Template Changes

- Remove decorative labels and numbering from Frame, Headline, Spotlight, and Chromatic.
- Remove Liquid's floating header play button.
- Keep functional content: title, channel, thumbnail, sampled accent, and YouTube attribution.
- Headline reserves a fixed title area and selects one of four font sizes from title length. It never truncates the title and does not let title growth move the artwork.
- Frame keeps one subtle thumbnail border and removes its offset shadow, vertical caption bar, and footer rule.

## Share Control

- Remove the full-width desktop Share Story action from the left workspace panel.
- Render one round Share button below the story preview on every viewport.
- Use the Lucide `Share2` icon when idle and `LoaderCircle` with `animate-spin` while clipboard copy and navigation are running.
- Keep an accessible name, tooltip, disabled state, and duplicate-click guard.

## Scope

No new dependencies, shared state, route parameters, export behavior, or template interfaces.

## Verification

- Source tests cover removed template chrome, Headline title tiers, Frame border reduction, and Share button placement/loading.
- Full tests, Nuxt typecheck, and Cloudflare Pages build pass.
