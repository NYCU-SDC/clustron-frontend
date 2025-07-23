import { useGroupRoles } from "@/hooks/useGroupRoles";
import { GroupMemberRoleName } from "@/types/group";

export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    const id = roles.find((r) => r.roleName === name)?.id;
    return id;
  };

  return {
    isLoading,
    isError,
    roleNameToId,
  };
}
