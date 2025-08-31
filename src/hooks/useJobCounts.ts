import { useQuery } from "@tanstack/react-query";
import { mockCountJobs } from "@/lib/mocks/jobLogic.ts";

export function useJobCounts(extra?: {
  //TODO: unused, wait for backend
  filterBy?: string;
  filterValue?: string;
}) {
  return useQuery({
    queryKey: ["job-counts", extra?.filterBy, extra?.filterValue],
    queryFn: () => mockCountJobs(extra),
  });
}
