import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

/** Fill owner and token so the settings panel's load button is enabled. */
function fillGitHubSettings() {
  fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'tuscaffy' } })
  fireEvent.change(screen.getByLabelText('Personal Access Token'), { target: { value: 'token' } })
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders dashboard when budget data is loaded', () => {
    mockUseBudget()

    render(<App />)

    expect(screen.getByText('MonthlySpent')).toBeInTheDocument()
    expect(screen.getByText('รายรับรวม')).toBeInTheDocument()
    expect(screen.getByLabelText('แก้ไขรายรับรวม')).toHaveTextContent('🪙103,000')
    expect(screen.getByText('กิน')).toBeInTheDocument()
  })

  it('opens the category detail when a category is clicked and goes back', () => {
    mockUseBudget()

    render(<App />)

    fireEvent.click(screen.getByText('กิน'))
    expect(screen.getByText('อาหาร')).toBeInTheDocument()
    expect(screen.getByText('รวมหมวดนี้')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('กลับ'))
    expect(screen.queryByText('รวมหมวดนี้')).not.toBeInTheDocument()
  })

  it('edits and deletes an item from the category detail', () => {
    const deleteExpense = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockUseBudget({ deleteExpense })

    render(<App />)

    fireEvent.click(screen.getByText('กิน'))
    fireEvent.click(screen.getByLabelText('แก้ไข อาหาร'))
    expect(screen.getByText('แก้ไขรายการ')).toBeInTheDocument()
    expect(screen.getByDisplayValue('อาหาร')).toBeInTheDocument()
    fireEvent.click(screen.getByText('ยกเลิก'))

    fireEvent.click(screen.getByLabelText('ลบ อาหาร'))
    expect(deleteExpense).toHaveBeenCalledWith('employed', '1')
  })

  it('adds an item with the category preselected from the category detail', () => {
    const addExpense = vi.fn()
    mockUseBudget({ addExpense })

    render(<App />)

    fireEvent.click(screen.getByText('กิน'))
    fireEvent.click(screen.getByText('+ เพิ่มรายการในหมวดนี้'))
    expect(screen.getByLabelText('หมวดหมู่')).toHaveValue('food')

    fireEvent.change(screen.getByLabelText('ชื่อรายการ'), { target: { value: 'กาแฟ' } })
    fireEvent.change(screen.getByLabelText('จำนวนเงิน (THB)'), { target: { value: '80' } })
    fireEvent.click(screen.getByText('บันทึก'))

    expect(addExpense).toHaveBeenCalledWith('employed', expect.objectContaining({ name: 'กาแฟ', amount: 80, categoryId: 'food' }))
  })

  it('updates income from the summary screen', () => {
    const updateIncome = vi.fn()
    mockUseBudget({ updateIncome })

    render(<App />)

    expect(screen.queryByLabelText('รายได้ทั้งหมด')).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('แก้ไขรายรับรวม'))
    fireEvent.change(screen.getByLabelText('รายรับรวม'), { target: { value: '90000' } })
    fireEvent.keyDown(screen.getByLabelText('รายรับรวม'), { key: 'Enter' })

    expect(updateIncome).toHaveBeenCalledWith('employed', 90000)
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

    expect(screen.queryByText('บันทึกลง GitHub')).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('เมนู'))
    fireEvent.click(screen.getByText('บันทึกลง GitHub'))

    expect(save).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens GitHub settings from the hamburger menu', () => {
    mockUseBudget()

    render(<App />)

    fireEvent.click(screen.getByLabelText('เมนู'))
    fireEvent.click(screen.getByText('⚙️ ตั้งค่า GitHub'))

    expect(screen.getByText('ตั้งค่า GitHub')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('does not pass typed settings to useBudget until บันทึก is clicked', () => {
    mockUseBudget()

    render(<App />)

    fireEvent.click(screen.getByLabelText('เมนู'))
    fireEvent.click(screen.getByText('⚙️ ตั้งค่า GitHub'))
    fillGitHubSettings()

    expect(useBudget).toHaveBeenLastCalledWith({ owner: '', repo: 'MonthlySpent', token: '' })

    fireEvent.click(screen.getByText('บันทึก'))

    expect(useBudget).toHaveBeenLastCalledWith({ owner: 'tuscaffy', repo: 'MonthlySpent', token: 'token' })
  })

  it('closes the settings panel once the load after saving succeeds', () => {
    mockUseBudget()

    const { rerender } = render(<App />)

    fireEvent.click(screen.getByLabelText('เมนู'))
    fireEvent.click(screen.getByText('⚙️ ตั้งค่า GitHub'))
    fillGitHubSettings()
    fireEvent.click(screen.getByText('บันทึก'))

    mockUseBudget({ loading: true })
    rerender(<App />)
    expect(screen.getByText('ตั้งค่า GitHub')).toBeInTheDocument()

    mockUseBudget({ loading: false })
    rerender(<App />)
    expect(screen.queryByText('ตั้งค่า GitHub')).not.toBeInTheDocument()
  })

  it('keeps the settings panel open when the load after saving fails', () => {
    mockUseBudget()

    const { rerender } = render(<App />)

    fireEvent.click(screen.getByLabelText('เมนู'))
    fireEvent.click(screen.getByText('⚙️ ตั้งค่า GitHub'))
    fillGitHubSettings()
    fireEvent.click(screen.getByText('บันทึก'))

    mockUseBudget({ loading: true })
    rerender(<App />)
    mockUseBudget({ loading: false, error: 'Bad credentials' })
    rerender(<App />)

    expect(screen.getByText('ตั้งค่า GitHub')).toBeInTheDocument()
    expect(screen.getByText('โหลดล้มเหลว: Bad credentials')).toBeInTheDocument()
  })

  it('renders a theme toggle button', () => {
    mockUseBudget()

    render(<App />)

    expect(screen.getByRole('button', { name: /สลับเป็นโหมด/ })).toBeInTheDocument()
  })
})
