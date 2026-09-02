import { useQuery } from '@tanstack/react-query'
import { fetchUserDetail } from '../api/users'

export function useUserDetail(appId: string, userRef: string | null, days = 30) {
  return useQuery({
    queryKey: ['user', appId, userRef, days],
    queryFn: () => fetchUserDetail(appId, userRef!, days),
    enabled: userRef != null,
  })
}
