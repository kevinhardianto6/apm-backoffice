// Nav layout matches docs/mockups/*.png exactly (grouping, order, item names).
// `path` present = built and routed. `path` absent = disabled, per the 2026-09-02
// FEATURES.md decision: dimmed, non-clickable, "Not available yet" tooltip — rather
// than omitted — so the sidebar reads as a visible roadmap and doesn't reshuffle as
// features land.
export interface NavItem {
  label: string
  path?: (appId: string) => string
}

export interface NavGroup {
  heading: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    heading: 'MONITOR',
    items: [
      { label: 'Overview', path: (appId) => `/apps/${appId}` },
      { label: 'Issues', path: (appId) => `/apps/${appId}/issues` },
      { label: 'Network' }, // feat-004
      { label: 'User Lookup' }, // feat-005
    ],
  },
  {
    heading: 'ANALYZE',
    items: [{ label: 'Performance' }, { label: 'Releases' }, { label: 'Devices' }],
  },
  {
    heading: 'CONFIG',
    items: [{ label: 'Alerts & SLOs' }, { label: 'Symbol files' }],
  },
]
