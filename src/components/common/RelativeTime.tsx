import { relativeTime } from '../../lib/time'

export function RelativeTime({ iso, className }: { iso: string | null; className?: string }) {
  if (!iso) return <span className={className}>—</span>
  return (
    <span className={className} title={new Date(iso).toLocaleString()}>
      {relativeTime(iso)}
    </span>
  )
}
