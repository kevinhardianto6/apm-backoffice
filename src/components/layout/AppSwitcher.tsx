import { useNavigate } from 'react-router-dom'
import type { App } from '../../api/types'

export function AppSwitcher({ apps, selectedId }: { apps: App[]; selectedId: string }) {
  const navigate = useNavigate()
  const selected = apps.find((a) => a.id === selectedId)

  return (
    <div>
      <select
        value={selectedId}
        onChange={(e) => navigate(`/apps/${e.target.value}`)}
        className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white"
      >
        {apps.map((app) => (
          // name falls back to id for unregistered apps (APP_NAMES stub, BE-06 Phase 3) —
          // that's the expected state for a new app, not an error.
          <option key={app.id} value={app.id}>
            {app.name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-1 truncate text-xs text-slate-500" title={selected.id}>
          {selected.platform ?? 'no data yet'}
        </div>
      )}
    </div>
  )
}
