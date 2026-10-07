import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from '../components/SettingsPanel'
import type { GitHubConfig } from '../api/github'

const config: GitHubConfig = { owner: 'tuscaffy', repo: 'MonthlySpent', token: 'token' }

describe('SettingsPanel', () => {
  it('renders config fields', () => {
    render(<SettingsPanel config={config} onSave={vi.fn()} loading={false} error={null} saveError={null} saving={false} />)

    expect(screen.getByLabelText('Owner')).toHaveValue('tuscaffy')
    expect(screen.getByLabelText('Repo')).toHaveValue('MonthlySpent')
  })

  it('edits a local draft without saving while typing', () => {
    const onSave = vi.fn()
    render(<SettingsPanel config={config} onSave={onSave} loading={false} error={null} saveError={null} saving={false} />)

    fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'new-owner' } })

    expect(screen.getByLabelText('Owner')).toHaveValue('new-owner')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with the edited config when บันทึก is clicked', () => {
    const onSave = vi.fn()
    render(<SettingsPanel config={config} onSave={onSave} loading={false} error={null} saveError={null} saving={false} />)

    fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'new-owner' } })
    fireEvent.click(screen.getByText('บันทึก'))

    expect(onSave).toHaveBeenCalledWith({ ...config, owner: 'new-owner' })
  })

  it('disables บันทึก until every field is filled', () => {
    render(<SettingsPanel config={{ ...config, token: '' }} onSave={vi.fn()} loading={false} error={null} saveError={null} saving={false} />)

    expect(screen.getByText('บันทึก')).toBeDisabled()
  })

  it('displays error messages', () => {
    render(<SettingsPanel config={config} onSave={vi.fn()} loading={false} error="Not Found" saveError="Conflict" saving={false} />)

    expect(screen.getByText('โหลดล้มเหลว: Not Found')).toBeInTheDocument()
    expect(screen.getByText('บันทึกล้มเหลว: Conflict')).toBeInTheDocument()
  })
})
