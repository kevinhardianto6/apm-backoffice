export type Staleness = 'fresh' | 'stale' | 'very-stale' | 'never'

// Turns "last event" into an active signal, not just a timestamp: this is the mechanism
// docs/04 §4 relies on to tell "no problems" apart from "no data arriving" — both render
// as an empty screen, and only the ingest pipeline's actual pulse (this) tells them apart.
// Thresholds are a judgment call (no SLA is documented for event delivery latency) — pilot
// apps upload every upload_interval_s (30s default, 01 §9) plus normal network delay, so
// "fresh" gives generous headroom above that before treating a gap as suspicious.
export function eventStaleness(iso: string | null): Staleness {
  if (!iso) return 'never'
  const ageMs = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ageMs)) return 'never'
  const hour = 60 * 60 * 1000
  if (ageMs < hour) return 'fresh'
  if (ageMs < 24 * hour) return 'stale'
  return 'very-stale'
}

export function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diffMs = Date.now() - then
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  return `${day}d ago`
}
