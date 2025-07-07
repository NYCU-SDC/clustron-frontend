import { api } from "@/lib/request/api";
import type {
  GetPendingMembersResponse,
  RemovePendingMemberParams,
  UpdatePendingMemberInput,
  UpdatePendingMemberResponse,
} from "@/types/group";

//  GET /api/groups/{id}/pendingMembers
export async function getPendingMembers(
  groupId: string,
): Promise<GetPendingMembersResponse> {
  return api(`/api/groups/${groupId}/pendingMembers`);
}

// DELETE /api/groups/{id}/pendingMembers/{pendingId}
export async function removePendingMember({
  id,
  pendingId,
}: RemovePendingMemberParams): Promise<void> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "DELETE",
  });
}

// PUT /api/groups/{id}/pendingMembers/{pendingId}
export async function updatePendingMember({
  id,
  pendingId,
  role,
}: UpdatePendingMemberInput): Promise<UpdatePendingMemberResponse> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}
