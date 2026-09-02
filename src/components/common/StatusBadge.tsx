import type { IssueStatus } from '../../api/types'

const styles: Record<IssueStatus, string> = {
  new: 'bg-red-900/60 text-red-200 border-red-800',
  triaged: 'border-slate-600 text-slate-300',
  resolved: 'border-emerald-800 text-emerald-400',
  ignored: 'border-slate-700 text-slate-500',
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] uppercase ${styles[status]}`}>
      {status}
    </span>
  )
}
