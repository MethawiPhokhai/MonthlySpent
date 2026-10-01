import { formatCurrency } from '../utils/format'

interface SummaryCardsProps {
  readonly income: number
  readonly expenses: number
}

/** Three summary cards: total income, total expenses, and remaining balance. */
export function SummaryCards({ income, expenses }: SummaryCardsProps) {
  const remaining = income - expenses

  const cards = [
    { label: 'รายรับรวม', value: income, cls: 'stat-income' },
    { label: 'รายจ่ายรวม', value: expenses, cls: 'stat-expense' },
    {
      label: 'คงเหลือ',
      value: remaining,
      cls: remaining >= 0 ? 'stat-balance' : 'stat-balance-warn',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={`stat ${card.cls}`}>
          <p className="stat-label">{card.label}</p>
          <p className="stat-value">{formatCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  )
}
