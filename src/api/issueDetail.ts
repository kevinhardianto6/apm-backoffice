import { ApiError, apiFetch } from './client'
import type { IssueDetail, IssueStatus } from './types'

// The server ignores real_users_only here (readapi.py hardcodes real_only=False for
// /v1/issues/{id}) — only `days` is actually honored, default 30.
export async function fetchIssueDetail(issueId: string, days = 30): Promise<IssueDetail | null> {
  try {
    return await apiFetch<IssueDetail>(`/v1/issues/${issueId}?days=${days}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

export async function updateIssueStatus(
  issueId: string,
  status: IssueStatus,
): Promise<{ id: string; status: IssueStatus }> {
  return apiFetch(`/v1/issues/${issueId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}
