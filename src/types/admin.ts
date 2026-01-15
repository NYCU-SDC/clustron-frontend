export const GlobalRoleUser = "USER";
export const GlobalRoleOrganizer = "ORGANIZER";
export const GlobalRoleAdmin = "ADMIN";

export const GlobalRoles = [
  GlobalRoleAdmin,
  GlobalRoleOrganizer,
  GlobalRoleUser,
] as const;

export const GLOBAL_ROLE_OPTIONS: { id: GlobalRole; label: string }[] = [
  { id: GlobalRoleUser, label: "User" },
  { id: GlobalRoleOrganizer, label: "Organizer" },
  { id: GlobalRoleAdmin, label: "Admin" },
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

export type UpdateUserRoleInput = {
  id: string;
  role: GlobalRole;
};

export type UpdateUserRoleResponse = User;

export type GetGlobalRolesResponse = {
  roles: GlobalRole[];
};
