import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useBudget } from '../hooks/useBudget'
import type { BudgetData } from '../types/budget'

const mockBudget: BudgetData = {
  meta: { currency: 'THB', version: '1.0.0' },
  scenarios: [
    {
      id: 'employed',
      name: 'มีรายได้',
      description: '',
      income: { total: 100000 },
      expenses: [
        { id: 'exp-1', name: 'เงินเก็บ', amount: 12000, categoryId: 'savings', paymentMethodId: 'dime', due: 'monthly', note: '' },
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
  categories: [{ id: 'savings', name: 'เงินเก็บ', color: '#81C784' }],
  paymentMethods: [{ id: 'dime', name: 'Dime' }],
}

const config = { owner: 'tuscaffy', repo: 'MonthlySpent', token: 'token' }

describe('useBudget', () => {
  it('loads budget data on mount', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(mockBudget)
    expect(result.current.sha).toBe('sha-1')
    expect(result.current.error).toBeNull()
  })

  it('sets error when load fails', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ error: 'Network error' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network error')
    expect(result.current.data).toBeNull()
  })

  it('auto-saves fresh data after a mutation', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true, newSha: 'sha-2' })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.addExpense('employed', {
        name: 'กินข้าว',
        amount: 3000,
        categoryId: 'food',
        paymentMethodId: null,
        due: 'monthly',
        note: '',
      })
    })

    await waitFor(() => expect(saveBudgetFile).toHaveBeenCalledTimes(1))

    const sentData = saveBudgetFile.mock.calls[0][1] as BudgetData
    expect(sentData.scenarios[0].expenses).toHaveLength(2)
    expect(sentData.scenarios[0].expenses[1].name).toBe('กินข้าว')
  })

  it('saves current data when save is called manually', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true, newSha: 'sha-2' })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(saveBudgetFile).not.toHaveBeenCalled()

    await act(async () => {
      await result.current.save()
    })

    expect(saveBudgetFile).toHaveBeenCalledTimes(1)
    expect(saveBudgetFile).toHaveBeenCalledWith(config, mockBudget, 'sha-1')
  })

  it('updates an expense', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.updateExpense('employed', { ...mockBudget.scenarios[0].expenses[0], amount: 15000 })
    })

    expect(result.current.data?.scenarios[0].expenses[0].amount).toBe(15000)
  })

  it('deletes an expense', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.deleteExpense('employed', 'exp-1')
    })

    expect(result.current.data?.scenarios[0].expenses).toHaveLength(0)
  })

  it('updates income total', async () => {
    const fetchBudgetFile = vi.fn().mockResolvedValue({ data: mockBudget, sha: 'sha-1' })
    const saveBudgetFile = vi.fn().mockResolvedValue({ success: true })

    const { result } = renderHook(() => useBudget(config, { fetchBudgetFile, saveBudgetFile }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.updateIncome('employed', 120000)
    })

    expect(result.current.data?.scenarios[0].income.total).toBe(120000)
  })
})
