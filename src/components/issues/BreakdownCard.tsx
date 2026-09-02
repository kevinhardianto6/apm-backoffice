import type { BreakdownItem } from '../../api/types'
import { formatNumber } from '../../lib/format'

export function BreakdownCard({ title, items }: { title: string; items: BreakdownItem[] }) {
  return (
    <div className="rounded border border-slate-800 p-4">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      {items.length === 0 && <div className="text-xs text-slate-500">No data</div>}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} className="text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="truncate">{item.label}</span>
              <span className="shrink-0 text-slate-500">
                {item.pct}% · {formatNumber(item.count)}
              </span>
            </div>
            <div className="mt-1 h-1 w-full rounded bg-slate-800">
              <div
                className="h-1 rounded bg-indigo-600"
                style={{ width: `${Math.max(item.pct, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
