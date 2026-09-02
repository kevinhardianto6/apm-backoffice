import type { SessionOutcome, UserSession } from '../../api/types'
import { RelativeTime } from '../common/RelativeTime'

const outcomeStyle: Record<SessionOutcome, string> = {
  crashed: 'bg-red-900/60 text-red-200 border-red-800',
  errors: 'border-amber-700 text-amber-300',
  clean: 'border-emerald-800 text-emerald-400',
}

// FE-21 asks for outcome per session + breadcrumb. Only outcome is available from
// user_detail() today (see UserDetail['sessions'] doc comment in api/types.ts) — no
// breadcrumb data per arbitrary session exists yet, so none is shown here rather than
// faked.
export function SessionTimeline({ sessions }: { sessions: UserSession[] }) {
  if (sessions.length === 0) {
    return <div className="p-4 text-sm text-slate-500">No sessions in this window.</div>
  }

  return (
    <div className="flex flex-col">
      {sessions.map((s) => (
        <div
          key={s.session_id}
          className="flex items-center gap-4 border-t border-slate-800/60 px-4 py-3 text-sm first:border-t-0"
        >
          <span className="w-24 shrink-0 text-slate-400">
            <RelativeTime iso={s.first_seen} />
          </span>
          <span
            className={`w-20 shrink-0 rounded border px-1.5 py-0.5 text-center text-[10px] uppercase ${outcomeStyle[s.outcome]}`}
          >
            {s.outcome}
          </span>
          <span className="flex-1 text-slate-400">
            {s.events} event{s.events === 1 ? '' : 's'}
            {s.crashes > 0 && <span className="ml-2 text-red-400">{s.crashes} crash</span>}
            {s.errors > 0 && <span className="ml-2 text-amber-400">{s.errors} error</span>}
            {s.network_failures > 0 && (
              <span className="ml-2 text-amber-400">{s.network_failures} network failure</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
