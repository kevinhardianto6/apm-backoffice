// Pre-symbolication display (FE-06/FE-17). The crash frame schema (01 §4.3: "threads:
// array of thread with stack frame — address + offset") isn't pinned down further in the
// contract, and no real payload seen yet populates `threads`/`binary_images` (the pilot's
// own seed data omits them). So frames are rendered generically — whatever keys exist — and
// app-owned vs system-frame highlighting (FE-06's main ask) is NOT implemented: doing that
// needs a documented way to tell an app frame from a system one (e.g. a binary/image
// reference per frame, matched against `binary_images`), which no confirmed sample
// exhibits. Flagged rather than guessed at.
export function StackTrace({ attrs }: { attrs: Record<string, unknown> }) {
  const threads = attrs.threads
  const name = attrs.name as string | undefined
  const reason = attrs.reason as string | undefined
  const crashType = attrs.crash_type as string | undefined

  return (
    <div className="rounded border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="font-semibold">Stack trace</span>
        <span className="text-xs text-amber-400">● not symbolicated — symbolication service pending</span>
      </div>
      <div className="p-4 font-mono text-xs">
        <div className="mb-3 text-slate-300">
          {crashType && <span className="uppercase text-slate-500">{crashType} · </span>}
          {name}
          {reason && <span className="text-slate-500"> · {reason}</span>}
        </div>

        {Array.isArray(threads) && threads.length > 0 ? (
          <div className="flex flex-col gap-4">
            {threads.map((thread, ti) => (
              <div key={ti}>
                <div className="mb-1 text-slate-500">Thread {ti}</div>
                {Array.isArray((thread as Record<string, unknown>).frames) ? (
                  ((thread as Record<string, unknown>).frames as unknown[]).map((frame, fi) => (
                    <div key={fi} className="pl-3 text-slate-300">
                      {Object.entries(frame as Record<string, unknown>)
                        .map(([k, v]) => `${k}=${v}`)
                        .join('  ')}
                    </div>
                  ))
                ) : (
                  <div className="pl-3 text-slate-600">no frames on this thread</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500">
            No stack frames in this event. Shown above is everything reported:{' '}
            {crashType ?? 'unknown crash type'}.
          </div>
        )}
      </div>
    </div>
  )
}
