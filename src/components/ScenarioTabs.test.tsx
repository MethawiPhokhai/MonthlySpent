import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ScenarioTabs } from './ScenarioTabs'
import type { Scenario } from '../types/budget'

const scenarios: Scenario[] = [
  { id: 'employed', name: 'มีรายได้', description: '', income: { total: 0 }, expenses: [] },
  { id: 'unemployed', name: 'ไม่มีเงินเดือน', description: '', income: { total: 0 }, expenses: [] },
]

describe('ScenarioTabs', () => {
  it('renders a tab for each scenario', () => {
    render(<ScenarioTabs scenarios={scenarios} activeScenarioId="employed" onChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: 'มีรายได้' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'ไม่มีเงินเดือน' })).toBeInTheDocument()
  })

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn()
    render(<ScenarioTabs scenarios={scenarios} activeScenarioId="employed" onChange={onChange} />)

    fireEvent.click(screen.getByRole('tab', { name: 'ไม่มีเงินเดือน' }))

    expect(onChange).toHaveBeenCalledWith('unemployed')
  })
})
