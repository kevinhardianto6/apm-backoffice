import type { Breadcrumb } from '../../api/types'

// FE-07 "black box recorder" timeline — relative to the crash, not wall clock (docs/04 §4).
// Both breadcrumb.timestamp and the reference point use the DEVICE clock (ts_client), not
// ts_server, since they're captured by the same clock and server time could carry network
// latency/skew relative to it.
function relativeOffset(entryIso: string, referenceIso: string): string {
  const ms = new Date(entryIso).getTime() - new Date(referenceIso).getTime()
  const sign = ms <= 0 ? '-' : '+'
  return `${sign}${Math.abs(ms / 1000).toFixed(1)}s`
}

const levelColor: Record<Breadcrumb['level'], string> = {
  debug: 'text-slate-500',
  info: 'text-slate-300',
  warning: 'text-amber-300',
  error: 'text-red-300',
}

export function BreadcrumbTimeline({
  breadcrumbs,
  referenceTsClient,
}: {
  breadcrumbs: Breadcrumb[]
  referenceTsClient: string
}) {
  return (
    <div className="rounded border border-slate-800">
      <div className="border-b border-slate-800 px-4 py-3 font-semibold">
        Breadcrumbs
        <span className="ml-2 text-xs font-normal text-slate-500">
          {breadcrumbs.length} events, relative to crash
        </span>
      </div>
      {breadcrumbs.length === 0 ? (
        <div className="p-4 text-sm text-slate-500">
          No breadcrumbs on this event. Either none were recorded, or this event predates
          breadcrumb capture.
        </div>
      ) : (
        <div className="flex flex-col">
          {breadcrumbs.map((crumb, i) => (
            <div
              key={i}
              className="flex gap-3 border-t border-slate-800/60 px-4 py-2 text-xs first:border-t-0"
              title={new Date(crumb.timestamp).toLocaleString()}
            >
              <span className="w-14 shrink-0 text-slate-500">
                {relativeOffset(crumb.timestamp, referenceTsClient)}
              </span>
              <span className="w-24 shrink-0 uppercase text-slate-500">{crumb.category}</span>
              <span className={levelColor[crumb.level]}>{crumb.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
