# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-003 rework (frame/breadcrumb schemas, contract v1.4) — ✅ done,
  about to start feat-004.
- **Status:** 🔵 in progress — starting feat-004 (Network Explorer) next, per explicit approval
  to proceed after the rework (no review pause requested for this one).
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser against 3 real
  seeded payloads (realistic crash, error, memory_limit termination) — frame highlighting,
  breadcrumb relative-time, source location, termination notice all correct.

## Next step

Build feat-004 (Network Explorer, FE-10/11). Read `readapi.py`'s `network()` first (same
verify-against-source habit as every prior feature) — note it already defaults `days=1` not 7,
and returns `hosts: [{host, requests, p50, p95, p99, failure_rate, failures_by_category}]`,
plus `drilldown: {host, failure_category, series: [{t, failures}]}` when `?host=` is passed.
That `drilldown.series` is the real time-series data for the SSL spike view — unlike Overview,
this endpoint actually has what's needed, no gap to flag here.

Resolved this session (contract now v1.4, docs/01-Kontrak-Data-API.md):
- Crash frame schema (§4.3.1/§4.3.2) — `StackTrace.tsx` rewritten, highlights `is_app` frames,
  verified against a real 2-thread/5-frame payload.
- Breadcrumb schema (§4.5.1) — `BreadcrumbTimeline.tsx` rewritten to read documented fields
  directly, verified against a real 7-breadcrumb payload.
- Both re-verified in-browser against `send-test-data.py`'s new realistic crash/error/termination.

Pilot server is running in the background (`ingest.py` in `/Users/kevinhardianto/APM/apm-ingest`,
DB was wiped and re-seeded this session) — restart it (same dir,
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
| src/api/types.ts | Added StackFrame, Thread, BinaryImage, Breadcrumb types | Contract v1.4 (01 §4.3.1/4.3.2/4.5.1) |
| src/components/issues/StackTrace.tsx | Rewritten | Real frame schema + is_app highlighting (FE-06) |
| src/components/issues/BreadcrumbTimeline.tsx | Rewritten | Real breadcrumb schema, ts_client-relative offsets |
| src/routes/IssueDetail.tsx | Updated prop name/value passed to BreadcrumbTimeline | referenceTsClient instead of crashTsServer |
| FEATURES.md, this file | Updated | Superseded decisions, new evidence |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
