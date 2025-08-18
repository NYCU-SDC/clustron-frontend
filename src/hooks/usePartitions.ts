import { useQuery } from "@tanstack/react-query";
import { mockGetPartitions } from "@/lib/mocks/jobsLogic";

export function usePartitions() {
  //TODO: wait for backend
  return useQuery({
    queryKey: ["job-partitions"],
    queryFn: () => mockGetPartitions(),
  });
}
