import { useState } from 'react'
import type { GitHubConfig } from './api/github'
import { BudgetTable } from './components/BudgetTable'
import { Collapsible } from './components/Collapsible'
import { DonutChart } from './components/DonutChart'
import { ItemModal } from './components/ItemModal'
import { ScenarioTabs } from './components/ScenarioTabs'
import { SettingsPanel } from './components/SettingsPanel'
import { SummaryCards } from './components/SummaryCards'
import { TotalIncomeInput } from './components/TotalIncomeInput'
import { DEFAULT_SCENARIO_ID, LOCAL_STORAGE_CONFIG_KEY } from './constants'
import { useBudget } from './hooks/useBudget'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { ExpenseItem } from './types/budget'

export default function App() {
  const [config, setConfig] = useLocalStorage<GitHubConfig>(LOCAL_STORAGE_CONFIG_KEY, {
    owner: '',
    repo: 'MonthlySpent',
    token: '',
  })
  const [activeScenarioId, setActiveScenarioId] = useState<string>(DEFAULT_SCENARIO_ID)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const { data, loading, saving, error, saveError, load, save, addExpense, updateExpense, deleteExpense, updateIncome } =
    useBudget(config)

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

  function handleSaveItem(item: ExpenseItem | Omit<ExpenseItem, 'id'>) {
    if ('id' in item) {
      updateExpense(activeScenarioId, item)
    } else {
      addExpense(activeScenarioId, item)
    }
    setIsModalOpen(false)
  }

  function handleDelete(itemId: string) {
    if (confirm('ต้องการลบรายการนี้หรือไม่?')) {
      deleteExpense(activeScenarioId, itemId)
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

          <Collapsible title="สรุปภาพรวม">
            <SummaryCards income={activeScenario.income.total} expenses={totalExpenses} />
          </Collapsible>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Collapsible title="สัดส่วนรายจ่าย">
                <DonutChart expenses={activeScenario.expenses} categories={data.categories} />
              </Collapsible>
            </div>
            <div className="space-y-6 lg:col-span-2">
              <Collapsible title="รายได้ทั้งหมด">
                <TotalIncomeInput
                  total={activeScenario.income.total}
                  onChange={(total) => updateIncome(activeScenarioId, total)}
                />
              </Collapsible>
              <Collapsible
                title="รายจ่ายตามหมวดหมู่"
                action={
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    + เพิ่มรายการ
                  </button>
                }
              >
                <BudgetTable
                  expenses={activeScenario.expenses}
                  categories={data.categories}
                  paymentMethods={data.paymentMethods}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Collapsible>
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
