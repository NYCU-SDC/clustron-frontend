import { api } from "@/lib/request/api";
import type { GetGroupsResponse } from "@/types/group";

export async function getGroups(page = 0): Promise<GetGroupsResponse> {
  const query = new URLSearchParams({ page: page.toString() });

  return api<GetGroupsResponse>(`/api/groups?${query.toString()}`);
}
