import { api } from "@/lib/request/api";
import type {
  GetPendingMembersResponse,
  RemovePendingMemberParams,
  UpdatePendingMemberInput,
  UpdatePendingMemberResponse,
} from "@/types/group";

// GET
export async function getPendingMembers(
  groupId: string,
): Promise<GetPendingMembersResponse> {
  return api(`/api/groups/${groupId}/pendingMembers`);
}

// PUT
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

// DELETE
export async function removePendingMember({
  id,
  pendingId,
}: RemovePendingMemberParams): Promise<void> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "DELETE",
  });
}
