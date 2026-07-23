import { formatCurrency } from '../utils/format'

interface TotalIncomeInputProps {
  readonly total: number
  readonly onChange: (total: number) => void
}

/** Editable total income field with a formatted preview. */
export function TotalIncomeInput({ total, onChange }: TotalIncomeInputProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          id="total-income"
          type="number"
          min={0}
          value={total}
          aria-label="รายได้ทั้งหมด"
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
        />
        <span className="text-sm text-slate-500">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
