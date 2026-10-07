import { useEffect, useState } from 'react'
import type { GitHubConfig } from './api/github'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { CategoryDetail } from './components/CategoryDetail'
import { ItemModal } from './components/ItemModal'
import { ScenarioTabs } from './components/ScenarioTabs'
import { SettingsPanel } from './components/SettingsPanel'
import { SummaryCards } from './components/SummaryCards'
import { ThemeToggle } from './components/ThemeToggle'
import { TotalIncomeInput } from './components/TotalIncomeInput'
import { DEFAULT_SCENARIO_ID, LOCAL_STORAGE_CONFIG_KEY } from './constants'
import { useBudget } from './hooks/useBudget'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import type { ExpenseItem } from './types/budget'

/** Root component: connects GitHub-backed budget state to the dashboard UI. */
export default function App() {
  const [config, setConfig] = useLocalStorage<GitHubConfig>(LOCAL_STORAGE_CONFIG_KEY, {
    owner: '',
    repo: 'MonthlySpent',
    token: '',
  })
  const [activeScenarioId, setActiveScenarioId] = useState<string>(DEFAULT_SCENARIO_ID)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  const [defaultCategoryId, setDefaultCategoryId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const { data, loading, saving, error, saveError, load, save, addExpense, updateExpense, deleteExpense, updateIncome } =
    useBudget(config)

  const activeScenario = data?.scenarios.find((scenario) => scenario.id === activeScenarioId) ?? data?.scenarios[0]
  const totalExpenses = activeScenario?.expenses.reduce((sum, item) => sum + item.amount, 0) ?? 0
  const selectedCategory = data?.categories.find((category) => category.id === selectedCategoryId)

  // Lifecycle: start each screen (summary / category detail) at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedCategoryId])

  /** Open the modal with an empty form for a new expense, optionally preselecting a category. */
  function handleAdd(categoryId = '') {
    setEditingItem(null)
    setDefaultCategoryId(categoryId)
    setIsModalOpen(true)
  }

  /** Open the modal prefilled with the expense being edited. */
  function handleEdit(item: ExpenseItem) {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  /** Create or update the expense; useBudget auto-saves the change. */
  function handleSaveItem(item: ExpenseItem | Omit<ExpenseItem, 'id'>) {
    if (activeScenario) {
      if ('id' in item) {
        updateExpense(activeScenario.id, item)
      } else {
        addExpense(activeScenario.id, item)
      }
    }
    setIsModalOpen(false)
  }

  /** Delete the expense after confirmation; useBudget auto-saves the change. */
  function handleDelete(itemId: string) {
    if (activeScenario && confirm('ต้องการลบรายการนี้หรือไม่?')) {
      deleteExpense(activeScenario.id, itemId)
    }
  }

  if (loading && !data) {
    return (
      <div className="page flex items-center justify-center">
        <p className="meta">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="shell shell-narrow">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">สมุดบัญชีส่วนตัว</p>
            <h1 className="title-xl">MonthlySpent</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            {data && (
              <button type="button" onClick={save} disabled={saving} className="btn btn-primary">
                {saving ? 'กำลังบันทึก...' : 'บันทึกลง GitHub'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className="btn btn-ghost"
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
          <main className="screen mt-6">
            {selectedCategory ? (
              <CategoryDetail
                category={selectedCategory}
                expenses={activeScenario.expenses}
                totalExpenses={totalExpenses}
                paymentMethods={data.paymentMethods}
                onBack={() => setSelectedCategoryId(null)}
                onAdd={() => handleAdd(selectedCategory.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <>
                {data.scenarios.length > 1 && (
                  <div className="mb-4">
                    <ScenarioTabs
                      scenarios={data.scenarios}
                      activeScenarioId={activeScenario.id}
                      onChange={setActiveScenarioId}
                    />
                  </div>
                )}

                {activeScenario.description && (
                  <p className="meta text-center">{activeScenario.description}</p>
                )}

                <div className="mt-6">
                  <SummaryCards income={activeScenario.income.total} expenses={totalExpenses} />
                </div>

                <div className="mt-7">
                  <label htmlFor="total-income" className="field-label">
                    รายได้ทั้งหมด
                  </label>
                  <TotalIncomeInput
                    total={activeScenario.income.total}
                    onChange={(total) => updateIncome(activeScenario.id, total)}
                  />
                </div>

                <div className="mt-8">
                  <CategoryBreakdown
                    expenses={activeScenario.expenses}
                    categories={data.categories}
                    onSelect={setSelectedCategoryId}
                  />
                </div>

                <div className="sticky-action">
                  <button type="button" onClick={() => handleAdd()} className="btn btn-primary btn-block">
                    + เพิ่มรายการ
                  </button>
                </div>
              </>
            )}
          </main>
        ) : (
          <div className="card empty-state mt-8">
            <p className="title-md">กรอกข้อมูล GitHub ด้านบนแล้วกด "โหลดข้อมูล" เพื่อเริ่มใช้งาน</p>
            <p className="meta mt-2">ต้องการ Personal Access Token ที่มีสิทธิ์ Contents ของ repo นี้</p>
          </div>
        )}

        <ItemModal
          isOpen={isModalOpen}
          item={editingItem}
          categories={data?.categories ?? []}
          paymentMethods={data?.paymentMethods ?? []}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      </div>
    </div>
  )
}
