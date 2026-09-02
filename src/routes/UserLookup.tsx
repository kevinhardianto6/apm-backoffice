import { useOutletContext, useSearchParams } from 'react-router-dom'
import type { App } from '../api/types'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { IntegrityChips } from '../components/user-lookup/IntegrityChips'
import { NoPiiBadge } from '../components/user-lookup/NoPiiBadge'
import { SessionTimeline } from '../components/user-lookup/SessionTimeline'
import { UserSearchBox } from '../components/user-lookup/UserSearchBox'
import { useResolveUser } from '../hooks/useResolveUser'
import { useUserDetail } from '../hooks/useUserDetail'

export function UserLookup() {
  const { app } = useOutletContext<{ app: App }>()
  const [params, setParams] = useSearchParams()

  // Only the resolved, opaque user_ref ever lives in the URL — never the raw identifier
  // that was searched (see UserSearchBox's comment for why).
  const userRef = params.get('ref')

  const resolve = useResolveUser(app.id)
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserDetail(app.id, userRef)

  const handleSearch = (input: { kind: 'user_ref'; value: string } | { kind: 'identifier'; value: string }) => {
    if (input.kind === 'user_ref') {
      setParams({ ref: input.value })
      return
    }
    resolve.mutate(input.value, {
      onSuccess: (res) => setParams({ ref: res.user_ref }),
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">User Lookup</h1>
          <p className="text-sm text-slate-500">{app.name} · pseudonymous refs only</p>
        </div>
        <NoPiiBadge />
      </div>

      <div className="mt-4">
        <UserSearchBox onSearch={handleSearch} isSearching={resolve.isPending} />
        <p className="mt-2 text-xs text-slate-500">
          Raw identifiers are hashed server-side to a user_ref — this app never stores the raw
          value.
        </p>
      </div>

      {resolve.isError && <ErrorState error={resolve.error} />}

      {userRef && isLoadingUser && <Loading label="Loading user…" />}
      {userRef && userError && <ErrorState error={userError} />}
      {userRef && !isLoadingUser && !userError && user === null && (
        <div className="mt-6 rounded border border-slate-800 p-6 text-sm text-slate-500">
          No data for {userRef} in the last 30 days.
        </div>
      )}

      {user && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between rounded border border-slate-800 p-4">
            <div>
              <div className="font-mono text-lg">{user.user_ref}</div>
              <div className="text-xs text-slate-500">
                {user.sessions_count} sessions in window · {user.device.model ?? 'unknown device'}{' '}
                · {user.device.os} {user.device.os_version} · app {user.device.app_version} (
                {user.device.app_build})
              </div>
            </div>
            <IntegrityChips integrity={user.integrity} />
          </div>

          <div className="rounded border border-slate-800">
            <div className="border-b border-slate-800 px-4 py-3 font-semibold">
              Session timeline
            </div>
            <SessionTimeline sessions={user.sessions} />
          </div>
        </div>
      )}
    </div>
  )
}
