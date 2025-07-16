import { useGroupRoles } from "@/hooks/useGroupRoles";
import { GroupMemberRoleName } from "@/types/group";

export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    // console.log("roleNameToId", name, roles);
    // console.log(r.role, name.role.roleName)
    console.log("Roles from useGroupRoles:", roles);
    console.log("Looking for role:", name);
    const id = roles.find((r) => r.roleName === name)?.id;
    console.log(id);
    return id;
  };

  return {
    isLoading,
    isError,
    roleNameToId,
  };
}
