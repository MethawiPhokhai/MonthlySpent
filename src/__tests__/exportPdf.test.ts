import { describe, expect, it } from 'vitest'
import type { Category, PaymentMethod, Scenario } from '../types/budget'
import { buildExpenseReportHtml, escapeHtml, groupExpensesByCategory } from '../utils/exportPdf'

const categories: Category[] = [
  { id: 'savings', name: 'เงินเก็บ', color: '#000' },
  { id: 'food', name: 'กิน', color: '#000' },
  { id: 'emergency', name: 'ฉุกเฉิน', color: '#000' },
]
const paymentMethods: PaymentMethod[] = [{ id: 'dime', name: 'Dime' }]
const scenario: Scenario = {
  id: 'employed',
  name: 'มีรายได้',
  description: '',
  income: { total: 1000 },
  expenses: [
    { id: 'a', name: 'เงินเก็บ A', amount: 300, categoryId: 'savings', paymentMethodId: 'dime', due: 'monthly', note: '' },
    { id: 'b', name: 'ข้าว', amount: 200, categoryId: 'food', paymentMethodId: null, due: '', note: '' },
    { id: 'c', name: 'ไม่มีหมวด', amount: 50, categoryId: 'gone', paymentMethodId: null, due: '', note: '' },
  ],
}

describe('groupExpensesByCategory', () => {
  it('follows category order, skips empty categories, and keeps orphans', () => {
    const groups = groupExpensesByCategory(scenario.expenses, categories)
    expect(groups.map((g) => [g.name, g.total])).toEqual([
      ['เงินเก็บ', 300],
      ['กิน', 200],
      ['ไม่ระบุหมวด', 50],
    ])
  })
})

describe('buildExpenseReportHtml', () => {
  const html = buildExpenseReportHtml(scenario, categories, paymentMethods, new Date('2026-11-01T00:00:00Z'))

  it('lists every expense exactly once and totals the grand sum', () => {
    expect(html.split('<tr>').length - 1).toBe(3 + 3) // 3 body rows + 3 header rows
    expect(html).toContain('เงินเก็บ A')
    expect(html).toContain('ไม่ระบุหมวด')
    expect(html).toContain('รายจ่ายรวมทั้งหมด 🪙550')
    expect(html).toContain('🪙450')
  })

  it('escapes user-entered text', () => {
    const evil = buildExpenseReportHtml(
      { ...scenario, expenses: [{ ...scenario.expenses[0], name: '<script>x</script>' }] },
      categories,
      paymentMethods,
    )
    expect(evil).not.toContain('<script>x</script>')
    expect(evil).toContain('&lt;script&gt;')
  })

  it('escapeHtml covers the special characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;')
  })
})
