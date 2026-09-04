import { api } from "@/lib/request/api";
import type { GetGroupsParams, GetGroupsResponse } from "@/types/group";

export async function getGroups(
  params: GetGroupsParams = {},
): Promise<GetGroupsResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set("page", params.page.toString());
  if (params.size !== undefined) query.set("size", params.size.toString());
  if (params.sort) query.set("sort", params.sort);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const queryString = query.toString();
  const path = queryString ? `/api/groups?${queryString}` : "/api/groups";

  return api<GetGroupsResponse>(path);
}
