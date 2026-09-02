import type { FailureCategory, NetworkHost } from '../../api/types'

export function CategoryChips({
  host,
  selected,
  onSelect,
}: {
  host: NetworkHost
  selected: string | null
  onSelect: (category: string | null) => void
}) {
  const categories = Object.entries(host.failures_by_category) as [FailureCategory, number][]

  if (categories.length === 0) {
    return <div className="text-sm text-slate-500">No failures on {host.host} in this window.</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(([category, count]) => (
        <button
          key={category}
          onClick={() => onSelect(selected === category ? null : category)}
          className={`rounded border px-2 py-1 text-xs ${
            selected === category
              ? 'border-indigo-600 bg-indigo-950/50 text-indigo-200'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          {category} <span className="text-slate-500">({count})</span>
        </button>
      ))}
    </div>
  )
}
