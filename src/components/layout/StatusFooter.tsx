import { useHealth } from '../../hooks/useHealth'
import { RelativeTime } from '../common/RelativeTime'

// "symbols N pending" from the mockup is intentionally omitted: no symbol-upload
// data exists anywhere yet (symbolication service doesn't exist — docs/04 §3.6).
// Showing a fabricated count would violate the "honest empty state" principle.
export function StatusFooter({ lastEvent }: { lastEvent: string | null }) {
  const { isLoading, isError } = useHealth()

  const ingestLabel = isLoading ? 'checking…' : isError ? 'unreachable' : 'healthy'
  const ingestColor = isLoading ? 'text-slate-500' : isError ? 'text-red-400' : 'text-emerald-400'

  return (
    <div className="flex flex-col gap-1.5 border-t border-slate-800 px-4 py-4 text-xs text-slate-500">
      <div className="flex items-baseline justify-between gap-2">
        <span className="shrink-0">ingest</span>
        <span className={`truncate ${ingestColor}`}>● {ingestLabel}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="shrink-0">symbolication</span>
        <span className="truncate text-slate-600">not yet available</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="shrink-0">last event</span>
        <RelativeTime iso={lastEvent} />
      </div>
    </div>
  )
}
