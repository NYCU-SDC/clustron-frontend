import { api } from "@/lib/api";
import type { GetGroupMembersResponse } from "@/types/group";

export async function getMembers(
  groupId: string,
  page = 1,
  pageSize = 100,
): Promise<GetGroupMembersResponse> {
  return api(
    `/api/groups/${groupId}/members?page=${page}&pageSize=${pageSize}`,
  );
}
