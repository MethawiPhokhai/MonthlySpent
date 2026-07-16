import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TotalIncomeInput } from '../components/TotalIncomeInput'

describe('TotalIncomeInput', () => {
  it('renders the total income value', () => {
    render(<TotalIncomeInput total={103000} onChange={vi.fn()} />)

    expect(screen.getByLabelText('รายได้ทั้งหมด')).toHaveValue(103000)
    expect(screen.getByText('฿103,000')).toBeInTheDocument()
  })

  it('calls onChange when the value changes', () => {
    const onChange = vi.fn()
    render(<TotalIncomeInput total={0} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('รายได้ทั้งหมด'), { target: { value: '50000' } })

    expect(onChange).toHaveBeenCalledWith(50000)
  })
})
