import { useQuery } from "@tanstack/react-query";
import { getJobCounts, type JobCounts, type Job } from "@/lib/request/jobs";

export function useGetJobCounts(status?: Job["status"], enabled = true) {
  return useQuery<JobCounts>({
    queryKey: ["job-counts", status],
    queryFn: () => getJobCounts(status),
    enabled,
  });
}
