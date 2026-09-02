import { Link, useParams } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import type { App } from '../api/types'
import { BreakdownCard } from '../components/issues/BreakdownCard'
import { BreadcrumbTimeline } from '../components/issues/BreadcrumbTimeline'
import { EnvironmentCard } from '../components/issues/EnvironmentCard'
import { ErrorLocation } from '../components/issues/ErrorLocation'
import { StackTrace } from '../components/issues/StackTrace'
import { StatusDropdown } from '../components/issues/StatusDropdown'
import { TerminationNotice } from '../components/issues/TerminationNotice'
import { ErrorState } from '../components/common/ErrorState'
import { IssueTypeBadge } from '../components/common/IssueTypeBadge'
import { Loading } from '../components/common/Loading'
import { RelativeTime } from '../components/common/RelativeTime'
import { useIssueDetail } from '../hooks/useIssueDetail'
import { formatNumber } from '../lib/format'

export function IssueDetail() {
  const { app } = useOutletContext<{ app: App }>()
  const { issueId } = useParams<{ issueId: string }>()
  const { data: issue, isLoading, error } = useIssueDetail(issueId!, 30)

  if (isLoading) return <Loading label="Loading issue…" />
  if (error) return <ErrorState error={error} />
  if (!issue) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Issue "{issueId}" not found in the last 30 days for any app.
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="text-xs text-slate-500">
        <Link to={`/apps/${app.id}`} className="hover:text-slate-300">
          Overview
        </Link>{' '}
        / {issue.id}
      </div>

      <div className="mt-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <IssueTypeBadge type={issue.type} />
            <h1 className="text-lg font-semibold">{issue.title}</h1>
          </div>
          <div className="mt-2 flex gap-6 text-sm text-slate-400">
            <span>
              {formatNumber(issue.users_affected)} users ·{' '}
              {formatNumber(issue.sessions_affected)} sessions · {formatNumber(issue.events)}{' '}
              events
            </span>
            <span>
              first seen <RelativeTime iso={issue.first_seen} /> · last seen{' '}
              <RelativeTime iso={issue.last_seen} />
            </span>
          </div>
        </div>
        <StatusDropdown issueId={issue.id} status={issue.status} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {issue.type === 'termination' && (
            <TerminationNotice attrs={issue.sample_event.attrs} />
          )}
          {issue.type === 'error' && <ErrorLocation attrs={issue.sample_event.attrs} />}
          {issue.type === 'crash' && <StackTrace attrs={issue.sample_event.attrs} />}
          <BreadcrumbTimeline
            breadcrumbs={issue.breadcrumbs}
            referenceTsClient={issue.sample_event.ts_client}
          />
        </div>

        <div className="flex flex-col gap-4">
          <BreakdownCard title="Devices" items={issue.breakdowns.devices} />
          <BreakdownCard title="OS versions" items={issue.breakdowns.os_versions} />
          <BreakdownCard title="App versions" items={issue.breakdowns.app_versions} />
          <EnvironmentCard environment={issue.environment} />
        </div>
      </div>
    </div>
  )
}
