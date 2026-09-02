import type { StackFrame, Thread } from '../../api/types'

// FE-06/FE-17. Frame highlighting does NOT wait for symbolication (01 §4.3.1): `is_app`
// is set by the SDK at capture time, so "this frame is our code" is known from the first
// crash report. symbol_name/file/line stay null until BE-11 exists — shown when present,
// with no redesign needed once they start arriving.
function Frame({ frame }: { frame: StackFrame }) {
  const symbolicated = frame.symbol_name != null
  return (
    <div
      className={`flex gap-3 rounded px-2 py-1 ${
        frame.is_app ? 'bg-indigo-950/40 text-slate-100' : 'text-slate-500'
      }`}
    >
      <span className="w-6 shrink-0 text-right text-slate-600">{frame.index}</span>
      <span className={frame.is_app ? 'font-medium' : ''}>{frame.object_name}</span>
      {symbolicated ? (
        <span className="text-slate-300">
          {frame.symbol_name}
          {frame.file && (
            <span className="text-slate-500">
              {' '}
              · {frame.file}
              {frame.line != null ? `:${frame.line}` : ''}
            </span>
          )}
        </span>
      ) : (
        <span className="text-slate-600">{frame.instruction_addr}</span>
      )}
    </div>
  )
}

export function StackTrace({ attrs }: { attrs: Record<string, unknown> }) {
  const threads = attrs.threads as Thread[] | undefined
  const name = attrs.name as string | undefined
  const reason = attrs.reason as string | undefined
  const crashType = attrs.crash_type as string | undefined

  return (
    <div className="rounded border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="font-semibold">Stack trace</span>
        <span className="text-xs text-amber-400">
          ● not symbolicated — symbolication service pending
        </span>
      </div>
      <div className="p-4 font-mono text-xs">
        <div className="mb-3 text-slate-300">
          {crashType && <span className="uppercase text-slate-500">{crashType} · </span>}
          {name}
          {reason && <span className="text-slate-500"> · {reason}</span>}
        </div>

        {threads && threads.length > 0 ? (
          <div className="flex flex-col gap-4">
            {threads.map((thread) => (
              <div key={thread.index}>
                <div className="mb-1 text-slate-500">
                  Thread {thread.index} · {thread.name}
                  {thread.crashed && <span className="ml-2 text-red-400">crashed</span>}
                </div>
                {thread.frames.length > 0 ? (
                  <div className="flex flex-col gap-0.5">
                    {thread.frames.map((frame) => (
                      <Frame key={frame.index} frame={frame} />
                    ))}
                  </div>
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
