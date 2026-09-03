# Epic · APM Kit Backoffice v1

**Status:** ✅ done · closed 2026-09-02 · **Depends on:** —

**PRD:** `docs/00-Overview.md`, `docs/01-Kontrak-Data-API.md` §10, `docs/04-Frontend-Website.md` · **Prefix:** `feat-`
**Started:** 2026-09-02 · **Started by:** Kevin Hardianto

Build order is fixed — one feature active at a time, stop for review after each. Only P0
requirements from `docs/04-Frontend-Website.md` §3 are in scope through feat-006 (FE-18
ended up built too, as a small addition once feat-006 was otherwise done); other P1/P2 items
(FE-12/13/14/16/20, alerts, admin, RBAC, SSO) and the un-mocked sidebar sections
(Performance, Releases, Devices, Alerts & SLOs, Symbol files) are explicitly deferred — shown
disabled in the sidebar (2026-09-02 decision, see below), not built.

**FE-12 (release comparison) and FE-13 (alerting UI) deliberately held back, 2026-09-02** —
not just deferred by the original scope cut, actively declined when offered: FE-12 needs
multiple releases in the real data to compare against each other (the pilot only has one),
and FE-13's alert evaluator is backend work (BE-17, Phase 3) that doesn't exist — building
the UI now would be a form that submits to nothing. Don't pick either up without checking
whether that's changed.

| ID | Feature | Status | By | Depends on | Evidence |
|----|---------|:------:|----|------------|----------|
| feat-001 | Shell + data layer | ✅ | Kevin Hardianto | — | See below |
| feat-002 | Overview (FE-01/02) | ✅ | Kevin Hardianto | feat-001 | See below |
| feat-003 | Issues list + Issue Detail (FE-03/04/05/06/06b/06c/07/08/09/23) | ✅ | Kevin Hardianto | feat-002 | See below |
| feat-004 | Network Explorer (FE-10/11) | ✅ | Kevin Hardianto | feat-001 | See below |
| feat-005 | User Lookup (FE-21/23) | ✅ | Kevin Hardianto | feat-001 | See below |
| feat-006 | Polish — empty states, integration warnings, filters, shareable URLs, copy-as-markdown (FE-18/19/22, §3.8) | ✅ | Kevin Hardianto | feat-002, feat-003, feat-004, feat-005 | See below |

### feat-001 · Shell + data layer

- **Status:** ✅ done · **Depends on:** —
- **Done when:** App list loads from the real pilot server. App switcher, sidebar nav (built
  sections live, unbuilt ones disabled per the 2026-09-02 decision), typed API client with
  `X-APM-Read-Token` auth, env config (no hardcoded URL/token), loading/error states, and the
  footer status strip (ingest health + last event from real endpoints; symbols-pending shown
  as "not yet available" text, not a fabricated count — no symbol-upload data exists yet) all
  work.

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` passes | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` |
| ✅ | `./verify.sh lint` passes | Kevin Hardianto | `HARNESS_VERIFY: PASS (lint)` |
| ✅ | App list renders from `GET /v1/apps` against the running pilot server | Kevin Hardianto | Verified in-browser at `localhost:5173` — `com.company.merchant` shown with real sessions/events/last-seen after seeding the pilot server with `send-test-data.py` |
| ✅ | Read token sent via `X-APM-Read-Token`; app key never used here (SEC-16) | Kevin Hardianto | `src/api/client.ts` — no other header/key used against `/v1/*` |

**Decisions**
- 2026-09-02 · Vite/React/TS app scaffolded at repo root (not a nested subfolder) — this repo
  has no other deliverable.
