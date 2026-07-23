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

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function useBudget(
  config: GitHubConfig | null,
  deps: UseBudgetDependencies = {},
): UseBudgetResult {
  const fetchBudgetFile = deps.fetchBudgetFile ?? defaultFetch
  const saveBudgetFile = deps.saveBudgetFile ?? defaultSave

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

  const save = useCallback(async () => {
    if (!data || !sha) return
    const ok = await persist(data, sha)
    if (ok) lastSavedDataRef.current = data
  }, [data, sha, persist])

  // Auto-save after mutations. Runs after render, so it always sees fresh state.
  // Lifecycle order: event -> setData -> render -> this effect -> persist.
  useEffect(() => {
    if (!data || !sha || savingRef.current) return
    if (data === lastSavedDataRef.current) return
    const snapshot = data
    void persist(snapshot, sha).then((ok) => {
      if (ok) lastSavedDataRef.current = snapshot
    })
  }, [data, sha, persist])

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

  const addExpense = useCallback(
    (scenarioId: string, item: Omit<ExpenseItem, 'id'>) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: [...scenario.expenses, { ...item, id: generateId() }],
      }))
    },
    [updateScenario],
  )

  const updateExpense = useCallback(
    (scenarioId: string, item: ExpenseItem) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: scenario.expenses.map((expense) => (expense.id === item.id ? item : expense)),
      }))
    },
    [updateScenario],
  )

  const deleteExpense = useCallback(
    (scenarioId: string, itemId: string) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        expenses: scenario.expenses.filter((expense) => expense.id !== itemId),
      }))
    },
    [updateScenario],
  )

  const updateIncome = useCallback(
    (scenarioId: string, total: number) => {
      updateScenario(scenarioId, (scenario) => ({
        ...scenario,
        income: { ...scenario.income, total },
      }))
    },
    [updateScenario],
  )

  useEffect(() => {
    if (config && config.owner && config.repo && config.token) {
      load()
    }
  }, [load, config])

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
