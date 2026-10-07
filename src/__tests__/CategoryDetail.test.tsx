import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CategoryDetail } from '../components/CategoryDetail'
import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'

const category: Category = { id: 'savings', name: 'เงินเก็บ', color: '#81C784' }

const paymentMethods: PaymentMethod[] = [{ id: 'kbank', name: 'Kbank' }]

const expenses: ExpenseItem[] = [
  { id: '1', name: 'อาหาร', amount: 3000, categoryId: 'food', paymentMethodId: null, due: 'monthly', note: '' },
  { id: '2', name: 'ฝากประจำ', amount: 12000, categoryId: 'savings', paymentMethodId: 'kbank', due: 'monthly', note: '' },
]

/** Render the detail view with spies for every callback. */
function renderDetail() {
  const handlers = { onBack: vi.fn(), onAdd: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() }
  render(
    <CategoryDetail
      category={category}
      expenses={expenses}
      totalExpenses={15000}
      paymentMethods={paymentMethods}
      {...handlers}
    />,
  )
  return handlers
}

describe('CategoryDetail', () => {
  it('shows only this category items with total and share', () => {
    renderDetail()

    expect(screen.getByText('เงินเก็บ')).toBeInTheDocument()
    expect(screen.getByText('ฝากประจำ')).toBeInTheDocument()
    expect(screen.queryByText('อาหาร')).not.toBeInTheDocument()
    expect(screen.getAllByText('🪙12,000')).toHaveLength(2)
    expect(screen.getByText('80% ของรายจ่ายทั้งเดือน')).toBeInTheDocument()
    expect(screen.getByText('monthly · Kbank')).toBeInTheDocument()
  })

  it('calls back, add, edit and delete handlers', () => {
    const { onBack, onAdd, onEdit, onDelete } = renderDetail()

    fireEvent.click(screen.getByLabelText('กลับ'))
    expect(onBack).toHaveBeenCalled()

    fireEvent.click(screen.getByText('+ เพิ่มรายการในหมวดนี้'))
    expect(onAdd).toHaveBeenCalled()

    fireEvent.click(screen.getByLabelText('แก้ไข ฝากประจำ'))
    expect(onEdit).toHaveBeenCalledWith(expenses[1])

    fireEvent.click(screen.getByLabelText('ลบ ฝากประจำ'))
    expect(onDelete).toHaveBeenCalledWith('2')
  })
})
