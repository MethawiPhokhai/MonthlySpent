import type { Scenario } from '../types/budget'

interface ScenarioTabsProps {
  readonly scenarios: Scenario[]
  readonly activeScenarioId: string
  readonly onChange: (scenarioId: string) => void
}

/** Tab bar for switching between budget scenarios (hidden by App when there is only one). */
export function ScenarioTabs({ scenarios, activeScenarioId, onChange }: ScenarioTabsProps) {
  return (
    <div className="tabs" role="tablist">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          role="tab"
          aria-selected={scenario.id === activeScenarioId}
          onClick={() => onChange(scenario.id)}
          className="tab flex-1"
        >
          {scenario.name}
        </button>
      ))}
    </div>
  )
}
