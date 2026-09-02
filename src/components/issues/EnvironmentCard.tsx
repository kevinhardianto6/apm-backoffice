import type { Issue } from '../../api/types'

export function EnvironmentCard({ environment }: { environment: Issue['environment'] }) {
  const rows: [string, number][] = [
    ['Real device', environment.real_device_pct],
    ['Emulator', environment.emulator_pct],
    ['Rooted', environment.rooted_pct],
    ['Developer mode', environment.dev_mode_pct],
  ]

  return (
    <div className="rounded border border-slate-800 p-4">
      <div className="mb-3 text-sm font-semibold">Environment</div>
      <div className="flex flex-col gap-2">
        {rows.map(([label, pct]) => (
          <div key={label} className="text-xs">
            <div className="flex justify-between text-slate-300">
              <span>{label}</span>
              <span className="text-slate-500">{pct}%</span>
            </div>
            <div className="mt-1 h-1 w-full rounded bg-slate-800">
              <div
                className={`h-1 rounded ${label === 'Real device' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
