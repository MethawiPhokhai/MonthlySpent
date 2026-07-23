import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'
import { formatCurrency } from '../utils/format'

interface BudgetTableProps {
  readonly expenses: ExpenseItem[]
  readonly categories: Category[]
  readonly paymentMethods: PaymentMethod[]
  readonly onEdit: (item: ExpenseItem) => void
  readonly onDelete: (itemId: string) => void
}

interface ItemActionsProps {
  readonly item: ExpenseItem
  readonly onEdit: (item: ExpenseItem) => void
  readonly onDelete: (itemId: string) => void
}

/** Edit/delete actions for one expense, shared by the card and table layouts. */
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

/** Resolve a payment method id to its display name. */
function getPaymentMethodName(paymentMethods: PaymentMethod[], id: string | null): string {
  return paymentMethods.find((method) => method.id === id)?.name ?? '-'
}

interface ItemViewProps {
  readonly item: ExpenseItem
  readonly paymentMethods: PaymentMethod[]
  readonly onEdit: (item: ExpenseItem) => void
  readonly onDelete: (itemId: string) => void
}

/** One expense as a vertical card (mobile layout). */
function ExpenseItemCard({ item, paymentMethods, onEdit, onDelete }: ItemViewProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-slate-800">{item.name}</span>
        <span className="whitespace-nowrap font-medium text-slate-800">{formatCurrency(item.amount)}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
        <span>{item.due || '-'}</span>
        <span>·</span>
        <span>{getPaymentMethodName(paymentMethods, item.paymentMethodId)}</span>
      </div>
      <div className="mt-2">
        <ItemActions item={item} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}

/** One expense as a table row (desktop layout). */
function ExpenseItemRow({ item, paymentMethods, onEdit, onDelete }: ItemViewProps) {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-3 py-2">{item.name}</td>
      <td className="px-3 py-2 text-slate-500">{item.due || '-'}</td>
      <td className="px-3 py-2 text-slate-500">{getPaymentMethodName(paymentMethods, item.paymentMethodId)}</td>
      <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end">
          <ItemActions item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </td>
    </tr>
  )
}

interface CategoryGroupProps {
  readonly category: Category
  readonly items: ExpenseItem[]
  readonly paymentMethods: PaymentMethod[]
  readonly onEdit: (item: ExpenseItem) => void
  readonly onDelete: (itemId: string) => void
}

/** Category header plus its expenses in both mobile (cards) and desktop (table) layouts. */
function CategoryGroup({ category, items, paymentMethods, onEdit, onDelete }: CategoryGroupProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="font-medium text-slate-800">{category.name}</span>
        <span className="text-sm text-slate-500">({formatCurrency(total)})</span>
      </div>

      <div className="space-y-2 sm:hidden">
        {items.map((item) => (
          <ExpenseItemCard
            key={item.id}
            item={item}
            paymentMethods={paymentMethods}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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
              <ExpenseItemRow
                key={item.id}
                item={item}
                paymentMethods={paymentMethods}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Expenses grouped by category, rendered as cards on mobile and a table on desktop. */
export function BudgetTable({ expenses, categories, paymentMethods, onEdit, onDelete }: BudgetTableProps) {
  const grouped = categories
    .map((category) => ({
      category,
      items: expenses.filter((expense) => expense.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0)

  if (grouped.length === 0) {
    return <p className="py-8 text-center text-slate-400">ยังไม่มีรายจ่าย</p>
  }

  return (
    <div className="space-y-4">
      {grouped.map(({ category, items }) => (
        <CategoryGroup
          key={category.id}
          category={category}
          items={items}
          paymentMethods={paymentMethods}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
