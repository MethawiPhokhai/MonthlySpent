import { formatCurrency } from '../utils/format'

interface SummaryCardsProps {
  readonly income: number
  readonly expenses: number
}

export function SummaryCards({ income, expenses }: SummaryCardsProps) {
  const remaining = income - expenses

  const cards = [
    { label: 'รายรับรวม', value: income, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'รายจ่ายรวม', value: expenses, color: 'bg-rose-100 text-rose-800' },
    { label: 'คงเหลือ', value: remaining, color: remaining >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl p-4 shadow-sm ${card.color}`}>
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(card.value)}</p>
        </div>
      ))}
    </div>
  )
}
