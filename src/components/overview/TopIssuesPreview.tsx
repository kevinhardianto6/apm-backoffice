import { Link } from 'react-router-dom'
import type { Issue } from '../../api/types'
import { ErrorState } from '../common/ErrorState'
import { IssueTypeBadge } from '../common/IssueTypeBadge'
import { Loading } from '../common/Loading'
import { RelativeTime } from '../common/RelativeTime'
import { StatusBadge } from '../common/StatusBadge'
import { formatNumber } from '../../lib/format'
import { useIssues } from '../../hooks/useIssues'

export function TopIssuesPreview({
  appId,
  days,
  realUsersOnly,
}: {
  appId: string
  days: number
  realUsersOnly: boolean
}) {
  const { data, isLoading, error } = useIssues(appId, {
    days,
    realUsersOnly,
    sort: 'impact',
    limit: 6,
  })

  return (
    <div className="rounded border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <span className="font-semibold">Top Issues</span>
          <span className="ml-2 text-xs text-slate-500">sorted by impact · {days}d</span>
        </div>
        {/* Full filterable/sortable list is BO-3 (feat-003) — not built yet. */}
        <Link
          to={`/apps/${appId}/issues`}
          className="text-xs text-indigo-400 hover:text-indigo-300"
        >
          View all →
        </Link>
      </div>

      {isLoading && <Loading label="Loading issues…" />}
      {error && <ErrorState error={error} />}

      {data && data.issues.length === 0 && (
        <div className="p-6 text-sm text-slate-500">
          No issues in the last {days} days — this app is clean, not silent. Check the footer's
          "last event" time to confirm data is still arriving.
        </div>
      )}

      {data && data.issues.length > 0 && (
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="px-4 py-2 font-normal">Issue</th>
              <th className="px-4 py-2 font-normal">Type</th>
              <th className="px-4 py-2 text-right font-normal">Events</th>
              <th className="px-4 py-2 text-right font-normal">Users</th>
              <th className="px-4 py-2 font-normal">Platform</th>
              <th className="px-4 py-2 font-normal">First seen</th>
              <th className="px-4 py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.issues.map((issue: Issue) => (
              <tr key={issue.id} className="border-t border-slate-800/60">
                <td className="px-4 py-2.5 font-medium">{issue.title}</td>
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
