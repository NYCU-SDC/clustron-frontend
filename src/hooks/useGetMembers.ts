import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/request/getMembers";
import type { GetGroupMembersResponse } from "@/types/group";

export function useGetMembers(groupId: string, page: number = 1) {
  return useQuery<GetGroupMembersResponse>({
    queryKey: ["GroupMember", groupId, page],
    queryFn: () => getMembers(groupId, page),
    enabled: !!groupId,
    placeholderData: (prev) => prev,
  });
}
