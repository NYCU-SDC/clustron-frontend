import { useQuery } from "@tanstack/react-query";
import { getPendingMembers } from "@/lib/request/groupPendingMembers";
import type { GetPendingMembersResponse } from "@/types/group";

export function useGetPendingMembers(groupId: string, page: number = 1) {
  return useQuery<GetPendingMembersResponse>({
    queryKey: ["pendingMembers", groupId, page],
    queryFn: () => getPendingMembers(groupId, page),
    enabled: !!groupId,
  });
}
