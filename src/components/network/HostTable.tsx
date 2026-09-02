import type { NetworkHost } from '../../api/types'
import { formatNumber } from '../../lib/format'

// No 24h-trend sparkline: network() returns only whole-window aggregates per host, no
// daily/hourly bucketed series outside a single host+category drilldown — same gap as
// Overview's metric cards (no history endpoint exists yet).
function failureColor(rate: number): string {
  if (rate >= 5) return 'text-red-400'
  if (rate >= 1) return 'text-amber-400'
  return 'text-emerald-400'
}

function ms(v: number | null): string {
  if (v == null) return '—'
  return v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`
}

export function HostTable({
  hosts,
  selectedHost,
  onSelect,
}: {
  hosts: NetworkHost[]
  selectedHost: string | null
  onSelect: (host: string) => void
}) {
  return (
    <div className="rounded border border-slate-800">
      <div className="border-b border-slate-800 px-4 py-3 font-semibold">
        Hosts <span className="ml-2 text-xs font-normal text-slate-500">sorted by failure rate</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="px-4 py-2 font-normal">Host</th>
              <th className="px-4 py-2 text-right font-normal">Requests</th>
              <th className="px-4 py-2 text-right font-normal">p50</th>
              <th className="px-4 py-2 text-right font-normal">p95</th>
              <th className="px-4 py-2 text-right font-normal">p99</th>
              <th className="px-4 py-2 text-right font-normal">Fail rate</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((h) => (
              <tr
                key={h.host}
                onClick={() => onSelect(h.host)}
                className={`cursor-pointer border-t border-slate-800/60 hover:bg-slate-900/40 ${
                  selectedHost === h.host ? 'bg-indigo-950/30' : ''
                }`}
              >
                <td className="px-4 py-2.5 font-medium">{h.host}</td>
                <td className="px-4 py-2.5 text-right">{formatNumber(h.requests)}</td>
                <td className="px-4 py-2.5 text-right text-slate-400">{ms(h.p50)}</td>
                <td className="px-4 py-2.5 text-right text-slate-400">{ms(h.p95)}</td>
                <td className="px-4 py-2.5 text-right text-slate-400">{ms(h.p99)}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${failureColor(h.failure_rate)}`}>
                  {h.failure_rate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
