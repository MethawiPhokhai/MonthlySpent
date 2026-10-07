import type { Category, ExpenseItem } from '../types/budget'
import { getCategoryTotals } from '../utils/budget'
import { formatCurrency } from '../utils/format'

interface CategoryBreakdownProps {
  readonly expenses: ExpenseItem[]
  readonly categories: Category[]
  readonly onSelect: (categoryId: string) => void
}

/** Stacked share bar plus a tappable list of spending per category. */
export function CategoryBreakdown({ expenses, categories, onSelect }: CategoryBreakdownProps) {
  const data = getCategoryTotals(expenses, categories)

  if (data.length === 0) {
    return <p className="empty-state">ยังไม่มีรายจ่าย</p>
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const rows = data.map((item) => ({ ...item, percent: (item.value / total) * 100 }))

  return (
    <div>
      <div className="share-bar" aria-hidden="true">
        {rows.map((row) => (
          <div key={row.id} style={{ width: `${row.percent}%`, backgroundColor: row.color }} />
        ))}
      </div>

      <h2 className="section-title mt-7">รายจ่ายตามหมวด</h2>
      <ul className="mt-1 flex flex-col">
        {rows.map((row) => (
          <li key={row.id}>
            <button type="button" onClick={() => onSelect(row.id)} className="list-row">
              <span className="swatch" style={{ backgroundColor: row.color }} />
              <span className="list-row-name">{row.name}</span>
              <span className="list-row-percent">{Math.round(row.percent)}%</span>
              <span className="list-row-amount">{formatCurrency(row.value)}</span>
              <span className="chevron" aria-hidden="true">&gt;</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
