import type { Scenario } from '../types/budget'
import { classNames } from '../utils/format'

interface ScenarioTabsProps {
  readonly scenarios: Scenario[]
  readonly activeScenarioId: string
  readonly onChange: (scenarioId: string) => void
}

export function ScenarioTabs({ scenarios, activeScenarioId, onChange }: ScenarioTabsProps) {
  return (
    <div className="flex space-x-1 rounded-lg bg-slate-200 p-1" role="tablist">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          role="tab"
          aria-selected={scenario.id === activeScenarioId}
          onClick={() => onChange(scenario.id)}
          className={classNames(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            scenario.id === activeScenarioId
              ? 'bg-white text-slate-900 shadow'
              : 'text-slate-600 hover:bg-slate-100',
          )}
        >
          {scenario.name}
        </button>
      ))}
    </div>
  )
}
