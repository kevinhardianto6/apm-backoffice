import type { IssueStatus, IssueType } from '../../api/types'

const TYPES: IssueType[] = ['crash', 'network_failure', 'error', 'termination']
const STATUSES: IssueStatus[] = ['new', 'triaged', 'resolved', 'ignored']
const SORTS: { value: 'impact' | 'events' | 'recent'; label: string }[] = [
  { value: 'impact', label: 'Impact' },
  { value: 'events', label: 'Events' },
  { value: 'recent', label: 'Most recent' },
]

export interface IssuesFilters {
  type: string
  status: string
  platform: string
  appVersion: string
  sort: 'impact' | 'events' | 'recent'
}

// `type`/`status`/`sort` are server-side (readapi.py `issues()` reads them from the
// query string). `platform`/`appVersion` are NOT — the server doesn't accept those
// params for this endpoint, so they're applied client-side against the fetched page.
// Fine at pilot scale; would need server support (a version/os/platform filter param)
// to hold up at real volume.
export function IssuesFilterBar({
  filters,
  onChange,
  platformOptions,
  versionOptions,
}: {
  filters: IssuesFilters
  onChange: (next: Partial<IssuesFilters>) => void
  platformOptions: string[]
  versionOptions: string[]
}) {
  const selectClass =
    'rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-200'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.type}
        onChange={(e) => onChange({ type: e.target.value })}
        className={selectClass}
      >
        <option value="">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.platform}
        onChange={(e) => onChange({ platform: e.target.value })}
        className={selectClass}
      >
        <option value="">All platforms</option>
        {platformOptions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={filters.appVersion}
        onChange={(e) => onChange({ appVersion: e.target.value })}
        className={selectClass}
      >
        <option value="">All app versions</option>
        {versionOptions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as IssuesFilters['sort'] })}
        className={selectClass}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
