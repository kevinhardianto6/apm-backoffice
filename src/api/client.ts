import { env } from '../config/env'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.status = status
    this.body = body
  }
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

// Health is unauthenticated (no read token required) and lives outside /v1.
export async function fetchHealth(): Promise<import('./types').Health> {
  const res = await fetch(`${env.apiBaseUrl}/health`)
  if (!res.ok) throw new ApiError(res.status, await safeJson(res))
  return res.json()
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'X-APM-Read-Token': env.readToken,
      ...init?.headers,
    },
  })
  if (!res.ok) throw new ApiError(res.status, await safeJson(res))
  return res.json()
}
