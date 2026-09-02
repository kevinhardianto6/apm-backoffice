import { apiFetch } from './client'
import type { NetworkResponse } from './types'

export async function fetchNetwork(
  appId: string,
  opts: { days: number; realUsersOnly: boolean; host?: string; failureCategory?: string },
): Promise<NetworkResponse> {
  const params = new URLSearchParams({
    days: String(opts.days),
    real_users_only: String(opts.realUsersOnly),
  })
  if (opts.host) params.set('host', opts.host)
  if (opts.failureCategory) params.set('failure_category', opts.failureCategory)
  return apiFetch<NetworkResponse>(`/v1/apps/${appId}/network?${params}`)
}
