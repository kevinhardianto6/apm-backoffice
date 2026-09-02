# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Build the APM Kit backoffice SPA (React+Vite+TS) against the pilot Read API,
  one BO feature at a time, stopping for review after each (see FEATURES.md epic).
- **Active feature:** feat-003 · Issues list + Issue Detail — ✅ done, stopped for review per build order.
- **Status:** 🟠 awaiting user review before starting feat-004.
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Verified live in-browser: issues list
  filters/sort/URL state, issue detail for crash/network/http_error types, status PATCH
  round-trips and persists on refetch.

## Next step

Waiting on user review of feat-003 before starting feat-004 (Network Explorer, FE-10/11).
Before writing UI: read `readapi.py`'s `network()` for the exact response shape (host table
fields, `drilldown.series` for the SSL time-series view) the same way prior endpoints were
checked — don't assume `01 §10` matches without confirming against source. Note: `network()`
defaults `days=1` (not 7) unlike every other endpoint — checked already, worth double-checking
nothing else about it differs from pattern.

Two real gaps carried forward from feat-003, flagged in FEATURES.md, not yet resolved:
- Crash frame schema unconfirmed — no real payload has populated `threads`/`binary_images` yet.
  FE-06's app-frame-vs-system-frame highlighting is NOT implemented because of this. Needs
  either a real crash payload or a documented frame schema.
- Breadcrumb entry schema unconfirmed similarly — `BreadcrumbTimeline.tsx` reads defensively.
Neither blocks progress; both render correctly with today's data (which has neither field
populated) and will need a look once real payloads with these fields exist.

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
| (feat-001/002 files) | — | See prior commit `feat-001, feat-002: ...` |
| src/api/{issueDetail,types}.ts | Added/extended | IssueDetail, BreakdownItem, SampleEvent types + fetch/patch |
| src/hooks/{useIssueDetail,useUpdateIssueStatus}.ts | Added | Detail query + status mutation |
| src/components/issues/*.tsx (StatusDropdown, BreakdownCard, EnvironmentCard, StackTrace, ErrorLocation, TerminationNotice, BreadcrumbTimeline, IssuesFilterBar) | Added | feat-003 building blocks |
| src/routes/{IssuesList,IssueDetail}.tsx | Added | feat-003 pages |
| src/App.tsx, navConfig.ts | Updated | Wired /issues and /issues/:issueId routes; Sidebar "Issues" now live |
| src/components/overview/TopIssuesPreview.tsx, src/routes/IssuesList.tsx | overflow-x-auto wrapper | Tables were overflowing the viewport with no scroll container |
| FEATURES.md, this file | Updated | feat-003 evidence + decisions |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
