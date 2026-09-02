import { ApiError, apiFetch } from './client'
import type { UserDetail } from './types'

// BE-23. The raw identifier is sent once, over TLS, to be hashed server-side and
// discarded — never stored, never echoed back except as the opaque user_ref.
export async function resolveUser(appId: string, identifier: string): Promise<{ user_ref: string }> {
  return apiFetch(`/v1/apps/${appId}/users/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  })
}

export async function fetchUserDetail(
  appId: string,
  userRef: string,
  days = 30,
): Promise<UserDetail | null> {
  try {
    return await apiFetch<UserDetail>(`/v1/apps/${appId}/users/${userRef}?days=${days}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}
