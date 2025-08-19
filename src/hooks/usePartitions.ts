import { useQuery } from "@tanstack/react-query";
import { mockGetPartitions } from "@/lib/mocks/jobLogic.ts";

export function usePartitions() {
  //TODO: unused, wait for backend
  return useQuery({
    queryKey: ["job-partitions"],
    queryFn: () => mockGetPartitions(),
  });
}
