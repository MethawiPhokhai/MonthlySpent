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

const inputClass =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
const labelClass = 'block text-xs font-medium text-slate-500 dark:text-slate-400'

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
    <div className="rounded-xl bg-white p-4 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">ตั้งค่า GitHub</h3>
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
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          {loading ? 'กำลังโหลด...' : 'โหลดข้อมูล'}
        </button>
        {(loading || saving) && <span className="text-sm text-slate-500 dark:text-slate-400">กำลังทำงาน...</span>}
      </div>

      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">โหลดล้มเหลว: {error}</p>}
      {saveError && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">บันทึกล้มเหลว: {saveError}</p>}
    </div>
  )
}
