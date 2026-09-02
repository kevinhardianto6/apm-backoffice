import { useQuery } from '@tanstack/react-query'
import { fetchIssueDetail } from '../api/issueDetail'

export function useIssueDetail(issueId: string, days = 30) {
  return useQuery({
    queryKey: ['issue', issueId, days],
    queryFn: () => fetchIssueDetail(issueId, days),
  })
}
