import { useQuery } from "@tanstack/react-query";
import { GroupRoleAccessLevel } from "@/types/group";
import { api } from "@/lib/request/api";
import { AccessLevelOrder } from "@/lib/permission";

export type RoleItem = {
  id: string;
  roleName: string;
  accessLevel: GroupRoleAccessLevel;
};

async function fetchRoles(): Promise<RoleItem[]> {
  const res = await api("/api/roles");
  return res.map((item: any) => ({
    id: item.ID,
    roleName: item.Role,
    accessLevel: item.AccessLevel,
  }));
}

export function useRoleMapper() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<RoleItem[]>({
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
  ): RoleItem[] => {
    const minLevel = AccessLevelOrder[accessLevel] ?? 0;
    // console.log("💡 accessLevel", accessLevel);
    // console.log("🧱 AccessLevelOrder", AccessLevelOrder);
    return data.filter(
      (r) => (AccessLevelOrder[r.accessLevel] ?? 0) <= minLevel,
    );
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
