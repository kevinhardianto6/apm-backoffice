import { useOutletContext, useSearchParams } from 'react-router-dom'
import type { App } from '../api/types'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { CategoryChips } from '../components/network/CategoryChips'
import { FailureTimeSeries } from '../components/network/FailureTimeSeries'
import { HostTable } from '../components/network/HostTable'
import { SslGuidanceCallout } from '../components/network/SslGuidanceCallout'
import { useNetwork } from '../hooks/useNetwork'
import { formatCompactNumber } from '../lib/format'

const DAY_OPTIONS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
]

const SSL_CATEGORIES = new Set(['ssl_certificate', 'ssl_pinning_rejected'])

export function Network() {
  const { app } = useOutletContext<{ app: App }>()
  const [params, setParams] = useSearchParams()

  const days = Number(params.get('days') ?? 1)
  const selectedHost = params.get('host')
  const selectedCategory = params.get('failure_category')

  const setDays = (d: number) => {
    const next = new URLSearchParams(params)
    next.set('days', String(d))
    setParams(next, { replace: true })
  }
  const selectHost = (host: string) => {
    const next = new URLSearchParams(params)
    if (host === selectedHost) {
      next.delete('host')
      next.delete('failure_category')
    } else {
      next.set('host', host)
      next.delete('failure_category')
    }
    setParams(next, { replace: true })
  }
  const selectCategory = (category: string | null) => {
    const next = new URLSearchParams(params)
    if (category) next.set('failure_category', category)
    else next.delete('failure_category')
    setParams(next, { replace: true })
  }

  // Overview list is unfiltered by host/category — only the drilldown query needs those.
  const { data: overview, isLoading, error } = useNetwork(app.id, { days, realUsersOnly: true })
  const { data: drilldownData } = useNetwork(app.id, {
    days,
    realUsersOnly: true,
    host: selectedHost ?? undefined,
    failureCategory: selectedCategory ?? undefined,
  })

  const totalRequests = overview?.hosts.reduce((sum, h) => sum + h.requests, 0) ?? 0
  const selectedHostRow = overview?.hosts.find((h) => h.host === selectedHost)

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">Network Explorer</h1>
          <p className="text-sm text-slate-500">
            {formatCompactNumber(totalRequests)} requests · {app.name}
          </p>
        </div>
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
      </div>

      {isLoading && <Loading label="Loading network data…" />}
      {error && <ErrorState error={error} />}

      {overview && overview.hosts.length === 0 && (
        <div className="mt-6 rounded border border-slate-800 p-6 text-sm text-slate-500">
          No network activity in the last {days === 1 ? '24h' : `${days}d`}.
        </div>
      )}

      {overview && overview.hosts.length > 0 && (
        <div className="mt-6 flex flex-col gap-6">
          <HostTable hosts={overview.hosts} selectedHost={selectedHost} onSelect={selectHost} />

          {selectedHostRow && (
            <div className="rounded border border-slate-800 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold">
                  Drill-down <span className="text-slate-500">host = {selectedHostRow.host}</span>
                </div>
              </div>
              <CategoryChips
                host={selectedHostRow}
                selected={selectedCategory}
                onSelect={selectCategory}
              />

              {selectedCategory && (
                <div className="mt-4 flex flex-col gap-4">
                  <FailureTimeSeries series={drilldownData?.drilldown?.series ?? []} />
                  {SSL_CATEGORIES.has(selectedCategory) && (
                    <SslGuidanceCallout category={selectedCategory} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
