import { useQuery } from "@tanstack/react-query";
import { getJobCounts } from "@/lib/request/jobs";
import type { Job, JobCounts } from "@/lib/request/jobs";

export function useJobCounts(status?: Job["status"]) {
  return useQuery<JobCounts>({
    queryKey: ["jobs", "counts", status],
    queryFn: () => getJobCounts(status),
  });
}
