import type { IssueStatus } from '../../api/types'
import { useUpdateIssueStatus } from '../../hooks/useUpdateIssueStatus'

const OPTIONS: IssueStatus[] = ['new', 'triaged', 'resolved', 'ignored']

export function StatusDropdown({ issueId, status }: { issueId: string; status: IssueStatus }) {
  const mutation = useUpdateIssueStatus(issueId)

  return (
    <select
      value={status}
      disabled={mutation.isPending}
      onChange={(e) => mutation.mutate(e.target.value as IssueStatus)}
      className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm capitalize text-white disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
