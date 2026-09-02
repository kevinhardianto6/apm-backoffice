// FE-21: not decoration — the visible proof that raw identifiers are hashed server-side
// (BE-23) and never stored. If this app ever starts persisting a raw phone/email anywhere
// (state, URL, logs), this badge becomes a lie; keep it truthful, not just present.
export function NoPiiBadge() {
  return (
    <span className="flex items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950/30 px-2.5 py-1 text-xs text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      no PII stored
    </span>
  )
}
