// Every number needs a comparison (docs/04 §4) — never render a bare metric.
// Arrow direction is literal (current vs previous); color encodes whether that
// direction is good or bad for this particular metric (e.g. crash-free rate rising
// is good, error rate rising is bad).
export function TrendBadge({
  delta,
  higherIsBetter,
  suffix = '%',
}: {
  delta: number
  higherIsBetter: boolean
  suffix?: string
}) {
  if (delta === 0) {
    return <span className="text-slate-500">no change</span>
  }

  const rising = delta > 0
  const isGood = rising === higherIsBetter
  const color = isGood ? 'text-emerald-400' : 'text-red-400'
  const arrow = rising ? '▲' : '▼'

  return (
    <span className={color}>
      {arrow} {Math.abs(delta).toFixed(1)}
      {suffix}
    </span>
  )
}
