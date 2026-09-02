import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { useApps } from '../hooks/useApps'

export function RootRedirect() {
  const { data: apps, isLoading, error } = useApps()
  const navigate = useNavigate()

  useEffect(() => {
    if (apps && apps.length > 0) {
      navigate(`/apps/${apps[0].id}`, { replace: true })
    }
  }, [apps, navigate])

  if (isLoading) return <Loading label="Loading apps…" />
  if (error) return <ErrorState error={error} />
  if (apps && apps.length === 0) {
    return (
      <div className="p-6 text-sm text-slate-400">
        No apps have sent data yet. Once the pilot app starts reporting, it will show up here.
      </div>
    )
  }
  return <Loading />
}
