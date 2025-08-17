import { useQuery } from "@tanstack/react-query";
import { mockCountJobs } from "@/lib/mocks/jobsLogic.ts";

export function useJobCounts(extra?: {
  filterBy?: string;
  filterValue?: string;
}) {
  return useQuery({
    queryKey: ["job-counts", extra?.filterBy, extra?.filterValue],
    queryFn: () => mockCountJobs(extra),
  });
}
