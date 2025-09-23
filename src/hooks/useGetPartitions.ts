import { useQuery } from "@tanstack/react-query";
import { getPartitions, type Partitions } from "@/lib/request/jobs";

export function useGetPartitions(enabled = true) {
  return useQuery<Partitions>({
    queryKey: ["partitions"],
    queryFn: getPartitions,
    enabled,
  });
}
