// FE-11: "for ssl_certificate/ssl_pinning_rejected, show affected host, user count,
// app version & OS spread, and first-seen; the pattern itself — a sharp spike across all
// app versions at once — is the diagnosis." This app has the host and the failure
// shape (real, from the drilldown series above). It does NOT have user count or an
// app-version/OS breakdown scoped to this host+category — network() aggregates only
// requests/latency/failure-category counts per host, nothing per-user or per-version.
// Showing a specific "N users affected" or "spans versions X, Y" here would be invented.
// This stays generic/educational instead of asserting conclusions about this incident
// specifically — flagged in FEATURES.md as a server gap if per-incident specifics are wanted.
export function SslGuidanceCallout({ category }: { category: string }) {
  return (
    <div className="rounded border border-amber-800 bg-amber-950/20 p-4 text-sm">
      <div className="font-semibold text-amber-300">
        ▲ {category === 'ssl_pinning_rejected' ? 'Pinning rejection' : 'Certificate failure'}{' '}
        pattern
      </div>
      <p className="mt-2 text-amber-200/80">
        A sharp spike appearing across a host all at once — rather than ramping in with a
        release rollout — is the signature of a server-side certificate change breaking a
        pinned client, not a client-side regression. Compare the served cert chain against the
        pinned SPKI hashes shipped in the app.
      </p>
      <p className="mt-2 text-xs text-amber-200/50">
        User count and affected app-version/OS spread for this specific host+category aren't
        available from the Network endpoint yet — only request/latency/failure-count
        aggregates are. Ask if you want the server extended for this (network() would need a
        per-user / per-version breakdown, similar to what issues() already returns).
      </p>
    </div>
  )
}
