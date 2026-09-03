# State — Kevin Hardianto

> Your personal working state. One file per person (`state/<git config user.name>.md`),
> so merge / rebase / cherry-pick never conflict — nobody else ever writes here.
> Keep it small — cap ~100 lines. Finished work rotates to `archive/`.
> Team-wide view of who's doing what lives in `FEATURES.md`, not here.

## Now

- **Objective:** Was building the APM Kit backoffice SPA epic (feat-001..006). **That epic is
  now closed and rotated** to `archive/epics/apm-kit-backoffice-v1.md` per the user's request.
- **Active feature:** None. `FEATURES.md` currently has no open epic or feature.
- **Status:** 🟡 idle — waiting on new scope from the user.
- **Last verify:** `./verify.sh build` → `HARNESS_VERIFY: PASS (build)`;
  `./verify.sh lint` → `HARNESS_VERIFY: PASS (lint)`. Full app verified live in-browser across
  all 4 MONITOR screens plus the new integration-warnings footer lines and FE-18 copy button.

## Next step

Nothing queued. `FEATURES.md` is now just the header + an empty roll-up table + the Shipped
entry. When new work comes in:
- If it's more backoffice scope (the deferred P1/P2 items: FE-12/13/14/16/20, alerts, admin,
  RBAC, SSO — see the archived epic's intro for why FE-12/13 specifically were declined, not
  just deferred), start a new `## Epic ·` section in `FEATURES.md` rather than reopening the
  archived one.
- If it's something else entirely, same — new epic section, fresh `feat-` numbering continues
  from where it left off (last used: feat-006) unless the user wants a new prefix.

Real, still-open gaps from the closed epic worth knowing about before touching this codebase
again (full detail in the archived epic file):
- No time-series/history endpoint anywhere → no sparklines (Overview cards, per-host Network
  trend).
- No SLO config → no breach-styling on Overview cards (amber-border-on-bad-trend substitutes).
- Stale-SDK-version warning UI reads `sdk_versions[].is_outdated` correctly already but has
  never seen real `true`/named-outdated data — the user said they're adding the "latest
  version" registry server-side; no frontend change needed once that lands, just re-verify.
- User Lookup's breadcrumb relative-time uses `last_seen` (server clock), not `ts_client`
  (device clock) — `user_detail()` has no per-session device timestamp, unlike Issue Detail.

Pilot server is running in the background (`ingest.py` in `/Users/kevinhardianto/APM/apm-ingest`,
DB last re-seeded 2026-09-03 with `user_id_source`/`sdk_health` support) — restart it (same
dir, `APM_CORS_ORIGINS='http://localhost:5173' python3 ingest.py`, then
`python3 send-test-data.py`) if the session's background process died.

## Parked

- None.

## In flight elsewhere

- None.

## Blockers

- None.

## Changes (this session)

| File | Change | Why |
|------|--------|-----|
| src/api/{integration,types}.ts | Added IntegrationResponse + related types, fetchIntegration | New `GET /v1/apps/:id/integration` endpoint |
| src/hooks/useIntegration.ts | Added | Query hook, 60s refetch |
| src/components/layout/IntegrationStatusLines.tsx | Added | 3-state (unavailable/healthy/warning) status rows |
| src/components/layout/StatusFooter.tsx, routes/Shell.tsx | Updated | Wired new status lines in; StatusFooter now takes `appId` |
| src/lib/issueMarkdown.ts, components/issues/CopyMarkdownButton.tsx | Added | FE-18 |
| src/routes/IssueDetail.tsx | Updated | Added Copy as Markdown button next to status dropdown |
| FEATURES.md | Epic rotated out | Closed epic moved to archive/epics/, roll-up table now empty, Shipped entry added |
| archive/epics/apm-kit-backoffice-v1.md | Added | Full rotated epic detail (all 6 features, evidence, decisions) |
| this file | Reset for idle state | Epic closed, no active feature |

_Ground truth: run `git diff --stat` to confirm this table matches reality._
