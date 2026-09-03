import { api } from "@/lib/request/api";
import type { GroupLinkRequest, GroupLinkResponse } from "@/types/group";

// 🔸 Create Link
export async function createGroupLink({
  groupId,
  payload,
}: {
  groupId: string;
  payload: GroupLinkRequest;
}): Promise<GroupLinkResponse> {
  return api(`/api/groups/${groupId}/link`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔸 Update Link
export async function updateGroupLink(
  groupId: string,
  linkId: string,
  payload: GroupLinkRequest,
): Promise<GroupLinkResponse> {
  return api(`/api/groups/${groupId}/link/${linkId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// 🔸 Delete Link
export async function deleteGroupLink(
  groupId: string,
  linkId: string,
): Promise<void> {
  return api(`/api/groups/${groupId}/link/${linkId}`, {
    method: "DELETE",
  });
}
