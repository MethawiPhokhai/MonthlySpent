import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DonutChart } from '../components/DonutChart'
import type { Category, ExpenseItem } from '../types/budget'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div data-testid="chart-container" style={{ width: 400, height: 400 }}>
        {children}
      </div>
    ),
  }
})

const categories: Category[] = [
  { id: 'food', name: 'กิน', color: '#DCE775' },
  { id: 'savings', name: 'เงินเก็บ', color: '#81C784' },
]

const expenses: ExpenseItem[] = [
  { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: null, due: 'monthly', note: '' },
  { id: '2', name: 'เงินเก็บ', amount: 12000, categoryId: 'savings', paymentMethodId: null, due: 'monthly', note: '' },
]

describe('DonutChart', () => {
  it('renders chart container when expenses exist', () => {
    render(
      <div style={{ width: 400, height: 400 }}>
        <DonutChart expenses={expenses} categories={categories} />
      </div>,
    )

    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
  })

  it('renders empty state when no expenses', () => {
    render(
      <div style={{ width: 400, height: 400 }}>
        <DonutChart expenses={[]} categories={categories} />
      </div>,
    )

    expect(screen.getByText('ยังไม่มีรายจ่าย')).toBeInTheDocument()
  })
})
