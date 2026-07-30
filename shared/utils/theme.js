// @ts-check

/** @typedef {'light' | 'dark'} Theme */

/** @param {unknown} value */
export function isTheme(value) {
  return value === 'light' || value === 'dark'
}

/**
 * @param {unknown} storedTheme
 * @param {boolean} prefersDark
 * @returns {Theme}
 */
export function resolveTheme(storedTheme, prefersDark) {
  if (isTheme(storedTheme)) return storedTheme
  return prefersDark ? 'dark' : 'light'
}
