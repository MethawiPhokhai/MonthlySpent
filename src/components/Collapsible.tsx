import { useState } from 'react'
import type { ReactNode } from 'react'

interface CollapsibleProps {
  readonly title: string
  readonly defaultOpen?: boolean
  readonly action?: ReactNode
  readonly children: ReactNode
}

export function Collapsible({ title, defaultOpen = true, action, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600"
          aria-expanded={open}
        >
          <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>{title}</span>
        </button>
        {action}
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}
