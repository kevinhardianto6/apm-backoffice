import type { UserDetail } from '../../api/types'

function Chip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded border px-2 py-1 text-xs ${
        active ? 'border-amber-700 bg-amber-950/30 text-amber-300' : 'border-slate-700 text-slate-400'
      }`}
    >
      {label} {active ? 'Yes' : 'No'}
    </span>
  )
}

export function IntegrityChips({ integrity }: { integrity: UserDetail['integrity'] }) {
  return (
    <div className="flex gap-2">
      <Chip label="Emulator" active={integrity.is_emulator} />
      <Chip label="Rooted" active={integrity.is_rooted} />
      <Chip label="Dev mode" active={integrity.is_dev_mode} />
    </div>
  )
}
