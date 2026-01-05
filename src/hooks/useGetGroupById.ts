import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "@/lib/request/getGroupById";

export function useGetGroupById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupById(id),
    enabled: !!id && enabled,
  });
}
