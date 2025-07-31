import { api } from "@/lib/request/api";
import type { GetGroupMembersResponse } from "@/types/group";

export async function getMembers(
  groupId: string,
  page = 1,
  pageSize = 1,
): Promise<GetGroupMembersResponse> {
  return api<GetGroupMembersResponse>(
    // `/api/groups/${groupId}/members?page=${page}}`,
    `/api/groups/${groupId}/members?pageSize=${pageSize}&page=${page}`,
  );
}
