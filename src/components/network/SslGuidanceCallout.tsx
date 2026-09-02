import type { NetworkDrilldown } from '../../api/types'
import { formatNumber } from '../../lib/format'
import { RelativeTime } from '../common/RelativeTime'

// FE-11. `all_active_versions_affected` (01 §10) is what makes this an evidenced
// conclusion instead of a guess: a spike across EVERY active version at once can't come
// from a new release, so it points at a server-side change (cert rotation against a
// pinning client). Confined to specific versions instead points at a regression in those
// versions — so that branch says so plainly and does NOT show the cert-rotation claim,
// because the evidence doesn't support it there.
export function SslGuidanceCallout({
  category,
  drilldown,
}: {
  category: string
  drilldown: NetworkDrilldown
}) {
  const label = category === 'ssl_pinning_rejected' ? 'Pinning rejection' : 'Certificate failure'

  return (
    <div className="rounded border border-amber-800 bg-amber-950/20 p-4 text-sm">
      <div className="font-semibold text-amber-300">▲ {label} pattern</div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div>
          <div className="text-slate-500">Users affected</div>
          <div className="text-slate-100">{formatNumber(drilldown.users_affected)}</div>
        </div>
        <div>
          <div className="text-slate-500">Started</div>
          <div className="text-slate-100">
            <RelativeTime iso={drilldown.started} />
          </div>
        </div>
        <div>
          <div className="text-slate-500">App versions</div>
          <div className="text-slate-100">
            {drilldown.affected_version_count} of {drilldown.active_version_count} active
          </div>
        </div>
        <div>
          <div className="text-slate-500">Platforms</div>
          <div className="text-slate-100">
            {drilldown.platforms.map((p) => `${p.label} ${p.pct}%`).join(' / ') || '—'}
          </div>
        </div>
      </div>

      {drilldown.all_active_versions_affected ? (
        <p className="mt-3 text-amber-200/80">
          <span className="font-medium">
            All {drilldown.active_version_count} active app version
            {drilldown.active_version_count === 1 ? '' : 's'} affected at once
          </span>{' '}
          — that pattern can't come from a new release. It's the signature of a server-side
          certificate change breaking a pinned client, not a client-side regression. Compare
          the served cert chain against the pinned SPKI hashes shipped in the app.
        </p>
      ) : (
        <p className="mt-3 text-amber-200/80">
          Concentrated in {drilldown.affected_version_count} of{' '}
          {drilldown.active_version_count} active app versions —{' '}
          <span className="font-medium">
            {drilldown.app_versions.map((v) => v.label).join(', ')}
          </span>
          . Other active versions aren't affected, so this doesn't look like a server-side
          certificate change; look for a regression in those specific versions instead.
        </p>
      )}
    </div>
  )
}
