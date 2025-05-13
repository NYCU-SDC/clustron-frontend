// src/api/queries/useGetGroupById.ts

import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "@/api/groups/getGroupById";

export function useGetGroupById(id: string | undefined) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => {
      return getGroupById(id!);
    },
    enabled: !!id,
  });
}
