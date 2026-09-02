# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-005 · User Lookup — ✅ done, stopped for review per build order.
  Also closed the feat-004 network() gap (extended drilldown) before starting feat-005.
- **Status:** 🟠 awaiting user review before starting feat-006 (last feature in the epic).
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser: raw-identifier
  search (resolve → ref, URL never carries the raw value), direct user_ref search (skips
  resolve), honest not-found state, full session timeline against a real 8-session user.

## Next step

Waiting on user review of feat-005 before starting feat-006 (Polish — final feature in the
epic): honest empty states everywhere, integration warnings (docs/04 §3.8: no user_id, symbols
not uploaded, SDK event drops, stale SDK version), shareable URLs for every filter combination
(mostly already true — Overview/Issues/Network/UserLookup all reflect their filters in the
URL; audit for gaps rather than assume). This closes the 6-feature epic.

Real gaps flagged across the epic, not blocking, for the user's awareness (all in FEATURES.md
with dates/decisions — do not re-litigate without new information):
- No time-series/history endpoint → no sparklines anywhere (Overview, per-host Network trend).
- No SLO config → no breach-styling on Overview cards (amber border on bad-trend substitutes).
- Crash frame highlighting (FE-06) and breadcrumbs (FE-07) — RESOLVED this session, contract v1.4.
- Network SSL drill-down Key Facts (FE-11) — RESOLVED this session, network() extended.
- User Lookup per-session breadcrumbs (FE-21) — NOT resolved, `user_detail()` doesn't return
  them; would need the same treatment issue_detail() already got.

Pilot server is running in the background (`ingest.py` in `/Users/kevinhardianto/APM/apm-ingest`,
DB re-seeded 2026-09-02) — restart it (same dir, `APM_CORS_ORIGINS='http://localhost:5173'
python3 ingest.py`, then `python3 send-test-data.py`) if the session's background process died.

## Parked

- None.

## In flight elsewhere

- None.

## Blockers

- None.

## Changes (this session)

| File | Change | Why |
|------|--------|-----|
| src/api/types.ts | Added NetworkDrilldown (full shape), UserSession, UserDetail | Contract extensions |
| src/components/network/{FailureTimeSeries,SslGuidanceCallout}.tsx | Rewritten | Use real users_affected/started/version-breakdown/all_active_versions_affected |
| src/api/users.ts, hooks/{useUserDetail,useResolveUser}.ts | Added | resolve + user detail |
| src/components/user-lookup/*.tsx (NoPiiBadge, UserSearchBox, IntegrityChips, SessionTimeline) | Added | feat-005 building blocks |
| src/routes/UserLookup.tsx | Added | feat-005 page — raw identifier never enters URL/state, only resolved user_ref |
| src/App.tsx, navConfig.ts | Updated | Wired /users route; Sidebar "User Lookup" now live |
| FEATURES.md, this file | Updated | feat-004 gap superseded, feat-005 evidence + decisions |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
