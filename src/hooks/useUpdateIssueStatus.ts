import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateIssueStatus } from '../api/issueDetail'
import type { IssueStatus } from '../api/types'

export function useUpdateIssueStatus(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (status: IssueStatus) => updateIssueStatus(issueId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] })
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })
}
