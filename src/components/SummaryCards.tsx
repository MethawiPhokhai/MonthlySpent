import { useState } from 'react'
import { formatCurrency } from '../utils/format'

interface SummaryCardsProps {
  readonly income: number
  readonly expenses: number
  readonly onIncomeChange: (total: number) => void
}

interface IncomeCardProps {
  readonly income: number
  readonly onIncomeChange: (total: number) => void
}

/** Green income card; tap the amount to edit it in place (Enter/blur saves, Escape cancels). */
function IncomeCard({ income, onIncomeChange }: IncomeCardProps) {
  const [draft, setDraft] = useState<string | null>(null)

  /** Commit the draft if it is a valid, changed amount, then leave edit mode. */
  function commit() {
    if (draft === null) return
    const total = Number(draft)
    if (draft !== '' && !Number.isNaN(total) && total >= 0 && total !== income) {
      onIncomeChange(total)
    }
    setDraft(null)
  }

  return (
    <div className="stat stat-income">
      <p className="stat-label">รายรับรวม</p>
      {draft === null ? (
        <button
          type="button"
          onClick={() => setDraft(String(income))}
          aria-label="แก้ไขรายรับรวม"
          className="stat-value stat-edit"
        >
          {formatCurrency(income)}
        </button>
      ) : (
        <input
          type="number"
          min={0}
          autoFocus
          value={draft}
          aria-label="รายรับรวม"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setDraft(null)
          }}
          className="stat-value stat-input"
        />
      )}
    </div>
  )
}

/** Remaining-balance hero with an over/within-budget badge, plus income and expense cards. */
export function SummaryCards({ income, expenses, onIncomeChange }: SummaryCardsProps) {
  const remaining = income - expenses
  const isOver = remaining < 0

  return (
    <div>
      <div className="balance">
        <p className="balance-label">คงเหลือ</p>
        <p className={`balance-value ${isOver ? 'is-over' : ''}`}>{formatCurrency(remaining)}</p>
        <span className={`badge ${isOver ? 'badge-over' : 'badge-ok'}`}>
          {isOver ? 'จ่ายเกินรายรับ' : 'อยู่ในงบ'}
        </span>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4">
        <IncomeCard income={income} onIncomeChange={onIncomeChange} />
        <div className="stat stat-expense">
          <p className="stat-label">รายจ่ายรวม</p>
          <p className="stat-value">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </div>
  )
}
