import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BudgetTable } from '../components/BudgetTable'
import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'

const categories: Category[] = [
  { id: 'food', name: 'กิน', color: '#DCE775' },
  { id: 'savings', name: 'เงินเก็บ', color: '#81C784' },
]

const paymentMethods: PaymentMethod[] = [{ id: 'kbank', name: 'Kbank' }]

const expenses: ExpenseItem[] = [
  { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: 'kbank', due: 'monthly', note: '' },
  { id: '2', name: 'เงินเก็บ', amount: 12000, categoryId: 'savings', paymentMethodId: null, due: 'monthly', note: '' },
]

describe('BudgetTable', () => {
  it('renders expenses grouped by category', () => {
    render(<BudgetTable expenses={expenses} categories={categories} paymentMethods={paymentMethods} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('กิน')).toBeInTheDocument()
    expect(screen.getAllByText('เงินเก็บ')).toHaveLength(2)
    expect(screen.getByText('อาหาร')).toBeInTheDocument()
    expect(screen.getByText('฿3,000')).toBeInTheDocument()
    expect(screen.getByText('฿12,000')).toBeInTheDocument()
  })

  it('calls onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<BudgetTable expenses={expenses} categories={categories} paymentMethods={paymentMethods} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByLabelText('แก้ไข อาหาร'))
    expect(onEdit).toHaveBeenCalledWith(expenses[0])

    fireEvent.click(screen.getByLabelText('ลบ อาหาร'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
