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

// 01 §5.
export type FailureCategory =
  | 'ssl_certificate'
  | 'ssl_pinning_rejected'
  | 'tls_handshake'
  | 'timeout'
  | 'dns'
  | 'connectivity'
  | 'cancelled'
  | 'http_error'
  | 'unknown'

export interface NetworkHost {
  host: string
  requests: number
  p50: number | null
  p95: number | null
  p99: number | null
  failure_rate: number
  failures_by_category: Partial<Record<FailureCategory, number>>
}

export interface NetworkDrilldownPoint {
  /** Minute bucket, `ts_server` truncated to 16 chars (YYYY-MM-DDTHH:MM). */
  t: string
  failures: number
}

// 01 §10 "Blok drilldown pada endpoint network". `all_active_versions_affected` is what
// turns FE-11's "likely cause" callout from a claim into an evidenced conclusion: a spike
// across every active version at once can't come from a new release, so it points at a
// server-side change (cert rotation against a pinning client); confined to specific
// versions instead points at a regression in those versions.
export interface NetworkDrilldown {
  host: string
  failure_category: string | null
  failures: number
  users_affected: number
  started: string | null
  last_seen: string | null
  peak: NetworkDrilldownPoint | null
  app_versions: BreakdownItem[]
  platforms: BreakdownItem[]
  os_versions: BreakdownItem[]
  affected_version_count: number
  active_version_count: number
  all_active_versions_affected: boolean
  series: NetworkDrilldownPoint[]
}

export interface NetworkResponse {
  app_id: string
  window_days: number
  hosts: NetworkHost[]
  // Only present when the request includes `host` (readapi.py's network()).
  drilldown?: NetworkDrilldown
}

export type SessionOutcome = 'crashed' | 'errors' | 'clean'

// 01 §4.5.1 / §10. Breadcrumbs live in a device-side ring buffer and ride along ONLY on a
// crash/error event — a clean session has none of these BY DESIGN (sending them for every
// session would multiply upload volume with nothing to diagnose), not missing data.
// `timeline` is built from actually-stored events and exists for every session — it's the
// real activity record, not a stand-in for breadcrumbs on clean sessions.
export interface SessionTimelineEntry {
  t: string
  type: string
  label: string
  detail: string
}

export interface UserSession {
  session_id: string
  events: number
  first_seen: string
  last_seen: string
  outcome: SessionOutcome
  crashes: number
  errors: number
  network_failures: number
  breadcrumbs: Breadcrumb[]
  breadcrumbs_available: boolean
  timeline: SessionTimelineEntry[]
}

// 01 §10 / BE-23. `user_ref` is the only identifier this app ever handles — the raw
// phone/email typed into search is resolved server-side and never stored, never put in
// this app's URLs (that would defeat the point via browser history), never logged.
export interface UserDetail {
  user_ref: string
  pseudonymous: true
  sessions_count: number
  device: {
    model: string | null
    os: string | null
    os_version: string | null
    app_version: string | null
    app_build: string | null
  }
  integrity: {
    is_emulator: boolean
    is_rooted: boolean
    is_dev_mode: boolean
  }
  sessions: UserSession[]
}

// 01 §2.2/§2.3, 04 §3.8. Every block carries `available` — the frontend must never show
// an "all clear" for a condition it can't actually answer yet (an absent warning only
// means something if its presence would have been possible). When `available` is false,
// render nothing/muted for that condition instead of a fake healthy status; `reason`
// explains why when present.
export interface UserIdSourceInfo {
  available: boolean
  host_sessions: number
  generated_sessions: number
  unknown_sessions: number
  generated_pct: number | null
  reason?: string
}

export interface SdkHealthInfo {
  available: boolean
  installs_reporting: number
  written: number
  sent: number
  dropped: number
  dropped_pct: number | null
  drop_reasons: Record<string, number>
  reason?: string
}

export interface SdkVersionInfo {
  sdk_name: string
  version: string | null
  sessions: number
  /** `null` means the server has no registry entry for this SDK — not the same as "this is the latest". */
  latest_known: string | null
  /** `null` (not `false`) when `latest_known` is null — unknown, not up to date. */
  is_outdated: boolean | null
}

export interface SymbolicationInfo {
  available: boolean
  reason?: string
}

export interface IntegrationResponse {
  app_id: string
  window_days: number
  user_id_source: UserIdSourceInfo
  sdk_health: SdkHealthInfo
  sdk_versions: SdkVersionInfo[]
  symbolication: SymbolicationInfo
}
