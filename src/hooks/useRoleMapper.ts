import { useGroupRoles } from "@/hooks/useGroupRoles";
import { GroupMemberRoleName } from "@/types/group";

/**
 * 輸入 role name，取得對應的 roleId（從 /api/roles）
 */
export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    // console.log("roleNameToId", name, roles);
    // console.log(r.role, name.role.id)
    // @ts-ignore
    return roles.find((r) => r.Role === name)?.ID;
  };

  return {
    isLoading,
    isError,
    roleNameToId,
  };
}
