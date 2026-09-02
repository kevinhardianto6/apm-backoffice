export function RealUsersToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded border border-emerald-800 bg-emerald-950/30 px-3 py-1.5 text-sm text-emerald-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-emerald-500"
      />
      Real users only
    </label>
  )
}
