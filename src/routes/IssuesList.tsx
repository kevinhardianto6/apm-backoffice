import { useMemo } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import type { App, Issue } from '../api/types'
import { ErrorState } from '../components/common/ErrorState'
import { IssueTypeBadge } from '../components/common/IssueTypeBadge'
import { Loading } from '../components/common/Loading'
import { RelativeTime } from '../components/common/RelativeTime'
import { StatusBadge } from '../components/common/StatusBadge'
import { IssuesFilterBar, type IssuesFilters } from '../components/issues/IssuesFilterBar'
import { RealUsersToggle } from '../components/overview/RealUsersToggle'
import { useIssues } from '../hooks/useIssues'
import { formatNumber } from '../lib/format'

const DAY_OPTIONS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
]

export function IssuesList() {
  const { app } = useOutletContext<{ app: App }>()
  const [params, setParams] = useSearchParams()

  const days = Number(params.get('days') ?? 7)
  const realUsersOnly = params.get('real_users_only') !== 'false'
  const filters: IssuesFilters = {
    type: params.get('type') ?? '',
    status: params.get('status') ?? '',
    platform: params.get('platform') ?? '',
    appVersion: params.get('app_version') ?? '',
    sort: (params.get('sort') as IssuesFilters['sort']) ?? 'impact',
  }

  const setDays = (d: number) => {
    const next = new URLSearchParams(params)
    next.set('days', String(d))
    setParams(next, { replace: true })
  }
  const setRealUsersOnly = (v: boolean) => {
    const next = new URLSearchParams(params)
    next.set('real_users_only', String(v))
    setParams(next, { replace: true })
  }

  const setFilters = (patch: Partial<IssuesFilters>) => {
    const next = new URLSearchParams(params)
    const map: Record<keyof IssuesFilters, string> = {
      type: 'type',
      status: 'status',
      platform: 'platform',
      appVersion: 'app_version',
      sort: 'sort',
    }
    for (const [key, value] of Object.entries(patch)) {
      const param = map[key as keyof IssuesFilters]
      if (value) next.set(param, value)
      else next.delete(param)
    }
    setParams(next, { replace: true })
  }

  const { data, isLoading, error } = useIssues(app.id, {
    days,
    realUsersOnly,
    sort: filters.sort,
    limit: 200,
  })

  // type/status could be server-side (readapi.py's issues() accepts both), but applying
  // all four filters client-side against one `limit: 200` fetch is simpler than mixing
  // server- and client-side filtering, and fine at pilot scale.
  const filtered = useMemo(() => {
    if (!data) return []
    return data.issues.filter((issue) => {
      if (filters.type && issue.type !== filters.type) return false
      if (filters.status && issue.status !== filters.status) return false
      if (filters.platform && !issue.platforms.some((p) => p.includes(filters.platform)))
        return false
      if (filters.appVersion && !issue.app_versions.includes(filters.appVersion)) return false
      return true
    })
  }, [data, filters.type, filters.status, filters.platform, filters.appVersion])

  const platformOptions = useMemo(
    () => Array.from(new Set(data?.issues.flatMap((i) => i.platforms) ?? [])).sort(),
    [data],
  )
  const versionOptions = useMemo(
    () => Array.from(new Set(data?.issues.flatMap((i) => i.app_versions) ?? [])).sort(),
    [data],
  )

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">Issues</h1>
          <p className="text-sm text-slate-500">{app.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded border border-slate-700 text-sm">
            {DAY_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDays(opt.days)}
                className={`px-3 py-1.5 ${
                  days === opt.days ? 'bg-indigo-900/60 text-white' : 'text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <RealUsersToggle checked={realUsersOnly} onChange={setRealUsersOnly} />
        </div>
      </div>

      <div className="mt-4">
        <IssuesFilterBar
          filters={filters}
          onChange={setFilters}
          platformOptions={platformOptions}
          versionOptions={versionOptions}
        />
      </div>

      {isLoading && <Loading label="Loading issues…" />}
      {error && <ErrorState error={error} />}

      {data && filtered.length === 0 && data.count > 0 && (
        <div className="mt-6 rounded border border-slate-800 p-6 text-sm text-slate-500">
          No issues match these filters — {formatNumber(data.count)} issue
          {data.count === 1 ? '' : 's'} exist in the last {days} days outside them. Try
          widening the filters above.
        </div>
      )}

      {data && filtered.length === 0 && data.count === 0 && (
        <div className="mt-6 rounded border border-slate-800 p-6 text-sm text-slate-500">
          No issues in the last {days} days — this app is clean, not silent. Check the
          sidebar footer's "last event" time to confirm data is still arriving.
        </div>
      )}

      {data && filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-500">
              <th className="px-4 py-2 font-normal">Issue</th>
              <th className="px-4 py-2 font-normal">Type</th>
              <th className="px-4 py-2 text-right font-normal">Events</th>
              <th className="px-4 py-2 text-right font-normal">Users</th>
              <th className="px-4 py-2 font-normal">Platform</th>
              <th className="px-4 py-2 font-normal">First seen</th>
              <th className="px-4 py-2 font-normal">Last seen</th>
              <th className="px-4 py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue: Issue) => (
              <tr key={issue.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                <td className="px-4 py-2.5 font-medium">
                  <Link
                    to={`/apps/${app.id}/issues/${issue.id}`}
                    className="hover:text-indigo-400"
                  >
                    {issue.title}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <IssueTypeBadge type={issue.type} />
                </td>
                <td className="px-4 py-2.5 text-right">{formatNumber(issue.events)}</td>
                <td className="px-4 py-2.5 text-right">{formatNumber(issue.users_affected)}</td>
                <td className="px-4 py-2.5 text-slate-400">
                  {issue.platforms.join(', ') || '—'}
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  <RelativeTime iso={issue.first_seen} />
                </td>
                <td className="px-4 py-2.5 text-slate-400">
                  <RelativeTime iso={issue.last_seen} />
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={issue.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
