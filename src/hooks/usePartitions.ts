import { useQuery } from "@tanstack/react-query";
import { mockGetPartitions } from "@/lib/mocks/jobsLogic.ts";

export function usePartitions() {
  return useQuery({
    queryKey: ["job-partitions"],
    queryFn: () => mockGetPartitions(),
  });
}
