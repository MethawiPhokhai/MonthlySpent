import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category, ExpenseItem } from '../types/budget'
import { getCategoryTotals } from '../utils/budget'

interface DonutChartProps {
  expenses: ExpenseItem[]
  categories: Category[]
}

export function DonutChart({ expenses, categories }: DonutChartProps) {
  const data = getCategoryTotals(expenses, categories)

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white p-4 text-slate-400">
        ยังไม่มีรายจ่าย
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-600">สัดส่วนรายจ่าย</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              label={(entry) => `${entry.name} ${Math.round((entry.value / total) * 100)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
