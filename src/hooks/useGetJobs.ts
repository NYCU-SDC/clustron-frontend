import { useQuery } from "@tanstack/react-query";
import { getJobs, type JobsPage } from "@/lib/request/jobs";

export function useGetJobs(
  params?: Parameters<typeof getJobs>[0],
  enabled = true,
) {
  return useQuery<JobsPage>({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
    enabled,
  });
}
