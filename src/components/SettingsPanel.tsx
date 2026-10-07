import { useState } from 'react'
import type { GitHubConfig } from '../api/github'

interface SettingsPanelProps {
  readonly config: GitHubConfig
  readonly onSave: (config: GitHubConfig) => void
  readonly loading: boolean
  readonly error: string | null
  readonly saveError: string | null
  readonly saving: boolean
}

const inputClass = 'input'
const labelClass = 'kicker'

/**
 * GitHub connection settings with a save action and status messages. Typing edits a local
 * draft only; the config (and the data load it triggers) changes when "บันทึก" is pressed.
 */
export function SettingsPanel({
  config,
  onSave,
  loading,
  error,
  saveError,
  saving,
}: SettingsPanelProps) {
  const [draft, setDraft] = useState<GitHubConfig>(config)

  /** Merge one field change into the draft. */
  function updateField<K extends keyof GitHubConfig>(field: K, value: GitHubConfig[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="card p-4">
      <h3 className="title-lg mb-3">ตั้งค่า GitHub</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="gh-owner" className={labelClass}>
            Owner
          </label>
          <input
            id="gh-owner"
            type="text"
            value={draft.owner}
            onChange={(e) => updateField('owner', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="gh-repo" className={labelClass}>
            Repo
          </label>
          <input
            id="gh-repo"
            type="text"
            value={draft.repo}
            onChange={(e) => updateField('repo', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gh-token" className={labelClass}>
            Personal Access Token
          </label>
          <input
            id="gh-token"
            type="password"
            value={draft.token}
            onChange={(e) => updateField('token', e.target.value)}
            placeholder="ghp_..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(draft)}
          disabled={!draft.owner || !draft.repo || !draft.token || loading}
          className="btn btn-primary"
        >
          {loading ? 'กำลังโหลด...' : 'บันทึก'}
        </button>
        {(loading || saving) && <span className="meta">กำลังทำงาน...</span>}
      </div>

      {error && <p className="error-text">โหลดล้มเหลว: {error}</p>}
      {saveError && <p className="error-text">บันทึกล้มเหลว: {saveError}</p>}
    </div>
  )
}
