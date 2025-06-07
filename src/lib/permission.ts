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

export function canEditMembers(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === AccessLevelOwner || accessLevel === AccessLevelAdmin;
}

export function canArchiveGroup(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === AccessLevelOwner;
}
export function isReadonlyMember(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === AccessLevelUser;
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
