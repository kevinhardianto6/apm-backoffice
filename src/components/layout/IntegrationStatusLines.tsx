import { useIntegration } from '../../hooks/useIntegration'

// docs/04 §3.8: persistent, app-level integration warnings. The rule that matters most
// here (added to §3.8 alongside these fields): never show an "all clear" for a condition
// that can't be answered yet. Each row is one of three genuinely distinct states —
// unavailable (muted, "not yet available"), healthy (green, real data says fine), or
// warning (amber, real data says not fine) — never collapsed into just two, or a healthy
// row would be indistinguishable from a condition nobody could check.
function StatusLine({
  label,
  state,
  detail,
}: {
  label: string
  state: 'unavailable' | 'healthy' | 'warning'
  detail: string
}) {
  const color =
    state === 'warning'
      ? 'text-amber-400'
      : state === 'healthy'
        ? 'text-emerald-400'
        : 'text-slate-600'
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0">{label}</span>
      <span className={`truncate text-right ${color}`} title={detail}>
        {detail}
      </span>
    </div>
  )
}

// Thresholds are a judgment call, same as eventStaleness — docs/04 names the conditions
// ("sebagian besar sesi", "rasio dropped naik") without numeric cutoffs.
const GENERATED_PCT_WARN = 50
const DROPPED_PCT_WARN = 1

export function IntegrationStatusLines({ appId }: { appId: string }) {
  const { data } = useIntegration(appId)
  if (!data) return null

  const { user_id_source: src, sdk_health: health, sdk_versions: versions } = data

  const outdated = versions.filter((v) => v.is_outdated === true)
  const anyDeterminate = versions.some((v) => v.is_outdated !== null)

  return (
    <>
      <StatusLine
        label="user coverage"
        state={
          !src.available
            ? 'unavailable'
            : (src.generated_pct ?? 0) > GENERATED_PCT_WARN
              ? 'warning'
              : 'healthy'
        }
        detail={
          !src.available
            ? 'not yet available'
            : `${src.generated_pct}% unlinkable`
        }
      />
      <StatusLine
        label="SDK health"
        state={
          !health.available
            ? 'unavailable'
            : (health.dropped_pct ?? 0) > DROPPED_PCT_WARN
              ? 'warning'
              : 'healthy'
        }
        detail={!health.available ? 'not yet available' : `${health.dropped_pct}% dropped`}
      />
      <StatusLine
        label="SDK version"
        state={
          !anyDeterminate
            ? 'unavailable'
            : outdated.length > 0
              ? 'warning'
              : 'healthy'
        }
        detail={
          !anyDeterminate
            ? 'not yet available'
            : outdated.length > 0
              ? `${outdated.map((v) => v.version).join(', ')} outdated`
              : 'up to date'
        }
      />
    </>
  )
}
