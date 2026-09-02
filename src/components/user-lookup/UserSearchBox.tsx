import { useState } from 'react'

const USER_REF_PATTERN = /^usr_[0-9a-f]{12}$/i

export function UserSearchBox({
  onSearch,
  isSearching,
  initialValue = '',
}: {
  onSearch: (input: { kind: 'user_ref'; value: string } | { kind: 'identifier'; value: string }) => void
  isSearching: boolean
  initialValue?: string
}) {
  // Deliberately component state, never URL/query state — a raw phone/email typed here
  // must never end up in the address bar or browser history (defeats "no PII stored").
  const [value, setValue] = useState(initialValue)

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(
      USER_REF_PATTERN.test(trimmed)
        ? { kind: 'user_ref', value: trimmed }
        : { kind: 'identifier', value: trimmed },
    )
  }

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Phone, email, or usr_… ref"
        className="w-full max-w-md rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600"
      />
      <button
        onClick={submit}
        disabled={isSearching}
        className="rounded border border-indigo-700 bg-indigo-900/60 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isSearching ? 'Searching…' : 'Search'}
      </button>
    </div>
  )
}
