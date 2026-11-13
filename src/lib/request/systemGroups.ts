import { api } from "@/lib/request/api";
import type {
  AddSystemGroupMemberRequest,
  RegisterSystemGroupRequest,
  RemoveSystemGroupMemberRequest,
  SystemGroup,
  SystemGroupCandidate,
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
  candidates: () => [...systemGroupQueryKeys.all, "candidates"] as const,
  members: (groupId: string) =>
    [...systemGroupQueryKeys.all, groupId, "members"] as const,
};

export function getSystemGroups(): Promise<SystemGroup[]> {
  return api<SystemGroup[]>("/api/systemGroups");
}

export function getSystemGroupCandidates(): Promise<SystemGroupCandidate[]> {
  return api<SystemGroupCandidate[]>("/api/systemGroups/candidates");
}

// Kicks off a background re-read of /etc/group on every active compute node.
// Returns 202; candidates update once the Ansible run finishes.
export function discoverSystemGroups(): Promise<{ message: string }> {
  return api("/api/systemGroups/discover", { method: "POST" });
}

// Registers a discovered local group by name. The backend resolves its gid and
// creates a matching LDAP posixGroup.
export function registerSystemGroup({
  name,
  description,
}: RegisterSystemGroupRequest): Promise<SystemGroup> {
  return api<SystemGroup>("/api/systemGroups", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export function deleteSystemGroup(id: string): Promise<{ message: string }> {
  return api(`/api/systemGroups/${id}`, { method: "DELETE" });
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
