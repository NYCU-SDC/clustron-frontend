import type { Group } from "@/lib/mockGroups";
import type { GroupSummary } from "@/types/group";
import type { User } from "@/lib/userMock";

export function transformGroupsToSummaries(
  groups: Group[],
  user: User | null,
): GroupSummary[] {
  if (!user) return [];

  const isAdmin = user.accessLevel === "Admin";

  return groups
    .filter(
      (group) =>
        isAdmin ||
        group.members.some((member) => member.studentId === user.studentId),
    )
    .map((group) => {
      const matched = group.members.find((m) => m.studentId === user.studentId);

      return {
        id: group.id,
        title: group.title,
        description: group.description,
        isArchived: group.isArchived,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        me: {
          role: matched
            ? {
                id: matched.id,
                role: matched.role,
                accessLevel: matched.accessLevel,
              }
            : {
                id: user.id,
                role: user.role,
                accessLevel: "Admin", // ✅ fallback for admin
              },
        },
      };
    });
}
