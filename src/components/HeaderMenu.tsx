import { useEffect, useRef, useState } from 'react'

interface HeaderMenuProps {
  readonly canSave: boolean
  readonly saving: boolean
  readonly settingsOpen: boolean
  readonly onSave: () => void
  readonly onToggleSettings: () => void
}

/** Hamburger button with a dropdown for "save to GitHub" and the GitHub settings panel. */
export function HeaderMenu({ canSave, saving, settingsOpen, onSave, onToggleSettings }: HeaderMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Lifecycle: while open, close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  /** Run a menu action and close the dropdown. */
  function choose(action: () => void) {
    setOpen(false)
    action()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="เมนู"
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn btn-ghost icon-btn"
      >
        <span aria-hidden="true">☰</span>
      </button>

      {open && (
        <div role="menu" className="menu">
          {canSave && (
            <button
              type="button"
              role="menuitem"
              onClick={() => choose(onSave)}
              disabled={saving}
              className="menu-item"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกลง GitHub'}
            </button>
          )}
          <button type="button" role="menuitem" onClick={() => choose(onToggleSettings)} className="menu-item">
            {settingsOpen ? 'ปิดตั้งค่า GitHub' : '⚙️ ตั้งค่า GitHub'}
          </button>
        </div>
      )}
    </div>
  )
}
