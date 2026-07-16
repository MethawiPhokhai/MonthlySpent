import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { useBudget } from './hooks/useBudget'
import type { BudgetData } from './types/budget'

vi.mock('./hooks/useBudget', () => ({
  useBudget: vi.fn(),
}))

const mockBudget: BudgetData = {
  meta: { currency: 'THB', version: '1.0.0' },
  scenarios: [
    {
      id: 'employed',
      name: 'มีรายได้',
      description: '',
      income: { total: 103000 },
      expenses: [
        { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: null, due: 'monthly', note: '' },
      ],
    },
    {
      id: 'unemployed',
      name: 'ไม่มีเงินเดือน',
      description: '',
      income: { total: 0 },
      expenses: [],
    },
  ],
  categories: [{ id: 'food', name: 'กิน', color: '#DCE775' }],
  paymentMethods: [],
}

describe('App', () => {
  it('renders dashboard when budget data is loaded', () => {
    ;(useBudget as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockBudget,
      loading: false,
      saving: false,
      error: null,
      saveError: null,
      load: vi.fn(),
      save: vi.fn(),
      addExpense: vi.fn(),
      updateExpense: vi.fn(),
      deleteExpense: vi.fn(),
      updateIncome: vi.fn(),
    })

    render(<App />)

    expect(screen.getByText('MonthlySpent')).toBeInTheDocument()
    expect(screen.getByText('มีรายได้')).toBeInTheDocument()
    expect(screen.getByText('รายรับรวม')).toBeInTheDocument()
    expect(screen.getAllByText('฿103,000')).toHaveLength(2)
    expect(screen.getByText('อาหาร')).toBeInTheDocument()
  })

  it('calls save when save button is clicked', () => {
    const save = vi.fn()
    ;(useBudget as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockBudget,
      loading: false,
      saving: false,
      error: null,
      saveError: null,
      load: vi.fn(),
      save,
      addExpense: vi.fn(),
      updateExpense: vi.fn(),
      deleteExpense: vi.fn(),
      updateIncome: vi.fn(),
    })

    render(<App />)

    fireEvent.click(screen.getByText('บันทึกลง GitHub'))

    expect(save).toHaveBeenCalled()
  })
})
