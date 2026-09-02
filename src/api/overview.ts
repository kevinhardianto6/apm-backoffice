import { apiFetch } from './client'
import type { OverviewResponse } from './types'

export async function fetchOverview(
  appId: string,
  opts: { days: number; realUsersOnly: boolean },
): Promise<OverviewResponse> {
  const params = new URLSearchParams({
    days: String(opts.days),
    real_users_only: String(opts.realUsersOnly),
  })
  return apiFetch<OverviewResponse>(`/v1/apps/${appId}/overview?${params}`)
}
