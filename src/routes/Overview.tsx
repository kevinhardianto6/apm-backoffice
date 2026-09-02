import { useSearchParams } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import type { App } from '../api/types'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { MetricCard } from '../components/overview/MetricCard'
import { RealUsersToggle } from '../components/overview/RealUsersToggle'
import { TopIssuesPreview } from '../components/overview/TopIssuesPreview'
import { useOverview } from '../hooks/useOverview'
import { formatCompactNumber, formatPercent } from '../lib/format'

const DAY_OPTIONS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
]

function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export function Overview() {
  const { app } = useOutletContext<{ app: App }>()
  const [params, setParams] = useSearchParams()

  const days = Number(params.get('days') ?? 7)
  const realUsersOnly = params.get('real_users_only') !== 'false'

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

  const { data, isLoading, error } = useOverview(app.id, { days, realUsersOnly })

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">Overview</h1>
          <p className="text-sm text-slate-500">
            {app.name} · {app.platform ?? 'no data yet'}
          </p>
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

      {isLoading && <Loading label="Loading overview…" />}
      {error && <ErrorState error={error} />}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-5 gap-4">
            <MetricCard
              label="CRASH-FREE SESSIONS"
              value={formatPercent(data.current.crash_free_sessions)}
              delta={data.delta.crash_free_sessions}
              higherIsBetter
            />
            <MetricCard
              label="CRASH-FREE USERS"
              value={formatPercent(data.current.crash_free_users)}
              delta={data.delta.crash_free_users}
              higherIsBetter
            />
            <MetricCard
              label="ERROR RATE"
              value={formatPercent(data.current.error_rate)}
              delta={data.delta.error_rate}
              higherIsBetter={false}
            />
            <MetricCard
              label="NETWORK FAILURE RATE"
              value={formatPercent(data.current.network_failure_rate)}
              delta={data.delta.network_failure_rate}
              higherIsBetter={false}
            />
            <MetricCard
              label="TOTAL SESSIONS"
              value={formatCompactNumber(data.current.sessions)}
              delta={pctDelta(data.current.sessions, data.previous.sessions)}
              higherIsBetter
            />
          </div>

          {realUsersOnly && data.excluded_non_real_events > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Excluding{' '}
              {formatPercent(
                (100 * data.excluded_non_real_events) /
                  (data.excluded_non_real_events + data.current.events),
              )}{' '}
              emulator/debug events
            </p>
          )}

          <div className="mt-6">
            <TopIssuesPreview appId={app.id} days={days} realUsersOnly={realUsersOnly} />
          </div>
        </>
      )}
    </div>
  )
}
