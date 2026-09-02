# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-006 · Polish — ✅ done. **This closes the 6-feature epic (6/6).**
  Stopped for review per build order.
- **Status:** 🟠 awaiting user review. Epic is functionally complete; not yet rotated to
  `archive/epics/` — left for the user to decide after reviewing feat-006.
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser (including a
  temporary fetch-mock to force the zero-session case, since no real narrow-window gap exists
  in the seeded data) — see FEATURES.md feat-006 evidence table.

## Next step

Nothing queued — the epic's 6 features are all ✅. Waiting on user direction: review feat-006,
then either (a) ask to rotate the completed epic to `archive/epics/` per
`.claude/skills/edts-harness/references/rotation.md`, or (b) open new `FEATURES.md` rows for
further work (P1/P2 items intentionally deferred: FE-12/13/14/16/18/20, alerts, admin, RBAC,
SSO, and the several real server-side gaps below), or (c) something else entirely.

Real gaps still open, flagged in FEATURES.md, none blocking anything built so far:
- No time-series/history endpoint → no sparklines (Overview cards, per-host Network trend).
- No SLO config → no breach-styling on Overview cards.
- §3.8 integration warnings (stale SDK version, dropped events, missing setUser, symbols) —
  none of the four are answerable with current Read API / schema; would need real
  server-side additions, detailed in FEATURES.md feat-006.
- User Lookup's breadcrumb relative-time uses `last_seen` (server clock) not `ts_client`
  (device clock) — `user_detail()` has no per-session device timestamp, unlike Issue Detail.

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
| src/lib/time.ts | Added `eventStaleness()` | Turns "last event" into a fresh/stale/very-stale/never signal |
| src/components/common/RelativeTime.tsx | Added optional `className` | Lets the footer color-code by staleness |
| src/components/layout/StatusFooter.tsx | Wired staleness coloring | Makes the "no problems" vs "no data arriving" distinction visible app-wide (user's explicit priority) |
| src/routes/Overview.tsx | Added explicit zero-session handling | Metric cards default to misleading 100%/0% at sessions=0 — replaced with an honest notice |
| src/routes/IssuesList.tsx | Split empty state (filtered vs clean/no-data); added RealUsersToggle | FE-19 + FE-22 gaps |
| src/routes/Network.tsx | Added RealUsersToggle, wired real_users_only through (was hardcoded true) | FE-22 gap |
| FEATURES.md, this file | Updated | feat-006 evidence, §3.8 gap analysis, shareable-URL audit |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
