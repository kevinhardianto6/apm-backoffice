import type { IssueType } from '../../api/types'

// Fallback branch handles enum values FE doesn't recognize yet — per docs/01 §11,
// additive enum growth must degrade gracefully, not throw or blank out.
const styles: Partial<Record<IssueType, string>> = {
  crash: 'border-red-800 text-red-300',
  network_failure: 'border-indigo-800 text-indigo-300',
  error: 'border-slate-600 text-slate-300',
  termination: 'border-amber-800 text-amber-300',
}

const labels: Partial<Record<IssueType, string>> = {
  network_failure: 'network',
}

export function IssueTypeBadge({ type }: { type: IssueType }) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[10px] uppercase ${
        styles[type] ?? 'border-slate-700 text-slate-500'
      }`}
    >
      {labels[type] ?? type}
    </span>
  )
}
