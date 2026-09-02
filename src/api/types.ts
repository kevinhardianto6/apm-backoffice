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

export interface BreakdownItem {
  label: string
  count: number
  pct: number
}

// 01 §4.3.1. `is_app` is set by the SDK at capture time — it knows its own main binary;
// deriving this in the frontend by name-matching would be fragile. `symbol_name`/`file`/
// `line` are null until BE-11's symbolication runs; render whichever is present.
export interface StackFrame {
  index: number
  object_name: string
  object_addr: string
  instruction_addr: string
  is_app: boolean
  symbol_name: string | null
  file: string | null
  line: number | null
}

export interface Thread {
  index: number
  crashed: boolean
  name: string
  frames: StackFrame[]
}

// 01 §4.3.2. `uuid` matches this binary to the correct symbol file (dSYM/mapping).
export interface BinaryImage {
  name: string
  uuid: string
  base_addr: string
  size: number
  arch: string
  is_app: boolean
}

// 01 §4.5.1. Already decoded from its wire form (a JSON string, so it inherits the same
// SEC-05 scrubbing pass as any other string attribute) by the server before it reaches
// this response — readapi.py's issue_detail() does the json.loads.
export interface Breadcrumb {
  timestamp: string
  category: 'navigation' | 'user_action' | 'network' | 'lifecycle' | 'state' | 'log'
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
}

export interface SampleEvent {
  event_id: string
  ts_server: string
  ts_client: string
  session_id: string
  user_ref: string | null
  // Shape varies by issue type (§4.3/4.4/4.7) — crash-specific fields (threads,
  // binary_images) are typed above and read via `attrs.threads as Thread[] | undefined`
  // at the call site, since attrs is a untyped bag shared across all issue types.
  attrs: Record<string, unknown>
  ctx: Record<string, unknown>
}

export interface IssueDetail extends Issue {
  app_id: string
  breakdowns: {
    devices: BreakdownItem[]
    os_versions: BreakdownItem[]
    app_versions: BreakdownItem[]
  }
  sample_event: SampleEvent
  breadcrumbs: Breadcrumb[]
}
