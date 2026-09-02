// FE-06b: `error`-type issues have no stack frames — source_file/function/line
// (01 §4.4) is the actionable location instead. source_line is display-only, never
// part of the fingerprint (01 §6), so it's shown but never implied to affect grouping.
export function ErrorLocation({ attrs }: { attrs: Record<string, unknown> }) {
  const file = attrs.source_file as string | undefined
  const fn = attrs.source_function as string | undefined
  const line = attrs.source_line as number | undefined
  const message = attrs.message as string | undefined
  const domain = attrs.domain as string | undefined
  const code = attrs.code as number | string | undefined

  return (
    <div className="rounded border border-slate-800 p-4">
      <div className="mb-2 font-semibold">Source location</div>
      <div className="font-mono text-sm text-slate-200">
        {file ?? 'unknown file'}
        {fn && <span className="text-slate-500"> · {fn}</span>}
        {line != null && <span className="text-slate-500">:{line}</span>}
      </div>
      {(message || domain) && (
        <div className="mt-2 text-sm text-slate-400">
          {domain && <span>{domain}</span>}
          {code != null && <span> ({code})</span>}
          {message && <span>{domain ? ' · ' : ''}{message}</span>}
        </div>
      )}
    </div>
  )
}
