import { apiFetch } from './client'
import type { IssuesResponse } from './types'

export async function fetchIssues(
  appId: string,
  opts: {
    days: number
    realUsersOnly: boolean
    sort?: 'impact' | 'events' | 'recent'
    limit?: number
  },
): Promise<IssuesResponse> {
  const params = new URLSearchParams({
    days: String(opts.days),
    real_users_only: String(opts.realUsersOnly),
    sort: opts.sort ?? 'impact',
    limit: String(opts.limit ?? 50),
  })
  return apiFetch<IssuesResponse>(`/v1/apps/${appId}/issues?${params}`)
}
