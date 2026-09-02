import { useQuery } from '@tanstack/react-query'
import { fetchOverview } from '../api/overview'

export function useOverview(appId: string, opts: { days: number; realUsersOnly: boolean }) {
  return useQuery({
    queryKey: ['overview', appId, opts.days, opts.realUsersOnly],
    queryFn: () => fetchOverview(appId, opts),
  })
}
