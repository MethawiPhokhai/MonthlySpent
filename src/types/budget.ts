export type ScenarioId = 'employed' | 'unemployed'

export interface Category {
  id: string
  name: string
  color: string
}

export interface PaymentMethod {
  id: string
  name: string
}

export interface Income {
  total: number
}

export interface ExpenseItem {
  id: string
  name: string
  amount: number
  categoryId: string
  paymentMethodId: string | null
  due: string
  note: string
}

export interface Scenario {
  id: ScenarioId
  name: string
  description: string
  income: Income
  expenses: ExpenseItem[]
}

export interface BudgetMeta {
  currency: string
  version: string
}

export interface BudgetData {
  meta: BudgetMeta
  scenarios: Scenario[]
  categories: Category[]
  paymentMethods: PaymentMethod[]
}

export interface GitHubConfig {
  owner: string
  repo: string
  token: string
}

