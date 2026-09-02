export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="p-6 text-sm text-slate-400">{label}</div>
}
