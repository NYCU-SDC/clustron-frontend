import { useQuery } from "@tanstack/react-query";
import { getPendingMembers } from "@/lib/request/groupPendingMembers";
import type { GetPendingMembersResponse } from "@/types/group";

export function useGetPendingMembers(groupId: string) {
  return useQuery<GetPendingMembersResponse>({
    queryKey: ["pendingMembers", groupId],
    queryFn: () => getPendingMembers(groupId),
    enabled: !!groupId,
  });
}
