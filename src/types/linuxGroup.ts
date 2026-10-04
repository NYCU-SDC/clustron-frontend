import type { PaginatedResponse } from "@/types/generic";

// A Linux system group a user can be granted membership of (e.g. docker, sudo).
export type LinuxGroup = {
  name: string;
  gid: number;
  memberCount: number;
};

export type LinuxGroupMember = {
  id: string;
  userIdentifier: string; // student id or email
  fullName: string;
  linuxUsername: string;
};

// Linux group names: start with a lowercase letter or underscore, then
// lowercase letters, digits, underscores or dashes. Max 32 characters.
export const LINUX_GROUP_NAME_PATTERN = /^[a-z_][a-z0-9_-]{0,31}$/;

export function isValidLinuxGroupName(name: string): boolean {
  return LINUX_GROUP_NAME_PATTERN.test(name);
}

// GET /api/linuxGroups
export type GetLinuxGroupsRequest = {
  page?: number;
  size?: number;
  search?: string;
};

export type GetLinuxGroupsResponse = PaginatedResponse<LinuxGroup>;

// GET /api/linuxGroups/{name}/members
export type GetLinuxGroupMembersRequest = {
  name: string;
  page?: number;
  size?: number;
};

export type GetLinuxGroupMembersResponse = PaginatedResponse<LinuxGroupMember>;

// POST /api/linuxGroups/{name}/members
export type AddLinuxGroupMembersRequest = {
  name: string;
  members: string[]; // student ids or emails
};

export type AddLinuxGroupMemberError = {
  member: string;
  message: string;
};

export type AddLinuxGroupMembersResult = {
  addedSuccessNumber: number;
  addedFailureNumber: number;
  errors: AddLinuxGroupMemberError[];
};

// DELETE /api/linuxGroups/{name}/members/{memberId}
export type RemoveLinuxGroupMemberRequest = {
  name: string;
  memberId: string;
};
