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
  page = 1,
): Promise<GetPendingMembersResponse> {
  return api(`/api/groups/${groupId}/pendingMembers?page=${page}`);
}

// PUT
export async function updatePendingMember({
  id,
  pendingId,
  roleId,
}: UpdatePendingMemberInput): Promise<UpdatePendingMemberResponse> {
  return api(`/api/groups/${id}/pendingMembers/${pendingId}`, {
    method: "PUT",
    body: JSON.stringify({ roleId }),
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
