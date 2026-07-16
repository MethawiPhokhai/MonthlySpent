import { formatCurrency } from '../utils/format'

interface TotalIncomeInputProps {
  total: number
  onChange: (total: number) => void
}

export function TotalIncomeInput({ total, onChange }: TotalIncomeInputProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <label htmlFor="total-income" className="block text-sm font-medium text-slate-600">
        รายได้ทั้งหมด
      </label>
      <div className="mt-1 flex items-center gap-3">
        <input
          id="total-income"
          type="number"
          min={0}
          value={total}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
        />
        <span className="text-sm text-slate-500">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
