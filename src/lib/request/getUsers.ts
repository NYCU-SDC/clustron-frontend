import { api } from "@/lib/request/api";
import type { GetUsersParams, GetUsersResponse } from "@/types/admin";

export async function getUsers(
  params: GetUsersParams,
): Promise<GetUsersResponse> {
  const { page = 1, size = 20, search, role, sort, sortBy } = params;

  const query = new URLSearchParams({
    // 重要：後端從 0 開始算，所以前端的第 1 頁要傳 0 給後端
    page: (page - 1).toString(),
    size: size.toString(),
  });

  if (search) query.append("search", search);
  if (role) query.append("role", role);
  if (sort) query.append("sort", sort);
  if (sortBy) query.append("sortBy", sortBy); // fullName | studentID | email

  return api<GetUsersResponse>(`/api/users?${query.toString()}`);
}
