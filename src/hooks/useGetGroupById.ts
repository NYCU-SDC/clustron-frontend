import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "@/lib/request/getGroupById";
import type { GroupDetail } from "@/types/group";

export function useGetGroupById(id: string, enabled = true) {
  return useQuery<GroupDetail>({
    queryKey: ["group", id],
    queryFn: () => getGroupById(id),
    enabled: !!id && enabled,
  });
}
