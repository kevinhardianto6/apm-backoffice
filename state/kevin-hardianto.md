# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-005 · User Lookup — ✅ done, including the per-session breadcrumb
  rework (user_detail() extended). Stopped for review per build order.
- **Status:** 🟠 awaiting user review before starting feat-006 (last feature in the epic).
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser: session rows
  correctly show breadcrumb count only when `breadcrumbs_available`, expand to the real
  breadcrumb trail or the real event timeline accordingly.

## Next step

Waiting on user review before starting feat-006 (Polish — final feature in the epic): honest
empty states everywhere, integration warnings (docs/04 §3.8: no user_id, symbols not uploaded,
SDK event drops, stale SDK version), shareable URLs for every filter combination (mostly
already true — Overview/Issues/Network/UserLookup all reflect their filters in the URL; audit
for gaps rather than assume this is complete). This closes the 6-feature epic.

Real gaps flagged across the epic, not blocking, for the user's awareness (all in FEATURES.md
with dates/decisions — do not re-litigate without new information):
- No time-series/history endpoint → no sparklines anywhere (Overview, per-host Network trend).
- No SLO config → no breach-styling on Overview cards (amber border on bad-trend substitutes).
- All three FE-06/FE-07/FE-11/FE-21 breadcrumb/frame-schema gaps flagged earlier this
  session are now RESOLVED (contract v1.4 + user_detail()/network() extensions). Nothing
  currently open from feat-001..005 except the two "no data source at all" items above.
- One approximation worth knowing: User Lookup's breadcrumb relative-time reference uses
  `last_seen` (server clock) since `user_detail()` has no per-session `ts_client`; Issue
  Detail's equivalent uses the real device clock. Minor, noted in FEATURES.md.

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
| src/api/types.ts | Added SessionTimelineEntry; extended UserSession with breadcrumbs/breadcrumbs_available/timeline | user_detail() extended (contract v1.4) |
| src/components/user-lookup/SessionTimeline.tsx | Rewritten | Expand/collapse per session, gated on breadcrumbs_available not outcome |
| src/components/user-lookup/EventTimeline.tsx | Added | Real per-session event record, shown when no breadcrumbs exist |
| FEATURES.md, this file | Updated | feat-005 breadcrumb gap superseded with evidence |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
