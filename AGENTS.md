# AGENTS.md

apm-backoffice — the backoffice web dashboard for APM Kit, an in-house mobile APM system.
Client-only SPA reading a Read API served by the pilot ingestion server.
Router for agent work. Facts live in the linked docs; this file is the map, not the manual.

## Session startup

1. Load the `edts-harness` skill first, every session.
2. Read **your** state file — resolve it with:
   `echo "state/$(git config user.name | tr "[:upper:] " "[:lower:]-").md"`
   It's the only state file you read in full: active feature, last verify
   result, blockers, next step. Never write to anyone else's state file.
3. Read `CONSTITUTION.md` — the permanent rules and past decisions. Always in context.
4. Run `./verify.sh build` to confirm a clean baseline before editing.
5. Pick the **one** ready feature from `FEATURES.md` (all its `Depends on` are ✅).
   Set its status to 🔵 and start.

## Project overview

- **Stack:** React + Vite + TypeScript, client-only SPA (no server of its own). Tailwind for
  styling, TanStack Query for data fetching/caching, react-router-dom for routing (URL holds
  filter state), recharts for sparklines and the network time series.
- **Structure:** `src/api/` (typed Read API client), `src/hooks/` (query hooks per resource),
  `src/routes/` (one file per screen), `src/components/<domain>/`, `src/lib/` (time/number
  formatting), `src/config/env.ts` (base URL + read token from `.env.local`, never hardcoded).
- **Data source:** pilot ingestion server (`README-pilot-api.md`), Read API per
  `docs/01-Kontrak-Data-API.md` §10, auth via `X-APM-Read-Token` header (SEC-16: separate from
  the SDK's write-only app key).
- **Docs:** `docs/00-Overview.md` (product context), `docs/01-Kontrak-Data-API.md` §10
  (authoritative API contract), `docs/04-Frontend-Website.md` (FE-xx requirements + design
  principles), `docs/mockups/*.png` (approved visual design), `CONSTITUTION.md` (rules),
  `FEATURES.md` (scope), `JOURNAL.md` (lessons).

## Verification

Run before claiming any work done. All checks must pass.

```bash
./verify.sh build
```

`verify.sh` prints a final `HARNESS_VERIFY: PASS` / `FAIL` line — that line is your evidence.
Only checks this project actually has are listed. Do not invent lint/test/e2e steps.

## Definition of done

A feature is `✅` only when: its `Done when` criteria are met, `verify.sh` passes, evidence is
recorded in its `FEATURES.md` sub-table, and your state file is updated with the next step.

## Session handoff

- Keep your state file current in real time — flip status the moment it changes.
- After every edit, append to its `Changes` table (file · what · why).
- Before ending: run verify, record the result, leave your state file resumable on its own.
- When a feature closes, rotate its detail to `archive/features/<id>.md` and replace its
  Evidence cell with a link. Same for sessions and completed epics. Write the archive file
  *first*, then remove the detail — the other order loses the evidence if interrupted.

---

## Rules

**All binding rules live in `CONSTITUTION.md`** — architecture, platform constraints, code
prohibitions, process, and git. It is binding, not advisory: read it at startup (step 3),
and if anything in this file appears to conflict with it, **`CONSTITUTION.md` wins.**

Rules are deliberately not repeated here. One home, no drift.
