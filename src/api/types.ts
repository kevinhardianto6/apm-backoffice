// Mirrors the Read API contract in docs/01-Kontrak-Data-API.md §10, as actually
// implemented by the pilot server (readapi.py) — checked against source, not assumed.
// Fields absent from a response must be handled as missing, not assumed present —
// per §11, additive contract changes only add optional fields.

export interface App {
  id: string
  /** Falls back to `id` for unregistered apps (APP_NAMES stub, BE-06 Phase 3) — not an error case. */
  name: string
  /** Derived from distinct `os` values seen in the data, e.g. "iOS & Android". `null` if no events yet. */
  platform: string | null
  platforms: string[]
  events: number
  sessions: number
  last_seen: string | null
}

export interface Health {
  status: 'ok'
  events_stored: number
}

export interface OverviewMetrics {
  crash_free_sessions: number
  crash_free_users: number
  error_rate: number
  network_failure_rate: number
  sessions: number
  users: number
  events: number
}

export interface OverviewResponse {
  app_id: string
  window_days: number
  real_users_only: boolean
  /** Events excluded because they came from emulator/dev-mode sessions (BE-24/FE-22). */
  excluded_non_real_events: number
  current: OverviewMetrics
  previous: OverviewMetrics
  /** Only the four rate metrics — session/user/event count deltas are computed client-side. */
  delta: Pick<
    OverviewMetrics,
    'crash_free_sessions' | 'crash_free_users' | 'error_rate' | 'network_failure_rate'
  >
}

export type IssueType = 'crash' | 'network_failure' | 'error' | 'termination'
export type IssueStatus = 'new' | 'triaged' | 'resolved' | 'ignored'

export interface Issue {
  id: string
  title: string
  type: IssueType
  events: number
  users_affected: number
  sessions_affected: number
  first_seen: string
  last_seen: string
  platforms: string[]
  app_versions: string[]
  status: IssueStatus
  environment: {
    real_device_pct: number
    emulator_pct: number
    rooted_pct: number
    dev_mode_pct: number
  }
}

export interface IssuesResponse {
  app_id: string
  window_days: number
  count: number
  issues: Issue[]
}
