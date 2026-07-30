# How the M7 Mobile Story Carousel Works

## Why This Feature Exists

The mobile home page previously showed ten template cards before the generated story. That made the page long and made the controls more prominent than the result.

M7 changes the hierarchy: after generation, the story itself is the picker. One template is rendered at a time, and changing templates changes one ID.

This preserves the product's simple job:

```text
YouTube URL -> attractive story image -> share
```

## Runtime Story

When metadata loads, `pages/index.vue` stores the result and passes the current `selectedTemplate` into `StoryTemplateCarousel`. A swipe, arrow press, keyboard press, or position-button click enters through the carousel, calculates another template index, and emits `update:modelValue`. Vue updates `selectedTemplate`, `StoryPreview` switches its active template component, and the existing page watcher writes the selected template to the URL.

If the gesture is mostly vertical or shorter than 48 pixels, the carousel does nothing and the browser keeps scrolling normally.

## Request Flow

```text
User swipes left on the story
  -> StoryTemplateCarousel.startSwipe()
  -> StoryTemplateCarousel.finishSwipe()
  -> horizontal movement passes the threshold
  -> showNextTemplate()
  -> selectTemplate(next index)
  -> emit("update:modelValue", template.id)
  -> pages/index.vue updates selectedTemplate
  -> StoryPreview renders the matching component
  -> page watcher syncs ?template=... with router.replace()
```

There is no request to Nitro or YouTube when the template changes. The backend participates only when the video metadata is first loaded.

## Data Shape

The carousel does not move large story objects around. Its important data is deliberately small:

```ts
type StoryTemplateId =
  | 'centered'
  | 'editorial'
  | 'poster'
  | 'progress'
  | 'clean-poster'
  | 'full-bleed'
  | 'glass'
  | 'chromatic'
  | 'split'
  | 'liquid'
```

The state flow is:

```text
selectedTemplate: StoryTemplateId
  -> find its index in STORY_TEMPLATES
  -> add or subtract one
  -> wrap the index into the valid 0-9 range
  -> emit the next StoryTemplateId
```

The modulo expression performs the wrap:

```ts
const wrappedIndex = (index + templateCount) % templateCount
```

Adding `templateCount` prevents a previous action from producing a negative array index.

## Component Ownership

`pages/index.vue` owns product state:

- Loaded YouTube metadata
- Selected template
- URL query synchronization
- Navigation to the share route
- Scrolling to the generated mobile result

`StoryTemplateCarousel.vue` owns interaction mechanics:

- Current template index derived from the selected ID
- Previous and next navigation
- Touch gesture start and finish coordinates
- Gesture threshold validation
- Keyboard and button alternatives

`StoryPreview.vue` owns rendering:

- Maps a `StoryTemplateId` to a Vue component
- Renders only that component
- Samples thumbnail colors where required
- Exposes the element used by PNG export

This keeps the dependency direction simple:

```text
pages/index.vue
  -> StoryTemplateCarousel.vue
       -> StoryPreview.vue
            -> one story template component
```

## Why There Are Not Ten Full Slides

A traditional horizontal carousel often renders every slide beside every other slide. Here, each slide would be a full 9:16 story containing images, typography, palette sampling, and export-related DOM.

Rendering ten full previews would:

- Do more image and layout work.
- Make it less obvious which DOM node should be exported.
- Increase mobile memory use.
- Duplicate work when only one result is visible.

Instead, the carousel renders one `StoryPreview` and changes its `templateId`. The existing transition provides the visual replacement.

## Swipe Validation

The gesture has two rules:

```ts
Math.abs(horizontalDistance) >= 48
Math.abs(horizontalDistance) > Math.abs(verticalDistance)
```

The first rejects taps and small hand movements. The second protects normal vertical page scrolling.

Mouse drags are ignored because desktop already has the template grid and mouse dragging should not unexpectedly switch designs.

## Responsive Boundary

Tailwind's `lg` breakpoint is the mode boundary:

```text
Below lg:
  template grid hidden
  carousel controls visible
  mobile Share Story action beside the result

At lg and above:
  template grid visible
  carousel controls hidden
  desktop Share Story action remains in the control panel
```

This is one page with responsive presentation, not two separate versions of the application.

## Generation and Auto-Scroll

After `load()` returns metadata, `fetchMetadata()`:

1. Synchronizes the video and template query parameters.
2. Checks that code is running in the browser.
3. Checks that the viewport is below `1024px`.
4. Waits for Vue to render with `nextTick()`.
5. Scrolls the result section into view.

The browser check matters because Nuxt can execute setup code during server rendering, where `window` does not exist.

## Failure Traces

### Invalid YouTube URL

```text
Trigger: Generate
First function: fetchMetadata()
Failure: useYoutubeMetadata.load() returns no metadata
State change: errorMessage changes; selectedTemplate does not change
Side effect: no auto-scroll and no route update
Visible result: friendly metadata error
```

### Short or Vertical Gesture

```text
Trigger: touch movement
First function: startSwipe(), followed by finishSwipe()
Failure branch: movement misses the horizontal threshold
State change: none
Side effect: none
Visible result: page scroll continues normally
```

### Unknown Template ID

```text
Trigger: invalid or stale route query
Entry validation: parseStoryTemplate() in the route layer
Fallback: centered
State change: selectedTemplate receives a valid ID
Visible result: Centered renders instead of a broken component
```

### Metadata Missing

```text
Trigger: arrow key or carousel method before generation
Guard: if (!props.metadata) return
State change: none
Visible result: placeholder preview stays unchanged
```

## How to Debug It

Inspect these boundaries in order:

1. Confirm `metadata` is non-null.
2. Confirm `selectedTemplateIndex` matches the visible template.
3. Confirm `finishSwipe()` receives a horizontal distance larger than 48.
4. Confirm `update:modelValue` emits a valid ID.
5. Confirm `pages/index.vue` changes `selectedTemplate`.
6. Confirm `StoryPreview.activeComponent` maps that ID to the expected card.
7. Confirm the URL query changes without adding history entries.

Temporary logs should stay at those boundaries:

```ts
console.log('[templateCarousel] gesture', { horizontalDistance, verticalDistance })
console.log('[templateCarousel] selected', { templateId: template.id })
```

Remove temporary logs after the trace is understood.

## Verification

Run:

```bash
npm run typecheck
npm run build
```

Then test a phone-sized viewport:

1. Generate a public YouTube video.
2. Swipe through all ten templates.
3. Scroll vertically while touching the story.
4. Use both arrow buttons.
5. Use the ten position controls.
6. Open Share Story and confirm its `template` query matches the visible design.
7. Return to Edit Story and confirm the same design restores.

## Ownership Check

Without looking at the code, explain:

1. Which component owns `selectedTemplate`?
2. What event crosses the carousel-to-page boundary?
3. Why does a vertical swipe not change the template?
4. Why is only one story preview rendered?
5. Which existing watcher preserves the template in the URL?
6. What happens when the index moves backward from zero?
