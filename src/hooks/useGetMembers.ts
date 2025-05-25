import { useInfiniteQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/request/getMembers";
// import type { GetGroupMembersResponse } from "@/types/group";

const PAGE_SIZE = 100;

export function useInfiniteMembers(groupId: string) {
  return useInfiniteQuery({
    queryKey: ["members", groupId],
    queryFn: ({ pageParam = 1 }) => getMembers(groupId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !!groupId,
  });
}

// import { useQuery } from "@tanstack/react-query";
// import { getMembers } from "@/lib/request/getMembers";
// import type { GetGroupMembersResponse } from "@/types/group";

// export function useGetMembers(groupId: string, enabled = true) {
//   return useQuery<GetGroupMembersResponse>({
//     queryKey: ["group-members", groupId],
//     queryFn: () => getMembers(groupId),
//     enabled: !!groupId && enabled,
//   });
// }
