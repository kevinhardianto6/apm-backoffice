import { apiFetch } from './client'
import type { IntegrationResponse } from './types'

export async function fetchIntegration(appId: string, days = 7): Promise<IntegrationResponse> {
  return apiFetch<IntegrationResponse>(`/v1/apps/${appId}/integration?days=${days}`)
}
