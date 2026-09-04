import type { Thread } from '../api/types'

// 01 §4.3.1 specifies `threads` as native nested JSON, not a string — only `breadcrumbs`
// is documented as a JSON-encoded string (§4.5.1, deliberately, for scrubbing). At least
// one real SDK build has been observed sending `threads` (and likely `binary_images`)
// double-encoded as a string anyway, which crashed this page outright (`threads.map is
// not a function`, no array to call it on). That's a mobile-side contract deviation worth
// fixing at the source — but this page should degrade to "no frames" instead of a blank
// screen no matter what shape shows up, the same way it already tolerates absent frames.
export function parseThreads(raw: unknown): Thread[] {
  if (Array.isArray(raw)) return raw as Thread[]
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Thread[]
    } catch {
      // fall through to empty
    }
  }
  return []
}
