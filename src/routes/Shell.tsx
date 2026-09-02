import { Outlet, useParams } from 'react-router-dom'
import { AppSwitcher } from '../components/layout/AppSwitcher'
import { Sidebar } from '../components/layout/Sidebar'
import { StatusFooter } from '../components/layout/StatusFooter'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { useApps } from '../hooks/useApps'

export function Shell() {
  const { appId } = useParams<{ appId: string }>()
  const { data: apps, isLoading, error } = useApps()

  if (isLoading) return <Loading label="Loading apps…" />
  if (error) return <ErrorState error={error} />
  if (!apps || !appId) return <Loading />

  const selectedApp = apps.find((a) => a.id === appId)
  if (!selectedApp) {
    return (
      <div className="p-6 text-sm text-slate-400">
        App "{appId}" has no data. Known apps: {apps.map((a) => a.id).join(', ') || 'none'}.
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <div className="flex w-56 shrink-0 flex-col justify-between border-r border-slate-800">
        <div>
          <div className="border-b border-slate-800 p-4">
            <div className="text-sm font-semibold">APM Kit</div>
            <div className="mt-3">
              <AppSwitcher apps={apps} selectedId={appId} />
            </div>
          </div>
          <Sidebar appId={appId} />
        </div>
        <StatusFooter lastEvent={selectedApp.last_seen} />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet context={{ app: selectedApp }} />
      </div>
    </div>
  )
}
