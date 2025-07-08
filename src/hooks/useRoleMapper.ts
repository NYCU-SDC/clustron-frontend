import { useGroupRoles } from "@/hooks/useGroupRoles";
import { GroupMemberRoleName } from "@/types/group";

export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    // console.log("roleNameToId", name, roles);
    // console.log(r.role, name.role.roleName)
    console.log("Roles from useGroupRoles:", roles);
    return roles.find((r) => r.Role === name)?.ID;
  };

  return {
    isLoading,
    isError,
    roleNameToId,
  };
}
