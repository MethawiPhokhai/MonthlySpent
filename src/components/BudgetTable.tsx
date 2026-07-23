import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'
import { getCategoryTotals } from '../utils/budget'
import { formatCurrency } from '../utils/format'

interface BudgetTableProps {
  expenses: ExpenseItem[]
  categories: Category[]
  paymentMethods: PaymentMethod[]
  onEdit: (item: ExpenseItem) => void
  onDelete: (itemId: string) => void
}

interface ItemActionsProps {
  item: ExpenseItem
  onEdit: (item: ExpenseItem) => void
  onDelete: (itemId: string) => void
}

function ItemActions({ item, onEdit, onDelete }: ItemActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="text-sm text-blue-600 hover:text-blue-800"
        aria-label={`แก้ไข ${item.name}`}
      >
        แก้ไข
      </button>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="text-sm text-rose-600 hover:text-rose-800"
        aria-label={`ลบ ${item.name}`}
      >
        ลบ
      </button>
    </div>
  )
}

export function BudgetTable({ expenses, categories, paymentMethods, onEdit, onDelete }: BudgetTableProps) {
  const totals = getCategoryTotals(expenses, categories)
  const grouped = totals
    .map((total) => ({
      category: categories.find((c) => c.id === total.id)!,
      total,
      items: expenses.filter((expense) => expense.categoryId === total.id),
    }))
    .filter((group) => group.items.length > 0)

  const getPaymentMethodName = (id: string | null) => paymentMethods.find((method) => method.id === id)?.name ?? '-'

  return (
    <div>
      {grouped.length === 0 ? (
        <p className="py-8 text-center text-slate-400">ยังไม่มีรายจ่าย</p>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ category, total, items }) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="font-medium text-slate-800">{category.name}</span>
                <span className="text-sm text-slate-500">({formatCurrency(total.value)})</span>
              </div>

              <div className="space-y-2 sm:hidden">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <span className="whitespace-nowrap font-medium text-slate-800">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{item.due || '-'}</span>
                      <span>·</span>
                      <span>{getPaymentMethodName(item.paymentMethodId)}</span>
                    </div>
                    <div className="mt-2">
                      <ItemActions item={item} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-lg border border-slate-200 sm:block">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">รายการ</th>
                      <th className="px-3 py-2 text-left font-medium">รอบ</th>
                      <th className="px-3 py-2 text-left font-medium">จ่าย</th>
                      <th className="px-3 py-2 text-right font-medium">จำนวน</th>
                      <th className="px-3 py-2 text-right font-medium">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-slate-500">{item.due || '-'}</td>
                        <td className="px-3 py-2 text-slate-500">{getPaymentMethodName(item.paymentMethodId)}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end">
                            <ItemActions item={item} onEdit={onEdit} onDelete={onDelete} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
