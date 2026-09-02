# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-002 · Overview (FE-01/02) — ✅ done, stopped for review per build order.
- **Status:** 🟠 awaiting user review before starting feat-003.
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser: metric cards,
  trend badges, Real-users-only toggle (session count + issue list actually change), day-range
  selector, Top Issues preview all work against the real pilot server.

## Next step

Waiting on user review of feat-002 before starting feat-003 (Issues list + Issue Detail,
FE-03/04/05/06/06b/06c/07/08/09/23 — the biggest feature, per the 2026-09-02 decision to fold
the full Issues Explorer in before Issue Detail). Before writing UI: read `readapi.py`'s
`issue_detail()` for the exact response shape (stack frames, breadcrumbs, sample event,
breakdowns) the same way `/v1/apps` and `overview()` were checked in this session — don't
assume it matches `01 §10`'s described shape without confirming against source.

Known gaps to carry forward, not re-litigate:
- No time-series endpoint exists (no sparklines anywhere in this app yet).
- No SLO config exists (no breach-styling anywhere in this app yet).
- `app.name`/`app.platform` are real now (pilot server updated 2026-09-02); `types.ts` already
  reflects this.

Pilot server is running in the background (`ingest.py` in `/Users/kevinhardianto/APM/apm-ingest`)
seeded via `send-test-data.py` — restart it (same dir, `APM_CORS_ORIGINS='http://localhost:5173'
python3 ingest.py`) if the session's background process died.

## Parked

- None.

## In flight elsewhere

- None.

## Blockers

- None.

## Changes (this session)

| File | Change | Why |
|------|--------|-----|
| Vite/React/TS scaffold (package.json, vite.config.ts, tsconfig*, index.html, .gitignore, .oxlintrc.json) | Added | BO-1 shell |
| src/api/{client,apps,overview,issues,types}.ts | Added | Typed Read API client + endpoints used so far |
| src/hooks/{useApps,useHealth,useOverview,useIssues}.ts | Added | TanStack Query wrappers |
| src/components/layout/{Sidebar,AppSwitcher,StatusFooter,navConfig}.tsx | Added | Shell chrome |
| src/components/common/{Loading,ErrorState,RelativeTime,TrendBadge,StatusBadge,IssueTypeBadge}.tsx | Added | Shared UI |
| src/components/overview/{MetricCard,RealUsersToggle,TopIssuesPreview}.tsx | Added | BO-2 Overview |
| src/routes/{RootRedirect,Shell,Overview}.tsx, App.tsx, main.tsx | Added | Routing + wiring |
| src/config/env.ts, .env.example, .env.local | Added | Base URL/token, dev vs prod split |
| vite.config.ts | Added dev-only proxy | Sandboxed preview browser can't trust pilot's self-signed cert |
| verify.sh | Wired real `npm run build`/`lint` | Was a TODO stub |
| FEATURES.md, AGENTS.md, this file | Updated | Real epic/feature backlog, decisions, evidence |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
