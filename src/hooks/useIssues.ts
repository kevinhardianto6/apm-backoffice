import { useQuery } from '@tanstack/react-query'
import { fetchIssues } from '../api/issues'

export function useIssues(
  appId: string,
  opts: {
    days: number
    realUsersOnly: boolean
    sort?: 'impact' | 'events' | 'recent'
    limit?: number
  },
) {
  return useQuery({
    queryKey: ['issues', appId, opts],
    queryFn: () => fetchIssues(appId, opts),
  })
}
