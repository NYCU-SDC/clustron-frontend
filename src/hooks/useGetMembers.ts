import { useInfiniteQuery } from "@tanstack/react-query";
import { getMember } from "@/lib/request/getMember";
import type { MemberResponse, Paginated } from "@/lib/request/getMember";

export type UseGetMembersResult = Paginated<MemberResponse>;

export function useInfiniteMembers(
  groupId: string | undefined,
  size: number = 10,
) {
  return useInfiniteQuery({
    queryKey: ["members", groupId],
    queryFn: async ({ pageParam = 1 }) => {
      return await getMember(groupId!, pageParam, size);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: !!groupId,
  });
}
