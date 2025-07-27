// common role type
// export type GroupRoleAccessLevel = "GROUP_OWNER" | "GROUP_ADMIN" | "USER";
export const AccessLevelUser = "USER";
export const AccessLevelAdmin = "GROUP_ADMIN";
export const AccessLevelOwner = "GROUP_OWNER";

export const AccessLevels = [
  AccessLevelUser,
  AccessLevelAdmin,
  AccessLevelOwner,
];
export type GlobalRole = "admin" | "organizer" | "user";

export type GroupRoleAccessLevel = (typeof AccessLevels)[number];

export type GroupMemberRoleName =
  | "group_owner"
  | "teacher_assistant"
  | "student"
  | "auditor";

// group role
export type GroupRole = {
  id: string;
  roleName: GroupMemberRoleName;
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

// =========================
// 🔹 GET /api/groups
// =========================

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

// =========================
// 🔹 GET /api/groups/{id}
// =========================

export type GroupDetail = GroupSummary & {
  me: {
    type: string;
    role: GroupRole;
  };
};

// =========================
// 🔹 POST /api/groups
// =========================

export type CreateGroupInput = {
  title: string;
  description: string;
  members: {
    member: string; // email or user id
    roleId: string;
  }[];
};

export type CreateGroupResponse = GroupDetail;

// =========================
// 🔹 GET /api/groups/{id}/members
// =========================

export type GetGroupMembersResponse = {
  items: GroupMember[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// =========================
// 🔹 POST /api/groups/{id}/members
// =========================

export type AddGroupMemberInput = {
  member: string;
  roleId: string;
};

export type AddGroupMemberResponse = GroupMember;

// =========================
// 🔹 DELETE /api/groups/{id}/members/{memberId}
// =========================

export type RemoveMemberParams = {
  id: string;
  memberId: string;
};

// =========================
// 🔹 PUT /api/groups/{id}/members/{memberId}
// =========================

export type UpdateGroupMemberInput = {
  id: string;
  role: GroupMemberRoleName;
};

export type UpdateGroupMemberResponse = GroupMember;

// =========================
// 🔹 POST /api/groups/{id}/archive
// 🔹 POST /api/groups/{id}/unarchive
// =========================

export type ArchiveGroupParams = {
  id: string;
};

// =========================
// 🔹 POST /api/roles
// 🔹 PUT /api/roles/{id}
// =========================

export type RoleConfigInput = {
  role: GroupMemberRoleName;
  accessLevel: GroupRoleAccessLevel;
};
