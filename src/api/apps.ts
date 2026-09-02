import { apiFetch } from './client'
import type { App } from './types'

export async function fetchApps(): Promise<App[]> {
  const data = await apiFetch<{ apps: App[] }>('/v1/apps')
  return data.apps
}
