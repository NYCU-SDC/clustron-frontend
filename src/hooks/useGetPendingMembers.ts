import { useQuery } from "@tanstack/react-query";
import { getPendingMembers } from "@/lib/request/groupPendingMembers";

export function useGetPendingMembers(groupId: string) {
  return useQuery({
    queryKey: ["pendingMembers", groupId],
    queryFn: () => getPendingMembers(groupId),
    enabled: !!groupId,
  });
}
