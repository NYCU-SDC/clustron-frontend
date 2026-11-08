import { api } from "@/lib/request/api";
import type {
  AddSystemGroupMemberRequest,
  RemoveSystemGroupMemberRequest,
  SystemGroup,
  SystemGroupMember,
} from "@/types/systemGroup";

/**
 * System group requests. These are admin-only endpoints (see the backend
 * casbin policy). The group and its LDAP posixGroup are registered elsewhere;
 * this module covers listing registered groups and managing their members.
 */

export const systemGroupQueryKeys = {
  all: ["systemGroups"] as const,
  list: () => [...systemGroupQueryKeys.all, "list"] as const,
  members: (groupId: string) =>
    [...systemGroupQueryKeys.all, groupId, "members"] as const,
};

export function getSystemGroups(): Promise<SystemGroup[]> {
  return api<SystemGroup[]>("/api/systemGroups");
}

export function getSystemGroupMembers(
  groupId: string,
): Promise<SystemGroupMember[]> {
  return api<SystemGroupMember[]>(`/api/systemGroups/${groupId}/members`);
}

export function addSystemGroupMember({
  groupId,
  userId,
}: AddSystemGroupMemberRequest): Promise<{ message: string }> {
  return api(`/api/systemGroups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function removeSystemGroupMember({
  groupId,
  userId,
}: RemoveSystemGroupMemberRequest): Promise<{ message: string }> {
  return api(`/api/systemGroups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
}
