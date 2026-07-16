import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchBudgetFile, saveBudgetFile } from '../api/github'
import type { BudgetData } from '../types/budget'

const mockBudget: BudgetData = {
  meta: { currency: 'THB', version: '1.0.0' },
  scenarios: [
    {
      id: 'employed',
      name: 'มีรายได้',
      description: '',
      income: { total: 100000 },
      expenses: [],
    },
  ],
  categories: [],
  paymentMethods: [],
}

const config = { owner: 'tuscaffy', repo: 'MonthlySpent', token: 'test-token' }

function b64Encode(data: unknown): string {
  const json = JSON.stringify(data)
  const bytes = new TextEncoder().encode(json)
  const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join('')
  return btoa(binString)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchBudgetFile', () => {
  it('returns decoded data and sha on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: b64Encode(mockBudget), sha: 'abc123' }),
    } as Response)

    const result = await fetchBudgetFile(config)

    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.data).toEqual(mockBudget)
    expect(result.sha).toBe('abc123')
  })

  it('returns an error message on failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not Found' }),
    } as Response)

    const result = await fetchBudgetFile(config)

    expect('error' in result).toBe(true)
    if (!('error' in result)) return
    expect(result.error).toBe('Not Found')
  })
})

describe('saveBudgetFile', () => {
  it('returns success and new sha on valid PUT', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: { sha: 'new-sha' } }),
    } as Response)

    const result = await saveBudgetFile(config, mockBudget, 'abc123')

    expect(result).toEqual({ success: true, newSha: 'new-sha' })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/repos/tuscaffy/MonthlySpent/contents/data/budget.json'),
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('returns an error message on failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ message: 'Conflict' }),
    } as Response)

    const result = await saveBudgetFile(config, mockBudget, 'abc123')

    expect('error' in result).toBe(true)
    if (!('error' in result)) return
    expect(result.error).toBe('Conflict')
  })
})
