import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/request/getGroups";
import type { GetGroupsParams } from "@/types/group";

export function useGetGroups(params: GetGroupsParams = {}) {
  return useQuery({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
    placeholderData: (previousData) => previousData,
  });
}
