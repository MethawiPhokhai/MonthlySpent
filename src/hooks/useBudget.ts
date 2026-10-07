import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BudgetData, ExpenseItem } from '../types/budget'
import { fetchBudgetFile as defaultFetch, saveBudgetFile as defaultSave } from '../api/github'
import type { GitHubConfig } from '../api/github'

export interface UseBudgetDependencies {
  fetchBudgetFile?: (config: GitHubConfig) => Promise<{ data: BudgetData; sha: string } | { error: string }>
  saveBudgetFile?: (
    config: GitHubConfig,
    data: BudgetData,
    sha: string,
  ) => Promise<{ success: true; newSha: string } | { error: string; status?: number }>
}

export interface UseBudgetState {
  data: BudgetData | null
  sha: string | null
  loading: boolean
  saving: boolean
  error: string | null
  saveError: string | null
}

export interface UseBudgetActions {
  load: () => Promise<void>
  save: () => Promise<void>
  addExpense: (scenarioId: string, item: Omit<ExpenseItem, 'id'>) => void
  updateExpense: (scenarioId: string, item: ExpenseItem) => void
  deleteExpense: (scenarioId: string, itemId: string) => void
  updateIncome: (scenarioId: string, total: number) => void
}

export type UseBudgetResult = UseBudgetState & UseBudgetActions

/** Generate a unique id for a new expense item. */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

/** Manage the budget lifecycle: load from GitHub, edit locally, auto-save after each change. */
export function useBudget(
  config: GitHubConfig | null,
  deps: UseBudgetDependencies = {},
): UseBudgetResult {
  const fetchBudgetFile = deps.fetchBudgetFile ?? defaultFetch
  const saveBudgetFile = deps.saveBudgetFile ?? defaultSave

  // ----- Lifecycle stage 1: local state (data is null until the first successful load) -----
  const [data, setData] = useState<BudgetData | null>(null)
  const [sha, setSha] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Snapshot of the data most recently persisted to the remote file.
  // Written only inside callbacks/effects — never during render.
  const lastSavedDataRef = useRef<BudgetData | null>(null)
  const savingRef = useRef(false)

  /** Lifecycle 2: fetch budget.json from GitHub and mark it as the last-persisted snapshot. */
  const load = useCallback(async () => {
    if (!config) return
    setLoading(true)
    setError(null)
    const result = await fetchBudgetFile(config)
    setLoading(false)
    if ('error' in result) {
      setError(result.error)
      return
    }
    lastSavedDataRef.current = result.data
    setData(result.data)
    setSha(result.sha)
  }, [config, fetchBudgetFile])

  /** Lifecycle 3: PUT data to GitHub with the current sha; on conflict (409) reload the remote version. */
  const persist = useCallback(
    async (currentData: BudgetData, currentSha: string): Promise<boolean> => {
      if (!config) return false
      savingRef.current = true
      setSaving(true)
      setSaveError(null)
      const result = await saveBudgetFile(config, currentData, currentSha)
      savingRef.current = false
      setSaving(false)
      if ('error' in result) {
        if (result.status === 409) {
          setSaveError('ข้อมูลมีการเปลี่ยนแปลงบน server กรุณาโหลดข้อมูลล่าสุดแล้วลองอีกครั้ง')
          await load()
        } else {
          setSaveError(result.error)
        }
        return false
      }
      setSha(result.newSha)
      return true
    },
    [config, saveBudgetFile, load],
  )

  /** Manually persist the current state (header save button). */
  const save = useCallback(async () => {
    if (!data || !sha) return
    const ok = await persist(data, sha)
    if (ok) lastSavedDataRef.current = data
  }, [data, sha, persist])

  // ----- Lifecycle 4: auto-save -----
  // Runs after render whenever data differs from the last persisted snapshot,
  // so it always sends fresh state: event -> setData -> render -> this effect -> persist.
  useEffect(() => {
    if (!data || !sha || savingRef.current) return
    if (data === lastSavedDataRef.current) return
    const snapshot = data
    void persist(snapshot, sha).then((ok) => {
      if (ok) lastSavedDataRef.current = snapshot
    })
  }, [data, sha, persist])

  /** Immutably update one scenario by id. */
  const updateScenario = useCallback(
    (
      scenarioId: string,
      updater: (scenario: BudgetData['scenarios'][number]) => BudgetData['scenarios'][number],
    ) => {
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          scenarios: prev.scenarios.map((scenario) =>
            scenario.id === scenarioId ? updater(scenario) : scenario,
          ),
        }
      })
    },
    [],
  )

  /** Append a new expense with a generated id. */
  const addExpense = useCallback(
    (scenarioId: string, item: Omit<ExpenseItem, 'id'>) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: [...scenario.expenses, { ...item, id: generateId() }],
      }))
    },
    [updateScenario],
  )

  /** Replace the expense with the same id. */
  const updateExpense = useCallback(
    (scenarioId: string, item: ExpenseItem) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: scenario.expenses.map((expense) => (expense.id === item.id ? item : expense)),
      }))
    },
    [updateScenario],
  )

  /** Remove the expense with the given id. */
  const deleteExpense = useCallback(
    (scenarioId: string, itemId: string) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: scenario.expenses.filter((expense) => expense.id !== itemId),
      }))
    },
    [updateScenario],
  )

  /** Set the scenario's total income. */
  const updateIncome = useCallback(
    (scenarioId: string, total: number) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        income: { ...scenario.income, total },
      }))
    },
    [updateScenario],
  )

  // ----- Lifecycle 0: initial load — fetch once the GitHub config is complete -----
  useEffect(() => {
    if (config && config.owner && config.repo && config.token) {
      load()
    }
  }, [load, config])

  // Memoized public API so the hook result keeps a stable identity between renders.
  return useMemo(
    () => ({
      data,
      sha,
      loading,
      saving,
      error,
      saveError,
      load,
      save,
      addExpense,
      updateExpense,
      deleteExpense,
      updateIncome,
    }),
    [data, sha, loading, saving, error, saveError, load, save, addExpense, updateExpense, deleteExpense, updateIncome],
  )
}
