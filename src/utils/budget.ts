import type { Category, ExpenseItem } from '../types/budget'

export interface CategoryTotal {
  id: string
  name: string
  color: string
  value: number
}

export function getCategoryTotals(expenses: ExpenseItem[], categories: Category[]): CategoryTotal[] {
  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      value: expenses
        .filter((expense) => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((item) => item.value > 0)
}
