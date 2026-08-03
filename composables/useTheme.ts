import { isTheme, resolveTheme } from '~/shared/utils/theme.js'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'posterize-theme'
const THEME_COLORS: Record<Theme, string> = {
  light: '#f6f7f8',
  dark: '#111315'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.querySelector<HTMLMetaElement>('#theme-color')
    ?.setAttribute('content', THEME_COLORS[theme])
}

export function useTheme() {
  const theme = useState<Theme>('app-theme', () => 'light')
  let mediaQuery: MediaQueryList | null = null
  let hasExplicitPreference = false

  function readStoredTheme(): Theme | null {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY)
      return isTheme(storedTheme) ? storedTheme : null
    } catch {
      return null
    }
  }

  function setTheme(nextTheme: Theme, persist = true) {
    theme.value = nextTheme
    applyTheme(nextTheme)

    if (!persist) return
    hasExplicitPreference = true

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // The current page still keeps the selected theme.
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function handleSystemTheme(event: MediaQueryListEvent) {
    if (hasExplicitPreference) return
    setTheme(event.matches ? 'dark' : 'light', false)
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    hasExplicitPreference = Boolean(readStoredTheme())

    const rootTheme = document.documentElement.dataset.theme
    setTheme(resolveTheme(rootTheme, mediaQuery.matches), false)
    mediaQuery.addEventListener('change', handleSystemTheme)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleSystemTheme)
  })

  return {
    theme: readonly(theme),
    toggleTheme
  }
}
