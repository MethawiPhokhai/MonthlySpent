import { useCallback, useEffect } from 'react'
import { LOCAL_STORAGE_THEME_KEY } from '../constants'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark'

/** Dark mode is the default; the choice is remembered per browser. */
export const DEFAULT_THEME: Theme = 'dark'

/** Mirror the theme onto <html> so Tailwind's `dark:` variant and the CSS variables follow it. */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

/** Read/write the app theme, keeping the `dark` class on <html> in sync. */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_THEME_KEY, DEFAULT_THEME)

  // Lifecycle: <html> carries the theme class as soon as React mounts and after every change.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return { theme, toggleTheme } as const
}
