import type { GitHubConfig } from '../api/github'

interface SettingsPanelProps {
  readonly config: GitHubConfig
  readonly onChange: (config: GitHubConfig) => void
  readonly onLoad: () => void
  readonly loading: boolean
  readonly error: string | null
  readonly saveError: string | null
  readonly saving: boolean
}

const inputClass = 'input'
const labelClass = 'kicker'

/** GitHub connection settings with a load action and status messages. */
export function SettingsPanel({
  config,
  onChange,
  onLoad,
  loading,
  error,
  saveError,
  saving,
}: SettingsPanelProps) {
  /** Merge one field change into the current config. */
  function updateField<K extends keyof GitHubConfig>(field: K, value: GitHubConfig[K]) {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="card p-4">
      <h3 className="title-lg mb-3">ตั้งค่า GitHub</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="gh-owner" className={labelClass}>
            Owner
          </label>
          <input
            id="gh-owner"
            type="text"
            value={config.owner}
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
            value={config.repo}
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
            value={config.token}
            onChange={(e) => updateField('token', e.target.value)}
            placeholder="ghp_..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onLoad}
          disabled={!config.owner || !config.repo || !config.token || loading}
          className="btn btn-primary"
        >
          {loading ? 'กำลังโหลด...' : 'โหลดข้อมูล'}
        </button>
        {(loading || saving) && <span className="meta">กำลังทำงาน...</span>}
      </div>

      {error && <p className="error-text">โหลดล้มเหลว: {error}</p>}
      {saveError && <p className="error-text">บันทึกล้มเหลว: {saveError}</p>}
    </div>
  )
}
