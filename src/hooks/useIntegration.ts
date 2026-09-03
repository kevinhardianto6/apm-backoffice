import { useQuery } from '@tanstack/react-query'
import { fetchIntegration } from '../api/integration'

export function useIntegration(appId: string, days = 7) {
  return useQuery({
    queryKey: ['integration', appId, days],
    queryFn: () => fetchIntegration(appId, days),
    refetchInterval: 60_000,
  })
}
