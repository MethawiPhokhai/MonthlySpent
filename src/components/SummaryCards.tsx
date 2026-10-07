import { formatCurrency } from '../utils/format'

interface SummaryCardsProps {
  readonly income: number
  readonly expenses: number
}

/** Remaining-balance hero with an over/within-budget badge, plus income and expense cards. */
export function SummaryCards({ income, expenses }: SummaryCardsProps) {
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
        <div className="stat stat-income">
          <p className="stat-label">รายรับรวม</p>
          <p className="stat-value">{formatCurrency(income)}</p>
        </div>
        <div className="stat stat-expense">
          <p className="stat-label">รายจ่ายรวม</p>
          <p className="stat-value">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </div>
  )
}
