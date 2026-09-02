import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { NetworkDrilldownPoint } from '../../api/types'
import { RelativeTime } from '../common/RelativeTime'

// FE-11: "the shape of the graph is itself the diagnosis" — a sharp spike across a
// pinned host is the signature of a server-side cert change breaking a pinned client.
// `peak` comes from the server (readapi.py computes it over the same series), not
// recomputed client-side.
export function FailureTimeSeries({
  series,
  peak,
}: {
  series: NetworkDrilldownPoint[]
  peak: NetworkDrilldownPoint | null
}) {
  if (series.length === 0) {
    return (
      <div className="rounded border border-slate-800 p-6 text-sm text-slate-500">
        No failures for this host/category in the selected window.
      </div>
    )
  }

  const data = series.map((p) => ({ ...p, tLabel: p.t.slice(11) }))

  return (
    <div className="rounded border border-slate-800 p-4">
      <div className="mb-3 flex items-baseline justify-between text-sm">
        <span className="font-semibold">Failures / min</span>
        {peak && (
          <span className="text-slate-500">
            peak {peak.failures}/min · <RelativeTime iso={`${peak.t}:00Z`} />
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <XAxis dataKey="tLabel" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 12 }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="failures"
            stroke="#f87171"
            fill="#f87171"
            fillOpacity={0.15}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
