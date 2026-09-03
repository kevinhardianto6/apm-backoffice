import type { IssueDetail, StackFrame, Thread } from '../api/types'
import { relativeTime } from './time'

// FE-18: a plain-text/markdown summary an engineer can paste into a ticket or chat
// without having to screenshot the app. Includes only what's actually on the issue —
// no stack trace section for non-crash types, no breadcrumbs line when there are none.
export function issueToMarkdown(issue: IssueDetail): string {
  const lines: string[] = []
  lines.push(`### ${issue.title}`)
  lines.push('')
  lines.push(
    `**${issue.type}** · ${issue.status} · ${issue.users_affected} users · ${issue.sessions_affected} sessions · ${issue.events} events`,
  )
  lines.push(
    `First seen ${relativeTime(issue.first_seen)} · Last seen ${relativeTime(issue.last_seen)}`,
  )
  lines.push(`Platforms: ${issue.platforms.join(', ') || '—'}`)
  lines.push(`App versions: ${issue.app_versions.join(', ') || '—'}`)
  lines.push('')

  const attrs = issue.sample_event.attrs

  if (issue.type === 'error') {
    const file = attrs.source_file as string | undefined
    const fn = attrs.source_function as string | undefined
    const line = attrs.source_line as number | undefined
    lines.push(`**Source:** ${file ?? 'unknown'}${fn ? ` · ${fn}` : ''}${line != null ? `:${line}` : ''}`)
    lines.push('')
  }

  if (issue.type === 'termination') {
    lines.push(`**Termination reason:** ${attrs.termination_reason ?? 'unknown'}`)
    lines.push('')
  }

  if (issue.type === 'crash') {
    const threads = attrs.threads as Thread[] | undefined
    lines.push('**Stack trace** (not symbolicated)')
    lines.push('```')
    if (threads && threads.length > 0) {
      for (const thread of threads) {
        lines.push(`Thread ${thread.index}${thread.crashed ? ' (crashed)' : ''} · ${thread.name}`)
        for (const frame of thread.frames as StackFrame[]) {
          const loc = frame.symbol_name
            ? `${frame.symbol_name}${frame.file ? ` (${frame.file}:${frame.line})` : ''}`
            : frame.instruction_addr
          lines.push(`  ${frame.index} ${frame.object_name} ${loc}${frame.is_app ? '  [app]' : ''}`)
        }
      }
    } else {
      lines.push('No stack frames in this event.')
    }
    lines.push('```')
    lines.push('')
  }

  if (issue.breadcrumbs.length > 0) {
    lines.push('**Breadcrumbs**')
    lines.push('```')
    for (const crumb of issue.breadcrumbs) {
      lines.push(`${crumb.timestamp}  [${crumb.category}/${crumb.level}]  ${crumb.message}`)
    }
    lines.push('```')
    lines.push('')
  }

  lines.push(`Issue ID: \`${issue.id}\``)

  return lines.join('\n')
}
