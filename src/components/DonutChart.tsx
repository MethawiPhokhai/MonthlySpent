import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category, ExpenseItem } from '../types/budget'
import { getCategoryTotals } from '../utils/budget'

interface DonutChartProps {
  readonly expenses: ExpenseItem[]
  readonly categories: Category[]
}

interface CategoryLabelProps {
  readonly x?: number
  readonly y?: number
  readonly textAnchor?: 'start' | 'middle' | 'end'
  readonly name?: string
  readonly percent?: number
}

/**
 * Slice label rendered as SVG text. It reads its colour from the `--chart-label`
 * CSS variable so it stays legible in both themes (Recharts renders outside Tailwind's
 * class-based `dark:` variant).
 */
function CategoryLabel({ x, y, textAnchor, name, percent }: CategoryLabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fill="var(--chart-label)"
      fontSize={12}
    >
      {`${name ?? ''} ${Math.round((percent ?? 0) * 100)}%`}
    </text>
  )
}

/** Donut chart showing the share of spending per category. */
export function DonutChart({ expenses, categories }: DonutChartProps) {
  const data = getCategoryTotals(expenses, categories)

  if (data.length === 0) {
    return (
      <div className="empty-state flex h-64 items-center justify-center">
        ยังไม่มีรายจ่าย
      </div>
    )
  }

  return (
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
            label={<CategoryLabel />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              border: '1px solid var(--chart-tooltip-border)',
              borderRadius: 8,
              color: 'var(--chart-tooltip-fg)',
            }}
            itemStyle={{ color: 'var(--chart-tooltip-fg)' }}
            labelStyle={{ color: 'var(--chart-tooltip-fg)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
