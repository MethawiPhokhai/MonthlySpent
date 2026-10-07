import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SummaryCards } from '../components/SummaryCards'

describe('SummaryCards', () => {
  it('renders income, expenses, and remaining', () => {
    render(<SummaryCards income={103000} expenses={41699} />)

    expect(screen.getByText('รายรับรวม')).toBeInTheDocument()
    expect(screen.getByText('รายจ่ายรวม')).toBeInTheDocument()
    expect(screen.getByText('คงเหลือ')).toBeInTheDocument()
    expect(screen.getByText('🪙103,000')).toBeInTheDocument()
    expect(screen.getByText('🪙61,301')).toBeInTheDocument()
    expect(screen.getByText('อยู่ในงบ')).toBeInTheDocument()
  })

  it('flags spending over income', () => {
    render(<SummaryCards income={75000} expenses={75209} />)

    expect(screen.getByText('-🪙209')).toBeInTheDocument()
    expect(screen.getByText('จ่ายเกินรายรับ')).toBeInTheDocument()
  })
})
