// 共用型別
export type GroupRoleAccessLevel = "GROUP_OWNER" | "GROUP_ADMIN" | "USER";
export type AccessLevelOwner = "GROUP_OWNER";
export type AccessLevelAdmin = "GROUP_ADMIN";
export type AccessLevelUser = "USER";

export type GroupMemberRoleName =
  | "Group Owner"
  | "Teacher assistant"
  | "Student"
  | "Auditor";

// 群組成員中的角色資訊
export type GroupRole = {
  id: string;
  role: GroupMemberRoleName;
  accessLevel: GroupRoleAccessLevel;
};

// 群組成員
export type GroupMember = {
  id: string;
  username: string;
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
    role: GroupMemberRoleName;
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
  role: GroupMemberRoleName;
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
