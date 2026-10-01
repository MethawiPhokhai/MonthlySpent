import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from '../components/ThemeToggle'

describe('ThemeToggle', () => {
  it('offers switching to light while the dark theme is active', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'สลับเป็นโหมดสว่าง' })).toBeInTheDocument()
  })

  it('offers switching to dark while the light theme is active', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'สลับเป็นโหมดมืด' })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="dark" onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: 'สลับเป็นโหมดสว่าง' }))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
