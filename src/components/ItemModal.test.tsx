import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ItemModal } from './ItemModal'
import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'

const categories: Category[] = [
  { id: 'food', name: 'กิน', color: '#DCE775' },
  { id: 'savings', name: 'เงินเก็บ', color: '#81C784' },
]

const paymentMethods: PaymentMethod[] = [
  { id: 'kbank', name: 'Kbank' },
]

const item: ExpenseItem = {
  id: '1',
  name: 'อาหาร',
  amount: 3000,
  categoryId: 'food',
  paymentMethodId: null,
  due: 'monthly',
  note: '',
}

describe('ItemModal', () => {
  it('renders add form when no item is provided', () => {
    render(<ItemModal isOpen item={null} categories={categories} paymentMethods={paymentMethods} onClose={vi.fn()} onSave={vi.fn()} />)

    expect(screen.getByText('เพิ่มรายการ')).toBeInTheDocument()
  })

  it('renders edit form with item values', () => {
    render(<ItemModal isOpen item={item} categories={categories} paymentMethods={paymentMethods} onClose={vi.fn()} onSave={vi.fn()} />)

    expect(screen.getByText('แก้ไขรายการ')).toBeInTheDocument()
    expect(screen.getByDisplayValue('อาหาร')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3000')).toBeInTheDocument()
  })

  it('calls onSave with form data when submitted', () => {
    const onSave = vi.fn()
    render(<ItemModal isOpen item={null} categories={categories} paymentMethods={paymentMethods} onClose={vi.fn()} onSave={onSave} />)

    fireEvent.change(screen.getByLabelText('ชื่อรายการ'), { target: { value: 'กินข้าว' } })
    fireEvent.change(screen.getByLabelText('จำนวนเงิน (THB)'), { target: { value: '150' } })
    fireEvent.change(screen.getByLabelText('หมวดหมู่'), { target: { value: 'food' } })
    fireEvent.click(screen.getByText('บันทึก'))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'กินข้าว',
        amount: 150,
        categoryId: 'food',
      }),
    )
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(<ItemModal isOpen item={null} categories={categories} paymentMethods={paymentMethods} onClose={onClose} onSave={vi.fn()} />)

    fireEvent.click(screen.getByText('ยกเลิก'))

    expect(onClose).toHaveBeenCalled()
  })
})