- 2026-09-02 · TanStack Query added (beyond the user's minimal-deps ask) for loading/error/cache
  state across every screen — the alternative is re-implementing that by hand in every hook.
- 2026-09-02 · Full Issues Explorer (FE-03/04/05) folded into feat-003, built before Issue
  Detail — it's the entry point to the detail view, and both are P0.
- 2026-09-02 · Unbuilt sidebar sections rendered disabled (dimmed, non-clickable, "Not available
  yet" tooltip), matching mockup layout/grouping, instead of omitted.
- 2026-09-02 · Footer "symbols N pending" from the mockup has no backing data (symbolication
  service doesn't exist yet, confirmed in pilot server source and `docs/04` §3.6) — shown as a
  static pending note instead of a fabricated number.
- 2026-09-02 · `GET /v1/apps` (pilot server, `readapi.py`) returns only `{id, events, sessions,
  last_seen}` — no display name or platform field like the mockup's "Merchant App / iOS &
  Android". AppSwitcher shows the raw `app_id` (e.g. `com.company.merchant`) until/unless the
  server grows a registry with friendly names.
  **Superseded same day:** server now returns `name` (config-map stub, falls back to `app_id`
  for unregistered apps — BE-06 Phase 3 will make this a real registry) and `platform` /
  `platforms` (derived from distinct `os` values seen in the data, not configured). AppSwitcher
  updated to use both; `name === id` is treated as the normal unregistered case, not an error.
- 2026-09-02 · Added a dev-only Vite proxy (`vite.config.ts`) for `/v1` and `/health` to the
  pilot server. The pilot's self-signed cert has no click-through path in this session's
  sandboxed preview browser; proxying same-origin sidesteps that entirely (Node-side `secure:
  false` instead of asking the browser to trust the cert). Production build still talks to
  `VITE_APM_API_BASE_URL` directly — real deployment presumably sits behind a valid on-prem
  cert. A real browser can still be pointed at the API directly instead, same as the
  Simulator-trust step in `README-pilot-api.md`.

**Blockers** — none.

### feat-002 · Overview (FE-01/02)

- **Status:** ✅ done · **Depends on:** feat-001
- **Done when:** Metric cards (crash-free sessions/users, error rate, network failure rate,
  total sessions) with trend vs previous period; "Real users only" toggle wired to
  `real_users_only`; excluded-events caption; Top Issues preview table with a link into the
  full Issues list (feat-003).

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` / `lint` pass | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` / `(lint)` |
| ✅ | All 5 metric cards show a trend, never a bare number | Kevin Hardianto | `src/components/overview/MetricCard.tsx` always renders `TrendBadge`; verified in-browser with real data |
| ✅ | "Real users only" toggle wired to `real_users_only`, changes results | Kevin Hardianto | Verified in-browser: unchecking it changed session count 5→6 and surfaced an additional (emulator) issue, URL updated to `?real_users_only=false` |
| ✅ | Top Issues preview is impact-sorted, capped, links to (future) full list | Kevin Hardianto | `TopIssuesPreview.tsx` calls `sort: 'impact', limit: 6`; "View all" links to `/apps/:id/issues` (feat-003 builds that route) |

**Decisions**
- 2026-09-02 · **No sparklines.** `GET /v1/apps/{id}/overview` (checked `readapi.py`) returns
  only scalar `current`/`previous`/`delta` blocks — no daily time series exists anywhere on the
  server. Built the trend badges (real, required by FE-01) without the mockup's sparkline chart
  rather than fabricate one. Flagging: if you want sparklines, the server needs a
  history/timeseries endpoint first.
- 2026-09-02 · **No SLO breach styling.** Mockup highlights cards with an orange border tied to
  an SLO target (e.g. "SLO 99.5% · breached") — no SLO config exists server-side. Substituted:
  a card gets an amber border when its trend is moving the wrong way (bad direction), which
  gives a similar at-a-glance signal without inventing threshold data.
- 2026-09-02 · **Excluded-events caption wording.** Mockup says "Excluding N% emulator/debug
  *sessions*"; the server's `excluded_non_real_events` counts events, not sessions. Captioned it
  as "emulator/debug events" instead of copying mockup wording that doesn't match what's
  actually measured.
- 2026-09-02 · Total Sessions' trend is computed client-side
  (`(current.sessions - previous.sessions) / previous.sessions`) since the `delta` object from
  the API only carries the four rate metrics, not session/user/event count deltas.

**Blockers** — none.

### feat-003 · Issues list + Issue Detail

- **Status:** ✅ done · **Depends on:** feat-002
- **Done when:** `/issues` list — filterable, sortable, URL-reflected filter state — plus Issue
  Detail with breakdowns, environment card, status dropdown, and type-specific display.

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` / `lint` pass | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` / `(lint)` |
| ✅ | Issues list filters (type/status/platform/app version) and sorts (impact/events/recent), URL reflects state | Kevin Hardianto | Verified in-browser: `/apps/:id/issues?...` params all round-trip |
| ✅ | Issue Detail renders real breakdowns/environment for crash, network_failure, error issue types | Kevin Hardianto | Verified in-browser against 3 real seeded issues (one each of crash/network/http_error) |
| ✅ | Status dropdown PATCHes and persists | Kevin Hardianto | Verified in-browser: New→Triaged round-tripped through `PATCH /v1/issues/{id}`, confirmed on refetch |
| ✅ | `error`/`termination` types get FE-06b/FE-06c-specific display, never a crash stack trace | Kevin Hardianto | Verified in-browser 2026-09-02 against real seeded `error` (source_file/function/line) and `termination` (`memory_limit`) issues |

**Decisions**
- 2026-09-02 · **Crash frame schema unconfirmed — flagging, not guessing.** `01 §4.3` says
  `threads` holds "stack frame (address + offset)" but doesn't pin down per-frame field names,
  and no real payload seen yet populates `threads`/`binary_images` at all (the pilot's own
  `send-test-data.py` omits them from its crash events). `StackTrace.tsx` therefore renders
  frames generically (whatever keys exist, as `key=value`) instead of assuming a schema, shows
  a clear "not symbolicated" banner, and degrades to name/reason/crash_type when no frames
  exist at all (today's actual pilot state). **FE-06's app-frame-highlighting is NOT
  implemented** — that needs a documented way to link a frame to `binary_images` to tell app
  code from system frameworks, which isn't specified or exhibited anywhere yet. Needs either a
  real crash payload to design against, or a documented frame schema, before it can be built.
  **Superseded 2026-09-02 (same day, contract updated to v1.4):** `01 §4.3.1/§4.3.2` now
  specifies the frame schema exactly, and app-frame highlighting turns out NOT to need
  symbolication at all — `is_app` is set by the SDK at capture time (it knows its own main
  binary; the frontend deriving this by name-matching would have been fragile). `StackTrace.tsx`
  rewritten: highlights frames where `is_app === true`, dims the rest, shows
  `object_name` + `instruction_addr`, and will show `symbol_name`/`file`/`line` in place of the
  raw address once BE-11 populates them — no redesign needed. Verified against a real 2-thread,
  5-frame payload (mixed `is_app`) via `send-test-data.py`.
- 2026-09-02 · **Breadcrumb entry schema unconfirmed**, same reason — embedded on the sample
  event's attrs (not a separate event stream), no populated example seen. `BreadcrumbTimeline.tsx`
  reads defensively (tries `category`/`message` plus a few plausible timestamp field names,
  falls back to ordinal position) rather than hardcode field names that might not exist.
  **Superseded 2026-09-02 (same day, contract v1.4):** `01 §4.5.1` now documents the exact
  shape — `timestamp`/`category`/`level`/`message`, delivered as a JSON *string* (not a nested
  array) specifically so it inherits SEC-05 scrubbing like any other string attribute; the
  server (`readapi.py`) already decodes it before this app ever sees it. Rewrote
  `BreadcrumbTimeline.tsx` to read the documented fields directly, dropped the ordinal
  fallback, and switched relative-time to use the crash's `sample_event.ts_client` (device
  clock, same source as breadcrumb `timestamp`) rather than `ts_server`, avoiding
  server-latency skew. Verified against a real 7-breadcrumb payload ending in the SSL failure
  that preceded the crash. Observation for whoever next touches `send-test-data.py`: its
  breadcrumb `timestamp`s are hardcoded to a fixed string while the crash event's `ts_client`
  is generated at send-time, so the demo shows breadcrumbs ~52 minutes "before" the crash
  instead of the intended few-seconds lead-in — not a frontend bug, the relative-time math is
  correct against whatever timestamps it's given.
- 2026-09-02 · `platform`/`app_version` filters run client-side against one `limit: 200` fetch
  — `readapi.py`'s `issues()` doesn't accept those as query params (only `type`, `status`,
  `sort`, `days`, `real_users_only`, `limit`). Fine at pilot scale; would need server-side
  support to hold up at real volume.
- 2026-09-02 · `/v1/issues/{id}` ignores `real_users_only` server-side (`readapi.py` hardcodes
  `real_only=False` there) — only `days` (default 30) is actually honored. Not worked around
  client-side; documented in `api/issueDetail.ts`.

**Blockers** — none.

### feat-004 · Network Explorer (FE-10/11)

- **Status:** ✅ done · **Depends on:** feat-001
- **Done when:** Host table with p50/p95/p99 and failure rate; drill-down by
  `failure_category` with a dedicated SSL/pinning view (time series + guidance callout).

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` / `lint` pass | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` / `(lint)` |
| ✅ | Host table shows real p50/p95/p99/failure_rate, sorted by failure rate | Kevin Hardianto | Verified in-browser against 3 real seeded hosts |
| ✅ | Drill-down by host → category → real time-series chart | Kevin Hardianto | Verified in-browser: `api.merchant.com` → `ssl_pinning_rejected` renders the real 1-point series from `drilldown.series` |
| ✅ | Dedicated SSL/pinning guidance shown for `ssl_certificate`/`ssl_pinning_rejected`, evidenced (not asserted) via `all_active_versions_affected` | Kevin Hardianto | Verified in-browser against real data: 1 of 1 active version, `true` branch rendered with real users_affected/started/platforms |

**Decisions**
- 2026-09-02 · **No per-host 24h-trend sparkline.** Same root cause as Overview's missing
  sparklines — `network()` (checked `readapi.py`) returns only whole-window aggregates per
  host, no bucketed history series outside a specific host+category drilldown.
- 2026-09-02 · **FE-11's Key Facts panel (users affected, app-version/OS spread, first-seen)
  is NOT built — flagging, not fabricating.** The mockup and FE-11's own text call for these
  specifically for SSL/pinning drill-downs, but `network()` aggregates only
  requests/latency/failure-category counts per host — nothing per-user or per-version, unlike
  `issues()` which already returns exactly that shape for issues. `SslGuidanceCallout.tsx`
  shows the general diagnostic heuristic (real, from FE-11's own text) plus the real
  peak-failures/when stat from the chart, and says outright what's missing instead of
  inventing a user count or version spread. Would need `network()` extended with a per-user /
  per-version breakdown (mirroring `issues()`'s `breakdowns`) to close this properly.
  **Superseded 2026-09-02 (same day, `network()` extended):** `drilldown` now returns
  `users_affected`, `started`, `last_seen`, `peak`, `app_versions`/`platforms`/`os_versions`
  breakdowns, `affected_version_count`/`active_version_count`, and
  `all_active_versions_affected`. `SslGuidanceCallout.tsx` rewritten to show the Key Facts row
  (users affected, started, version/platform spread — all real) and branch on
  `all_active_versions_affected`: `true` shows the server-side-certificate explanation with
  "N of N active versions affected" as the stated evidence; `false` states plainly that
  failures are concentrated in specific versions (named) and does NOT show the cert-rotation
  claim, since the evidence wouldn't support it. Verified live against real seeded data (1 of
  1 active version, `true` branch); the `false` branch was verified by code review only — the
  seed script produces just one app version, so there was no real payload to exercise it live.
  `FailureTimeSeries.tsx` also switched to the server's `peak` instead of computing its own.
- 2026-09-02 · Mockup's "1 active alert" badge and "Open incident" action omitted entirely —
  alerts (`GET/POST /v1/apps/{id}/alerts`) are out of scope for this epic (§00 Fase 3 backlog
  item, not in the BO-1..6 build order), and there's no data or feature to back either one.
- 2026-09-02 · Day range limited to 24h/7d (no 30d) to match the mockup's own toggle for this
  screen specifically — Overview and Issues offer 30d, Network does not.

**Blockers** — none.

### feat-005 · User Lookup (FE-21/23)

- **Status:** ✅ done · **Depends on:** feat-001
- **Done when:** Search accepts a raw identifier (resolved via `POST .../users/resolve`) or a
  `user_ref` directly; "no PII stored" badge; device-integrity chips; session timeline with
  outcome badges.

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` / `lint` pass | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` / `(lint)` |
| ✅ | Raw identifier search resolves via `POST .../users/resolve`, never stores/URLs the raw value | Kevin Hardianto | Verified in-browser + network tab: searching `0812345678` fires `POST resolve` then `GET .../usr_515736ec05fa`; URL after search is `?ref=usr_515736ec05fa` only |
| ✅ | Pasting a `user_ref` directly skips resolve entirely | Kevin Hardianto | Verified in-browser + network tab: `usr_deadbeef0000` fires only the `GET` (404), no `POST resolve` call |
| ✅ | "no PII stored" badge, device-integrity chips, session timeline with outcome badges | Kevin Hardianto | Verified in-browser against real 8-session user: clean/errors/crashed badges all rendered correctly |
| ✅ | Honest "not found" state, not a crash, for an unknown `user_ref` | Kevin Hardianto | Verified in-browser: `usr_deadbeef0000` → "No data for usr_deadbeef0000 in the last 30 days." |
| ✅ | Session expands to breadcrumb trail where `breadcrumbs_available`, event timeline otherwise; no breadcrumb count shown on sessions without them | Kevin Hardianto | Verified in-browser against real data: 2 of 8 sessions (crash + error, both from the realistic-payload events) show "7 breadcrumbs" and expand to the black-box trail; the SIGSEGV-crash and network-failure-only sessions correctly show 0 and expand to their event timeline instead |

**Decisions**
- 2026-09-02 · **Raw identifier never touches this app's URL or persisted state.** Deliberate
  and stricter than strictly required: `UserSearchBox` keeps the typed value in transient
  component state only; the URL (and thus browser history, and anything that reads
  `window.location`) only ever carries the resolved, opaque `user_ref` via `?ref=`. A raw
  phone/email in the address bar would quietly undermine the "no PII stored" claim even
  though the server itself never stores it.
- 2026-09-02 · **Per-session breadcrumbs (FE-21) NOT built — flagging, not fabricating.**
  `user_detail()` (checked `readapi.py`) returns only `outcome`/`crashes`/`errors`/
  `network_failures` per session — no breadcrumb data. Breadcrumbs only exist today attached
  to a specific issue's sample event (`GET /v1/issues/{id}`), not addressable per arbitrary
  session. Would need `user_detail()` extended to attach a breadcrumb snapshot per session
  (mirroring how `issue_detail()` already does it for one sample event) to close this.
  **Superseded 2026-09-02 (same day, `user_detail()` extended, with a correction to the
  mockup):** sessions now carry `breadcrumbs[]`, `breadcrumbs_available`, and `timeline[]`
  (real stored events — network/crash/error/termination — for every session). Correction:
  breadcrumbs only exist for sessions with a crash or error — they live in a device-side
  ring buffer and only ride along on a failing event (01 §4.5.1); a clean session has none
  **by design**, not missing data. The mockup's "14 breadcrumbs · order completed" on a
  clean session isn't achievable without changing the SDK, so it was not built toward.
  `SessionTimeline.tsx` gates on `breadcrumbs_available` (not `outcome` — an "errors" session
  from a `network_failure` alone has no breadcrumb snapshot either, only crash/error events
  carry one): expands to the breadcrumb trail (reusing Issue Detail's `BreadcrumbTimeline`
  component) where available, the real event timeline otherwise, and shows no breadcrumb
  count on sessions without them. Verified against real data: the realistic crash/error
  sessions return 7 breadcrumbs each; the synthetic SIGSEGV crash and network-failure-only
  sessions return 0 and fall back to their event timeline correctly.
  One approximation, noted for accuracy: `BreadcrumbTimeline`'s relative-offset reference
  uses the session's `last_seen` (server clock, `ts_server`) rather than the crash/error
  event's own `ts_client` (device clock) — `user_detail()` doesn't expose a per-session
  `ts_client`, only `first_seen`/`last_seen` in server time. Issue Detail's version of this
  component has the exact device-clock reference available and uses it; this one doesn't,
  so there's a theoretical server-latency skew here that Issue Detail's doesn't have.
- 2026-09-02 · `user_ref` detection uses the exact format the server generates
  (`^usr_[0-9a-f]{12}$`, checked `user_ref_from()` in `ingest.py`) to decide resolve-or-not,
  rather than guessing a looser pattern.

**Blockers** — none.

### feat-006 · Polish

- **Status:** ✅ done · **Depends on:** feat-002, feat-003, feat-004, feat-005
- **Done when:** Honest empty states everywhere (no problems vs no data arriving, clearly
  distinct); integration warnings from `docs/04` §3.8 (no `user_id`, symbols not uploaded, SDK
  event drops, stale SDK version); every issue view and filter combination has a shareable URL.

| ✓ | Check | By | Proof |
|:-:|-------|----|-------|
| ✅ | `./verify.sh build` / `lint` pass | Kevin Hardianto | `HARNESS_VERIFY: PASS (build)` / `(lint)` |
| ✅ | Overview never shows misleadingly-"healthy" 100%/0% cards for a zero-session window | Kevin Hardianto | Verified in-browser (fetch mocked to a real zero-session `overview()` response, both the plain-zero and filtered-to-zero cases) — metric cards replaced by an explicit amber notice in both cases |
| ✅ | Sidebar footer's "last event" is a live staleness signal, not just a timestamp | Kevin Hardianto | `eventStaleness()` + color-coding in `StatusFooter.tsx`; verified in-browser (green when fresh) |
| ✅ | "Real users only" toggle present everywhere FE-22 names (Overview, Issues, Network) | Kevin Hardianto | Added to Issues/Network (were URL-readable but had no UI control — a real gap); verified in-browser on both: toggling reveals/hides the emulator-only crash and events |
| ✅ | Issues list distinguishes "filtered too narrow" from "clean/no data" (FE-19) | Kevin Hardianto | Code review — `data.count > 0` vs `=== 0` branch, mirroring the pattern already verified live in `TopIssuesPreview` |
| ✅ | §3.8 integration warnings: user coverage + SDK health, each with a genuine 3rd "unavailable" state (never a fake all-clear) | Kevin Hardianto | Verified in-browser against real data: "user coverage" green (0% unlinkable), "SDK health" amber (1.55% dropped > 1% threshold), "SDK version" green (up to date) — all real numbers from `GET /v1/apps/:id/integration`. The `available:false` muted branch is structurally identical to the already-live-verified "symbolication: not yet available" row; not re-exercised live this round (see decision below) |
| ✅ | FE-18 copy issue as markdown | Kevin Hardianto | Verified in-browser: button click invokes `navigator.clipboard.writeText`; this session's sandboxed preview browser denies clipboard permission (`NotAllowedError`), surfaced as "Copy failed" via the added try/catch rather than silently doing nothing — a real browser grants this from a user gesture |

**Decisions**
- 2026-09-02 · **The empty-state work centers on Overview, not just copy tweaks.**
  `overview()` (readapi.py) defaults `crash_free_sessions`/`crash_free_users` to `100.0` and
  every rate to `0.0` when `sessions === 0` — confirmed via a direct call against an app with
  zero events: `{"crash_free_sessions": 100.0, "crash_free_users": 100.0, "error_rate": 0.0,
  "network_failure_rate": 0.0, "sessions": 0}`. Left as-is, this is the single most dangerous
  case docs/04 §4 warns about: it doesn't render as an empty screen, it renders as a
  reassuring, fully-green dashboard. `Overview.tsx` now checks `sessions === 0` explicitly and
  replaces the metric cards with an amber notice instead of letting the defaults imply health,
  distinguishing "all sessions in this window were filtered out by Real users only" (data
  exists) from "nothing arrived at all" (points at the footer's last-event signal).
- 2026-09-02 · **The sidebar footer is the cross-screen mechanism, made active rather than
  passive.** It already showed "last event" (built in feat-001), but as a neutral-colored
  timestamp — reading it as a signal required the viewer to already know to distrust an old
  value. `eventStaleness()` (`src/lib/time.ts`) now classifies it fresh (<1h, green) / stale
  (<24h, amber) / very-stale or never (red), so a suspicious value is visually flagged without
  requiring interpretation. Thresholds are a judgment call — no event-delivery SLA is
  documented; pilot apps upload every `upload_interval_s` (30s default, `01` §9) plus normal
  network delay, so 1h gives generous headroom before treating a gap as suspicious.
- 2026-09-02 · **§3.8 integration warnings NOT built — all four conditions checked against
  the Read API and none are answerable with current data, not a scope cut:**
  - *Sessions without `setUser`* — `user_id` is never actually absent (the SDK generates a
    stable per-install ID when the host app doesn't call `setUser`, `01` §2), so there is no
    stored signal distinguishing "developer-supplied" from "SDK-generated" identifiers at all.
    Nothing to query.
  - *Symbols not uploaded* — same gap flagged since feat-003: no symbolication service, no
    symbol-upload table, exists anywhere yet.
  - *SDK-reported dropped events* — would require a client-reported metric that isn't part of
    the event schema (`01` §4) at all; nothing to receive or query.
  - *Stale SDK version* — closest to buildable: `sdk_version` **is** stored per event
    (checked `ingest.py`'s schema), but no Read API endpoint returns it, and there's no
    "latest published SDK version" authority anywhere to compare against even if it were
    exposed. Would need both a `network`/`overview`-style aggregation added to the Read API
    and a place to configure "current" version.
  All four would need real, named server/schema work, not frontend guesswork — flagging
  precisely rather than shipping fabricated warning banners that always say "all clear."
  **Superseded 2026-09-02 (same day, contract updated, two of four turned out to be SDK gaps
  rather than missing endpoints):** `01 §2.2` adds `user_id_source` (`host` | `generated`) to
  the envelope — the SDK always fills `user_id`, so "developer forgot `setUser`" and "SDK
  auto-generated" were genuinely indistinguishable before this field existed, not just
  unqueried. `01 §2.3` adds `sdk.health` (`written`/`sent`/`dropped`/`drop_reasons`),
  cumulative per install — MOB-27's counters existed on-device but never left it, which
  defeats the point (the moment they matter is exactly when nobody's watching the device).
  `apm-ingest` extended to match: `events.user_id_source` column, a new `sdk_health` table
  keyed on `install_id` (cumulative counters get upserted, not summed across reports — summing
  would double-count), and `GET /v1/apps/{id}/integration` aggregating both plus
  `sdk_versions[]` (against a small `LATEST_SDK_VERSIONS` registry) and a `symbolication`
  block. **Every block carries `available`** — this is the mechanism for the addition to `04
  §3.8`: "don't show an all-clear for a condition that can't be answered yet, since an absent
  warning only means something if its presence would have been possible." Built: `user coverage`
  and `SDK health` status lines in the sidebar footer (alongside the existing ingest/
  symbolication/last-event lines), each rendering one of three genuinely distinct states —
  unavailable (muted), healthy (green), or warning (amber) — never collapsed to two. Verified
  live: 0% unlinkable (healthy), 1.55% dropped (correctly flagged, >1% threshold), one SDK
  version, up to date. **Stale SDK version** stays unbuilt here — the user is adding the
  "latest version" registry server-side; the frontend's `SDK version` line already reads
  `sdk_versions[].is_outdated` (`null` when `latest_known` is unset — explicitly not treated
  as "up to date" per the `04` addition) and needs no further changes once real outdated data
  exists. **Symbols not uploaded** stays Phase 3 as before — `symbolication.available` is
  `false` from the server itself now, not just absent from this app.
  Thresholds for "warning" (generated sessions >50%, dropped events >1%) are judgment calls —
  neither `01` nor `04` names a number, consistent with `eventStaleness()`'s thresholds
  earlier in this file.
- 2026-09-02 · **Shareable-URL audit** (docs/04 §4): Overview (`days`, `real_users_only`),
  Issues (`days`, `real_users_only`, `type`, `status`, `platform`, `app_version`, `sort`),
  Network (`days`, `real_users_only`, `host`, `failure_category`), Issue Detail (the path
  itself), User Lookup (`ref` — deliberately excludes the raw searched identifier, see
  feat-005) all reflect their full filter state in the URL. No gaps found beyond the two
  toggles added above.

**Blockers** — none.
