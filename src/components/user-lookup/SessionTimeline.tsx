import { useState } from 'react'
import type { SessionOutcome, UserSession } from '../../api/types'
import { BreadcrumbTimeline } from '../issues/BreadcrumbTimeline'
import { RelativeTime } from '../common/RelativeTime'
import { EventTimeline } from './EventTimeline'

const outcomeStyle: Record<SessionOutcome, string> = {
  crashed: 'bg-red-900/60 text-red-200 border-red-800',
  errors: 'border-amber-700 text-amber-300',
  clean: 'border-emerald-800 text-emerald-400',
}

// FE-21/FE-07. Gated on breadcrumbs_available, not outcome — a session can be "errors"
// from a network_failure alone, which carries no breadcrumb snapshot either (only
// crash/error events do, 01 §4.5.1). Where breadcrumbs exist, show the black-box
// breadcrumb trail (same component Issue Detail uses); otherwise the event timeline,
// which every session has.
export function SessionTimeline({ sessions }: { sessions: UserSession[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (sessions.length === 0) {
    return <div className="p-4 text-sm text-slate-500">No sessions in this window.</div>
  }

  return (
    <div className="flex flex-col">
      {sessions.map((s) => {
        const isOpen = expanded === s.session_id
        return (
          <div key={s.session_id} className="border-t border-slate-800/60 first:border-t-0">
            <button
              onClick={() => setExpanded(isOpen ? null : s.session_id)}
              className="flex w-full items-center gap-4 px-4 py-3 text-left text-sm hover:bg-slate-900/40"
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
                {s.breadcrumbs_available && (
                  <span className="ml-2 text-slate-500">· {s.breadcrumbs.length} breadcrumbs</span>
                )}
              </span>
              <span className="text-slate-600">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4">
                {s.breadcrumbs_available ? (
                  <BreadcrumbTimeline breadcrumbs={s.breadcrumbs} referenceTsClient={s.last_seen} />
                ) : (
                  <EventTimeline timeline={s.timeline} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
