// The "black box recorder" timeline (FE-07), relative to crash time, not wall clock.
// Per-entry shape isn't confirmed by any real payload yet (breadcrumbs come embedded on
// the sample event's attrs, not as their own event type here) — read defensively by
// trying the field names 01 §4.5 documents (category, message, level) plus a few
// plausible timestamp keys, falling back to ordinal position if none match.
function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) if (obj[k] != null) return obj[k]
  return undefined
}

function relativeOffset(entry: Record<string, unknown>, crashTsMs: number): string | null {
  const raw = pick(entry, ['offset_ms', 'ts_offset_ms', 'time_since_launch_ms'])
  if (typeof raw === 'number') return `${(raw / 1000).toFixed(1)}s`

  const ts = pick(entry, ['ts_client', 'ts', 'timestamp'])
  if (typeof ts === 'string') {
    const ms = new Date(ts).getTime()
    if (!Number.isNaN(ms)) return `${((ms - crashTsMs) / 1000).toFixed(1)}s`
  }
  return null
}

export function BreadcrumbTimeline({
  breadcrumbs,
  crashTsServer,
}: {
  breadcrumbs: unknown[]
  crashTsServer: string
}) {
  const crashTsMs = new Date(crashTsServer).getTime()

  return (
    <div className="rounded border border-slate-800">
      <div className="border-b border-slate-800 px-4 py-3 font-semibold">Breadcrumbs</div>
      {breadcrumbs.length === 0 ? (
        <div className="p-4 text-sm text-slate-500">
          No breadcrumbs on this event. Either none were recorded, or this event predates
          breadcrumb capture.
        </div>
      ) : (
        <div className="flex flex-col">
          {breadcrumbs.map((raw, i) => {
            const entry = (raw ?? {}) as Record<string, unknown>
            const category = pick(entry, ['category']) as string | undefined
            const message = pick(entry, ['message']) as string | undefined
            const offset = relativeOffset(entry, crashTsMs)
            return (
              <div
                key={i}
                className="flex gap-3 border-t border-slate-800/60 px-4 py-2 text-xs first:border-t-0"
              >
                <span className="w-14 shrink-0 text-slate-500">{offset ?? `#${i}`}</span>
                {category && (
                  <span className="w-24 shrink-0 uppercase text-slate-500">{category}</span>
                )}
                <span className="text-slate-300">{message ?? JSON.stringify(entry)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
