import { useQuery } from '@tanstack/react-query'
import { fetchNetwork } from '../api/network'

export function useNetwork(
  appId: string,
  opts: { days: number; realUsersOnly: boolean; host?: string; failureCategory?: string },
) {
  return useQuery({
    queryKey: ['network', appId, opts],
    queryFn: () => fetchNetwork(appId, opts),
  })
}
