import { useQuery } from "@tanstack/react-query";
import { getPendingMembers } from "@/lib/request/groupPendingMembers";

export function useGetPendingMembers(groupId: string, page: number = 0) {
  return useQuery({
    queryKey: ["pendingMembers", groupId, page],
    queryFn: () => getPendingMembers(groupId, page),
    enabled: !!groupId,
    placeholderData: (prev) => prev,
  });
}
