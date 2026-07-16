import { describe, expect, it } from 'vitest'
import { getCategoryTotals } from '../utils/budget'
import type { Category, ExpenseItem } from '../types/budget'

const categories: Category[] = [
  { id: 'food', name: 'กิน', color: '#DCE775' },
  { id: 'savings', name: 'เงินเก็บ', color: '#81C784' },
]

const expenses: ExpenseItem[] = [
  { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: null, due: 'monthly', note: '' },
  { id: '2', name: 'เงินเก็บ', amount: 12000, categoryId: 'savings', paymentMethodId: null, due: 'monthly', note: '' },
]

describe('getCategoryTotals', () => {
  it('returns totals per category filtered to non-zero', () => {
    const totals = getCategoryTotals(expenses, categories)

    expect(totals).toHaveLength(2)
    expect(totals.find((t) => t.id === 'food')?.value).toBe(3000)
    expect(totals.find((t) => t.id === 'savings')?.value).toBe(12000)
  })

  it('omits categories with no expenses', () => {
    const totals = getCategoryTotals([expenses[0]], categories)

    expect(totals).toHaveLength(1)
    expect(totals[0].id).toBe('food')
  })
})
