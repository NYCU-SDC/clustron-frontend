export const AccessLevelUser = "USER";
export const AccessLevelAdmin = "GROUP_ADMIN";
export const AccessLevelOwner = "GROUP_OWNER";

export const AccessLevels = [
  AccessLevelUser,
  AccessLevelAdmin,
  AccessLevelOwner,
] as const;

export type GroupRoleAccessLevel = (typeof AccessLevels)[number];
export type GroupMemberRoleName = string;

export type GroupRole = {
  roleName: string;
  id: string;
  accessLevel: GroupRoleAccessLevel;
};
// group member
export type GroupMember = {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  role: GroupRole;
};

// GET /api/groups
export type GroupSummary = {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetGroupsResponse = {
  items: GroupSummary[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// GET /api/groups/{id}
export type GroupDetail = GroupSummary & {
  me: {
    type: string;
    role: GroupRole;
  };
  links?: GroupLinkResponse[];
};

// POST /api/groups
export type CreateGroupInput = {
  title: string;
  description: string;
  members?: {
    member: string; // email or user id
    roleId: string;
  }[];
  links?: GroupLinkPayload[];
};

export type JoinMemberErrorResponse = {
  member: string;
  role: string;
  message: string;
};

export type CreateGroupResultData = {
  addedSuccessNumber: number;
  addedFailureNumber: number;
  errors: JoinMemberErrorResponse[];
};

export type CreateGroupResponse = GroupDetail & {
  addedResult: CreateGroupResultData;
};

// GET /api/groups/{id}/members
export type GetGroupMembersResponse = {
  items: GroupMember[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// POST /api/groups/{id}/members
export type AddGroupMemberInput = {
  member: string;
  roleId: string;
};

export type AddGroupMemberResponse = GroupMember;

// DELETE /api/groups/{id}/members/{memberId}
export type RemoveMemberParams = {
  id: string;
  memberId: string;
};

// PUT /api/groups/{id}/members/{memberId}
export type UpdateGroupMemberInput = {
  groupId: string;
  memberId: string;
  roleId: GroupMemberRoleName;
};

export type UpdateGroupMemberResponse = GroupMember;

// POST /api/groups/{id}/archive
// POST /api/groups/{id}/unarchive
export type ArchiveGroupParams = {
  id: string;
};

// POST /api/roles
// PUT /api/roles/{id}
export type RoleConfigInput = {
  role: GroupMemberRoleName;
  accessLevel: GroupRoleAccessLevel;
};

// Pending Member Types
export type PendingMember = {
  id: string;
  userIdentifier: string;
  role: {
    id: string;
    roleName: GroupMemberRoleName;
    accessLevel: GroupRoleAccessLevel;
  };
};

// GET /api/groups/{id}/pendingMembers
export type GetPendingMembersResponse = {
  items: PendingMember[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// PUT /api/groups/{id}/pendingMembers/{pendingId}
export type UpdatePendingMemberInput = {
  id: string;
  pendingId: string;
  roleId: string;
};

export type UpdatePendingMemberResponse = {
  pendingMember: PendingMember;
};

// DELETE /api/groups/{id}/pendingMembers/{pendingId}
export type RemovePendingMemberParams = {
  id: string;
  pendingId: string;
};

// Group Link Types
// POST /api/groups/{id}/link
// PUT  /api/groups/{id}/link/{linkId}
// DELETE /api/groups/{id}/link/{linkId}

export type GroupLinkPayload = {
  title: string;
  url: string;
};

export type GroupLinkResponse = {
  id: string;
  title: string;
  url: string;
};
