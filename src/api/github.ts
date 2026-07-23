import type { BudgetData } from '../types/budget'
import { BUDGET_FILE_PATH } from '../constants'

export interface GitHubConfig {
  owner: string
  repo: string
  token: string
}

const API_BASE = 'https://api.github.com'
const FILE_PATH = BUDGET_FILE_PATH

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join('')
  return btoa(binString)
}

function base64ToUtf8(base64: string): string {
  const binString = atob(base64)
  const bytes = Uint8Array.from(binString, (c) => c.codePointAt(0)!)
  return new TextDecoder().decode(bytes)
}

export async function fetchBudgetFile(
  config: GitHubConfig,
): Promise<{ data: BudgetData; sha: string } | { error: string }> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  } catch {
    return { error: 'Network error: ไม่สามารถเชื่อมต่อ GitHub ได้' }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    return { error: body.message || `Failed to fetch file: ${response.status}` }
  }

  try {
    const content = await response.json()
    const decoded = JSON.parse(base64ToUtf8(content.content))
    return { data: decoded as BudgetData, sha: content.sha }
  } catch {
    return { error: 'ข้อมูล budget.json ไม่ถูกต้อง' }
  }
}

export async function saveBudgetFile(
  config: GitHubConfig,
  data: BudgetData,
  sha: string,
): Promise<{ success: true; newSha: string } | { error: string; status?: number }> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update budget via MonthlySpent',
        content: utf8ToBase64(JSON.stringify(data, null, 2)),
        sha,
      }),
    })
  } catch {
    return { error: 'Network error: ไม่สามารถเชื่อมต่อ GitHub ได้' }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    return { error: body.message || `Failed to save file: ${response.status}`, status: response.status }
  }

  const result = await response.json()
  return { success: true, newSha: result.content.sha as string }
}
