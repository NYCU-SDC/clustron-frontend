// import { api } from "@/lib/request/api";
// import { type GetGroupMembersResponse } from "@/types/group";
//
// export async function getMembers(groupId: string): Promise<GetGroupMembersResponse> {
//   return api<GetGroupMembersResponse>(`/api/groups/${groupId}/members`);
// }
import { api } from "@/lib/request/api";
import type { GetGroupMembersResponse } from "@/types/group";

export async function getMembers(
  groupId: string,
  page = 1,
  pageSize = 10,
): Promise<GetGroupMembersResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    size: pageSize.toString(),
  }).toString();

  return api<GetGroupMembersResponse>(
    `/api/groups/${groupId}/members?${query}`,
  );
}
