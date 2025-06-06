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
  GROUP_OWNER: ["Teacher assistant", "Student", "Auditor"],
  GROUP_ADMIN: ["Student", "Auditor"],
  USER: [],
}; //TODO

export type { GroupRoleAccessLevel };
