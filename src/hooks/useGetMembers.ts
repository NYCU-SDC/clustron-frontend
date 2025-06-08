import { useInfiniteQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/request/getMembers";

export function useInfiniteMembers(groupId: string) {
  return useInfiniteQuery({
    queryKey: ["members", groupId],
    queryFn: ({ pageParam = 1 }) => getMembers(groupId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: !!groupId,
  });
}
