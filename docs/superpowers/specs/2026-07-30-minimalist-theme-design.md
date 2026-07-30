# Minimalist Light and Dark Theme Design

## Goal

Give Story Tube a restrained, beginner-engineer visual identity while supporting light and dark modes across the creation and sharing routes.

The application chrome should feel simple, legible, and practical. Story templates remain expressive and are not recolored by the app theme.

## Theme Behavior

- Follow the operating-system color preference on the first visit.
- Provide one icon button that switches between light and dark.
- Store an explicit user choice in `localStorage`.
- Continue following system changes when the user has not made an explicit choice.
- Apply the theme before the app paints to avoid a light-to-dark flash.
- Set `color-scheme` and the browser `theme-color` to match the active theme.
- Use `data-theme="light"` or `data-theme="dark"` on the root HTML element.

## Visual Language

The app uses a neutral interface with one blue accent:

| Role | Light | Dark |
|---|---|---|
| Canvas | `#f6f7f8` | `#111315` |
| Surface | `#ffffff` | `#191c1f` |
| Raised surface | `#f0f2f4` | `#22262a` |
| Primary text | `#17191c` | `#f3f4f5` |
| Secondary text | `#676d75` | `#a7adb5` |
| Border | `#dfe2e6` | `#343a40` |
| Accent | `#2563eb` | `#60a5fa` |
| Accent text | `#ffffff` | `#0b1220` |
| Success | `#177245` | `#55c58a` |
| Error | `#b42318` | `#ff8a80` |

The app shell has:

- No decorative gradients.
- No backdrop blur.
- Thin borders instead of heavy shadows.
- Border radii at or below eight pixels.
- One restrained shadow only where a preview needs visual separation.
- Comfortable spacing without large marketing-style sections.

## Typography

- Use the native system sans-serif stack already provided by Tailwind.
- Do not download or bundle a custom font.
- Use regular and medium weights for body text.
- Use semibold or bold for headings and primary actions.
- Remove black and extra-black weights from app chrome.
- Keep headings compact:
  - Home title: `text-3xl`, increasing to `text-4xl` on larger screens.
  - Share title: `text-2xl` or `text-3xl`.
  - Section titles: `text-sm` or `text-base`.
- Keep letter spacing at zero except existing uppercase micro-labels, which should be removed where they add no meaning.

Story-template typography is outside this redesign because it is exported artwork.

## Architecture

### Root theme initialization

`nuxt.config.ts` adds a small inline head script that:

1. Reads the stored theme.
2. Falls back to `prefers-color-scheme`.
3. Sets `document.documentElement.dataset.theme`.
4. Sets `document.documentElement.style.colorScheme`.

This runs before Vue hydration and prevents a visible theme flash.

### Theme state

`composables/useTheme.ts` exposes:

```ts
type Theme = 'light' | 'dark'

theme: Ref<Theme>
toggleTheme(): void
```

On mount it reads the theme already applied by the head script. It persists changes and updates the root attribute, `color-scheme`, and browser theme-color metadata.

The composable listens for system preference changes only when no stored preference exists.

### Theme control

`components/app/AppThemeToggle.vue` uses the installed Lucide sun and moon icons. It is a fixed, accessible icon button in the app shell with:

- A stable 44-pixel target.
- An `aria-label` describing the action.
- A native hover title.
- Visible keyboard focus.

`app.vue` renders the toggle once above `<NuxtPage />`.

### Design tokens

`assets/css/main.css` defines semantic CSS variables under:

```css
:root,
:root[data-theme='light']

:root[data-theme='dark']
```

Page and control classes consume semantic variables rather than hard-coded light or dark values.

No theme store, plugin, middleware, or external color-mode dependency is added.

## Route Changes

### Home `/`

- Replace the gradient background with the theme canvas.
- Replace glass panels with plain bordered surfaces.
- Reduce the title size and font weight.
- Use the blue accent for Generate, selected templates, pagination, and Share Story.
- Keep the desktop template grid and mobile story carousel behavior unchanged.
- Keep one story preview rendered at a time.

### Share `/share/:videoId`

- Use the same canvas, surface, border, text, and accent tokens as Home.
- Preserve the existing two-column workflow and mobile stacking.
- Theme segmented controls, URL field, instructions, buttons, loading state, and invalid-video state.
- Preserve PNG rendering and story-template colors.

## Data Flow

```text
Initial document
  -> inline theme script reads localStorage or system preference
  -> root data-theme is applied before paint
  -> Vue mounts
  -> useTheme reads the active root theme
  -> user toggles
  -> root attribute, color-scheme, theme-color, and localStorage update
  -> CSS variables repaint Home and Share
```

Theme changes do not trigger metadata requests, regenerate QR codes, alter route queries, or change exported story artwork.

## Error Handling

- If `localStorage` is unavailable, the current session still toggles through the root attribute.
- If `matchMedia` is unavailable, light mode is the fallback.
- An invalid stored value is ignored.
- Theme errors must not prevent Nuxt from rendering.

## Testing

### Automated

- Theme parser accepts only `light` and `dark`.
- Initial theme resolution prefers a stored value over the system value.
- Initial theme resolution follows the system when no stored value exists.
- Type checking passes.
- Cloudflare Pages production build passes.

### Browser

- First visit follows light system preference.
- First visit follows dark system preference.
- Toggle changes every app surface without changing story artwork.
- Reload preserves an explicit choice.
- Without an explicit choice, changing the system preference updates the app.
- No incorrect-theme flash appears on reload.
- Home and Share remain usable at mobile and desktop sizes.
- Share, download, QR, clipboard, template carousel, and route restoration still work.

## Out of Scope

- More than two themes.
- User-selected accent colors.
- A theme settings page.
- Custom web fonts.
- Recoloring story templates or exported PNGs.
- A third-party color-mode module.

## Acceptance Criteria

- Home and Share both support matching light and dark modes.
- The first visit follows the device theme.
- An explicit choice survives reload.
- The app chrome uses neutral surfaces, blue accents, compact system typography, thin borders, and no decorative gradients.
- Story templates and exports remain unchanged.
- Existing creation, routing, sharing, and export behavior does not regress.
