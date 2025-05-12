// src/types/group.ts

export type AccessLevel = "user" | "groupAdmin" | "organizer" | "admin";

export type GroupRole = {
  id: string;
  role: string;
  accessLevel: AccessLevel;
};

export type MemberInput = {
  member: string; // email or studentId
  role: string;
};

export type CreateGroupInput = {
  title: string;
  description: string;
  members: MemberInput[];
};

// src/types/group.ts

export type GroupSummary = {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  me: {
    role: {
      id: string;
      role: string;
      accessLevel: AccessLevel;
    };
  };
};

export type PaginatedResponse<T> = {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};
