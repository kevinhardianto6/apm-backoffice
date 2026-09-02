import { TrendBadge } from '../common/TrendBadge'

// No sparkline: the overview endpoint returns only current/previous scalars, no daily
// time series (checked readapi.py — there's no history endpoint yet). Flagged as a
// server gap rather than faked with a placeholder chart; FE-01 requires the trend
// comparison, not specifically a chart, and that part is real.
export function MetricCard({
  label,
  value,
  delta,
  higherIsBetter,
  suffix = '%',
}: {
  label: string
  value: string
  delta: number
  higherIsBetter: boolean
  suffix?: string
}) {
  const rising = delta > 0
  const isBad = delta !== 0 && rising !== higherIsBetter

  return (
    <div
      className={`rounded border p-4 ${
        isBad ? 'border-amber-700/60 bg-amber-950/10' : 'border-slate-800'
      }`}
    >
      <div className="text-xs tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-xs">
        <TrendBadge delta={delta} higherIsBetter={higherIsBetter} suffix={suffix} />
      </div>
    </div>
  )
}
