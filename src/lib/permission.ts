import { GroupMemberRoleName } from "@/types/group";

export type GlobalRole = "admin" | "organizer" | "user";
export type GroupRoleAccessLevel = "GROUP_OWNER" | "GROUP_ADMIN" | "USER";
export function isGlobalAdmin(role: GlobalRole): boolean {
  return role === "admin" || role === "organizer";
}

export function canCreateGroup(role: GlobalRole): boolean {
  return isGlobalAdmin(role);
}

export function canEditMembers(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === "GROUP_OWNER" || accessLevel === "GROUP_ADMIN";
}

export function canArchiveGroup(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === "GROUP_OWNER";
}
export function isReadonlyMember(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === "USER";
}

export const assignableRolesMap: Record<
  GroupRoleAccessLevel,
  GroupMemberRoleName[]
> = {
  GROUP_OWNER: ["Teacher assistant", "Student", "Auditor"],
  GROUP_ADMIN: ["Student", "Auditor"],
  USER: [],
};
