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
        className="link-action"
        aria-label={`แก้ไข ${item.name}`}
      >
        แก้ไข
      </button>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="link-danger"
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
    <div className="item-card">
      <div className="flex items-start justify-between gap-2">
        <span>{item.name}</span>
        <span className="amount">
          {formatCurrency(item.amount)}
        </span>
      </div>
      <div className="meta mt-1 flex items-center gap-2">
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
    <tr>
      <td>{item.name}</td>
      <td className="meta">{item.due || '-'}</td>
      <td className="meta">
        {getPaymentMethodName(paymentMethods, item.paymentMethodId)}
      </td>
      <td className="is-numeric amount">{formatCurrency(item.amount)}</td>
      <td className="is-numeric">
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
        <span className="swatch" style={{ backgroundColor: category.color }} />
        <span className="title-lg">{category.name}</span>
        <span className="meta">({formatCurrency(total)})</span>
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

      <div className="table-card hidden sm:block">
        <table className="table min-w-[480px]">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>รอบ</th>
              <th>จ่าย</th>
              <th className="is-numeric">จำนวน</th>
              <th className="is-numeric">จัดการ</th>
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
    return <p className="empty-state">ยังไม่มีรายจ่าย</p>
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
