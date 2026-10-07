import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'
import { formatCurrency } from '../utils/format'

interface CategoryDetailProps {
  readonly category: Category
  readonly expenses: ExpenseItem[]
  readonly totalExpenses: number
  readonly paymentMethods: PaymentMethod[]
  readonly onBack: () => void
  readonly onAdd: () => void
  readonly onEdit: (item: ExpenseItem) => void
  readonly onDelete: (itemId: string) => void
}

/** Resolve a payment method id to its display name. */
function getPaymentMethodName(paymentMethods: PaymentMethod[], id: string | null): string {
  return paymentMethods.find((method) => method.id === id)?.name ?? '-'
}

/** One category's total, share of the month, and its expense items with edit/delete actions. */
export function CategoryDetail({
  category,
  expenses,
  totalExpenses,
  paymentMethods,
  onBack,
  onAdd,
  onEdit,
  onDelete,
}: CategoryDetailProps) {
  const items = expenses.filter((expense) => expense.categoryId === category.id)
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  const percent = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0

  return (
    <div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="กลับ" className="btn btn-ghost icon-btn">
          &lt;
        </button>
        <h2 className="screen-title ml-1">{category.name}</h2>
        <span className="swatch swatch-lg" style={{ backgroundColor: category.color }} />
      </div>

      <div className="stat stat-expense mt-7">
        <p className="stat-label">รวมหมวดนี้</p>
        <p className="stat-value stat-value-lg">{formatCurrency(total)}</p>
        <p className="stat-label mt-1">{percent}% ของรายจ่ายทั้งเดือน</p>
      </div>

      <div className="mt-7 flex items-baseline justify-between">
        <span className="section-title">รายการ</span>
        <span className="meta">{items.length} รายการ</span>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">ยังไม่มีรายการ</p>
      ) : (
        <ul className="mt-1 flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="list-row list-row-tall">
              <div className="list-row-name">
                <p>{item.name}</p>
                <p className="meta">
                  {item.due || '-'} · {getPaymentMethodName(paymentMethods, item.paymentMethodId)}
                </p>
              </div>
              <span className="list-row-amount">{formatCurrency(item.amount)}</span>
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`แก้ไข ${item.name}`}
                className="btn btn-ghost icon-btn"
              >
                แก้
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label={`ลบ ${item.name}`}
                className="btn btn-ghost icon-btn icon-btn-danger"
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="sticky-action">
        <button type="button" onClick={onAdd} className="btn btn-primary btn-block">
          + เพิ่มรายการในหมวดนี้
        </button>
      </div>
    </div>
  )
}
