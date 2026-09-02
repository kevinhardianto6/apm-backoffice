import { relativeTime } from '../../lib/time'

export function RelativeTime({ iso }: { iso: string | null }) {
  if (!iso) return <span>—</span>
  return <span title={new Date(iso).toLocaleString()}>{relativeTime(iso)}</span>
}
