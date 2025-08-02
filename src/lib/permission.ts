import {
  AccessLevelAdmin,
  AccessLevelOwner,
  AccessLevelUser,
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

export const AccessLevelOrder: Record<GroupRoleAccessLevel, number> = {
  GROUP_OWNER: 3,
  GROUP_ADMIN: 2,
  USER: 1,
};
export type { GroupRoleAccessLevel };
