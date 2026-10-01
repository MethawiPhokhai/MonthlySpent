import { useEffect, useState } from 'react'
import type { Category, ExpenseItem, PaymentMethod } from '../types/budget'
import { classNames } from '../utils/format'

interface ItemModalProps {
  readonly isOpen: boolean
  readonly item: ExpenseItem | null
  readonly categories: Category[]
  readonly paymentMethods: PaymentMethod[]
  readonly onClose: () => void
  readonly onSave: (item: ExpenseItem | Omit<ExpenseItem, 'id'>) => void
}

const emptyItem: Omit<ExpenseItem, 'id'> = {
  name: '',
  amount: 0,
  categoryId: '',
  paymentMethodId: null,
  due: '',
  note: '',
}

const fieldClass =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-slate-300'

/** Modal form for adding or editing one expense item. */
export function ItemModal({ isOpen, item, categories, paymentMethods, onClose, onSave }: ItemModalProps) {
  const [form, setForm] = useState<Omit<ExpenseItem, 'id'>>(emptyItem)

  // Lifecycle: reset the form each time the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setForm(item ? { ...item } : emptyItem)
    }
  }, [isOpen, item])

  if (!isOpen) return null

  const isEditing = item !== null
  const title = isEditing ? 'แก้ไขรายการ' : 'เพิ่มรายการ'

  /** Validate the form and emit it as a new or updated expense. */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.categoryId) return
    onSave(isEditing ? { ...form, id: item.id } : form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:border dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="item-name" className={labelClass}>
              ชื่อรายการ
            </label>
            <input
              id="item-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="item-amount" className={labelClass}>
              จำนวนเงิน (THB)
            </label>
            <input
              id="item-amount"
              type="number"
              required
              min={0}
              value={form.amount}
              onChange={(e) => {
                const raw = e.target.value === '' ? '' : Number(e.target.value)
                const amount = raw === '' || Number.isNaN(raw) ? 0 : Math.max(0, raw)
                setForm((prev) => ({ ...prev, amount }))
              }}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="item-category" className={labelClass}>
              หมวดหมู่
            </label>
            <select
              id="item-category"
              required
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className={fieldClass}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="item-payment" className={labelClass}>
              วิธีจ่าย
            </label>
            <select
              id="item-payment"
              value={form.paymentMethodId ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, paymentMethodId: e.target.value || null }))}
              className={fieldClass}
            >
              <option value="">ไม่ระบุ</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="item-due" className={labelClass}>
              รอบ/วันครบกำหนด
            </label>
            <input
              id="item-due"
              type="text"
              value={form.due}
              onChange={(e) => setForm((prev) => ({ ...prev, due: e.target.value }))}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="item-note" className={labelClass}>
              หมายเหตุ
            </label>
            <input
              id="item-note"
              type="text"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!form.name || !form.categoryId || form.amount <= 0}
              className={classNames(
                'rounded-lg px-4 py-2 text-sm font-medium text-white',
                form.name && form.categoryId && form.amount > 0
                  ? 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500'
                  : 'cursor-not-allowed bg-slate-400 dark:bg-slate-700',
              )}
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
