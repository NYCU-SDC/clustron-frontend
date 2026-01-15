import { useQuery } from "@tanstack/react-query";
import { GroupRole, GroupRoleAccessLevel } from "@/types/group";
import { api } from "@/lib/request/api";
import { AccessLevelOrder } from "@/lib/permission";

async function fetchRoles(): Promise<GroupRole[]> {
  const res = await api("/api/roles");
  return (res as GroupRole[]).map((item) => ({
    id: item.id,
    roleName: item.roleName,
    accessLevel: item.accessLevel,
  }));
}

export function useRoleMapper() {
  const {
    data = [] as GroupRole[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
  const roleNameToId = (roleName: string): string | undefined =>
    data.find((r) => r.roleName === roleName)?.id;

  const roleNameToAccessLevel = (
    roleName: string,
  ): GroupRoleAccessLevel | undefined =>
    data.find((r) => r.roleName === roleName)?.accessLevel;

  const getRolesByAccessLevel = (
    accessLevel: GroupRoleAccessLevel,
  ): GroupRole[] => {
    const currentLevel = AccessLevelOrder[accessLevel] ?? 0;
    return data.filter((role) => {
      const targetLevel = AccessLevelOrder[role.accessLevel] ?? 0;
      return targetLevel < currentLevel;
    });
  };

  return {
    isLoading,
    isError,
    roles: data,
    roleNameToId,
    roleNameToAccessLevel,
    getRolesByAccessLevel,
  };
}
