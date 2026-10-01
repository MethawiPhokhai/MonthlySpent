import type { Theme } from '../hooks/useTheme'

interface ThemeToggleProps {
  readonly theme: Theme
  readonly onToggle: () => void
}

/** Header button that switches between the dark (default) and light themes. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'

  return (
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      className="btn btn-ghost"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
