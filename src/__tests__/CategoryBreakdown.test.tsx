import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import type { Category, ExpenseItem } from '../types/budget'

const categories: Category[] = [
  { id: 'food', name: 'กิน', color: '#DCE775' },
  { id: 'savings', name: 'เงินเก็บ', color: '#81C784' },
]

const expenses: ExpenseItem[] = [
  { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: null, due: 'monthly', note: '' },
  { id: '2', name: 'เงินเก็บ', amount: 12000, categoryId: 'savings', paymentMethodId: null, due: 'monthly', note: '' },
]

describe('CategoryBreakdown', () => {
  it('renders each category with its share and total', () => {
    render(<CategoryBreakdown expenses={expenses} categories={categories} onSelect={vi.fn()} />)

    expect(screen.getByText('กิน')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
    expect(screen.getByText('🪙3,000')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('🪙12,000')).toBeInTheDocument()
  })

  it('calls onSelect with the category id when a row is clicked', () => {
    const onSelect = vi.fn()
    render(<CategoryBreakdown expenses={expenses} categories={categories} onSelect={onSelect} />)

    fireEvent.click(screen.getByText('เงินเก็บ'))

    expect(onSelect).toHaveBeenCalledWith('savings')
  })

  it('renders empty state when no expenses', () => {
    render(<CategoryBreakdown expenses={[]} categories={categories} onSelect={vi.fn()} />)

    expect(screen.getByText('ยังไม่มีรายจ่าย')).toBeInTheDocument()
  })
})
