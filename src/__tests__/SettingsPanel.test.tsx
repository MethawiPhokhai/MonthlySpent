import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from '../components/SettingsPanel'
import type { GitHubConfig } from '../api/github'

const config: GitHubConfig = { owner: 'tuscaffy', repo: 'MonthlySpent', token: 'token' }

describe('SettingsPanel', () => {
  it('renders config fields', () => {
    render(<SettingsPanel config={config} onChange={vi.fn()} onLoad={vi.fn()} loading={false} error={null} saveError={null} saving={false} />)

    expect(screen.getByLabelText('Owner')).toHaveValue('tuscaffy')
    expect(screen.getByLabelText('Repo')).toHaveValue('MonthlySpent')
  })

  it('calls onChange when a field changes', () => {
    const onChange = vi.fn()
    render(<SettingsPanel config={config} onChange={onChange} onLoad={vi.fn()} loading={false} error={null} saveError={null} saving={false} />)

    fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'new-owner' } })

    expect(onChange).toHaveBeenCalledWith({ ...config, owner: 'new-owner' })
  })

  it('calls onLoad when load button is clicked', () => {
    const onLoad = vi.fn()
    render(<SettingsPanel config={config} onChange={vi.fn()} onLoad={onLoad} loading={false} error={null} saveError={null} saving={false} />)

    fireEvent.click(screen.getByText('โหลดข้อมูล'))

    expect(onLoad).toHaveBeenCalled()
  })

  it('displays error messages', () => {
    render(<SettingsPanel config={config} onChange={vi.fn()} onLoad={vi.fn()} loading={false} error="Not Found" saveError="Conflict" saving={false} />)

    expect(screen.getByText('โหลดล้มเหลว: Not Found')).toBeInTheDocument()
    expect(screen.getByText('บันทึกล้มเหลว: Conflict')).toBeInTheDocument()
  })
})
