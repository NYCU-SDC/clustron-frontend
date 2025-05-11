// src/api/queries/useGetGroups.ts

import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/api/groups/getGroups";

export function useGetGroups(page = 1, size = 10) {
  return useQuery({
    queryKey: ["groups", page, size],
    queryFn: () => {
      console.log(`[useGetGroups] fetching page ${page}`);
      return getGroups(page, size);
    },
  });
}
