import { useEffect, useState } from 'react'
import { BudgetTable } from './components/BudgetTable'
import { DonutChart } from './components/DonutChart'
import { ItemModal } from './components/ItemModal'
import { ScenarioTabs } from './components/ScenarioTabs'
import { SettingsPanel } from './components/SettingsPanel'
import { SummaryCards } from './components/SummaryCards'
import { TotalIncomeInput } from './components/TotalIncomeInput'
import { useBudget } from './hooks/useBudget'
import type { ExpenseItem, GitHubConfig } from './types/budget'

const CONFIG_KEY = 'monthlyspent-config'

function getInitialConfig(): GitHubConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore
  }
  return { owner: '', repo: 'MonthlySpent', token: '' }
}

export default function App() {
  const [config, setConfig] = useState<GitHubConfig>(getInitialConfig)
  const [activeScenarioId, setActiveScenarioId] = useState<string>('employed')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const { data, loading, saving, error, saveError, load, save, addExpense, updateExpense, deleteExpense, updateIncome } =
    useBudget(config)

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    } catch {
      // ignore
    }
  }, [config])

  const activeScenario = data?.scenarios.find((scenario) => scenario.id === activeScenarioId)
  const totalExpenses = activeScenario?.expenses.reduce((sum, item) => sum + item.amount, 0) ?? 0

  function handleAdd() {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  function handleEdit(item: ExpenseItem) {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  async function handleSaveItem(item: ExpenseItem | Omit<ExpenseItem, 'id'>) {
    if ('id' in item) {
      updateExpense(activeScenarioId, item)
    } else {
      addExpense(activeScenarioId, item)
    }
    setIsModalOpen(false)
    await save()
  }

  async function handleDelete(itemId: string) {
    if (confirm('ต้องการลบรายการนี้หรือไม่?')) {
      deleteExpense(activeScenarioId, itemId)
      await save()
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">MonthlySpent</h1>
        <div className="flex items-center gap-2">
          {data && (
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกลง GitHub'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {showSettings && (
        <SettingsPanel
          config={config}
          onChange={setConfig}
          onLoad={load}
          loading={loading}
          error={error}
          saveError={saveError}
          saving={saving}
        />
      )}

      {data && activeScenario ? (
        <div className="mt-6 space-y-6">
          <ScenarioTabs
            scenarios={data.scenarios}
            activeScenarioId={activeScenarioId}
            onChange={setActiveScenarioId}
          />

          {activeScenario.description && (
            <p className="text-sm text-slate-500">{activeScenario.description}</p>
          )}

          <SummaryCards income={activeScenario.income.total} expenses={totalExpenses} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DonutChart expenses={activeScenario.expenses} categories={data.categories} />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <TotalIncomeInput
                total={activeScenario.income.total}
                onChange={async (total) => {
                  updateIncome(activeScenarioId, total)
                  await save()
                }}
              />
              <BudgetTable
                expenses={activeScenario.expenses}
                categories={data.categories}
                paymentMethods={data.paymentMethods}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl bg-slate-50 p-8 text-center text-slate-500">
          <p>กรอกข้อมูล GitHub ด้านบนแล้วกด "โหลดข้อมูล" เพื่อเริ่มใช้งาน</p>
          <p className="mt-2 text-sm">ต้องการ Personal Access Token ที่มีสิทธิ์ Contents ของ repo นี้</p>
        </div>
      )}

      <ItemModal
        isOpen={isModalOpen}
        item={editingItem}
        categories={data?.categories ?? []}
        paymentMethods={data?.paymentMethods ?? []}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  )
}
