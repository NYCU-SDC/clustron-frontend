export const GlobalRoleUser = "USER";
export const GlobalRoleOrganizer = "ORGANIZER";
export const GlobalRoleAdmin = "ADMIN";
export const GlobalRoleNotSetup = "ROLE_NOT_SETUP";

export const GlobalRoles = [
  GlobalRoleAdmin,
  GlobalRoleOrganizer,
  GlobalRoleUser,
  GlobalRoleNotSetup,
] as const;

export const GLOBAL_ROLE_OPTIONS: { id: GlobalRole; label: string }[] = [
  { id: GlobalRoleUser, label: "User" },
  { id: GlobalRoleOrganizer, label: "Organizer" },
  { id: GlobalRoleAdmin, label: "Admin" },
  { id: GlobalRoleNotSetup, label: "Not Setup" },
];

export type GlobalRole = (typeof GlobalRoles)[number];

// global user
export type User = {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  role: GlobalRole;
};

// GET /api/users
export type GetUsersParams = {
  page?: number;
  size?: number;
  sort?: "asc" | "desc";
  sortBy?: "fullName" | "studentId" | "email";
  search?: string;
  role?: GlobalRole | "";
};

export type GetUsersResponse = {
  items: User[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
};

// PUT /api/users/{id}/globalRole
export type UpdateUserRoleInput = {
  id: string;
  role: Exclude<GlobalRole, typeof GlobalRoleNotSetup>;
};

export type UpdateUserRoleResponse = User;
