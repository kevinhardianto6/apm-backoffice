import { useState } from 'react'
import type { IssueDetail } from '../../api/types'
import { issueToMarkdown } from '../../lib/issueMarkdown'

export function CopyMarkdownButton({ issue }: { issue: IssueDetail }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issueToMarkdown(issue))
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 1500)
  }

  return (
    <button
      onClick={copy}
      className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800/60"
    >
      {state === 'copied' ? 'Copied!' : state === 'failed' ? 'Copy failed' : 'Copy as Markdown'}
    </button>
  )
}
