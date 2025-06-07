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
  page?: number,
  pageSize?: number,
): Promise<GetGroupMembersResponse> {
  const params = new URLSearchParams();
  if (page !== undefined) params.append("page", page.toString());
  if (pageSize !== undefined) params.append("size", pageSize.toString());

  return api<GetGroupMembersResponse>(
    `/api/groups/${groupId}/members${params.toString() ? "?" + params : ""}`,
  );
}
