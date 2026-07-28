# M5 Plan - Template Set

## Summary

Build a real template system from the seven supplied story-card references. The same normalized M2 metadata should render through every design, and switching templates should be instant and client-side.

Status: implemented ahead of M4.

## Implementation

- [x] Add a typed `StoryTemplateId` contract.
- [x] Replace the placeholder picker with seven working controls.
- [x] Route the active choice through `StoryPreview.vue`.
- [x] Keep every template locked to a responsive 9:16 surface.
- [x] Preserve empty, loading, error, and loaded metadata states.
- [x] Migrate the application and story components to Tailwind utilities.
- [x] Keep a minimal Tailwind base stylesheet only for global browser defaults.

## Template Set

| Template | Reference Direction |
|---|---|
| Centered | Rounded media and information card over a blurred thumbnail |
| Editorial | Monochrome full-bleed artwork with bold uppercase typography |
| Blue Poster | Blue editorial field, serif headline, framed thumbnail |
| Progress | Full-bleed image, lower-third title, playback progress cue |
| Clean Poster | Light type-first poster with numbered metadata lines |
| Full Bleed | Image-forward composition with title at the top |
| Glass | Floating translucent media card over a blurred background |

## Component Shape

```txt
components/story/
  StoryPreview.vue
  StoryPlayButton.vue
  StoryYoutubeBrand.vue
  templates/
    CenteredStoryCard.vue
    EditorialStoryCard.vue
    BluePosterStoryCard.vue
    ProgressStoryCard.vue
    CleanPosterStoryCard.vue
    FullBleedStoryCard.vue
    GlassStoryCard.vue
```

Shared template state lives in:

```txt
shared/types/story-template.ts
composables/useStoryCardContent.ts
```

## Acceptance Checks

- [x] All seven picker buttons switch the active component.
- [x] A real public YouTube video renders its title, channel, and thumbnail.
- [x] Long titles remain contained through template-specific line clamping.
- [x] Desktop viewport has no horizontal overflow.
- [x] Phone viewport has no horizontal overflow.
- [x] Cloudflare Pages production build passes.
- [x] M2 metadata route remains bundled in the Pages worker.

## Known Non-Goals

- PNG export remains M4.
- Duration is not displayed because oEmbed does not provide it.
- The YouTube cards are visual sharing assets, not embedded video players.
- Accent and typography customization can be added after export is stable.
