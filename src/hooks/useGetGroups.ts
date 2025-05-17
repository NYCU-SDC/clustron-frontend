import { useQuery } from "@tanstack/react-query";
import { mockGroups } from "@/lib/mockGroups";
import { transformGroupsToSummaries } from "@/lib/transGtoS";
import { useUserContext } from "@/context/UserContext";
import type { GroupSummary, PaginatedResponse } from "@/types/group";

export function useGetGroups() {
  const { user } = useUserContext();

  return useQuery({
    queryKey: ["groups", user?.studentId],
    queryFn: async (): Promise<PaginatedResponse<GroupSummary>> => {
      if (!user)
        return {
          items: [],
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: 0,
          hasNextPage: false,
        };

      const visibleGroups =
        user.accessLevel === "admin"
          ? mockGroups //
          : mockGroups.filter((group) =>
              group.members.some(
                (member) => member.studentId === user.studentId,
              ),
            );

      const summaries = transformGroupsToSummaries(visibleGroups, user);

      return {
        items: summaries,
        totalItems: summaries.length,
        totalPages: 1,
        currentPage: 1,
        pageSize: summaries.length,
        hasNextPage: false,
      };
    },
  });
}
