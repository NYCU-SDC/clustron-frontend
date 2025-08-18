import { useQuery } from "@tanstack/react-query";
import { mockListJobs, type ListJobsQuery } from "@/lib/mocks/jobsLogic";

export function useJobs(query: ListJobsQuery) {
  //TODO: wait for backend
  return useQuery({
    queryKey: ["jobs", query],
    queryFn: () => mockListJobs(query),
  });
}
