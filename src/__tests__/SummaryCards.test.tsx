import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SummaryCards } from '../components/SummaryCards'

describe('SummaryCards', () => {
  it('renders income, expenses, and remaining', () => {
    render(<SummaryCards income={103000} expenses={41699} onIncomeChange={vi.fn()} />)

    expect(screen.getByText('รายรับรวม')).toBeInTheDocument()
    expect(screen.getByText('รายจ่ายรวม')).toBeInTheDocument()
    expect(screen.getByText('คงเหลือ')).toBeInTheDocument()
    expect(screen.getByText('🪙103,000')).toBeInTheDocument()
    expect(screen.getByText('🪙61,301')).toBeInTheDocument()
    expect(screen.getByText('อยู่ในงบ')).toBeInTheDocument()
  })

  it('flags spending over income', () => {
    render(<SummaryCards income={75000} expenses={75209} onIncomeChange={vi.fn()} />)

    expect(screen.getByText('-🪙209')).toBeInTheDocument()
    expect(screen.getByText('จ่ายเกินรายรับ')).toBeInTheDocument()
  })

  it('edits income in the green card and saves on Enter', () => {
    const onIncomeChange = vi.fn()
    render(<SummaryCards income={75000} expenses={0} onIncomeChange={onIncomeChange} />)

    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    const input = screen.getByLabelText('รายรับรวม')
    expect(input).toHaveValue(75000)

    fireEvent.change(input, { target: { value: '80000' } })
    expect(onIncomeChange).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onIncomeChange).toHaveBeenCalledWith(80000)
    expect(screen.queryByLabelText('รายรับรวม')).not.toBeInTheDocument()
  })

  it('saves income on blur', () => {
    const onIncomeChange = vi.fn()
    render(<SummaryCards income={75000} expenses={0} onIncomeChange={onIncomeChange} />)

    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    fireEvent.change(screen.getByLabelText('รายรับรวม'), { target: { value: '90000' } })
    fireEvent.blur(screen.getByLabelText('รายรับรวม'))

    expect(onIncomeChange).toHaveBeenCalledWith(90000)
  })

  it('cancels on Escape and ignores empty or unchanged values', () => {
    const onIncomeChange = vi.fn()
    render(<SummaryCards income={75000} expenses={0} onIncomeChange={onIncomeChange} />)

    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    fireEvent.change(screen.getByLabelText('รายรับรวม'), { target: { value: '1' } })
    fireEvent.keyDown(screen.getByLabelText('รายรับรวม'), { key: 'Escape' })

    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    fireEvent.change(screen.getByLabelText('รายรับรวม'), { target: { value: '' } })
    fireEvent.keyDown(screen.getByLabelText('รายรับรวม'), { key: 'Enter' })

    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    fireEvent.keyDown(screen.getByLabelText('รายรับรวม'), { key: 'Enter' })

    expect(onIncomeChange).not.toHaveBeenCalled()
    expect(screen.getByLabelText('แก้ไขรายรับรวม')).toHaveTextContent('🪙75,000')
  })
})
