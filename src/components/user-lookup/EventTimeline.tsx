import type { SessionTimelineEntry } from '../../api/types'
import { RelativeTime } from '../common/RelativeTime'

// Shown when a session has no breadcrumbs (breadcrumbs_available === false) — which is
// every clean session, by design (01 §4.5.1: breadcrumbs only ride along on a crash/error
// event). This is the real, stored event record for the session — not a stand-in for
// breadcrumbs, the only activity record a clean session ever has.
const typeColor: Record<string, string> = {
  network: 'text-slate-400',
  network_failure: 'text-amber-300',
  crash: 'text-red-300',
  error: 'text-amber-300',
  termination: 'text-amber-300',
}

export function EventTimeline({ timeline }: { timeline: SessionTimelineEntry[] }) {
  if (timeline.length === 0) {
    return <div className="p-4 text-sm text-slate-500">No stored events for this session.</div>
  }

  return (
    <div className="rounded border border-slate-800">
      <div className="border-b border-slate-800 px-4 py-3 font-semibold">
        Event timeline
        <span className="ml-2 text-xs font-normal text-slate-500">
          {timeline.length} event{timeline.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="flex flex-col">
        {timeline.map((entry, i) => (
          <div
            key={i}
            className="flex gap-3 border-t border-slate-800/60 px-4 py-2 text-xs first:border-t-0"
          >
            <span className="w-16 shrink-0 text-slate-500">
              <RelativeTime iso={entry.t} />
            </span>
            <span className={`w-28 shrink-0 uppercase ${typeColor[entry.type] ?? 'text-slate-500'}`}>
              {entry.type}
            </span>
            <span className="text-slate-300">
              {entry.label}
              {entry.detail && <span className="text-slate-500"> · {entry.detail}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
