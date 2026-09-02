import { useMutation } from '@tanstack/react-query'
import { resolveUser } from '../api/users'

export function useResolveUser(appId: string) {
  return useMutation({
    mutationFn: (identifier: string) => resolveUser(appId, identifier),
  })
}
