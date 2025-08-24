import { useQuery } from "@tanstack/react-query";
import { mockListJobs, type ListJobsQuery } from "@/lib/mocks/jobLogic.ts";

export function useJobs(query: ListJobsQuery) {
  //TODO: unused, wait for backend
  return useQuery({
    queryKey: ["jobs", query],
    queryFn: () => mockListJobs(query),
  });
}
