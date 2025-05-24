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

export function canViewMembers(accessLevel: GroupRoleAccessLevel): boolean {
  return canEditMembers(accessLevel);
}

export function canArchiveGroup(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === "GROUP_OWNER";
}
export function isReadonlyMember(accessLevel: GroupRoleAccessLevel): boolean {
  return accessLevel === "USER";
}

export const assignableRolesMap: Record<
  GroupRoleAccessLevel,
  GroupRoleAccessLevel[]
> = {
  GROUP_OWNER: ["GROUP_ADMIN", "USER"],
  GROUP_ADMIN: ["USER"],
  USER: [],
};
