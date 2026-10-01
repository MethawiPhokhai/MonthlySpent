import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { useBudget } from '../hooks/useBudget'
import type { BudgetData } from '../types/budget'

vi.mock('../hooks/useBudget', () => ({
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
  ],
  categories: [{ id: 'food', name: 'กิน', color: '#DCE775' }],
  paymentMethods: [],
}

function mockUseBudget(overrides: Record<string, unknown> = {}) {
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
    ...overrides,
  })
}

describe('App', () => {
  it('renders dashboard when budget data is loaded', () => {
    mockUseBudget()

    render(<App />)

    expect(screen.getByText('MonthlySpent')).toBeInTheDocument()
    expect(screen.getByText('รายรับรวม')).toBeInTheDocument()
    expect(screen.getAllByText('🪙103,000')).toHaveLength(2)
    expect(screen.getAllByText('อาหาร')).toHaveLength(2)
  })

  it('hides the scenario tab bar when there is only one scenario', () => {
    mockUseBudget()

    render(<App />)

    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('shows the scenario tab bar when more than one scenario exists', () => {
    mockUseBudget({
      data: {
        ...mockBudget,
        scenarios: [
          ...mockBudget.scenarios,
          { id: 'freelance', name: 'ฟรีแลนซ์', description: '', income: { total: 0 }, expenses: [] },
        ],
      },
    })

    render(<App />)

    expect(screen.getByRole('tab', { name: 'มีรายได้' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'ฟรีแลนซ์' })).toBeInTheDocument()
  })

  it('calls save when save button is clicked', () => {
    const save = vi.fn()
    mockUseBudget({ save })

    render(<App />)

    fireEvent.click(screen.getByText('บันทึกลง GitHub'))

    expect(save).toHaveBeenCalled()
  })

  it('renders a theme toggle button', () => {
    mockUseBudget()

    render(<App />)

    expect(screen.getByRole('button', { name: /สลับเป็นโหมด/ })).toBeInTheDocument()
  })
})
