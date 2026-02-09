import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/request/getGroups";
import type { GetGroupsResponse } from "@/types/group";

export function useGetGroups() {
  return useQuery<GetGroupsResponse>({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
}
