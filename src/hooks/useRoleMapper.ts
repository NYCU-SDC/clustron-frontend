import { useGroupRoles } from "@/hooks/useGroupRoles";
import type { GroupMemberRoleName, GroupRoleAccessLevel } from "@/types/group";

export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    return roles.find((r) => r.Role === name)?.ID;
  };

  // access level → role list
  const assignableRolesMap: Record<
    GroupRoleAccessLevel,
    GroupMemberRoleName[]
  > = {
    GROUP_OWNER: [],
    GROUP_ADMIN: [],
    USER: [],
  };

  roles.forEach((r) => {
    const level = (r.accessLevel ?? r.AccessLevel) as GroupRoleAccessLevel;
    const name = (r.role ?? r.Role) as GroupMemberRoleName;

    if (!level || !name) {
      console.warn("[useRoleMapper] skipped invalid role:", r);
      return;
    }

    if (level === "USER") {
      assignableRolesMap.GROUP_ADMIN.push(name);
      assignableRolesMap.GROUP_OWNER.push(name);
    } else if (level === "GROUP_ADMIN") {
      assignableRolesMap.GROUP_OWNER.push(name);
    }
  });

  // console.log("[useRoleMapper] assignableRolesMap:", assignableRolesMap);

  return {
    isLoading,
    isError,
    roleNameToId,
    assignableRolesMap,
  };
}
