import { useInfiniteQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/request/getMembers";

const PAGE_SIZE = 10;

export function useInfiniteMembers(groupId: string) {
  return useInfiniteQuery({
    queryKey: ["members", groupId],
    queryFn: ({ pageParam = 1 }) => getMembers(groupId, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    enabled: !!groupId,
  });
}
