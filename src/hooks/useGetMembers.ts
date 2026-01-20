import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/request/getMembers";

export function useGetMembers(groupId: string, page: number = 1) {
  return useQuery({
    queryKey: ["GroupMember", groupId, page],
    queryFn: () => getMembers(groupId, page),
    enabled: !!groupId,
    placeholderData: (prev) => prev,
  });
}
