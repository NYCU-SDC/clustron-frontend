import { api } from "@/lib/request/api";
import type { GetUsersParams, GetUsersResponse } from "@/types/admin";

export async function getUsers(
  params: GetUsersParams,
): Promise<GetUsersResponse> {
  const { page = 0, size = 20, search, role, sort, sortBy } = params;

  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) query.append("search", search);
  if (role) query.append("role", role);
  if (sort) query.append("sort", sort);
  if (sortBy) query.append("sortBy", sortBy); // fullName | studentId | email

  return api<GetUsersResponse>(`/api/users?${query.toString()}`);
}
