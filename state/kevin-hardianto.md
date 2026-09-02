# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-004 · Network Explorer — ✅ done, stopped for review per build order.
- **Status:** 🟠 awaiting user review before starting feat-005.
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser: host table with
  real p50/p95/p99/failure_rate, host→category drill-down, real time-series chart, SSL
  guidance callout.

## Next step

Waiting on user review of feat-004 before starting feat-005 (User Lookup, FE-21/23). Before
writing UI: read `readapi.py`'s `resolve_user()` and `user_detail()` for exact response shapes
— same verify-against-source habit as every prior feature. Note from feat-003/004: this
project's pattern has been "check readapi.py first, flag real gaps instead of guessing,
propose a concrete default, keep moving" — that's been explicitly praised twice this session
(finding-1/2 process, and the network() gap flag), keep doing it.

Known real gap from feat-004, not blocking, flagged in FEATURES.md: `network()` has no
per-user / per-version breakdown for a host+category drill-down, so FE-11's "users affected,
app version/OS spread" for SSL incidents can't be shown — only the general diagnostic
heuristic and the real failure-count time series. Would need `network()` extended (mirroring
`issues()`'s `breakdowns` shape) to close properly.

Pilot server is running in the background (`ingest.py` in `/Users/kevinhardianto/APM/apm-ingest`,
DB re-seeded 2026-09-02 with the v1.4-contract test data) — restart it (same dir,
`APM_CORS_ORIGINS='http://localhost:5173' python3 ingest.py`, then `python3 send-test-data.py`)
if the session's background process died.

## Parked

- None.

## In flight elsewhere

- None.

## Blockers

- None.

## Changes (this session)

| File | Change | Why |
|------|--------|-----|
| src/api/{network,types}.ts | Added | NetworkHost/NetworkResponse/FailureCategory types + fetch |
| src/hooks/useNetwork.ts | Added | Query hook, used twice per page (overview list + drilldown) |
| src/components/network/*.tsx (HostTable, CategoryChips, FailureTimeSeries, SslGuidanceCallout) | Added | feat-004 building blocks |
| src/routes/Network.tsx | Added | feat-004 page, URL-reflected host/category/days state |
| src/App.tsx, navConfig.ts | Updated | Wired /network route; Sidebar "Network" now live |
| FEATURES.md, this file | Updated | feat-004 evidence + decisions |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
