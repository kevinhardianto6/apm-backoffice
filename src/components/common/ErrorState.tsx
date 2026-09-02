export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  return (
    <div className="m-6 rounded border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
      <div className="font-semibold text-red-200">Couldn't load data</div>
      <div className="mt-1 text-red-400">{message}</div>
    </div>
  )
}
