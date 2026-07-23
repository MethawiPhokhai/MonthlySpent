import type { GitHubConfig } from '../api/github'

interface SettingsPanelProps {
  config: GitHubConfig
  onChange: (config: GitHubConfig) => void
  onLoad: () => void
  loading: boolean
  error: string | null
  saveError: string | null
  saving: boolean
}

export function SettingsPanel({
  config,
  onChange,
  onLoad,
  loading,
  error,
  saveError,
  saving,
}: SettingsPanelProps) {
  function updateField<K extends keyof GitHubConfig>(field: K, value: GitHubConfig[K]) {
    onChange({ ...config, [field]: value })
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-slate-600">ตั้งค่า GitHub</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="gh-owner" className="block text-xs font-medium text-slate-500">
            Owner
          </label>
          <input
            id="gh-owner"
            type="text"
            value={config.owner}
            onChange={(e) => updateField('owner', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="gh-repo" className="block text-xs font-medium text-slate-500">
            Repo
          </label>
          <input
            id="gh-repo"
            type="text"
            value={config.repo}
            onChange={(e) => updateField('repo', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gh-token" className="block text-xs font-medium text-slate-500">
            Personal Access Token
          </label>
          <input
            id="gh-token"
            type="password"
            value={config.token}
            onChange={(e) => updateField('token', e.target.value)}
            placeholder="ghp_..."
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onLoad}
          disabled={!config.owner || !config.repo || !config.token || loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'กำลังโหลด...' : 'โหลดข้อมูล'}
        </button>
        {(loading || saving) && <span className="text-sm text-slate-500">กำลังทำงาน...</span>}
      </div>

      {error && <p className="mt-2 text-sm text-rose-600">โหลดล้มเหลว: {error}</p>}
      {saveError && <p className="mt-2 text-sm text-rose-600">บันทึกล้มเหลว: {saveError}</p>}
    </div>
  )
}
