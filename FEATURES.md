# Features

> Scope backbone, grouped by epic (one epic = one PRD = one ID prefix).
> Status: 🟡 not started · 🔵 in progress · ✅ done · 🔴 blocked · 🟠 needs verification
> **One feature is active at a time per person** (see `state/<name>.md`) — the backlog may span epics.
> `By` = who actually did the work, from `git config user.name` on the machine that ran it.
> Completed feature detail → `archive/features/`. Completed *epics* → `archive/epics/`, listed under Shipped.

| Epic | Progress | Active / open |
|------|:--------:|---------------|
| APM Kit Backoffice v1 | 2/6 | feat-003 |

---

## Epic · APM Kit Backoffice v1

**PRD:** `docs/00-Overview.md`, `docs/01-Kontrak-Data-API.md` §10, `docs/04-Frontend-Website.md` · **Prefix:** `feat-`
**Started:** 2026-09-02 · **Started by:** Kevin Hardianto

Build order is fixed — one feature active at a time, stop for review after each. Only P0
requirements from `docs/04-Frontend-Website.md` §3 are in scope through feat-006; P1/P2 items
(FE-12/13/14/16/18/20, alerts, admin, RBAC, SSO) and the un-mocked sidebar sections
(Performance, Releases, Devices, Alerts & SLOs, Symbol files) are explicitly deferred — shown
disabled in the sidebar (2026-09-02 decision, see below), not built.

| ID | Feature | Status | By | Depends on | Evidence |
|----|---------|:------:|----|------------|----------|
| feat-001 | Shell + data layer | ✅ | Kevin Hardianto | — | See below |
| feat-002 | Overview (FE-01/02) | ✅ | Kevin Hardianto | feat-001 | See below |
| feat-003 | Issues list + Issue Detail (FE-03/04/05/06/06b/06c/07/08/09/23) | 🟡 | — | feat-002 | — |
| feat-004 | Network Explorer (FE-10/11) | 🟡 | — | feat-001 | — |
| feat-005 | User Lookup (FE-21/23) | 🟡 | — | feat-001 | — |
| feat-006 | Polish — empty states, integration warnings, filters, shareable URLs (FE-19, §3.8, rest of FE-22) | 🟡 | — | feat-002, feat-003, feat-004, feat-005 | — |

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

- **Status:** 🟡 not started · **Depends on:** feat-002
- **Done when:** `/issues` list — filterable (app version, OS, platform, type, status, time
  range), sortable (impact/events/users/recent), URL-reflected filter state, built on the
  Overview's Top Issues table styling since no dedicated mockup exists — plus Issue Detail:
  stack trace with app-owned frames highlighted / system frames dimmed and a visible
  symbolication-pending note (FE-17 dependency, pre-symbolication per `docs/04` §3.6);
  breadcrumb timeline relative to crash time; device/OS/app-version breakdowns; Environment
  card (FE-23); status dropdown wired to `PATCH /v1/issues/{id}`; `error`-type issues show
  source_file/function/line (FE-06b) instead of a stack trace; `termination`-type issues shown
  with a distinct badge, never folded into crash metrics (FE-06c).

**Blockers** — none.

### feat-004 · Network Explorer (FE-10/11)

- **Status:** 🟡 not started · **Depends on:** feat-001
- **Done when:** Host table with p50/p95/p99 and failure rate; drill-down by
  `failure_category` with a dedicated SSL/pinning view (time series + "likely cause" callout,
  matching the mockup's spike-as-diagnosis framing).

**Blockers** — none.

### feat-005 · User Lookup (FE-21/23)

- **Status:** 🟡 not started · **Depends on:** feat-001
- **Done when:** Search accepts a raw identifier (resolved via `POST .../users/resolve`) or a
  `user_ref` directly; "no PII stored" badge; device-integrity chips; session timeline with
  outcome badges and per-session breadcrumbs.

**Blockers** — none.

### feat-006 · Polish

- **Status:** 🟡 not started · **Depends on:** feat-002, feat-003, feat-004, feat-005
- **Done when:** Honest empty states everywhere (no problems vs no data arriving, clearly
  distinct); integration warnings from `docs/04` §3.8 (no `user_id`, symbols not uploaded, SDK
  event drops, stale SDK version); every issue view and filter combination has a shareable URL.

**Blockers** — none.

---

## Shipped

Completed epics, rotated to `archive/epics/`. One line each.

_None yet._
