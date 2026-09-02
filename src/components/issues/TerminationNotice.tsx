// FE-06c: termination must read as visually distinct from a crash — this is the process
// being ended by the OS under resource pressure, not the app faulting. Never folded into
// crash metrics anywhere in this app.
export function TerminationNotice({ attrs }: { attrs: Record<string, unknown> }) {
  const reason = attrs.termination_reason as string | undefined

  return (
    <div className="rounded border border-amber-800 bg-amber-950/20 p-4 text-sm">
      <div className="font-semibold text-amber-300">Not a crash — process termination</div>
      <p className="mt-1 text-amber-200/80">
        The OS ended this process due to <span className="font-mono">{reason ?? 'unknown'}</span>{' '}
        pressure. No stack trace exists for this — it's observed retrospectively at the next
        launch, not reported by the app itself.
      </p>
    </div>
  )
}
