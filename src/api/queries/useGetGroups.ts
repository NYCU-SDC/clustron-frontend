// src/api/queries/useGetGroups.ts
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/api/groups/getGroups";
import { useUserContext } from "@/context/UserContext"; // ⬅️ 加這行

export function useGetGroups(page = 1, size = 10) {
  const { user } = useUserContext();
  const accessLevel = user?.accessLevel ?? "user";
  const userId = user?.id ?? "";

  return useQuery({
    queryKey: ["groups", page, size, accessLevel, userId],
    queryFn: () => {
      console.log(`[useGetGroups] fetching page ${page} as ${accessLevel}`);
      return getGroups(page, size, "asc", "title", accessLevel);
    },
    enabled: !!user,
  });
}
