import { useState } from 'react'
import type { StackFrame, Thread } from '../../api/types'
import { parseThreads } from '../../lib/crashAttrs'

// FE-06/FE-17. Frame highlighting does NOT wait for symbolication (01 §4.3.1): `is_app`
// is set by the SDK at capture time, so "this frame is our code" is known from the first
// crash report. symbol_name/file/line stay null until BE-11 exists — shown when present,
// with no redesign needed once they start arriving.
function Frame({ frame }: { frame: StackFrame }) {
  const symbolicated = frame.symbol_name != null
  return (
    <div
      className={`flex min-w-0 gap-3 rounded px-2 py-1 ${
        frame.is_app ? 'bg-indigo-950/40 text-slate-100' : 'text-slate-500'
      }`}
    >
      <span className="w-6 shrink-0 text-right text-slate-600">{frame.index}</span>
      <span className={`min-w-0 break-all ${frame.is_app ? 'font-medium' : ''}`}>
        {frame.object_name}
        {symbolicated ? (
          <span className="text-slate-300">
            {' '}
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
          <span className="text-slate-600"> {frame.instruction_addr}</span>
        )}
      </span>
    </div>
  )
}

// Real device crashes can carry dozens of threads with dozens of frames each — one
// observed payload was 38 threads. Rendering all of it at once (thousands of DOM rows)
// is both unscannable (only the crashed thread usually matters) and heavy enough to
// visibly stutter/tear the page's first paint. Only the crashed thread expands by
// default; others collapse to a one-line summary the engineer can open on demand.
function ThreadBlock({ thread, index, defaultOpen }: { thread: Thread; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const frames = Array.isArray(thread?.frames) ? thread.frames : []

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left text-slate-500 hover:text-slate-300"
      >
        <span className="text-slate-600">{open ? '▾' : '▸'}</span>
        <span className="mb-1">
          Thread {thread?.index ?? index} · {thread?.name}
          {thread?.crashed && <span className="ml-2 text-red-400">crashed</span>}
          {!thread?.crashed && (
            <span className="ml-2 text-slate-600">
              {frames.length} frame{frames.length === 1 ? '' : 's'}
            </span>
          )}
        </span>
      </button>
      {open &&
        (frames.length > 0 ? (
          <div className="mt-1 flex flex-col gap-0.5">
            {/* Position in the array, not `frame.index` — at least one real payload
                sends `index: 0` for every frame in a thread, which would collide as a
                React key. */}
            {frames.map((frame: StackFrame, fi: number) => (
              <Frame key={fi} frame={frame} />
            ))}
          </div>
        ) : (
          <div className="pl-3 text-slate-600">no frames on this thread</div>
        ))}
    </div>
  )
}

export function StackTrace({ attrs }: { attrs: Record<string, unknown> }) {
  const threads = parseThreads(attrs.threads)
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

        {threads.length > 0 ? (
          <div className="flex flex-col gap-3">
            {threads.length > 1 && (
              <div className="text-slate-600">
                {threads.length} threads — only the crashed thread is expanded by default
              </div>
            )}
            {(() => {
              const anyCrashed = threads.some((t) => t?.crashed)
              return threads.map((thread, i) => (
                <ThreadBlock
                  key={i}
                  thread={thread}
                  index={i}
                  defaultOpen={!!thread?.crashed || (!anyCrashed && i === 0)}
                />
              ))
            })()}
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
