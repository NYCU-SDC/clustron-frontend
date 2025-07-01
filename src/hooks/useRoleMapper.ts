import { useGroupRoles } from "@/hooks/useGroupRoles";
import type { GroupMemberRoleName, GroupRoleAccessLevel } from "@/types/group";

export function useRoleMapper() {
  const { data: roles = [], isLoading, isError } = useGroupRoles();

  // 🔍 Log 原始 API 資料
  console.log("[useRoleMapper] raw roles:", roles);

  const roleNameToId = (name: GroupMemberRoleName): string | undefined => {
    return roles.find((r) => r.Role === name)?.id;
  };

  // 🔁 access level → role map
  const assignableRolesMap = roles.reduce<
    Record<GroupRoleAccessLevel, GroupMemberRoleName[]>
  >(
    (map, r) => {
      const level = r.accessLevel as GroupRoleAccessLevel;
      const name = r.role as GroupMemberRoleName;
      if (!map[level]) map[level] = [];
      map[level].push(name);
      return map;
    },
    {
      GROUP_OWNER: [],
      GROUP_ADMIN: [],
      USER: [],
    },
  );

  console.log("[useRoleMapper] assignableRolesMap:", assignableRolesMap);

  //  role name → label map
  const initialMap: Record<GroupMemberRoleName, string> = {
    group_owner: "",
    teacher_assistant: "",
    student: "",
    auditor: "",
  };

  const roleLabelMap = roles.reduce((map, r) => {
    const name = r.Role as GroupMemberRoleName;
    map[name] = capitalizeLabel(name);
    return map;
  }, initialMap);

  console.log("[useRoleMapper] roleLabelMap:", roleLabelMap);

  return {
    isLoading,
    isError,
    roleNameToId,
    assignableRolesMap,
    roleLabelMap,
  };
}

function capitalizeLabel(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
