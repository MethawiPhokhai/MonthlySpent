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
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
