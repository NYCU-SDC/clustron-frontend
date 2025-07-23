import {
  AccessLevelAdmin,
  AccessLevelOwner,
  AccessLevelUser,
  GroupMemberRoleName,
  GroupRoleAccessLevel,
} from "@/types/group";

export type GlobalRole = "admin" | "organizer" | "user";
export function isGlobalAdmin(role: GlobalRole): boolean {
  return role === "admin" || role === "organizer";
}

export function canCreateGroup(role: GlobalRole): boolean {
  return isGlobalAdmin(role);
}

export function canEditMembers(
  accessLevel?: GroupRoleAccessLevel,
  globalRole?: GlobalRole,
) {
  return (
    globalRole === "admin" ||
    accessLevel == AccessLevelOwner ||
    accessLevel == AccessLevelAdmin
  );
}

export function canArchiveGroup(
  accessLevel?: GroupRoleAccessLevel,
  globalRole?: GlobalRole,
) {
  return globalRole === "admin" || accessLevel == AccessLevelOwner;
}

export function isReadonlyMember(
  accessLevel?: GroupRoleAccessLevel,
  globalRole?: GlobalRole,
) {
  return accessLevel == AccessLevelUser && !(globalRole === "admin");
}

export const assignableRolesMap: Record<
  GroupRoleAccessLevel,
  GroupMemberRoleName[]
> = {
  GROUP_OWNER: ["teacher_assistant", "student", "auditor"],
  GROUP_ADMIN: ["student", "auditor"],
  USER: [],
};
//TODO
export const roleLabelMap: Record<GroupMemberRoleName, string> = {
  group_owner: "Group Owner",
  teacher_assistant: "TA",
  student: "Student",
  auditor: "Auditor",
};

export type { GroupRoleAccessLevel };
